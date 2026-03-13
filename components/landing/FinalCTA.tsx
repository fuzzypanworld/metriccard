import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/15 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Ready to make your metrics{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            unforgettable
          </span>
          ?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
          Join hundreds of creators already using MetricCard. Free during beta &mdash; no credit card, no catch.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-slate-900/25 transition hover:bg-slate-700 hover:shadow-2xl"
          >
            Join the Waitlist
            <svg className="h-5 w-5 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Sign in with Google &middot; Takes 5 seconds
        </p>
      </div>
    </section>
  );
}
