"use client";

import { useMemo } from "react";
import {
  formatCompactNumber,
  formatReadableNumber,
  parseNumericInput,
} from "../lib/number";

type ThemeMode = "light" | "dark";
type CardRatio = "square" | "portrait";

type GrowthCardProps = {
  startValue: string;
  endValue: string;
  label: string;
  timePeriod: string;
  theme: ThemeMode;
  ratio: CardRatio;
  showWatermark: boolean;
};

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

  const cardClasses = isDark
    ? "border-slate-800 bg-slate-950 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const labelClasses = isDark ? "text-slate-400" : "text-slate-500";
  const watermarkClasses = isDark
    ? "text-slate-500 ring-slate-800"
    : "text-slate-400 ring-slate-200";

  const displayLabel = label.trim() || "Growth";
  const displayTime = timePeriod.trim() || "Recent period";

  // Graph dimensions
  const xLeft = 48;
  const xRight = 660;
  const yTop = 28;
  const yBottom = 200;
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
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
    )
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
    <article
      className={`relative w-[800px] overflow-hidden rounded-[36px] border shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] ${cardClasses} ${
        ratio === "square" ? "h-[800px]" : "h-[1000px]"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_50%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_50%)]"
        }`}
      />
      <div className="relative flex h-full flex-col p-10">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${labelClasses}`}
            >
              {displayLabel}
            </p>
            <p className={`mt-1 text-xs ${labelClasses}`}>{displayTime}</p>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className={`h-3.5 w-3.5 fill-current ${!isPositive ? "rotate-180" : ""}`}
            >
              <path d="M10.7 3.3a1 1 0 0 0-1.4 0L4.6 8a1 1 0 1 0 1.4 1.4L9 6.4V16a1 1 0 1 0 2 0V6.4l3 3a1 1 0 0 0 1.4-1.4l-4.7-4.7Z" />
            </svg>
            <span>{growthText}</span>
          </div>
        </div>

        {/* Big number */}
        <div className="mt-6">
          <p className={`text-[11px] uppercase tracking-wider ${labelClasses}`}>
            Current
          </p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-blue-500">
            {formatReadableNumber(end)}
          </p>
        </div>

        {/* Graph */}
        <div className="mt-8 flex-1">
          <svg
            viewBox="0 0 700 230"
            className="h-full w-full"
            role="img"
            aria-label="Growth line graph"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="metric-gradient-line"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="55%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient
                id="metric-gradient-area"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={
                    isDark ? "rgba(59,130,246,0.30)" : "rgba(59,130,246,0.18)"
                  }
                />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
              <filter
                id="metric-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Y-axis ticks */}
            {yTicks.map((tick, index) => (
              <g key={`grid-${index}`}>
                <line
                  x1={xLeft}
                  x2={xRight}
                  y1={tick.y}
                  y2={tick.y}
                  className={isDark ? "stroke-slate-800" : "stroke-slate-200"}
                  strokeWidth="1"
                  strokeDasharray={index === 0 ? "0" : "4 6"}
                />
                <text
                  x={xLeft - 8}
                  y={tick.y + 3}
                  textAnchor="end"
                  className={isDark ? "fill-slate-500" : "fill-slate-400"}
                  fontSize="10"
                  fontWeight="500"
                >
                  {formatCompactNumber(tick.value)}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line
              x1={xLeft}
              x2={xLeft}
              y1={yTop}
              y2={yBottom}
              className={isDark ? "stroke-slate-700" : "stroke-slate-300"}
              strokeWidth="1.5"
            />
            <line
              x1={xLeft}
              x2={xRight}
              y1={yBottom}
              y2={yBottom}
              className={isDark ? "stroke-slate-700" : "stroke-slate-300"}
              strokeWidth="1.5"
            />

            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#metric-gradient-area)"
              className="graph-area-animate"
            />

            {/* Track line */}
            <path
              d={linePath}
              fill="none"
              className={`${isDark ? "stroke-slate-800" : "stroke-slate-200"} stroke-[1.5]`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Main line */}
            <path
              d={linePath}
              fill="none"
              className="graph-line-animate stroke-[2.5]"
              stroke="url(#metric-gradient-line)"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#metric-line-glow)"
            />

            {/* Start dot */}
            <circle
              cx={startPoint.x}
              cy={startPoint.y}
              r="4"
              className={isDark ? "fill-slate-600" : "fill-slate-300"}
            />

            {/* End dot */}
            <circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="8"
              className="graph-endpoint-pulse fill-blue-500/20"
            />
            <circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="5"
              className="fill-blue-500"
            />
            <circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="2"
              className="fill-blue-100"
            />

            {/* Labels */}
            <text
              x={xLeft}
              y={yBottom + 16}
              textAnchor="start"
              className={isDark ? "fill-slate-500" : "fill-slate-400"}
              fontSize="10"
              fontWeight="500"
            >
              {formatCompactNumber(start)}
            </text>
            <text
              x={xRight}
              y={yBottom + 16}
              textAnchor="end"
              className={isDark ? "fill-slate-500" : "fill-slate-400"}
              fontSize="10"
              fontWeight="500"
            >
              {formatCompactNumber(end)}
            </text>
          </svg>
        </div>

        {showWatermark && (
          <div
            className={`mt-4 self-start rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${watermarkClasses}`}
          >
            Made with MetricCard
          </div>
        )}
      </div>
    </article>
  );
}
