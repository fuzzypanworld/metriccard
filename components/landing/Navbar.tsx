"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25">
            <svg viewBox="0 0 16 16" className="h-4.5 w-4.5 text-white" fill="currentColor">
              <path d="M2 2h4v4H2zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">MetricCard</span>
        </Link>

        <div className="flex items-center gap-6">
          <a href="#features" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:block">
            Features
          </a>
          <a href="#how-it-works" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:block">
            How it works
          </a>
          <Link
            href="/login"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700 hover:shadow-xl"
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </nav>
  );
}
