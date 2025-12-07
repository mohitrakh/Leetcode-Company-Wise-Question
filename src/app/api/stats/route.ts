import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Question, Progress } from '@/lib/models';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();

        // Get all user's progress entries
        const userProgress = await Progress.find({ userId: payload.userId }).lean();

        // Calculate overview stats
        const solvedEntries = userProgress.filter(p => p.status === 'SOLVED');
        const attemptedEntries = userProgress.filter(p => p.status === 'ATTEMPTED');
        const bookmarkedEntries = userProgress.filter(p => p.isBookmarked);

        // Calculate streak
        const solvedDates = solvedEntries
            .filter(p => p.dateSolved)
            .map(p => new Date(p.dateSolved!).toISOString().split('T')[0])
            .sort()
            .reverse();

        const uniqueDates = [...new Set(solvedDates)];
        let streakDays = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if streak is active (solved today or yesterday)
        if (uniqueDates.length > 0 && (uniqueDates[0] === today || uniqueDates[0] === yesterday)) {
            streakDays = 1;
            for (let i = 1; i < uniqueDates.length; i++) {
                const prevDate = new Date(uniqueDates[i - 1]);
                const currDate = new Date(uniqueDates[i]);
                const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
                if (diffDays === 1) {
                    streakDays++;
                } else {
                    break;
                }
            }
        }

        // Get total questions by difficulty
        const difficultyAggregation = await Question.aggregate([
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalByDifficulty: Record<string, number> = {};
        difficultyAggregation.forEach(d => {
            totalByDifficulty[d._id] = d.count;
        });

        // Get solved questions to calculate by difficulty
        const solvedQuestionIds = solvedEntries.map(p => p.questionId);
        const solvedQuestions = await Question.find({ _id: { $in: solvedQuestionIds } }).select('difficulty').lean();

        const solvedByDifficulty: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
        solvedQuestions.forEach(q => {
            solvedByDifficulty[q.difficulty] = (solvedByDifficulty[q.difficulty] || 0) + 1;
        });

        // Build activity heatmap data (last 365 days)
        const activityMap: Record<string, number> = {};
        solvedEntries.forEach(p => {
            if (p.dateSolved) {
                const date = new Date(p.dateSolved).toISOString().split('T')[0];
                activityMap[date] = (activityMap[date] || 0) + 1;
            }
        });

        const activityHeatmap: { date: string; count: number }[] = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 365);

        for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            activityHeatmap.push({
                date: dateStr,
                count: activityMap[dateStr] || 0
            });
        }

        // Calculate company readiness
        const companyAggregation = await Question.aggregate([
            { $unwind: '$companies' },
            {
                $group: {
                    _id: '$companies',
                    total: { $sum: 1 },
                    questionIds: { $push: '$_id' }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 20 } // Top 20 companies
        ]);

        const companyReadiness = companyAggregation.map(c => {
            const solvedInCompany = c.questionIds.filter((id: string) => solvedQuestionIds.includes(id)).length;
            return {
                company: c._id,
                solved: solvedInCompany,
                total: c.total,
                percentage: Math.round((solvedInCompany / c.total) * 100 * 10) / 10
            };
        });

        // Sort by percentage descending
        companyReadiness.sort((a, b) => b.percentage - a.percentage);

        // Get recent activity
        const recentProgress = await Progress.find({
            userId: payload.userId,
            status: { $in: ['SOLVED', 'ATTEMPTED'] }
        })
            .sort({ updatedAt: -1 })
            .limit(10)
            .lean();

        const recentQuestionIds = recentProgress.map(p => p.questionId);
        const recentQuestions = await Question.find({ _id: { $in: recentQuestionIds } })
            .select('title difficulty')
            .lean();

        const questionMap = new Map(recentQuestions.map(q => [q._id, q]));

        const recentActivity = recentProgress.map(p => ({
            questionId: p.questionId,
            title: questionMap.get(p.questionId)?.title || 'Unknown',
            difficulty: questionMap.get(p.questionId)?.difficulty || 'Medium',
            status: p.status,
            date: p.updatedAt
        }));

        // Most Common Questions - Questions asked by most companies
        const mostCommonQuestions = await Question.aggregate([
            {
                $project: {
                    _id: 1,
                    title: 1,
                    difficulty: 1,
                    acceptanceRate: 1,
                    companyCount: { $size: '$companies' }
                }
            },
            { $sort: { companyCount: -1 } },
            { $limit: 10 }
        ]);

        // Hidden Gems - High acceptance rate but asked by fewer companies
        // These are "easy wins" that are often overlooked
        const hiddenGems = await Question.aggregate([
            {
                $project: {
                    _id: 1,
                    title: 1,
                    difficulty: 1,
                    acceptanceRate: 1,
                    companyCount: { $size: '$companies' }
                }
            },
            {
                $match: {
                    acceptanceRate: { $gte: 0.6 }, // 60%+ acceptance
                    companyCount: { $gte: 3, $lte: 10 } // Not too obscure, not too common
                }
            },
            { $sort: { acceptanceRate: -1 } },
            { $limit: 10 }
        ]);

        return NextResponse.json({
            overview: {
                totalSolved: solvedEntries.length,
                totalAttempted: attemptedEntries.length,
                totalBookmarked: bookmarkedEntries.length,
                streakDays,
                lastSolvedDate: uniqueDates[0] || null
            },
            byDifficulty: {
                Easy: { solved: solvedByDifficulty.Easy, total: totalByDifficulty.Easy || 0 },
                Medium: { solved: solvedByDifficulty.Medium, total: totalByDifficulty.Medium || 0 },
                Hard: { solved: solvedByDifficulty.Hard, total: totalByDifficulty.Hard || 0 }
            },
            activityHeatmap,
            companyReadiness,
            recentActivity,
            mostCommonQuestions,
            hiddenGems
        });

    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
