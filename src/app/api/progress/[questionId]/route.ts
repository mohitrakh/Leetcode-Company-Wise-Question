import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Progress } from '@/lib/models';
import { getCurrentUser } from '@/lib/auth';

// GET - Get progress for specific question
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ questionId: string }> }
) {
    try {
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();
        const { questionId } = await params;

        const progress = await Progress.findOne({
            userId: payload.userId,
            questionId,
        }).lean();

        if (!progress) {
            return NextResponse.json({
                progress: {
                    questionId,
                    status: 'TODO',
                    notes: '',
                    isBookmarked: false,
                },
            });
        }

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
        console.error('Get question progress error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update status, notes, or bookmark for specific question
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ questionId: string }> }
) {
    try {
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();
        const { questionId } = await params;
        const body = await request.json();
        const { status, notes, isBookmarked } = body;

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
        console.error('Update question progress error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
