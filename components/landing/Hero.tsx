"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 sm:pt-40 lg:pb-32">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          Now accepting early users
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Turn your metrics into{" "}
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
            viral visuals
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          Create stunning text, growth, and payout cards optimized for X. Pick a scene, customize your stats, and download a pixel-perfect PNG in seconds.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-slate-900/25 transition hover:bg-slate-700 hover:shadow-2xl"
          >
            Join the Waitlist
            <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md"
          >
            See features
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500"].map((bg, i) => (
                <div key={i} className={`h-8 w-8 rounded-full ${bg} ring-2 ring-white`} />
              ))}
            </div>
            <span className="font-medium text-slate-700">200+ creators</span> joined
          </div>
          <div className="hidden h-4 w-px bg-slate-300 sm:block" />
          <span>Free during beta</span>
          <div className="hidden h-4 w-px bg-slate-300 sm:block" />
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  );
}
