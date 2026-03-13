import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "Pick your card type",
    description:
      "Choose between Text, Growth, or Payout cards depending on what you want to showcase.",
  },
  {
    step: "02",
    title: "Customize everything",
    description:
      "Set your handle, badge, scene background, theme, and fill in your numbers. Real-time preview as you edit.",
  },
  {
    step: "03",
    title: "Export & share",
    description:
      "Download a crisp 2x PNG ready for X, Instagram, or anywhere. One click, done.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-24 lg:py-32">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Simple workflow
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Three steps to a stunning card
          </h2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.step} className="relative">
              <span className="text-6xl font-black text-blue-100">{s.step}</span>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-slate-900/25 transition hover:bg-slate-700"
          >
            Get started for free
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
