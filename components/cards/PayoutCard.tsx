"use client";

import type { ThemeMode, RatioPreset } from "../../lib/types";
import { getRatioConfig } from "../../lib/ratios";
import CardShell from "./CardShell";

interface PayoutCardProps {
  platform: string;
  amount: string;
  timePeriod: string;
  subtitle: string;
  verified: boolean;
  theme: ThemeMode;
  ratio: RatioPreset;
  showWatermark: boolean;
}

export default function PayoutCard({
  platform,
  amount,
  timePeriod,
  subtitle,
  verified,
  theme,
  ratio,
  showWatermark,
}: PayoutCardProps) {
  const isDark = theme === "dark";
  const config = getRatioConfig(ratio);
  const isCompact = config.height < 350;
  const labelClasses = isDark ? "text-slate-400" : "text-slate-500";

  const displayPlatform = platform.trim() || "Platform";
  const displayAmount = amount.trim() || "$0";
  const displayTime = timePeriod.trim() || "This period";
  const displaySubtitle = subtitle.trim();

  return (
    <CardShell theme={theme} ratio={ratio} showWatermark={showWatermark}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${labelClasses}`}>
            {displayPlatform}
          </p>
          <p className={`mt-0.5 text-[10px] ${labelClasses}`}>{displayTime}</p>
        </div>
        {verified && (
          <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        )}
      </div>

      <div className={isCompact ? "mt-4" : "mt-8"}>
        <p className={`text-[9px] uppercase tracking-wider ${labelClasses}`}>
          Amount received
        </p>
        <p className={`mt-1 ${isCompact ? "text-2xl" : "text-4xl"} font-bold tracking-tight text-blue-500`}>
          {displayAmount}
        </p>
      </div>

      {displaySubtitle && !isCompact && (
        <p className={`mt-4 max-w-[85%] text-sm leading-relaxed ${labelClasses}`}>
          {displaySubtitle}
        </p>
      )}

      <div className="flex-1" />
    </CardShell>
  );
}
