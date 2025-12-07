"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, BookOpen, Bookmark } from "lucide-react";

interface StatsCardsProps {
    totalSolved: number;
    streakDays: number;
    totalAttempted: number;
    totalBookmarked: number;
}

export function StatsCards({ totalSolved, streakDays, totalAttempted, totalBookmarked }: StatsCardsProps) {
    const stats = [
        {
            label: "Problems Solved",
            value: totalSolved,
            icon: Trophy,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20"
        },
        {
            label: "Day Streak",
            value: streakDays,
            icon: Flame,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            borderColor: "border-orange-500/20"
        },
        {
            label: "Attempted",
            value: totalAttempted,
            icon: BookOpen,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/20"
        },
        {
            label: "Bookmarked",
            value: totalBookmarked,
            icon: Bookmark,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} className={`border-gray-800 ${stat.bgColor} backdrop-blur`}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.borderColor} border`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-gray-400">{stat.label}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
