"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp } from "lucide-react";

interface QuestionInsight {
    _id: string;
    title: string;
    difficulty: string;
    acceptanceRate: number;
    companyCount: number;
}

interface InsightListProps {
    data: QuestionInsight[];
    type: 'common' | 'gems';
}

export function InsightList({ data, type }: InsightListProps) {
    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    return (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {data.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
                data.map((item, index) => (
                    <Link
                        key={item._id}
                        href={`/questions/${item._id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xs text-gray-500 font-mono w-5">
                                {index + 1}.
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-200 group-hover:text-orange-400 transition-colors truncate">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className={`text-xs py-0 ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {type === 'common'
                                            ? `${item.companyCount} companies`
                                            : `${(item.acceptanceRate * 100).toFixed(0)}% acceptance`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0" />
                    </Link>
                ))
            )}
        </div>
    );
}
