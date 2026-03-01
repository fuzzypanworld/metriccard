"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GrowthCard from "../components/GrowthCard";
import PayoutCard from "../components/PayoutCard";
import TextCard from "../components/TextCard";
import { exportNodeAsPng } from "../lib/exportCardAsPng";

type ThemeMode = "light" | "dark";
type CardRatio = "square" | "portrait";
type PlanMode = "free" | "pro";
type CardType = "text" | "growth" | "payout";

const PREVIEW_WIDTH = 800;

const defaultText = `Shipped 2.4K new signups this week
MRR grew by 6.3M%
CAC down 18.5%
Revenue hit 171,24$ in one launch`;

export default function Home() {
  const [cardType, setCardType] = useState<CardType>("text");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [ratio, setRatio] = useState<CardRatio>("square");
  const [plan, setPlan] = useState<PlanMode>("free");
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  const [text, setText] = useState(defaultText);

  const [growthStart, setGrowthStart] = useState("0");
  const [growthEnd, setGrowthEnd] = useState("2400");
  const [growthLabel, setGrowthLabel] = useState("Followers");
  const [growthTime, setGrowthTime] = useState("30 days");

  const [payoutPlatform, setPayoutPlatform] = useState("X");
  const [payoutAmount, setPayoutAmount] = useState("$171,240");
  const [payoutTime, setPayoutTime] = useState("Last 30 days");
  const [payoutSubtitle, setPayoutSubtitle] = useState(
    "First payout from creator revenue"
  );
  const [payoutVerified, setPayoutVerified] = useState(true);

  const previewShellRef = useRef<HTMLDivElement>(null);
  const exportCardRef = useRef<HTMLDivElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);

  const cardHeight = ratio === "square" ? 800 : 1000;
  const isPro = plan === "pro";
  const showWatermark = !isPro;

  useEffect(() => {
    if (!isPro) {
      setRatio("square");
    }
  }, [isPro]);

  useEffect(() => {
    const node = previewShellRef.current;
    if (!node) return;

    const updateScale = () => {
      const availableWidth = node.clientWidth;
      const nextScale = Math.min(1, availableWidth / PREVIEW_WIDTH);
      setPreviewScale(nextScale > 0 ? nextScale : 1);
    };

    updateScale();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activeCard = useMemo(() => {
    if (cardType === "growth") {
      return (
        <GrowthCard
          startValue={growthStart}
          endValue={growthEnd}
          label={growthLabel}
          timePeriod={growthTime}
          theme={theme}
          ratio={ratio}
          showWatermark={showWatermark}
        />
      );
    }

    if (cardType === "payout") {
      return (
        <PayoutCard
          platform={payoutPlatform}
          amount={payoutAmount}
          timePeriod={payoutTime}
          subtitle={payoutSubtitle}
          verified={payoutVerified}
          theme={theme}
          ratio={ratio}
          showWatermark={showWatermark}
        />
      );
    }

    return (
      <TextCard
        text={text}
        theme={theme}
        ratio={ratio}
        showWatermark={showWatermark}
      />
    );
  }, [
    cardType,
    growthEnd,
    growthLabel,
    growthStart,
    growthTime,
    payoutAmount,
    payoutPlatform,
    payoutSubtitle,
    payoutTime,
    payoutVerified,
    ratio,
    showWatermark,
    text,
    theme,
  ]);

  const handleDownload = useCallback(async () => {
    const node = exportCardRef.current;
    if (!node || isDownloading) return;

    setIsDownloading(true);
    try {
      await exportNodeAsPng(node, "metric-card.png");
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading]);

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
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
            <button
              type="button"
              onClick={scrollToBuilder}
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700"
            >
              Start Building
            </button>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              See Examples
            </a>
          </div>

          {/* Feature pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-500">
            {[
              "Text cards with auto-highlights",
              "Growth graphs with animation",
              "Payout visuals",
              "Dark & light themes",
              "PNG export at 2x",
            ].map((f) => (
              <span
                key={f}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 backdrop-blur"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Builder ── */}
      <section
        ref={builderRef}
        className="scroll-mt-8 px-4 pb-16 sm:px-6"
      >
        <div className="mx-auto max-w-6xl space-y-5">
          {/* Card type tabs + controls row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
              {(["text", "growth", "payout"] as CardType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCardType(t)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
                    cardType === t
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTheme((c) => (c === "dark" ? "light" : "dark"))
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {theme === "dark" ? "☀ Light" : "● Dark"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setRatio((c) => (c === "square" ? "portrait" : "square"))
                }
                disabled={!isPro}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {ratio === "square" ? "1:1" : "4:5"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setPlan((c) => (c === "free" ? "pro" : "free"))
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isPro
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isPro ? "Pro" : "Free"}
              </button>
            </div>
          </div>

          {/* Editor + Preview */}
          <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Controls panel */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              {cardType === "text" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="text-input"
                    className="text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Post Content
                  </label>
                  <textarea
                    id="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-56 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                    placeholder="Paste your build-in-public post..."
                  />
                </div>
              )}

              {cardType === "growth" && (
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Starting number",
                      value: growthStart,
                      set: setGrowthStart,
                      ph: "0",
                    },
                    {
                      label: "Ending number",
                      value: growthEnd,
                      set: setGrowthEnd,
                      ph: "2,400",
                    },
                    {
                      label: "Label",
                      value: growthLabel,
                      set: setGrowthLabel,
                      ph: "Followers",
                    },
                    {
                      label: "Time period",
                      value: growthTime,
                      set: setGrowthTime,
                      ph: "30 days",
                    },
                  ].map((field) => (
                    <label
                      key={field.label}
                      className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {field.label}
                      <input
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                        placeholder={field.ph}
                      />
                    </label>
                  ))}
                </div>
              )}

              {cardType === "payout" && (
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Platform",
                      value: payoutPlatform,
                      set: setPayoutPlatform,
                      ph: "X",
                    },
                    {
                      label: "Amount",
                      value: payoutAmount,
                      set: setPayoutAmount,
                      ph: "$171,240",
                    },
                    {
                      label: "Time period",
                      value: payoutTime,
                      set: setPayoutTime,
                      ph: "Last 30 days",
                    },
                    {
                      label: "Subtitle",
                      value: payoutSubtitle,
                      set: setPayoutSubtitle,
                      ph: "Optional subtitle",
                    },
                  ].map((field) => (
                    <label
                      key={field.label}
                      className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {field.label}
                      <input
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                        placeholder={field.ph}
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPayoutVerified((c) => !c)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      payoutVerified
                        ? "border-blue-200 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {payoutVerified ? "Verified ✓" : "Verified: Off"}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isDownloading ? "Exporting..." : "Download PNG"}
              </button>
            </div>

            {/* Preview */}
            <div
              ref={previewShellRef}
              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100/60 p-3"
            >
              <div className="flex justify-center">
                <div
                  style={{
                    width: PREVIEW_WIDTH * previewScale,
                    height: cardHeight * previewScale,
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {activeCard}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
        MetricCard &middot; Free &amp; open-source
      </footer>

      {/* Off-screen export target */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[10000px] top-0 opacity-0"
      >
        <div ref={exportCardRef}>{activeCard}</div>
      </div>
    </main>
  );
}
