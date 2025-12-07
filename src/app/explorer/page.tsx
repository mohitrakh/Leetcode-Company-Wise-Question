"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    Search, ExternalLink, ChevronLeft, ChevronRight, Check, Clock, Circle, Flame, Puzzle, Bookmark, ChevronDown, ChevronUp, X
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { TableSkeleton } from "@/components/questions/TableSkeleton";

interface Question {
    _id: string;
    title: string;
    url: string;
    difficulty: string;
    acceptanceRate: number;
    companies: string[];
}

interface Company {
    _id: string;
    count: number;
}

type ProgressStatus = 'TODO' | 'ATTEMPTED' | 'SOLVED';

interface ProgressMap {
    [questionId: string]: {
        status: ProgressStatus;
        isBookmarked: boolean;
    };
}

export default function ExplorerPage() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [companies, setCompanies] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [progressMap, setProgressMap] = useState<ProgressMap>({});

    // Basic Filters
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [difficulty, setDifficulty] = useState<string>("all");
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

    // Advanced Filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [companyMode, setCompanyMode] = useState<'AND' | 'OR'>('OR');
    const [minFrequency, setMinFrequency] = useState<string>("");
    const [minAcceptance, setMinAcceptance] = useState<string>("");
    const [maxAcceptance, setMaxAcceptance] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

    // Active preset tracking
    const [activePreset, setActivePreset] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, difficulty, selectedCompanies, companyMode, minFrequency, minAcceptance, maxAcceptance, statusFilter, bookmarkedOnly]);

    // Fetch Companies
    useEffect(() => {
        axios.get("/api/companies")
            .then((response) => {
                const data: Company[] = response.data;
                const options = data.map(c => ({
                    label: c._id,
                    value: c._id,
                    count: c.count
                }));
                setCompanies(options);
            })
            .catch((err) => console.error("Failed to fetch companies", err));
    }, []);

    // Fetch Questions
    useEffect(() => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set("limit", "20");
        if (debouncedSearch) searchParams.set("search", debouncedSearch);
        if (difficulty && difficulty !== "all") searchParams.set("difficulty", difficulty);
        if (selectedCompanies.length > 0) {
            searchParams.set("company", selectedCompanies.join(','));
            searchParams.set("companyMode", companyMode);
        }
        if (minFrequency) searchParams.set("minFrequency", minFrequency);
        if (minAcceptance) searchParams.set("minAcceptance", minAcceptance);
        if (maxAcceptance) searchParams.set("maxAcceptance", maxAcceptance);
        if (statusFilter && statusFilter !== "all") searchParams.set("status", statusFilter);
        if (bookmarkedOnly) searchParams.set("bookmarked", "true");

        axios.get(`/api/questions?${searchParams.toString()}`)
            .then((response) => {
                setQuestions(response.data.data);
                setTotalPages(response.data.pagination.pages);
                setTotalQuestions(response.data.pagination.total);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch questions", err);
                setLoading(false);
            });
    }, [page, debouncedSearch, difficulty, selectedCompanies, companyMode, minFrequency, minAcceptance, maxAcceptance, statusFilter, bookmarkedOnly]);

    // Fetch user's progress for displayed questions
    useEffect(() => {
        if (user && questions.length > 0) {
            const questionIds = questions.map(q => q._id).join(',');
            axios.get(`/api/progress?questionIds=${questionIds}`)
                .then((response) => {
                    setProgressMap(response.data.progress);
                })
                .catch((err) => {
                    console.error("Failed to fetch progress", err);
                });
        }
    }, [user, questions]);

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20";
            case "Hard": return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const getStatusIcon = (status?: ProgressStatus) => {
        switch (status) {
            case 'SOLVED':
                return <Check className="h-4 w-4 text-green-500" />;
            case 'ATTEMPTED':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <Circle className="h-4 w-4 text-gray-600" />;
        }
    };

    // Preset filter handlers
    const applyHotQuestionsPreset = () => {
        setActivePreset('hot');
        setDifficulty('Medium');
        setMinFrequency('50');
        setMinAcceptance('');
        setMaxAcceptance('');
        setStatusFilter('all');
        setBookmarkedOnly(false);
        setShowAdvancedFilters(true);
    };

    const applyTrickyPreset = () => {
        setActivePreset('tricky');
        setDifficulty('all');
        setMinFrequency('');
        setMinAcceptance('');
        setMaxAcceptance('30');
        setStatusFilter('all');
        setBookmarkedOnly(false);
        setShowAdvancedFilters(true);
    };

    const applyMustRevisePreset = () => {
        setActivePreset('revise');
        setDifficulty('all');
        setMinFrequency('');
        setMinAcceptance('');
        setMaxAcceptance('');
        setStatusFilter('all');
        setBookmarkedOnly(true);
        setShowAdvancedFilters(true);
    };

    const clearAllFilters = () => {
        setActivePreset(null);
        setSearch('');
        setDifficulty('all');
        setSelectedCompanies([]);
        setCompanyMode('OR');
        setMinFrequency('');
        setMinAcceptance('');
        setMaxAcceptance('');
        setStatusFilter('all');
        setBookmarkedOnly(false);
    };

    const hasActiveFilters = search || difficulty !== 'all' || selectedCompanies.length > 0 ||
        minFrequency || minAcceptance || maxAcceptance ||
        statusFilter !== 'all' || bookmarkedOnly;

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="container mx-auto max-w-7xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Question Explorer</h1>
                    <p className="text-gray-400">Browse and filter questions from top tech companies</p>
                </div>

                {/* Filters */}
                <Card className="mb-6 border-gray-800 bg-gray-900/50 p-4 backdrop-blur">
                    {/* Basic Filters Row */}
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                placeholder="Search questions..."
                                className="pl-10 border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            value={difficulty}
                            onValueChange={(val) => {
                                setDifficulty(val);
                                setActivePreset(null);
                            }}
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
                        <div className="flex items-center gap-2">
                            <div className="w-[280px]">
                                <MultiSelect
                                    options={companies}
                                    selected={selectedCompanies}
                                    onChange={(selected) => {
                                        setSelectedCompanies(selected);
                                        setActivePreset(null);
                                    }}
                                    placeholder="Select Companies"
                                />
                            </div>
                            {selectedCompanies.length >= 2 && (
                                <div className="flex rounded-md border border-gray-700 overflow-hidden">
                                    <button
                                        onClick={() => setCompanyMode('OR')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${companyMode === 'OR'
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        OR
                                    </button>
                                    <button
                                        onClick={() => setCompanyMode('AND')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${companyMode === 'AND'
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        AND
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            Advanced Filters
                        </button>

                        {/* Quick Presets */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 mr-2">Quick Presets:</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={applyHotQuestionsPreset}
                                className={`text-xs cursor-pointer ${activePreset === 'hot'
                                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                                        : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Flame className="h-3 w-3 mr-1" />
                                Hot Questions
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={applyTrickyPreset}
                                className={`text-xs cursor-pointer ${activePreset === 'tricky'
                                        ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                                        : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Puzzle className="h-3 w-3 mr-1" />
                                Tricky
                            </Button>
                            {user && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={applyMustRevisePreset}
                                    className={`text-xs cursor-pointer ${activePreset === 'revise'
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                            : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <Bookmark className="h-3 w-3 mr-1" />
                                    Must Revise
                                </Button>
                            )}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="text-xs text-gray-500 hover:text-white cursor-pointer"
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showAdvancedFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-gray-800 pt-4">
                            {/* Min Frequency */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Min Frequency %</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="e.g., 50"
                                    value={minFrequency}
                                    onChange={(e) => {
                                        setMinFrequency(e.target.value);
                                        setActivePreset(null);
                                    }}
                                    className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                />
                            </div>

                            {/* Acceptance Range */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Min Acceptance %</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="e.g., 20"
                                    value={minAcceptance}
                                    onChange={(e) => {
                                        setMinAcceptance(e.target.value);
                                        setActivePreset(null);
                                    }}
                                    className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Max Acceptance %</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="e.g., 80"
                                    value={maxAcceptance}
                                    onChange={(e) => {
                                        setMaxAcceptance(e.target.value);
                                        setActivePreset(null);
                                    }}
                                    className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                />
                            </div>

                            {/* Progress-based filters (logged in only) */}
                            {user && (
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Status</label>
                                    <div className="flex items-center gap-3">
                                        <Select
                                            value={statusFilter}
                                            onValueChange={(val) => {
                                                setStatusFilter(val);
                                                setActivePreset(null);
                                            }}
                                        >
                                            <SelectTrigger className="flex-1 border-gray-700 bg-gray-900 text-white cursor-pointer">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-700 bg-gray-900 text-white">
                                                <SelectItem value="all" className="cursor-pointer">All Status</SelectItem>
                                                <SelectItem value="TODO" className="cursor-pointer">Todo</SelectItem>
                                                <SelectItem value="ATTEMPTED" className="cursor-pointer">Attempted</SelectItem>
                                                <SelectItem value="SOLVED" className="cursor-pointer">Solved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="bookmarked"
                                                checked={bookmarkedOnly}
                                                onCheckedChange={(checked) => {
                                                    setBookmarkedOnly(checked === true);
                                                    setActivePreset(null);
                                                }}
                                                className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                            />
                                            <label htmlFor="bookmarked" className="text-xs text-gray-400 cursor-pointer">
                                                Bookmarked
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                {/* Results Count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-transparent bg-gray-900/50">
                                {user && <TableHead className="w-[40px] text-center text-gray-400"></TableHead>}
                                <TableHead className="w-[60px] text-center text-gray-400">#</TableHead>
                                <TableHead className="text-gray-400 pl-6">Title</TableHead>
                                <TableHead className="w-[120px] text-gray-400 text-center">Difficulty</TableHead>
                                <TableHead className="w-[120px] text-gray-400 text-center">Acceptance</TableHead>
                                <TableHead className="text-gray-400 pl-6">Companies</TableHead>
                                <TableHead className="w-[60px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeleton />
                            ) : questions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={user ? 7 : 6} className="h-32 text-center text-gray-500">
                                        No questions found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questions.map((question, index) => (
                                    <TableRow key={question._id} className="border-gray-800 hover:bg-gray-800/40 transition-colors">
                                        {user && (
                                            <TableCell className="text-center">
                                                {getStatusIcon(progressMap[question._id]?.status)}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-center text-gray-500 font-mono text-xs">
                                            {(page - 1) * 20 + index + 1}
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
                                                    <Badge key={company} variant="secondary" className="bg-gray-800/80 text-gray-300 hover:bg-gray-700 capitalize border border-gray-700/50 px-2 cursor-pointer">
                                                        {company}
                                                    </Badge>
                                                ))}
                                                {question.companies.length > 3 && (
                                                    <Badge variant="secondary" className="bg-gray-800/80 text-gray-400 border border-gray-700/50 cursor-default">
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

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPage((p) => Math.max(1, p - 1));
                            setLoading(true);
                        }}
                        disabled={page === 1 || loading}
                        className="border-gray-800 bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-400 bg-gray-900 px-3 py-1.5 rounded-md border border-gray-800">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPage((p) => Math.min(totalPages, p + 1));
                            setLoading(true);
                        }}
                        disabled={page === totalPages || loading}
                        className="border-gray-800 bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
