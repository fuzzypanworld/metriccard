"use client";

import type { ThemeMode, RatioPreset, BadgeType, SceneType } from "@/lib/types";
import { getRatioConfig } from "@/lib/ratios";
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
  handle?: string;
  badge?: BadgeType;
  scene?: SceneType;
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
  handle,
  badge,
  scene,
}: PayoutCardProps) {
  const config = getRatioConfig(ratio);
  const isCompact = config.height < 350;
  const labelClasses = "text-slate-500";

  const displayPlatform = platform.trim() || "Platform";
  const displayAmount = amount.trim() || "$0";
  const displayTime = timePeriod.trim() || "This period";
  const displaySubtitle = subtitle.trim();

  return (
    <CardShell theme={theme} ratio={ratio} showWatermark={showWatermark} handle={handle} badge={badge} scene={scene}>
      {/* Platform header */}
      <div className="flex flex-col items-center">
        <p className={`text-sm font-semibold uppercase tracking-[0.15em] ${labelClasses}`}>
          {displayPlatform}
        </p>
        <p className={`mt-0.5 text-sm ${labelClasses}`}>{displayTime}</p>
      </div>

      {/* Big amount */}
      <div className={`${isCompact ? "mt-3" : "mt-5"} text-center`}>
        <p className={`${isCompact ? "text-3xl" : "text-5xl"} font-bold tracking-tight text-blue-500`}>
          {displayAmount}
        </p>
        <p className={`mt-1.5 text-sm uppercase tracking-wider ${labelClasses}`}>
          Amount received
        </p>
      </div>

      {/* Verified badge */}
      {verified && (
        <div className="mt-3 flex justify-center">
          <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-500">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        </div>
      )}

      {displaySubtitle && (
        <p className={`mt-3 text-center text-sm leading-relaxed ${labelClasses}`}>
          {displaySubtitle}
        </p>
      )}
    </CardShell>
  );
}
