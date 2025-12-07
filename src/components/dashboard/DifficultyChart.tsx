"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DifficultyData {
    Easy: { solved: number; total: number };
    Medium: { solved: number; total: number };
    Hard: { solved: number; total: number };
}

interface DifficultyChartProps {
    data: DifficultyData;
}

export function DifficultyChart({ data }: DifficultyChartProps) {
    const chartData = [
        { name: "Easy", value: data.Easy.solved, total: data.Easy.total, color: "#22c55e" },
        { name: "Medium", value: data.Medium.solved, total: data.Medium.total, color: "#eab308" },
        { name: "Hard", value: data.Hard.solved, total: data.Hard.total, color: "#ef4444" }
    ];

    const totalSolved = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex items-center justify-center gap-6 h-full!">
            <div className="relative w-[160px] h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                                            <p className="text-white font-medium">{data.name}</p>
                                            <p className="text-gray-400 text-sm">
                                                {data.value} / {data.total} solved
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-white">{totalSolved}</span>
                    <span className="text-xs text-gray-400">Solved</span>
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
                {chartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <div>
                            <p className="text-sm text-white">
                                {item.name}: <span className="font-medium">{item.value}</span>
                                <span className="text-gray-500"> / {item.total}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
