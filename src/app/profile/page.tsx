"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { User, Mail, Calendar, LogOut, Loader2 } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
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

                        <div className="pt-4 border-t border-gray-800">
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
                        <Button variant="ghost" className="text-gray-400 hover:text-white">
                            ← Back to Explorer
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
