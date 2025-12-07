"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, ExternalLink } from "lucide-react";

interface RecentItem {
    questionId: string;
    title: string;
    difficulty: string;
    status: string;
    date: string;
}

interface RecentActivityProps {
    data: RecentItem[];
}

export function RecentActivity({ data }: RecentActivityProps) {
    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-2">
            {data.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
                data.map((item, index) => (
                    <Link
                        key={`${item.questionId}-${index}`}
                        href={`/questions/${item.questionId}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            {item.status === 'SOLVED' ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <div>
                                <p className="text-sm text-gray-200 group-hover:text-orange-400 transition-colors">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className={`text-xs py-0 ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                                </div>
                            </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-gray-400" />
                    </Link>
                ))
            )}
        </div>
    );
}
