"use client";

import { useMemo } from "react";

interface ActivityDay {
    date: string;
    count: number;
}

interface ActivityHeatmapProps {
    data: ActivityDay[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
    const { weeks, months } = useMemo(() => {
        // Group data into weeks (columns)
        const weeks: ActivityDay[][] = [];
        let currentWeek: ActivityDay[] = [];

        // Find the starting day of the week for the first date
        const firstDate = new Date(data[0]?.date || new Date());
        const startDayOfWeek = firstDate.getDay(); // 0 = Sunday

        // Add empty cells for the first week
        for (let i = 0; i < startDayOfWeek; i++) {
            currentWeek.push({ date: '', count: -1 }); // -1 means empty
        }

        data.forEach((day, index) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        // Push remaining days
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        // Calculate month labels
        const months: { label: string; weekIndex: number }[] = [];
        let lastMonth = '';
        weeks.forEach((week, weekIndex) => {
            const validDay = week.find(d => d.date);
            if (validDay) {
                const date = new Date(validDay.date);
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                if (month !== lastMonth) {
                    months.push({ label: month, weekIndex });
                    lastMonth = month;
                }
            }
        });

        return { weeks, months };
    }, [data]);

    const getColor = (count: number) => {
        if (count === -1) return 'transparent';
        if (count === 0) return 'rgb(30, 30, 30)';
        if (count === 1) return 'rgb(14, 68, 41)';
        if (count === 2) return 'rgb(0, 109, 50)';
        if (count <= 4) return 'rgb(38, 166, 65)';
        return 'rgb(57, 211, 83)';
    };

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="overflow-x-auto">
            {/* Month labels */}
            <div className="flex mb-1 ml-8">
                {months.map((m, i) => (
                    <div
                        key={i}
                        className="text-xs text-gray-500"
                        style={{
                            position: 'relative',
                            left: `${m.weekIndex * 14}px`,
                            width: '50px'
                        }}
                    >
                        {m.label}
                    </div>
                ))}
            </div>

            <div className="flex gap-0.5">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 mr-1">
                    {dayLabels.map((day, i) => (
                        <div
                            key={day}
                            className="text-xs text-gray-500 h-[12px] leading-[12px]"
                            style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex gap-0.5">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-0.5">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className="w-[12px] h-[12px] rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-gray-500"
                                    style={{ backgroundColor: getColor(day.count) }}
                                    title={day.date ? `${day.date}: ${day.count} solved` : ''}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3">
                <span className="text-xs text-gray-500 mr-2">Less</span>
                {[0, 1, 2, 3, 5].map((count) => (
                    <div
                        key={count}
                        className="w-[12px] h-[12px] rounded-sm"
                        style={{ backgroundColor: getColor(count) }}
                    />
                ))}
                <span className="text-xs text-gray-500 ml-2">More</span>
            </div>
        </div>
    );
}
