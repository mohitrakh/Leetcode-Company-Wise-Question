"use client";

interface CompanyScore {
    company: string;
    solved: number;
    total: number;
    percentage: number;
}

interface CompanyReadinessProps {
    data: CompanyScore[];
}

export function CompanyReadiness({ data }: CompanyReadinessProps) {
    const getProgressColor = (percentage: number) => {
        if (percentage >= 60) return "bg-green-500";
        if (percentage >= 30) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getTextColor = (percentage: number) => {
        if (percentage >= 60) return "text-green-400";
        if (percentage >= 30) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {data.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No data yet. Start solving questions!</p>
            ) : (
                data.map((company) => (
                    <div key={company.company} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300 capitalize font-medium">
                                {company.company}
                            </span>
                            <span className={`text-sm font-mono ${getTextColor(company.percentage)}`}>
                                {company.percentage}%
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${getProgressColor(company.percentage)} transition-all duration-500`}
                                    style={{ width: `${Math.min(company.percentage, 100)}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-500 w-16 text-right">
                                {company.solved}/{company.total}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
