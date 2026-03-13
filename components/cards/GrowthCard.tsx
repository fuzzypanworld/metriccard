"use client";

import { useMemo, useState, useCallback } from "react";
import type { ThemeMode, RatioPreset, BadgeType, SceneType } from "@/lib/types";
import { getRatioConfig } from "@/lib/ratios";
import { formatCompactNumber, formatReadableNumber, parseNumericInput } from "@/lib/number";
import CardShell from "./CardShell";

interface GrowthCardProps {
  startValue: string;
  endValue: string;
  label: string;
  durationMonths: number;
  theme: ThemeMode;
  ratio: RatioPreset;
  showWatermark: boolean;
  handle?: string;
  badge?: BadgeType;
  scene?: SceneType;
}

// Deterministic "fake" monthly values from start to end with slight up/down
function generateMonthlyValues(
  start: number,
  end: number,
  numMonths: number
): number[] {
  if (numMonths < 2) return [start, end];
  const values: number[] = [start];
  const step = (end - start) / (numMonths - 1);
  let seed = 12;
  for (let i = 1; i < numMonths - 1; i++) {
    const trend = start + step * i;
    const wobble = ((seed = (seed * 1103515245 + 12345) >>> 0) % 101) - 50;
    const range = Math.max(1, Math.abs(end - start) * 0.08);
    const v = trend + (wobble / 50) * range;
    values.push(start >= 0 && end >= 0 ? Math.max(0, v) : v);
  }
  values.push(end);
  return values;
}

function formatChartAxisDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function GrowthCard({
  startValue,
  endValue,
  label,
  durationMonths,
  theme,
  ratio,
  showWatermark,
  handle,
  badge,
  scene,
}: GrowthCardProps) {
  const config = getRatioConfig(ratio);
  const isWide = ratio === "wide";
  const isCompact = config.height < 360;
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
  const labelClasses = "text-slate-500";
  const displayLabel = label.trim() || "Growth";
  const durationDays = durationMonths * 30;
  const avgPerMonth = durationMonths > 0 ? delta / durationMonths : 0;
  const avgPerWeek = durationDays > 0 ? delta / (durationDays / 7) : 0;
  const avgPerDay = durationDays > 0 ? delta / durationDays : 0;

  // Date range: end = today, start = today - durationMonths
  const { chartDates, monthlyValues } = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - durationMonths);
    const dates: Date[] = [];
    const d = new Date(startDate);
    while (d <= endDate || dates.length < 2) {
      dates.push(new Date(d));
      d.setMonth(d.getMonth() + 1);
      if (dates.length >= durationMonths + 1) break;
    }
    if (dates[dates.length - 1] > endDate) dates[dates.length - 1] = endDate;
    const values = generateMonthlyValues(start, end, dates.length);
    return { chartDates: dates, monthlyValues: values };
  }, [durationMonths, start, end]);

  const xLeft = 44;
  const xRight = 380;
  const yTop = isWide ? 10 : isCompact ? 26 : 16;
  const yBottom = isWide ? 90 : isCompact ? 116 : 120;
  const chartWidth = xRight - xLeft;
  const chartHeight = yBottom - yTop;

  const valueMin = Math.min(...monthlyValues);
  const valueMax = Math.max(...monthlyValues);
  const valueRange = Math.max(1, valueMax - valueMin);
  const paddedMin =
    valueMin >= 0 && valueMax >= 0 ? Math.max(0, valueMin - valueRange * 0.1) : valueMin - valueRange * 0.1;
  const paddedMax = valueMax + valueRange * 0.1;
  const paddedRange = Math.max(1, paddedMax - paddedMin);

  const points = useMemo(() => {
    return monthlyValues.map((v, i) => {
      const t = monthlyValues.length === 1 ? 0 : i / (monthlyValues.length - 1);
      const x = xLeft + t * chartWidth;
      const y = yBottom - ((v - paddedMin) / paddedRange) * chartHeight;
      return { x, y, value: v };
    });
  }, [monthlyValues, paddedMin, paddedRange, chartWidth, xLeft, yBottom, chartHeight]);

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

  // Drag spike: show vertical line and value at cursor x
  const [spikeX, setSpikeX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const svgWidth = 420;
  const svgHeight = isWide ? 110 : 160;

  const getPointAtX = useCallback(
    (clientX: number, rect: DOMRect) => {
      const x = ((clientX - rect.left) / rect.width) * svgWidth;
      if (x < xLeft || x > xRight) return null;
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (x >= a.x && x <= b.x) {
          const t = (x - a.x) / (b.x - a.x || 1);
          const y = a.y + t * (b.y - a.y);
          const value = a.value + t * (b.value - a.value);
          return { x, y, value };
        }
      }
      return null;
    },
    [points]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pt = getPointAtX(e.clientX, rect);
      if (pt) {
        setSpikeX(pt.x);
        setIsDragging(true);
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }
    },
    [getPointAtX]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pt = getPointAtX(e.clientX, rect);
      setSpikeX(pt ? pt.x : null);
    },
    [isDragging, getPointAtX]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setSpikeX(null);
  }, []);

  const spikePoint = useMemo(() => {
    if (spikeX == null) return null;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (spikeX >= a.x && spikeX <= b.x) {
        const t = (spikeX - a.x) / (b.x - a.x || 1);
        return {
          x: spikeX,
          y: a.y + t * (b.y - a.y),
          value: a.value + t * (b.value - a.value),
        };
      }
    }
    return null;
  }, [spikeX, points]);

  // Wide layout: stats on left, chart on right
  if (isWide) {
    return (
      <CardShell theme={theme} ratio={ratio} showWatermark={showWatermark} handle={handle} badge={badge} scene={scene}>
        <div className="flex w-full items-center gap-6">
          {/* Left: stats */}
          <div className="flex shrink-0 flex-col items-start">
            <p className="text-sm font-bold text-slate-800">
              {displayLabel}
            </p>
            <p className={`mt-0.5 text-xs ${labelClasses}`}>
              Last {durationMonths} month{durationMonths !== 1 ? "s" : ""}
            </p>
            <p className="mt-2 text-[2rem] font-bold leading-tight tracking-tight text-blue-500">
              {formatReadableNumber(end)}
            </p>
            <p className={`text-xs ${labelClasses}`}>
              {displayLabel.toLowerCase()}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {formatReadableNumber(delta)}
              </span>
              <span className={`text-xs font-medium ${labelClasses}`}>
                {growthText}
              </span>
            </div>
            <p className={`mt-1 text-[11px] ${labelClasses}`}>
              {isPositive ? "+" : ""}
              {formatCompactNumber(avgPerMonth)}/mo
              <span className="mx-1">·</span>
              {isPositive ? "+" : ""}
              {formatCompactNumber(avgPerWeek)}/wk
              <span className="mx-1">·</span>
              {isPositive ? "+" : ""}
              {formatCompactNumber(avgPerDay)}/day
            </p>
          </div>

          {/* Right: chart */}
          <div className="min-h-0 min-w-0 flex-1">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="h-full w-full touch-none select-none"
              role="img"
              aria-label="Growth chart"
              preserveAspectRatio="xMidYMid meet"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <defs>
                <linearGradient id="metric-gradient-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="55%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="metric-gradient-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.18)" />
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
                  <line
                    x1={xLeft} x2={xRight} y1={tick.y} y2={tick.y}
                    className="stroke-slate-200" strokeWidth="0.75"
                    strokeDasharray={index === 0 ? "0" : "3 5"}
                  />
                  <text
                    x={xLeft - 6} y={tick.y + 3} textAnchor="end"
                    className="fill-slate-400" fontSize="8" fontWeight="500"
                  >
                    {formatCompactNumber(tick.value)}
                  </text>
                </g>
              ))}

              <line x1={xLeft} x2={xLeft} y1={yTop} y2={yBottom} className="stroke-slate-300" strokeWidth="1" />
              <line x1={xLeft} x2={xRight} y1={yBottom} y2={yBottom} className="stroke-slate-300" strokeWidth="1" />

              <path d={areaPath} fill="url(#metric-gradient-area)" className="graph-area-animate" />
              <path d={linePath} fill="none" className="stroke-slate-200 stroke-[1]" strokeLinecap="round" strokeLinejoin="round" />
              <path d={linePath} fill="none" className="graph-line-animate stroke-[2]" stroke="url(#metric-gradient-line)" strokeLinecap="round" strokeLinejoin="round" filter="url(#metric-line-glow)" />

              <circle cx={startPoint.x} cy={startPoint.y} r="3" className="fill-slate-300" />
              <circle cx={endPoint.x} cy={endPoint.y} r="6" className="graph-endpoint-pulse fill-blue-500/20" />
              <circle cx={endPoint.x} cy={endPoint.y} r="3.5" className="fill-blue-500" />
              <circle cx={endPoint.x} cy={endPoint.y} r="1.5" className="fill-blue-100" />

              <text x={xLeft} y={yBottom + 12} textAnchor="start" className="fill-slate-400" fontSize="9" fontWeight="500">
                {formatChartAxisDate(chartDates[0])}
              </text>
              <text x={xRight} y={yBottom + 12} textAnchor="end" className="fill-slate-400" fontSize="9" fontWeight="500">
                {formatChartAxisDate(chartDates[chartDates.length - 1])}
              </text>

              {spikePoint && (
                <g>
                  <line x1={spikePoint.x} x2={spikePoint.x} y1={yTop} y2={yBottom} className="stroke-blue-400" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.9} />
                  <circle cx={spikePoint.x} cy={spikePoint.y} r="5" className="fill-blue-500 stroke-2 stroke-white" />
                  <text x={spikePoint.x} y={spikePoint.y - 10} textAnchor="middle" className="fill-slate-700 text-[10px] font-semibold">
                    {formatCompactNumber(spikePoint.value)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </CardShell>
    );
  }

  // Default (square / portrait) layout: stacked
  return (
    <CardShell theme={theme} ratio={ratio} showWatermark={showWatermark} handle={handle} badge={badge} scene={scene}>
      <div className="flex w-full flex-col items-center text-center">
        {/* Title + duration */}
        <div className="flex flex-col items-center">
          <p className="text-base font-bold text-slate-800">
            {displayLabel}
          </p>
          <p className={`mt-0.5 text-sm ${labelClasses}`}>
            Last {durationMonths} month{durationMonths !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Primary value */}
        <div className={`${isCompact ? "mt-2" : "mt-4"} text-center`}>
          <p className={`${isCompact ? "text-[2.25rem]" : "text-[2.75rem]"} font-bold tracking-tight text-blue-500`}>
            {formatReadableNumber(end)}
          </p>
          <p className={`mt-0.5 text-sm ${labelClasses}`}>
            {displayLabel.toLowerCase()}
          </p>
          {/* Growth badge + percentage */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-red-500/10 text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {formatReadableNumber(delta)} {displayLabel.toLowerCase()}
            </span>
            <span className={`text-xs font-medium ${labelClasses}`}>
              {growthText} growth
            </span>
          </div>
          {/* Average rates */}
          <p className={`mt-1.5 text-xs ${labelClasses}`}>
            {isPositive ? "+" : ""}
            {formatCompactNumber(avgPerMonth)}/mo
            <span className="mx-1.5">·</span>
            {isPositive ? "+" : ""}
            {formatCompactNumber(avgPerWeek)}/week
            <span className="mx-1.5">·</span>
            {isPositive ? "+" : ""}
            {formatCompactNumber(avgPerDay)}/day
          </p>
        </div>

        {/* Graph */}
        <div className={`${isCompact ? "mt-2" : "mt-5"} w-full max-w-[420px] min-h-0`}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="h-full w-full touch-none select-none"
            role="img"
            aria-label="Growth chart"
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <linearGradient id="metric-gradient-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="55%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="metric-gradient-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.18)" />
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
                <line
                  x1={xLeft} x2={xRight} y1={tick.y} y2={tick.y}
                  className="stroke-slate-200" strokeWidth="0.75"
                  strokeDasharray={index === 0 ? "0" : "3 5"}
                />
                <text
                  x={xLeft - 6} y={tick.y + 3} textAnchor="end"
                  className="fill-slate-400" fontSize="8" fontWeight="500"
                >
                  {formatCompactNumber(tick.value)}
                </text>
              </g>
            ))}

            <line x1={xLeft} x2={xLeft} y1={yTop} y2={yBottom} className="stroke-slate-300" strokeWidth="1" />
            <line x1={xLeft} x2={xRight} y1={yBottom} y2={yBottom} className="stroke-slate-300" strokeWidth="1" />

            <path d={areaPath} fill="url(#metric-gradient-area)" className="graph-area-animate" />
            <path d={linePath} fill="none" className="stroke-slate-200 stroke-[1]" strokeLinecap="round" strokeLinejoin="round" />
            <path d={linePath} fill="none" className="graph-line-animate stroke-[2]" stroke="url(#metric-gradient-line)" strokeLinecap="round" strokeLinejoin="round" filter="url(#metric-line-glow)" />

            <circle cx={startPoint.x} cy={startPoint.y} r="3" className="fill-slate-300" />
            <circle cx={endPoint.x} cy={endPoint.y} r="6" className="graph-endpoint-pulse fill-blue-500/20" />
            <circle cx={endPoint.x} cy={endPoint.y} r="3.5" className="fill-blue-500" />
            <circle cx={endPoint.x} cy={endPoint.y} r="1.5" className="fill-blue-100" />

            <text x={xLeft} y={yBottom + 14} textAnchor="start" className="fill-slate-400" fontSize="9" fontWeight="500">
              {formatChartAxisDate(chartDates[0])}
            </text>
            <text x={xRight} y={yBottom + 14} textAnchor="end" className="fill-slate-400" fontSize="9" fontWeight="500">
              {formatChartAxisDate(chartDates[chartDates.length - 1])}
            </text>

            {spikePoint && (
              <g>
                <line x1={spikePoint.x} x2={spikePoint.x} y1={yTop} y2={yBottom} className="stroke-blue-400" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.9} />
                <circle cx={spikePoint.x} cy={spikePoint.y} r="5" className="fill-blue-500 stroke-2 stroke-white" />
                <text x={spikePoint.x} y={spikePoint.y - 10} textAnchor="middle" className="fill-slate-700 text-[10px] font-semibold">
                  {formatCompactNumber(spikePoint.value)}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </CardShell>
  );
}
