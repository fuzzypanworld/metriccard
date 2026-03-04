"use client";

import { useMemo } from "react";
import type { ThemeMode, RatioPreset } from "../../lib/types";
import { getRatioConfig } from "../../lib/ratios";
import { formatCompactNumber, formatReadableNumber, parseNumericInput } from "../../lib/number";
import CardShell from "./CardShell";

interface GrowthCardProps {
  startValue: string;
  endValue: string;
  label: string;
  timePeriod: string;
  theme: ThemeMode;
  ratio: RatioPreset;
  showWatermark: boolean;
}

export default function GrowthCard({
  startValue,
  endValue,
  label,
  timePeriod,
  theme,
  ratio,
  showWatermark,
}: GrowthCardProps) {
  const isDark = theme === "dark";
  const config = getRatioConfig(ratio);
  const isCompact = config.height < 350;
  const start = parseNumericInput(startValue);
  const end = parseNumericInput(endValue);
  const delta = end - start;

  const growthText = useMemo(() => {
    if (start === 0 && end > 0) return "New";
    if (start === 0 && end === 0) return "0%";
    const pct = (delta / Math.abs(start)) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
  }, [delta, end, start]);

  const isPositive = delta >= 0;
  const labelClasses = isDark ? "text-slate-400" : "text-slate-500";
  const displayLabel = label.trim() || "Growth";
  const displayTime = timePeriod.trim() || "Recent period";

  const xLeft = 36;
  const xRight = 420;
  const yTop = 20;
  const yBottom = 140;
  const chartWidth = xRight - xLeft;
  const chartHeight = yBottom - yTop;

  const valueMin = Math.min(start, end);
  const valueMax = Math.max(start, end);
  const valueRange = Math.max(1, valueMax - valueMin);
  const rawPaddedMin = valueMin - valueRange * 0.1;
  const paddedMin =
    valueMin >= 0 && valueMax >= 0 ? Math.max(0, rawPaddedMin) : rawPaddedMin;
  const paddedMax = valueMax + valueRange * 0.1;
  const paddedRange = Math.max(1, paddedMax - paddedMin);

  const pointCount = 8;
  const points = Array.from({ length: pointCount }, (_, index) => {
    const t = index / (pointCount - 1);
    const smooth = t * t * (3 - 2 * t);
    const wave =
      index === 0 || index === pointCount - 1
        ? 0
        : Math.sin(t * Math.PI * 1.6) * valueRange * 0.05;
    const rawV = start + delta * smooth + wave;
    const v = valueMin >= 0 && valueMax >= 0 ? Math.max(0, rawV) : rawV;
    const x = xLeft + t * chartWidth;
    const y = yBottom - ((v - paddedMin) / paddedRange) * chartHeight;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xRight} ${yBottom} L ${xLeft} ${yBottom} Z`;

  const yTicks = [0, 0.5, 1].map((tick) => {
    const y = yBottom - tick * chartHeight;
    const value = paddedMin + tick * paddedRange;
    return { y, value };
  });

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  return (
    <CardShell theme={theme} ratio={ratio} showWatermark={showWatermark}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${labelClasses}`}>
            {displayLabel}
          </p>
          <p className={`mt-0.5 text-[10px] ${labelClasses}`}>{displayTime}</p>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`h-3 w-3 fill-current ${!isPositive ? "rotate-180" : ""}`}
          >
            <path d="M10.7 3.3a1 1 0 0 0-1.4 0L4.6 8a1 1 0 1 0 1.4 1.4L9 6.4V16a1 1 0 1 0 2 0V6.4l3 3a1 1 0 0 0 1.4-1.4l-4.7-4.7Z" />
          </svg>
          <span>{growthText}</span>
        </div>
      </div>

      {/* Big number */}
      <div className={isCompact ? "mt-2" : "mt-4"}>
        <p className={`text-[9px] uppercase tracking-wider ${labelClasses}`}>Current</p>
        <p className={`mt-0.5 ${isCompact ? "text-2xl" : "text-4xl"} font-bold tracking-tight text-blue-500`}>
          {formatReadableNumber(end)}
        </p>
      </div>

      {/* Graph */}
      <div className={`${isCompact ? "mt-2" : "mt-5"} flex-1 min-h-0`}>
        <svg
          viewBox="0 0 450 160"
          className="h-full w-full"
          role="img"
          aria-label="Growth line graph"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="metric-gradient-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="metric-gradient-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "rgba(59,130,246,0.30)" : "rgba(59,130,246,0.18)"} />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
            <filter id="metric-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {yTicks.map((tick, index) => (
            <g key={`grid-${index}`}>
              <line x1={xLeft} x2={xRight} y1={tick.y} y2={tick.y} className={isDark ? "stroke-slate-800" : "stroke-slate-200"} strokeWidth="0.75" strokeDasharray={index === 0 ? "0" : "3 5"} />
              <text x={xLeft - 6} y={tick.y + 3} textAnchor="end" className={isDark ? "fill-slate-500" : "fill-slate-400"} fontSize="8" fontWeight="500">
                {formatCompactNumber(tick.value)}
              </text>
            </g>
          ))}

          <line x1={xLeft} x2={xLeft} y1={yTop} y2={yBottom} className={isDark ? "stroke-slate-700" : "stroke-slate-300"} strokeWidth="1" />
          <line x1={xLeft} x2={xRight} y1={yBottom} y2={yBottom} className={isDark ? "stroke-slate-700" : "stroke-slate-300"} strokeWidth="1" />

          <path d={areaPath} fill="url(#metric-gradient-area)" className="graph-area-animate" />
          <path d={linePath} fill="none" className={`${isDark ? "stroke-slate-800" : "stroke-slate-200"} stroke-[1]`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={linePath} fill="none" className="graph-line-animate stroke-[2]" stroke="url(#metric-gradient-line)" strokeLinecap="round" strokeLinejoin="round" filter="url(#metric-line-glow)" />

          <circle cx={startPoint.x} cy={startPoint.y} r="3" className={isDark ? "fill-slate-600" : "fill-slate-300"} />
          <circle cx={endPoint.x} cy={endPoint.y} r="6" className="graph-endpoint-pulse fill-blue-500/20" />
          <circle cx={endPoint.x} cy={endPoint.y} r="3.5" className="fill-blue-500" />
          <circle cx={endPoint.x} cy={endPoint.y} r="1.5" className="fill-blue-100" />

          <text x={xLeft} y={yBottom + 12} textAnchor="start" className={isDark ? "fill-slate-500" : "fill-slate-400"} fontSize="8" fontWeight="500">
            {formatCompactNumber(start)}
          </text>
          <text x={xRight} y={yBottom + 12} textAnchor="end" className={isDark ? "fill-slate-500" : "fill-slate-400"} fontSize="8" fontWeight="500">
            {formatCompactNumber(end)}
          </text>
        </svg>
      </div>
    </CardShell>
  );
}
