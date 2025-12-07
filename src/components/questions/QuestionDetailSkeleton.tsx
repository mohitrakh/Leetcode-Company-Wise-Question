import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";

export function QuestionDetailSkeleton() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="container mx-auto max-w-7xl p-6">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div>
                            <Skeleton className="h-10 w-96 bg-gray-800 mb-4" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-20 bg-gray-800 rounded-full" />
                                <Skeleton className="h-6 w-32 bg-gray-800" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-40 bg-gray-800" />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="border-gray-800 bg-gray-900/30">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-6 w-32 bg-gray-800" />
                                    <Skeleton className="h-6 w-20 bg-gray-800 rounded-full" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="flex items-center justify-between">
                                            <Skeleton className="h-4 w-24 bg-gray-800" />
                                            <Skeleton className="h-4 w-16 bg-gray-800" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
