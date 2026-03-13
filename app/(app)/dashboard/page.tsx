import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and share your metric cards.
        </p>
      </div>

      <Link
        href="/editor"
        className="mt-8 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Open Editor</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Design your metric card and export as PNG.
          </p>
        </div>
        <svg className="ml-auto h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
    </div>
  );
}
