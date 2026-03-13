import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-white" fill="currentColor">
              <path d="M2 2h4v4H2zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z" />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-slate-900">MetricCard</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#features" className="transition hover:text-slate-900">Features</a>
          <a href="#how-it-works" className="transition hover:text-slate-900">How it works</a>
          <Link href="/login" className="transition hover:text-slate-900">Join Waitlist</Link>
        </div>

        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} MetricCard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
