"use client";

import { Fragment, useMemo } from "react";
import type { ThemeMode, RatioPreset } from "../../lib/types";
import { getRatioConfig } from "../../lib/ratios";
import CardShell from "./CardShell";

interface TextCardProps {
  text: string;
  theme: ThemeMode;
  ratio: RatioPreset;
  showWatermark: boolean;
}

const SPLIT_REGEX = /(\d+[\d.,KkMm$%]*)/g;
const NUMBER_TOKEN_REGEX = /^\d+[\d.,KkMm$%]*$/;

function extractNumbers(text: string): number[] {
  const matches = text.match(/[\d,.]+/g);
  if (!matches || matches.length === 0) return [];
  return matches
    .map((m) => parseFloat(m.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n));
}

function buildGrowthPath(
  numbers: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
): { linePath: string; areaPath: string; points: { x: number; y: number }[] } {
  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  if (count === 0) return { linePath: "", areaPath: "", points: [] };

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = Math.max(1, max - min);
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = sorted.map((v, i) => {
    const x = padX + (count === 1 ? innerW / 2 : (i / (count - 1)) * innerW);
    const y = padY + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });

  if (count === 1) {
    const p = points[0];
    const linePath = `M ${padX} ${p.y} L ${width - padX} ${p.y}`;
    const areaPath = `${linePath} L ${width - padX} ${height - padY} L ${padX} ${height - padY} Z`;
    return { linePath, areaPath, points: [{ x: padX, y: p.y }, { x: width - padX, y: p.y }] };
  }

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${linePath} L ${last.x} ${height - padY} L ${first.x} ${height - padY} Z`;

  return { linePath, areaPath, points };
}

export default function TextCard({
  text,
  theme,
  ratio,
  showWatermark,
}: TextCardProps) {
  const lines = text.split("\n");
  const isDark = theme === "dark";
  const config = getRatioConfig(ratio);
  const isCompact = config.height < 350;

  const headerClasses = isDark ? "text-slate-400" : "text-slate-500";
  const highlightClasses = isDark ? "text-blue-400" : "text-blue-500";

  const numbers = useMemo(() => extractNumbers(text), [text]);
  const graphW = 420;
  const graphH = 100;
  const padX = 8;
  const padY = 10;
  const { linePath, areaPath, points } = useMemo(
    () => buildGrowthPath(numbers, graphW, graphH, padX, padY),
    [numbers]
  );
  const showGraph = points.length >= 2 && !isCompact;

  return (
    <CardShell theme={theme} ratio={ratio} showWatermark={showWatermark}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${headerClasses}`}>
        MetricCard
      </p>

      <div className={`mt-4 space-y-1 ${isCompact ? "flex-1 overflow-hidden" : ""}`}>
        {lines.map((line, lineIndex) => {
          if (line.length === 0) {
            return (
              <p
                key={`line-${lineIndex}`}
                className={`${isCompact ? "text-sm" : "text-lg"} font-semibold leading-snug tracking-tight`}
              >
                &nbsp;
              </p>
            );
          }

          const segments = line.split(SPLIT_REGEX);

          return (
            <p
              key={`line-${lineIndex}`}
              className={`${isCompact ? "text-sm" : "text-lg"} font-semibold leading-snug tracking-tight`}
            >
              {segments.map((segment, segmentIndex) =>
                NUMBER_TOKEN_REGEX.test(segment) ? (
                  <span
                    key={`segment-${lineIndex}-${segmentIndex}`}
                    className={highlightClasses}
                  >
                    {segment}
                  </span>
                ) : (
                  <Fragment key={`segment-${lineIndex}-${segmentIndex}`}>
                    {segment}
                  </Fragment>
                )
              )}
            </p>
          );
        })}
      </div>

      {showGraph && (
        <div className="mt-auto mb-1">
          <svg
            viewBox={`0 0 ${graphW} ${graphH}`}
            className="w-full"
            role="img"
            aria-label="Growth trend"
          >
            <defs>
              <linearGradient id="text-graph-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="text-graph-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? "rgba(59,130,246,0.30)" : "rgba(59,130,246,0.18)"} />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
              <filter id="text-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d={areaPath} fill="url(#text-graph-area-grad)" className="graph-area-animate" />
            <path d={linePath} fill="none" stroke="url(#text-graph-line-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#text-glow)" className="graph-line-animate" />
            <circle cx={points[0].x} cy={points[0].y} r="2.5" className={isDark ? "fill-slate-500" : "fill-slate-300"} />
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" className="fill-blue-500 graph-endpoint-pulse" />
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="1.5" className="fill-blue-100" />
          </svg>
        </div>
      )}
    </CardShell>
  );
}
