"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Loader2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await signup(name, email, password, avatar);
            router.push("/profile");
        } catch (err: any) {
            setError(err.response?.data?.error || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="mb-8 flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
                <Code2 className="h-8 w-8 text-orange-500" />
                <span>LeetCode<span className="text-orange-500">Explorer</span></span>
            </div>

            <Card className="w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">Create Account</CardTitle>
                    <CardDescription className="text-gray-400">
                        Start tracking your interview prep journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Name</label>
                            <Input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Email</label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-gray-500">Minimum 6 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Avatar URL <span className="text-gray-600">(optional)</span></label>
                            <Input
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-orange-500 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
