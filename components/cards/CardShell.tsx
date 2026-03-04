"use client";

import type { ThemeMode, RatioPreset } from "../../lib/types";
import { getRatioConfig } from "../../lib/ratios";

interface CardShellProps {
  theme: ThemeMode;
  ratio: RatioPreset;
  showWatermark: boolean;
  children: React.ReactNode;
}

export default function CardShell({
  theme,
  ratio,
  showWatermark,
  children,
}: CardShellProps) {
  const isDark = theme === "dark";
  const config = getRatioConfig(ratio);

  const cardClasses = isDark
    ? "border-slate-800 bg-slate-950 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  const watermarkClasses = isDark
    ? "text-slate-500 ring-slate-800"
    : "text-slate-400 ring-slate-200";

  return (
    <article
      className={`relative overflow-hidden rounded-[24px] border shadow-[0_16px_48px_-20px_rgba(15,23,42,0.45)] ${cardClasses}`}
      style={{ width: config.width, height: config.height }}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.20),transparent_52%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_52%)]"
        }`}
      />
      <div className="relative flex h-full flex-col p-7">
        {children}

        {showWatermark && (
          <div
            className={`mt-3 self-start rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ${watermarkClasses}`}
          >
            Made with MetricCard
          </div>
        )}
      </div>
    </article>
  );
}
