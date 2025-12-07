"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Calendar, TrendingUp, Bookmark, BookmarkCheck, Check, Clock, Circle, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { QuestionDetailSkeleton } from "@/components/questions/QuestionDetailSkeleton";

interface Appearance {
    company: string;
    period: string;
    frequency: number;
    sourceFile: string;
}

interface QuestionDetail {
    _id: string;
    title: string;
    url: string;
    difficulty: string;
    acceptanceRate: number;
    companies: string[];
    appearances: Appearance[];
}

type ProgressStatus = 'TODO' | 'ATTEMPTED' | 'SOLVED';

interface Progress {
    status: ProgressStatus;
    notes: string;
    isBookmarked: boolean;
}

export default function QuestionDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const [question, setQuestion] = useState<QuestionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Progress state
    const [progress, setProgress] = useState<Progress>({
        status: 'TODO',
        notes: '',
        isBookmarked: false,
    });
    const [notesInput, setNotesInput] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingBookmark, setSavingBookmark] = useState(false);

    useEffect(() => {
        if (params.id) {
            axios.get(`/api/questions/${params.id}`)
                .then((response) => {
                    setQuestion(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params.id]);

    // Fetch user's progress for this question
    useEffect(() => {
        if (params.id && user) {
            axios.get(`/api/progress/${params.id}`)
                .then((response) => {
                    const p = response.data.progress;
                    setProgress({
                        status: p.status,
                        notes: p.notes,
                        isBookmarked: p.isBookmarked,
                    });
                    setNotesInput(p.notes || '');
                })
                .catch((err) => {
                    console.error('Failed to fetch progress:', err);
                });
        }
    }, [params.id, user]);

    const updateStatus = async (newStatus: ProgressStatus) => {
        if (!user) return;
        setSavingStatus(true);
        try {
            const response = await axios.patch(`/api/progress/${params.id}`, { status: newStatus });
            setProgress(prev => ({ ...prev, status: response.data.progress.status }));
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setSavingStatus(false);
        }
    };

    const toggleBookmark = async () => {
        if (!user) return;
        setSavingBookmark(true);
        try {
            const response = await axios.patch(`/api/progress/${params.id}`, {
                isBookmarked: !progress.isBookmarked
            });
            setProgress(prev => ({ ...prev, isBookmarked: response.data.progress.isBookmarked }));
        } catch (err) {
            console.error('Failed to toggle bookmark:', err);
        } finally {
            setSavingBookmark(false);
        }
    };

    const saveNotes = async () => {
        if (!user) return;
        setSavingNotes(true);
        try {
            const response = await axios.patch(`/api/progress/${params.id}`, { notes: notesInput });
            setProgress(prev => ({ ...prev, notes: response.data.progress.notes }));
        } catch (err) {
            console.error('Failed to save notes:', err);
        } finally {
            setSavingNotes(false);
        }
    };

    if (loading) {
        return <QuestionDetailSkeleton />;
    }

    if (!question) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header />
                <div className="container mx-auto max-w-7xl p-6 flex flex-col items-center justify-center h-[500px] gap-4">
                    <h1 className="text-2xl font-bold">Question not found</h1>
                    <Link href="/explorer">
                        <Button variant="outline" className="cursor-pointer">Back to Explorer</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const getStatusButtonStyle = (status: ProgressStatus, isActive: boolean) => {
        if (!isActive) return "border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800";
        switch (status) {
            case 'SOLVED': return "border-green-500 bg-green-500/20 text-green-400";
            case 'ATTEMPTED': return "border-yellow-500 bg-yellow-500/20 text-yellow-400";
            case 'TODO': return "border-gray-500 bg-gray-500/20 text-gray-400";
        }
    };

    // Group appearances by company
    const companyStats = question.appearances.reduce((acc, curr) => {
        if (!acc[curr.company]) {
            acc[curr.company] = [];
        }
        acc[curr.company].push(curr);
        return acc;
    }, {} as Record<string, Appearance[]>);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="container mx-auto max-w-7xl p-6">
                {/* Header section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4">{question.title}</h1>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                                    {question.difficulty}
                                </Badge>
                                <span className="text-gray-400">
                                    Acceptance: <span className="text-white">{(question.acceptanceRate * 100).toFixed(1)}%</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {user && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleBookmark}
                                    disabled={savingBookmark}
                                    className={`cursor-pointer ${progress.isBookmarked
                                        ? 'border-orange-500 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                                        : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                                >
                                    {savingBookmark ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : progress.isBookmarked ? (
                                        <BookmarkCheck className="h-4 w-4" />
                                    ) : (
                                        <Bookmark className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                            <a href={question.url} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-orange-600 hover:bg-orange-500 text-white cursor-pointer">
                                    Solve on LeetCode
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Progress Tracking Section - Only for logged in users */}
                {user && (
                    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur mb-8">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-gray-200">Your Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Status Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateStatus('TODO')}
                                    disabled={savingStatus}
                                    className={`cursor-pointer ${getStatusButtonStyle('TODO', progress.status === 'TODO')}`}
                                >
                                    <Circle className="h-4 w-4 mr-1" />
                                    Todo
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateStatus('ATTEMPTED')}
                                    disabled={savingStatus}
                                    className={`cursor-pointer ${getStatusButtonStyle('ATTEMPTED', progress.status === 'ATTEMPTED')}`}
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    Attempted
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateStatus('SOLVED')}
                                    disabled={savingStatus}
                                    className={`cursor-pointer ${getStatusButtonStyle('SOLVED', progress.status === 'SOLVED')}`}
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Solved
                                </Button>
                                {savingStatus && <Loader2 className="h-4 w-4 animate-spin text-gray-400 ml-2" />}
                            </div>

                            {/* Notes Section */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Personal Notes</label>
                                <Textarea
                                    placeholder="Add your notes here... (approach used, time complexity, key insights)"
                                    value={notesInput}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotesInput(e.target.value)}
                                    className="min-h-[100px] border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                />
                                <Button
                                    onClick={saveNotes}
                                    disabled={savingNotes || notesInput === progress.notes}
                                    size="sm"
                                    className="bg-orange-600 hover:bg-orange-500 text-white cursor-pointer disabled:opacity-50"
                                >
                                    {savingNotes ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Notes'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Company Stats Grid */}
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Companies asking this question</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(companyStats).map(([company, stats]) => (
                        <Card key={company} className="border-gray-800 bg-gray-900/30 backdrop-blur">
                            <CardHeader className="pb-3">
                                <CardTitle className="capitalize flex items-center justify-between text-gray-200">
                                    {company}
                                    <Badge variant="secondary" className="bg-gray-800 text-gray-400">
                                        {stats.length} periods
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.sort((a, b) => b.frequency - a.frequency).map((stat, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                <span className="capitalize">{stat.period.replace(/-/g, ' ')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-3 w-3 text-gray-500" />
                                                <span className="font-medium text-gray-300">{(stat.frequency * 100).toFixed(0)}% Freq</span>
                                            </div>
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
