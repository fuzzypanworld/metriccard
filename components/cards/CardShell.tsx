"use client";

import { useState } from "react";
import type { ThemeMode, RatioPreset, BadgeType, SceneType } from "@/lib/types";
import { getRatioConfig } from "@/lib/ratios";
import { getSceneBg, getGridBgSize } from "@/lib/scenes";

interface CardShellProps {
  theme: ThemeMode;
  ratio: RatioPreset;
  showWatermark: boolean;
  handle?: string;
  badge?: BadgeType;
  scene?: SceneType;
  children: React.ReactNode;
}

const BADGE_COLORS: Record<string, string> = {
  blue: "text-blue-500",
  gold: "text-amber-500",
  gray: "text-slate-400",
};

export default function CardShell({
  theme,
  ratio,
  showWatermark,
  handle,
  badge = "none",
  scene = "aurora",
  children,
}: CardShellProps) {
  const config = getRatioConfig(ratio);
  const isWide = ratio === "wide";

  const sceneBg = getSceneBg(scene, theme);
  const sceneBgSize = getGridBgSize(scene);

  const displayHandle = handle?.trim();
  const avatarUrl = displayHandle
    ? `https://unavatar.io/x/${encodeURIComponent(displayHandle)}`
    : null;
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showAvatarImg = avatarUrl && !avatarFailed;

  // Tighter padding for wide ratio so content doesn't get cut off
  const paddingClass = isWide ? "px-6 py-4" : "px-8 py-7";
  const avatarSize = isWide ? "h-10 w-10" : "h-12 w-12";

  return (
    <article
      className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white text-slate-900 shadow-[0_16px_48px_-20px_rgba(15,23,42,0.45)]"
      style={{ width: config.width, height: config.height }}
    >
      {/* Scene background layer */}
      <div
        className="absolute inset-0"
        style={{
          background: sceneBg,
          backgroundSize: sceneBgSize,
        }}
      />
      <div className={`relative flex h-full flex-col ${paddingClass}`}>
        {/* Handle + profile pic + Badge — pinned to top, centered */}
        {displayHandle && (
          <div className="flex items-center justify-center gap-2.5">
            {showAvatarImg && (
              <img
                src={avatarUrl!}
                alt=""
                className={`${avatarSize} rounded-full object-cover ring-1 ring-black/5`}
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
              />
            )}
            {(!avatarUrl || avatarFailed) && (
              <div
                className={`flex ${avatarSize} items-center justify-center rounded-full bg-slate-100 text-[13px] font-bold text-slate-600`}
              >
                {displayHandle[0]?.toUpperCase() || "?"}
              </div>
            )}
            <span className="text-base font-semibold text-slate-600">
              @{displayHandle}
            </span>
            {badge !== "none" && (
              <svg
                className={`h-5 w-5 ${BADGE_COLORS[badge]}`}
                viewBox="0 0 22 22"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11 0l2.817 3.694 4.592-.58-.58 4.592L21.523 11l-3.694 2.817.58 4.592-4.592-.58L11 21.523l-2.817-3.694-4.592.58.58-4.592L.477 11l3.694-2.817-.58-4.592 4.592.58L11 .477z"
                />
                <path
                  d="M7.5 11l2.25 2.25L14.5 8.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}

        {/* Main content — vertically & horizontally centered */}
        <div className="flex flex-1 flex-col items-center justify-center min-h-0">
          {children}
        </div>

        {/* Watermark */}
        {showWatermark && (
          <a
            href="https://metriccard.com"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-center rounded-full px-2.5 py-1 text-[10px] font-medium text-slate-400 ring-1 ring-slate-200 transition hover:opacity-80"
          >
            metriccard.com
          </a>
        )}
      </div>
    </article>
  );
}
