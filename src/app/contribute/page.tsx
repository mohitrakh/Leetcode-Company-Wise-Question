"use client";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
    Heart,
    GitFork,
    Code2,
    Mail,
    ExternalLink,
    Sparkles,
    Users,
    Database,
    ArrowRight,
    Github
} from "lucide-react";
import Link from "next/link";

export default function ContributePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 dark text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 py-20 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-6">
                            <Sparkles className="h-4 w-4" />
                            <span>Community Driven</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Help Us Keep the Data Fresh
                        </h1>

                        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                            LC Company Prep relies on community contributions to provide accurate, up-to-date
                            interview questions. Your contribution helps thousands of developers prepare better.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <a
                                href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 h-auto text-lg cursor-pointer">
                                    <GitFork className="mr-2 h-5 w-5" />
                                    Fork Data Repository
                                </Button>
                            </a>
                            <a href="mailto:mohitrakh01@gmail.com">
                                <Button variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white px-6 py-3 h-auto text-lg cursor-pointer">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Contact Us
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Contribute Section */}
            <section className="py-20 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                            Why Your Contribution Matters
                        </h2>
                        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                            Company-tagged LeetCode questions are a premium feature. We make this data accessible to everyone,
                            but we need your help to keep it current.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="group p-6 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-orange-500/50 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                    <Database className="h-6 w-6 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Data Gets Stale</h3>
                                <p className="text-gray-400">
                                    Companies update their question pools frequently. Without updates, developers miss out on the latest patterns.
                                </p>
                            </div>

                            <div className="group p-6 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                    <Users className="h-6 w-6 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Community Power</h3>
                                <p className="text-gray-400">
                                    With hundreds of companies and thousands of questions, no single person can track everything.
                                </p>
                            </div>

                            <div className="group p-6 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                    <Heart className="h-6 w-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Pay It Forward</h3>
                                <p className="text-gray-400">
                                    Help others succeed in their interviews just like this platform helped you prepare.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Contribute Section */}
            <section className="py-20 border-t border-gray-800 bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                            How to Contribute
                        </h2>
                        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                            Choose the method that works best for you. Every contribution counts!
                        </p>

                        <div className="space-y-6">
                            {/* Method 1 */}
                            <div className="group relative p-8 rounded-2xl bg-gradient-to-r from-orange-500/5 to-transparent border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                                <div className="absolute top-8 left-8 text-6xl font-bold text-orange-500/10 group-hover:text-orange-500/20 transition-colors">01</div>
                                <div className="relative pl-16">
                                    <div className="flex items-center gap-3 mb-3">
                                        <GitFork className="h-6 w-6 text-orange-500" />
                                        <h3 className="text-2xl font-semibold">Fork & Contribute to the Data Repository</h3>
                                    </div>
                                    <p className="text-gray-400 mb-4 text-lg">
                                        If you have LeetCode Premium, you can fork the original data repository, add new questions
                                        with their company tags, and submit a pull request.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                                        >
                                            <Github className="h-4 w-4" />
                                            <span>snehasishroy/leetcode-companywise-interview-questions</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Method 2 */}
                            <div className="group relative p-8 rounded-2xl bg-gradient-to-r from-purple-500/5 to-transparent border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                                <div className="absolute top-8 left-8 text-6xl font-bold text-purple-500/10 group-hover:text-purple-500/20 transition-colors">02</div>
                                <div className="relative pl-16">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Code2 className="h-6 w-6 text-purple-500" />
                                        <h3 className="text-2xl font-semibold">Create Your Own Scraper</h3>
                                    </div>
                                    <p className="text-gray-400 mb-4 text-lg">
                                        Are you a developer with LeetCode Premium? Build your own script to extract company-tagged
                                        questions and share your repository with the community.
                                    </p>
                                    <p className="text-gray-500">
                                        Share your script or repository at{" "}
                                        <a href="mailto:mohitrakh01@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                                            mohitrakh01@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Method 3 */}
                            <div className="group relative p-8 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-gray-800 hover:border-green-500/30 transition-all duration-300">
                                <div className="absolute top-8 left-8 text-6xl font-bold text-green-500/10 group-hover:text-green-500/20 transition-colors">03</div>
                                <div className="relative pl-16">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Mail className="h-6 w-6 text-green-500" />
                                        <h3 className="text-2xl font-semibold">Email Us Directly</h3>
                                    </div>
                                    <p className="text-gray-400 mb-4 text-lg">
                                        Not comfortable with GitHub? No problem! Send us the question details, company name,
                                        and any other relevant information directly via email.
                                    </p>
                                    <a
                                        href="mailto:mohitrakh01@gmail.com"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                    >
                                        <Mail className="h-4 w-4" />
                                        mohitrakh01@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Source Acknowledgment */}
            <section className="py-20 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Data Source</h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            This project wouldn&apos;t be possible without the amazing work of the open-source community.
                            Our question data comes from this repository:
                        </p>
                        <a
                            href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all group"
                        >
                            <Github className="h-8 w-8 text-gray-400 group-hover:text-white transition-colors" />
                            <div className="text-left">
                                <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                                    snehasishroy/leetcode-companywise-interview-questions
                                </div>
                                <div className="text-sm text-gray-500">
                                    Company-wise LeetCode question collection
                                </div>
                            </div>
                            <ExternalLink className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="p-12 rounded-3xl bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-orange-500/10 border border-gray-800">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Make a Difference?
                            </h2>
                            <p className="text-gray-400 mb-8 text-lg max-w-xl mx-auto">
                                Every question you add helps someone land their dream job. Start contributing today!
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a
                                    href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 h-auto text-lg cursor-pointer">
                                        Start Contributing
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </a>
                                <Link href="/explorer">
                                    <Button variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white px-8 py-4 h-auto text-lg cursor-pointer">
                                        Explore Questions
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>Made with <Heart className="inline h-4 w-4 text-red-500" /> by the community, for the community.</p>
                </div>
            </footer>
        </div>
    );
}
