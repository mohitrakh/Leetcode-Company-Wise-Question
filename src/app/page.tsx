import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-orange-500/30">
      {/* Navigation */}
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Code2 className="h-6 w-6 text-orange-500" />
          <span>LeetCode<span className="text-orange-500">Explorer</span></span>
        </div>
        <nav className="flex gap-4">
          <Link href="/explorer">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              Explorer
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center lg:py-32">
          <div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-800 bg-gray-900/50 px-7 py-2 backdrop-blur transition-all hover:border-gray-700 hover:bg-gray-900/80">
            <p className="text-sm font-semibold text-gray-300">
              🚀 Now with 600+ Companies
            </p>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Master Your <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              Dream Interview
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Stop guessing what to study. Access the exact questions asked by top tech companies in the last 6 months. Data-driven preparation starts here.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/explorer">
              <Button size="lg" className="h-12 bg-orange-600 px-8 text-base font-semibold text-white hover:bg-orange-500">
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 border-gray-700 bg-transparent px-8 text-base text-gray-300 hover:bg-white/10 hover:text-white">
              View Roadmap
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8 backdrop-blur-sm transition-all hover:border-gray-700">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Real Questions</h3>
              <p className="text-gray-400">
                Access a curated database of 3,000+ questions actually asked in recent interviews.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8 backdrop-blur-sm transition-all hover:border-gray-700">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Company Insights</h3>
              <p className="text-gray-400">
                Filter by company, difficulty, and frequency to target your preparation effectively.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8 backdrop-blur-sm transition-all hover:border-gray-700">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Community Driven</h3>
              <p className="text-gray-400">
                Join thousands of developers preparing for roles at FAANG and top startups.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 bg-black py-8 text-center text-sm text-gray-500">
        <p>© 2025 LeetCode Explorer. Built for developers.</p>
      </footer>
    </div>
  );
}
