"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import type { ThemeMode, RatioPreset, BadgeType, SceneType } from "@/lib/types";
import { getRatioConfig } from "@/lib/ratios";
import { formatCompactNumber, parseNumericInput } from "@/lib/number";
import CardShell from "./CardShell";

const METRIC_POINTS_COUNT = 8;

interface TextCardProps {
  metricLabel: string;
  metricStartDate: string;
  metricEndDate: string;
  metricStartValue: string;
  metricEndValue: string;
  metricPoints: number[];
  theme: ThemeMode;
  ratio: RatioPreset;
  showWatermark: boolean;
  handle?: string;
  badge?: BadgeType;
  scene?: SceneType;
  onPointsChange?: (points: number[]) => void;
}

function formatAxisDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function TextCard({
  metricLabel,
  metricStartDate,
  metricEndDate,
  metricStartValue,
  metricEndValue,
  metricPoints,
  theme,
  ratio,
  showWatermark,
  handle,
  badge,
  scene,
  onPointsChange,
}: TextCardProps) {
  const isDark = theme === "dark";
  const config = getRatioConfig(ratio);
  const isCompact = config.height < 360;
  const editable = typeof onPointsChange === "function";

  const startVal = parseNumericInput(metricStartValue);
  const endVal = parseNumericInput(metricEndValue);
  const points = useMemo(() => {
    const arr = [...metricPoints];
    while (arr.length < METRIC_POINTS_COUNT) {
      const i = arr.length;
      arr.push(startVal + (endVal - startVal) * ((i + 1) / (METRIC_POINTS_COUNT + 1)));
    }
    return arr.slice(0, METRIC_POINTS_COUNT);
  }, [metricPoints, startVal, endVal]);

  const allValues = useMemo(
    () => [startVal, ...points, endVal],
    [startVal, endVal, points]
  );

  const valueMin = Math.min(...allValues);
  const valueMax = Math.max(...allValues);
  const valueRange = Math.max(1, valueMax - valueMin);
  const paddedMin = valueMin - valueRange * 0.1;
  const paddedMax = valueMax + valueRange * 0.1;
  const paddedRange = Math.max(1, paddedMax - paddedMin);

  const xLeft = 44;
  const xRight = 380;
  const yTop = isCompact ? 20 : 16;
  const yBottom = isCompact ? 108 : 112;
  const chartWidth = xRight - xLeft;
  const chartHeight = yBottom - yTop;

  const svgWidth = 420;
  const svgHeight = 140;

  const coords = useMemo(() => {
    return allValues.map((v, i) => {
      const t = allValues.length === 1 ? 0 : i / (allValues.length - 1);
      const x = xLeft + t * chartWidth;
      const y = yBottom - ((v - paddedMin) / paddedRange) * chartHeight;
      return { x, y, value: v };
    });
  }, [allValues, paddedMin, paddedRange, chartWidth, xLeft, yBottom, chartHeight]);

  const linePath = coords
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xRight} ${yBottom} L ${xLeft} ${yBottom} Z`;

  const yTicks = [0, 0.5, 1].map((t) => ({
    y: yBottom - t * chartHeight,
    value: paddedMin + t * paddedRange,
  }));

  const labelClasses = "text-slate-500";
  const displayLabel = metricLabel.trim() || "Metric";

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const valueFromY = useCallback(
    (clientY: number) => {
      const svg = chartRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const svgY = ((clientY - rect.top) / rect.height) * svgHeight;
      const norm = (yBottom - svgY) / chartHeight;
      const value = paddedMin + norm * paddedRange;
      return value;
    },
    [chartHeight, paddedMin, paddedRange, svgHeight, yBottom]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, index: number) => {
      if (!editable || index < 1 || index > METRIC_POINTS_COUNT) return;
      e.preventDefault();
      setDraggingIndex(index);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [editable]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingIndex === null) return;
      const value = valueFromY(e.clientY);
      if (value == null) return;
      // Clamp to 0 minimum and reasonable max (3x the end value or start value, whichever is larger)
      const maxBound = Math.max(endVal, startVal, 1) * 3;
      const clamped = Math.max(0, Math.min(maxBound, Math.round(value)));
      const next = [...points];
      next[draggingIndex - 1] = clamped;
      onPointsChange?.(next);
    },
    [draggingIndex, valueFromY, points, onPointsChange, startVal, endVal]
  );

  const handlePointerUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  return (
    <CardShell theme={theme} ratio={ratio} showWatermark={showWatermark} handle={handle} badge={badge} scene={scene}>
      <div className="flex w-full flex-col items-center text-center">
        <p className="text-base font-bold text-slate-800">
          {displayLabel}
        </p>
        <p className={`mt-0.5 text-sm ${labelClasses}`}>
          {metricStartDate && metricEndDate
            ? `${formatAxisDate(metricStartDate)} – ${formatAxisDate(metricEndDate)}`
            : "Set start & end date"}
        </p>

        <div className={`${isCompact ? "mt-2" : "mt-4"} w-full max-w-[420px]`}>
          <svg
            ref={chartRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className={`w-full touch-none ${editable ? "cursor-crosshair" : ""}`}
            role="img"
            aria-label="Metric chart"
            preserveAspectRatio="xMidYMid meet"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <linearGradient id="metric-text-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="metric-text-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? "rgba(59,130,246,0.30)" : "rgba(59,130,246,0.18)"} />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>

            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={xLeft}
                  x2={xRight}
                  y1={tick.y}
                  y2={tick.y}
                  className={isDark ? "stroke-slate-800" : "stroke-slate-200"}
                  strokeWidth="0.75"
                  strokeDasharray={i === 0 ? "0" : "3 5"}
                />
                <text
                  x={xLeft - 6}
                  y={tick.y + 3}
                  textAnchor="end"
                  className={isDark ? "fill-slate-500" : "fill-slate-400"}
                  fontSize="8"
                  fontWeight="500"
                >
                  {formatCompactNumber(tick.value)}
                </text>
              </g>
            ))}

            <line
              x1={xLeft}
              x2={xLeft}
              y1={yTop}
              y2={yBottom}
              className={isDark ? "stroke-slate-700" : "stroke-slate-300"}
              strokeWidth="1"
            />
            <line
              x1={xLeft}
              x2={xRight}
              y1={yBottom}
              y2={yBottom}
              className={isDark ? "stroke-slate-700" : "stroke-slate-300"}
              strokeWidth="1"
            />

            <path d={areaPath} fill="url(#metric-text-area)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#metric-text-line)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {coords.map((p, i) => {
              const isMiddle = i >= 1 && i <= METRIC_POINTS_COUNT;
              const isDraggable = editable && isMiddle;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={isMiddle && editable ? 8 : 4}
                  className={
                    isDraggable
                      ? "fill-blue-500 stroke-2 stroke-white cursor-grab active:cursor-grabbing hover:fill-blue-400"
                      : isDark
                        ? "fill-slate-600"
                        : "fill-slate-300"
                  }
                  style={isDraggable ? { touchAction: "none" } : undefined}
                  onPointerDown={(e) => handlePointerDown(e, i)}
                />
              );
            })}

            <text
              x={xLeft}
              y={yBottom + 12}
              textAnchor="start"
              className={isDark ? "fill-slate-500" : "fill-slate-400"}
              fontSize="9"
              fontWeight="500"
            >
              {metricStartDate ? formatAxisDate(metricStartDate) : ""}
            </text>
            <text
              x={xRight}
              y={yBottom + 12}
              textAnchor="end"
              className={isDark ? "fill-slate-500" : "fill-slate-400"}
              fontSize="9"
              fontWeight="500"
            >
              {metricEndDate ? formatAxisDate(metricEndDate) : ""}
            </text>
          </svg>
        </div>
      </div>
    </CardShell>
  );
}
