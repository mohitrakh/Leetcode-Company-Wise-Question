"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, BookmarkCheck, Check, Clock, Circle, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";

interface Question {
    _id: string;
    title: string;
    url: string;
    difficulty: string;
    acceptanceRate: number;
    companies: string[];
}

interface BookmarkedQuestion extends Question {
    status: 'TODO' | 'ATTEMPTED' | 'SOLVED';
    notes: string;
}

export default function BookmarksPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [questions, setQuestions] = useState<BookmarkedQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState<string>("all");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    // Fetch bookmarked questions
    useEffect(() => {
        if (user) {
            setLoading(true);
            // First get bookmarked progress entries
            axios.get("/api/progress?bookmarked=true")
                .then(async (response) => {
                    const progressMap = response.data.progress;
                    const questionIds = Object.keys(progressMap);

                    if (questionIds.length === 0) {
                        setQuestions([]);
                        setLoading(false);
                        return;
                    }

                    // Fetch question details for bookmarked questions
                    const questionsResponse = await axios.get(`/api/questions?ids=${questionIds.join(',')}&limit=100`);
                    const questionsWithProgress = questionsResponse.data.data.map((q: Question) => ({
                        ...q,
                        status: progressMap[q._id]?.status || 'TODO',
                        notes: progressMap[q._id]?.notes || '',
                    }));
                    setQuestions(questionsWithProgress);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch bookmarks", err);
                    setLoading(false);
                });
        }
    }, [user]);

    const filteredQuestions = questions.filter(q =>
        difficulty === "all" || q.difficulty === difficulty
    );

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20";
            case "Hard": return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SOLVED':
                return <Check className="h-4 w-4 text-green-500" />;
            case 'ATTEMPTED':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <Circle className="h-4 w-4 text-gray-600" />;
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="container mx-auto max-w-7xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <BookmarkCheck className="h-8 w-8 text-orange-500" />
                        <h1 className="text-3xl font-bold tracking-tight">Must Revise</h1>
                    </div>
                    <p className="text-gray-400">Questions you&apos;ve bookmarked for revision</p>
                </div>

                {/* Filter */}
                <Card className="mb-8 border-gray-800 bg-gray-900/50 p-4 backdrop-blur">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">Filter by:</span>
                        <Select
                            value={difficulty}
                            onValueChange={setDifficulty}
                        >
                            <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900 text-white cursor-pointer">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-700 bg-gray-900 text-white">
                                <SelectItem value="all" className="cursor-pointer">All Difficulties</SelectItem>
                                <SelectItem value="Easy" className="cursor-pointer">Easy</SelectItem>
                                <SelectItem value="Medium" className="cursor-pointer">Medium</SelectItem>
                                <SelectItem value="Hard" className="cursor-pointer">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-gray-500 text-sm ml-auto">
                            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} bookmarked
                        </span>
                    </div>
                </Card>

                {/* Table */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-transparent bg-gray-900/50">
                                <TableHead className="w-[40px] text-center text-gray-400"></TableHead>
                                <TableHead className="text-gray-400 pl-6">Title</TableHead>
                                <TableHead className="w-[120px] text-gray-400 text-center">Difficulty</TableHead>
                                <TableHead className="w-[120px] text-gray-400 text-center">Acceptance</TableHead>
                                <TableHead className="text-gray-400 pl-6">Companies</TableHead>
                                <TableHead className="w-[60px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredQuestions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                        {questions.length === 0
                                            ? "No bookmarked questions yet. Start bookmarking from the question detail page!"
                                            : "No questions match the selected filter."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredQuestions.map((question) => (
                                    <TableRow key={question._id} className="border-gray-800 hover:bg-gray-800/40 transition-colors">
                                        <TableCell className="text-center">
                                            {getStatusIcon(question.status)}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-200 py-4 pl-6">
                                            <Link href={`/questions/${question._id}`} className="hover:text-orange-500 hover:underline cursor-pointer">
                                                {question.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={`${getDifficultyColor(question.difficulty)} px-3 py-0.5`}>
                                                {question.difficulty}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-gray-400 font-mono text-sm">
                                            {(question.acceptanceRate * 100).toFixed(1)}%
                                        </TableCell>
                                        <TableCell className="pl-6">
                                            <div className="flex flex-wrap gap-1.5">
                                                {question.companies.slice(0, 3).map((company) => (
                                                    <Badge key={company} variant="secondary" className="bg-gray-800/80 text-gray-300 hover:bg-gray-700 capitalize border border-gray-700/50 px-2">
                                                        {company}
                                                    </Badge>
                                                ))}
                                                {question.companies.length > 3 && (
                                                    <Badge variant="secondary" className="bg-gray-800/80 text-gray-400 border border-gray-700/50">
                                                        +{question.companies.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <a href={question.url} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 cursor-pointer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/explorer">
                        <Button variant="ghost" className="text-gray-400 hover:text-white">
                            ← Back to Explorer
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
