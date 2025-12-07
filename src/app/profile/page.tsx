"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { User, Mail, Calendar, LogOut, Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    // Sync State
    const [isSyncOpen, setIsSyncOpen] = useState(false);
    const [sessionCookie, setSessionCookie] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{
        success: boolean;
        message: string;
        stats?: { total: number; synced: number };
    } | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const handleSync = async () => {
        if (!sessionCookie) return;

        setIsSyncing(true);
        setSyncResult(null);

        try {
            const response = await axios.post("/api/sync/leetcode", {
                session: sessionCookie
            });

            setSyncResult({
                success: true,
                message: "Sync completed successfully!",
                stats: {
                    total: response.data.totalSolvedOnLeetCode,
                    synced: response.data.syncedCount
                }
            });
            // Clear cookie after success for security
            setSessionCookie("");
        } catch (error: any) {
            setSyncResult({
                success: false,
                message: error.response?.data?.error || error.message || "Failed to sync"
            });
        } finally {
            setIsSyncing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <div className="container mx-auto max-w-2xl p-6">
                <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>

                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-2xl text-white">{user.name}</CardTitle>
                                <p className="text-gray-400 mt-1">Member</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                    <p className="text-white">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                                    <p className="text-white">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-800 space-y-3">
                            <Dialog open={isSyncOpen} onOpenChange={setIsSyncOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full border-orange-500/20 text-orange-500 hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Sync LeetCode Progress
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Sync LeetCode Progress</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Enter your LeetCode session cookie to sync all your solved problems.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cookie">LEETCODE_SESSION Cookie</Label>
                                            <Input
                                                id="cookie"
                                                placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                                                value={sessionCookie}
                                                onChange={(e) => setSessionCookie(e.target.value)}
                                                className="bg-gray-800 border-gray-700 text-white font-mono text-xs"
                                                type="password"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Open LeetCode &gt; Inspect Element &gt; Application &gt; Cookies &gt; Copy LEETCODE_SESSION value.
                                            </p>
                                        </div>

                                        {syncResult && (
                                            <div className={`p-3 rounded-md text-sm flex items-start gap-2 ${syncResult.success ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                                                }`}>
                                                {syncResult.success ? <CheckCircle className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
                                                <div>
                                                    <p className="font-medium">{syncResult.message}</p>
                                                    {syncResult.stats && (
                                                        <p className="mt-1 text-xs opacity-90">
                                                            Found {syncResult.stats.total} solved problems. Synced {syncResult.stats.synced} to database.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <Button variant="ghost" onClick={() => setIsSyncOpen(false)} disabled={isSyncing} className="text-gray-400 hover:text-white hover:bg-gray-800">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSync} disabled={!sessionCookie || isSyncing} className="bg-orange-600 hover:bg-orange-700 text-white">
                                            {isSyncing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Syncing...
                                                </>
                                            ) : (
                                                "Start Sync"
                                            )}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <Link href="/explorer">
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
                            ← Back to Explorer
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
