import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_-10%,rgba(59,130,246,0.14),transparent_50%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Free to use &middot; No sign-up
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Turn metrics into
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {" "}shareable visuals
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          Create crisp text, growth, and payout cards optimized for X.
          Download as PNG in one click.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/editor"
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700"
          >
            Start Building
          </Link>
        </div>
      </div>
    </section>
  );
}
