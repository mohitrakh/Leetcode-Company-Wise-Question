"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Code2, User, LogOut, Loader2, BookmarkCheck, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <header className="container mx-auto flex h-16 items-center justify-between px-4 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                <Code2 className="h-6 w-6 text-orange-500" />
                <span>LeetCode<span className="text-orange-500">Explorer</span></span>
            </Link>
            <nav className="flex items-center gap-4">
                <Link href="/explorer">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                        Explorer
                    </Button>
                </Link>
                <Link href="/insights">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                        Insights
                    </Button>
                </Link>

                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 focus:outline-none cursor-pointer">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-700"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-800">
                            <div className="px-2 py-1.5">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                            <DropdownMenuSeparator className="bg-gray-800" />
                            <DropdownMenuItem asChild className="cursor-pointer text-gray-300 focus:text-white focus:bg-gray-800">
                                <Link href="/profile" className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer text-gray-300 focus:text-white focus:bg-gray-800">
                                <Link href="/dashboard" className="flex items-center">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer text-gray-300 focus:text-white focus:bg-gray-800">
                                <Link href="/bookmarks" className="flex items-center">
                                    <BookmarkCheck className="mr-2 h-4 w-4" />
                                    Must Revise
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-800" />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link href="/login">
                        <Button variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer">
                            Sign In
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
}

