"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, Gem, ExternalLink } from "lucide-react";

interface QuestionInsight {
    _id: string;
    title: string;
    difficulty: string;
    acceptanceRate: number;
    companyCount: number;
    url: string;
}

export default function InsightsPage() {
    const [mostCommon, setMostCommon] = useState<QuestionInsight[]>([]);
    const [hiddenGems, setHiddenGems] = useState<QuestionInsight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/insights?limit=100")
            .then((response) => {
                setMostCommon(response.data.mostCommonQuestions);
                setHiddenGems(response.data.hiddenGems);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch insights:", err);
                setLoading(false);
            });
    }, []);

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const router = useRouter();

    const QuestionRow = ({ item, index, showCompanyCount }: { item: QuestionInsight; index: number; showCompanyCount: boolean }) => (
        <div
            onClick={() => router.push(`/questions/${item._id}`)}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group border border-gray-800/50 cursor-pointer"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-sm text-gray-500 font-mono w-8 text-right">
                    {index + 1}.
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-200 group-hover:text-orange-400 transition-colors font-medium">
                        {item.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">
                            {showCompanyCount
                                ? `${item.companyCount} companies`
                                : `${(item.acceptanceRate * 100).toFixed(1)}% acceptance`
                            }
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <ExternalLink className="h-4 w-4 text-gray-500 hover:text-orange-400" />
                </a>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="container mx-auto max-w-5xl p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Question Insights</h1>
                        <p className="text-gray-400">Discover the most important questions to focus on</p>
                    </div>
                </div>

                <Tabs defaultValue="common" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-800 mb-6">
                        <TabsTrigger
                            value="common"
                            className="data-[state=active]:bg-blue-500/20 text-white data-[state=active]:text-blue-400 cursor-pointer"
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Most Common ({mostCommon.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="gems"
                            className="data-[state=active]:bg-purple-500/20 text-white data-[state=active]:text-purple-400 cursor-pointer"
                        >
                            <Gem className="h-4 w-4 mr-2" />
                            Hidden Gems ({hiddenGems.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="common">
                        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-lg text-gray-200 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-400" />
                                    Most Common Questions
                                </CardTitle>
                                <p className="text-sm text-gray-500">
                                    Questions asked by the most companies. These are fundamental problems you must master.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {mostCommon.map((item, index) => (
                                    <QuestionRow key={item._id} item={item} index={index} showCompanyCount={true} />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="gems">
                        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-lg text-gray-200 flex items-center gap-2">
                                    <Gem className="h-5 w-5 text-purple-400" />
                                    Hidden Gems
                                </CardTitle>
                                <p className="text-sm text-gray-500">
                                    High acceptance rate questions (60%+) with moderate company coverage. Easy wins for quick prep!
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {hiddenGems.map((item, index) => (
                                    <QuestionRow key={item._id} item={item} index={index} showCompanyCount={false} />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
