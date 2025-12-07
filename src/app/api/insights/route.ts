import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Question } from '@/lib/models';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        // Most Common Questions - Questions asked by most companies
        const mostCommonQuestions = await Question.aggregate([
            {
                $project: {
                    _id: 1,
                    title: 1,
                    difficulty: 1,
                    acceptanceRate: 1,
                    url: 1,
                    companyCount: { $size: '$companies' }
                }
            },
            { $sort: { companyCount: -1 } },
            { $limit: limit }
        ]);

        // Hidden Gems - High acceptance rate but asked by fewer companies
        const hiddenGems = await Question.aggregate([
            {
                $project: {
                    _id: 1,
                    title: 1,
                    difficulty: 1,
                    acceptanceRate: 1,
                    url: 1,
                    companyCount: { $size: '$companies' }
                }
            },
            {
                $match: {
                    acceptanceRate: { $gte: 0.6 },
                    companyCount: { $gte: 3, $lte: 15 }
                }
            },
            { $sort: { acceptanceRate: -1 } },
            { $limit: limit }
        ]);

        return NextResponse.json({
            mostCommonQuestions,
            hiddenGems
        });

    } catch (error) {
        console.error('Insights API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
