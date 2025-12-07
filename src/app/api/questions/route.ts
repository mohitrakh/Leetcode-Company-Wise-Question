import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Question, Progress } from '@/lib/models';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const company = searchParams.get('company');
        const companyMode = searchParams.get('companyMode') || 'OR'; // AND or OR
        const difficulty = searchParams.get('difficulty');
        const search = searchParams.get('search');
        const sort = searchParams.get('sort');
        const ids = searchParams.get('ids');

        // Advanced filters
        const minFrequency = searchParams.get('minFrequency');
        const minAcceptance = searchParams.get('minAcceptance');
        const maxAcceptance = searchParams.get('maxAcceptance');
        const status = searchParams.get('status'); // TODO, ATTEMPTED, SOLVED
        const bookmarkedOnly = searchParams.get('bookmarked') === 'true';

        const query: any = {};

        // Filter by specific question IDs (for bookmarks page)
        if (ids) {
            query._id = { $in: ids.split(',') };
        }

        // Company filter with AND/OR mode
        if (company) {
            const companies = company.split(',');
            if (companyMode === 'AND') {
                // Must have ALL selected companies
                query.companies = { $all: companies.map(c => new RegExp(c, 'i')) };
            } else {
                // Must have at least ONE of the selected companies (default)
                query.companies = { $in: companies.map(c => new RegExp(c, 'i')) };
            }
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Frequency filter (filter questions with at least one appearance >= minFrequency)
        if (minFrequency) {
            const freqThreshold = parseFloat(minFrequency) / 100;
            query['appearances.frequency'] = { $gte: freqThreshold };
        }

        // Acceptance rate filter
        if (minAcceptance || maxAcceptance) {
            query.acceptanceRate = {};
            if (minAcceptance) {
                query.acceptanceRate.$gte = parseFloat(minAcceptance) / 100;
            }
            if (maxAcceptance) {
                query.acceptanceRate.$lte = parseFloat(maxAcceptance) / 100;
            }
        }

        // Progress-based filters (require authentication)
        let progressFilterIds: string[] | null = null;
        if (status || bookmarkedOnly) {
            const payload = await getCurrentUser();
            if (payload) {
                const progressQuery: any = { userId: payload.userId };
                if (status && status !== 'all') {
                    progressQuery.status = status;
                }
                if (bookmarkedOnly) {
                    progressQuery.isBookmarked = true;
                }
                const progressEntries = await Progress.find(progressQuery).select('questionId').lean();
                progressFilterIds = progressEntries.map(p => p.questionId);

                // If filtering by progress but no matching entries, return empty
                if (progressFilterIds.length === 0) {
                    return NextResponse.json({
                        data: [],
                        pagination: { total: 0, page, pages: 0 }
                    });
                }

                // Add to query
                if (query._id) {
                    // Intersect with existing IDs filter
                    query._id = { $in: progressFilterIds.filter(id => query._id.$in.includes(id)) };
                } else {
                    query._id = { $in: progressFilterIds };
                }
            }
        }

        const skip = (page - 1) * limit;

        const sortOption: any = sort ? { [sort]: -1 } : { createdAt: -1 };

        const [questions, total] = await Promise.all([
            Question.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .select('-appearances') // Exclude heavy array
                .lean(),
            Question.countDocuments(query)
        ]);

        return NextResponse.json({
            data: questions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
