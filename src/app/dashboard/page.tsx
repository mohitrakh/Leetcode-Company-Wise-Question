"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { DifficultyChart } from "@/components/dashboard/DifficultyChart";
import { CompanyReadiness } from "@/components/dashboard/CompanyReadiness";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { InsightList } from "@/components/dashboard/InsightList";
import { Loader2, BarChart3, Building2, Clock, Calendar, TrendingUp, Gem } from "lucide-react";

interface QuestionInsight {
    _id: string;
    title: string;
    difficulty: string;
    acceptanceRate: number;
    companyCount: number;
}

interface StatsData {
    overview: {
        totalSolved: number;
        totalAttempted: number;
        totalBookmarked: number;
        streakDays: number;
        lastSolvedDate: string | null;
    };
    byDifficulty: {
        Easy: { solved: number; total: number };
        Medium: { solved: number; total: number };
        Hard: { solved: number; total: number };
    };
    activityHeatmap: { date: string; count: number }[];
    companyReadiness: { company: string; solved: number; total: number; percentage: number }[];
    recentActivity: { questionId: string; title: string; difficulty: string; status: string; date: string }[];
    mostCommonQuestions: QuestionInsight[];
    hiddenGems: QuestionInsight[];
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (user) {
            axios.get("/api/stats")
                .then((response) => {
                    setStats(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch stats:", err);
                    setError("Failed to load statistics");
                    setLoading(false);
                });
        }
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header />
                <div className="container mx-auto max-w-7xl p-6 text-center">
                    <p className="text-red-400">{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4 cursor-pointer">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="container mx-auto max-w-7xl p-6">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="h-8 w-8 text-orange-500" />
                        <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
                    </div>
                    <p className="text-gray-400">Track your progress and discover insights</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="mb-8">
                        <StatsCards
                            totalSolved={stats.overview.totalSolved}
                            streakDays={stats.overview.streakDays}
                            totalAttempted={stats.overview.totalAttempted}
                            totalBookmarked={stats.overview.totalBookmarked}
                        />
                    </div>
                )}

                {/* Activity Heatmap */}
                {stats && (
                    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur mb-8">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <CardTitle className="text-lg text-gray-200">Activity</CardTitle>
                            </div>
                            <p className="text-sm text-gray-500">
                                {stats.overview.totalSolved} problems solved in the past year
                            </p>
                        </CardHeader>
                        <CardContent>
                            <ActivityHeatmap data={stats.activityHeatmap} />
                        </CardContent>
                    </Card>
                )}

                {/* Data Insights Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Most Common Questions */}
                    {stats && (
                        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-400" />
                                    <CardTitle className="text-lg text-gray-200">Most Common Questions</CardTitle>
                                </div>
                                <p className="text-sm text-gray-500">Asked by the most companies - core fundamentals</p>
                            </CardHeader>
                            <CardContent>
                                <InsightList data={stats.mostCommonQuestions} type="common" />
                            </CardContent>
                        </Card>
                    )}

                    {/* Hidden Gems */}
                    {stats && (
                        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Gem className="h-5 w-5 text-purple-400" />
                                    <CardTitle className="text-lg text-gray-200">Hidden Gems</CardTitle>
                                </div>
                                <p className="text-sm text-gray-500">High acceptance rate, easy wins for quick prep</p>
                            </CardHeader>
                            <CardContent>
                                <InsightList data={stats.hiddenGems} type="gems" />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Difficulty Breakdown */}
                    {stats && (
                        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-lg text-gray-200">Difficulty Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DifficultyChart data={stats.byDifficulty} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Company Readiness */}
                    {stats && (
                        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                    <CardTitle className="text-lg text-gray-200">Company Readiness</CardTitle>
                                </div>
                                <p className="text-sm text-gray-500">Top 20 companies by question count</p>
                            </CardHeader>
                            <CardContent>
                                <CompanyReadiness data={stats.companyReadiness} />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Recent Activity */}
                {stats && (
                    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-gray-400" />
                                <CardTitle className="text-lg text-gray-200">Recent Activity</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity data={stats.recentActivity} />
                        </CardContent>
                    </Card>
                )}

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link href="/explorer">
                        <Button variant="ghost" className="text-gray-400 hover:text-white cursor-pointer">
                            ← Back to Explorer
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
