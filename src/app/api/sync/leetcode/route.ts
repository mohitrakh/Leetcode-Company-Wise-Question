import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Question, Progress } from '@/lib/models';
import { getCurrentUser } from '@/lib/auth';
import { getAllSolvedProblems } from '@/lib/leetcode';

export async function POST(request: Request) {
    try {
        await connectDB();
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { session } = await request.json();

        if (!session) {
            return NextResponse.json({ error: 'Session cookie is required' }, { status: 400 });
        }

        // Fetch all solved problems from LeetCode
        const solvedProblems = await getAllSolvedProblems(session);

        let syncedCount = 0;
        const errors: string[] = [];

        // Process in batches to avoid overwhelming DB
        // But for simplicity, we'll do it sequentially or with Promise.all in chunks

        // First, get all questions from our DB to map title/slug to ID
        // We can optimize this by only fetching needed fields
        // Or just query one by one if the number is not huge (e.g. < 3000)
        // Let's try to match by titleSlug first (more reliable), then title

        for (const problem of solvedProblems) {
            try {
                // Find the question in our DB
                // We assume our DB has title or url that contains the slug
                // Our Question model has 'title' and 'url'. 'url' usually ends with /title-slug/

                // Try to find by title (exact match)
                let question = await Question.findOne({ title: problem.title });

                if (!question) {
                    // Try to find by slug in URL
                    // url: https://leetcode.com/problems/two-sum
                    // slug: two-sum
                    question = await Question.findOne({ url: { $regex: `/${problem.titleSlug}/?$` } });
                }

                if (question) {
                    // Upsert progress
                    await Progress.findOneAndUpdate(
                        {
                            userId: user.userId,
                            questionId: question._id
                        },
                        {
                            $set: {
                                status: 'SOLVED',
                                updatedAt: new Date()
                                // We don't have exact dateSolved from this query, so we leave it or set to now
                                // If we want to preserve existing dateSolved, we use $setOnInsert for it?
                                // But this is a sync, maybe we just set it to now if not set?
                            },
                            $setOnInsert: {
                                dateSolved: new Date(),
                                isBookmarked: false,
                                notes: ''
                            }
                        },
                        { upsert: true, new: true }
                    );
                    syncedCount++;
                } else {
                    // Question not found in our DB, maybe we should add it?
                    // For now, just skip or log
                    // errors.push(`Question not found in DB: ${problem.title}`);
                }
            } catch (err: any) {
                errors.push(`Error syncing ${problem.title}: ${err.message}`);
            }
        }

        return NextResponse.json({
            status: 'Success',
            totalSolvedOnLeetCode: solvedProblems.length,
            syncedCount,
            errors: errors.slice(0, 10)
        });

    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
