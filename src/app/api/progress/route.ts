import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Progress } from '@/lib/models';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch user's progress (all or filtered by questionIds)
export async function GET(request: NextRequest) {
    try {
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const questionIds = searchParams.get('questionIds');
        const bookmarkedOnly = searchParams.get('bookmarked') === 'true';

        const query: Record<string, any> = { userId: payload.userId };

        if (questionIds) {
            query.questionId = { $in: questionIds.split(',') };
        }

        if (bookmarkedOnly) {
            query.isBookmarked = true;
        }

        const progress = await Progress.find(query).lean();

        // Return as a map for easy lookup
        const progressMap: Record<string, any> = {};
        for (const p of progress) {
            progressMap[p.questionId] = {
                status: p.status,
                notes: p.notes,
                isBookmarked: p.isBookmarked,
                dateSolved: p.dateSolved,
            };
        }

        return NextResponse.json({ progress: progressMap });
    } catch (error) {
        console.error('Get progress error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create or update progress for a question
export async function POST(request: NextRequest) {
    try {
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { questionId, status, notes, isBookmarked } = body;

        if (!questionId) {
            return NextResponse.json({ error: 'questionId is required' }, { status: 400 });
        }

        const updateData: Record<string, any> = { updatedAt: new Date() };

        if (status !== undefined) {
            updateData.status = status;
            if (status === 'SOLVED') {
                updateData.dateSolved = new Date();
            }
        }
        if (notes !== undefined) updateData.notes = notes;
        if (isBookmarked !== undefined) updateData.isBookmarked = isBookmarked;

        const progress = await Progress.findOneAndUpdate(
            { userId: payload.userId, questionId },
            { $set: updateData },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            progress: {
                questionId: progress.questionId,
                status: progress.status,
                notes: progress.notes,
                isBookmarked: progress.isBookmarked,
                dateSolved: progress.dateSolved,
            },
        });
    } catch (error) {
        console.error('Update progress error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
