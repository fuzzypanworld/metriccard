"use client";

import { Fragment, useMemo } from "react";

type ThemeMode = "light" | "dark";
type CardRatio = "square" | "portrait";

type TextCardProps = {
  text: string;
  theme: ThemeMode;
  ratio: CardRatio;
  showWatermark: boolean;
};

const SPLIT_REGEX = /(\d+[\d.,KkMm$%]*)/g;
const NUMBER_TOKEN_REGEX = /^\d+[\d.,KkMm$%]*$/;

/** Extract numbers from the text to drive the mini graph */
function extractNumbers(text: string): number[] {
  const matches = text.match(/[\d,.]+/g);
  if (!matches || matches.length === 0) return [];
  return matches
    .map((m) => parseFloat(m.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n));
}

/** Build a smooth upward growth curve from extracted values */
function buildGrowthPath(
  numbers: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
): { linePath: string; areaPath: string; points: { x: number; y: number }[] } {
  // Sort ascending to show growth
  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  if (count === 0) {
    return { linePath: "", areaPath: "", points: [] };
  }

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

  // If only one point, create a flat line
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

  const cardClasses = isDark
    ? "border-slate-800 bg-slate-950 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const headerClasses = isDark ? "text-slate-400" : "text-slate-500";
  const highlightClasses = isDark ? "text-blue-400" : "text-blue-500";
  const watermarkClasses = isDark
    ? "text-slate-500 ring-slate-800"
    : "text-slate-400 ring-slate-200";

  const numbers = useMemo(() => extractNumbers(text), [text]);
  const graphW = 680;
  const graphH = 160;
  const padX = 12;
  const padY = 16;
  const { linePath, areaPath, points } = useMemo(
    () => buildGrowthPath(numbers, graphW, graphH, padX, padY),
    [numbers]
  );
  const showGraph = points.length >= 2;

  return (
    <article
      className={`relative w-[800px] overflow-hidden rounded-[36px] border shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] ${cardClasses} ${
        ratio === "square" ? "h-[800px]" : "h-[1000px]"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.20),transparent_52%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_52%)]"
        }`}
      />
      <div className="relative flex h-full flex-col p-14">
        <p
          className={`text-sm font-semibold uppercase tracking-[0.2em] ${headerClasses}`}
        >
          MetricCard
        </p>

        {/* Text content */}
        <div className="mt-6 space-y-1.5">
          {lines.map((line, lineIndex) => {
            if (line.length === 0) {
              return (
                <p
                  key={`line-${lineIndex}`}
                  className="text-3xl font-semibold leading-snug tracking-tight"
                >
                  &nbsp;
                </p>
              );
            }

            const segments = line.split(SPLIT_REGEX);

            return (
              <p
                key={`line-${lineIndex}`}
                className="text-3xl font-semibold leading-snug tracking-tight"
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

        {/* Mini growth graph */}
        {showGraph && (
          <div className="mt-auto mb-2">
            <svg
              viewBox={`0 0 ${graphW} ${graphH}`}
              className="w-full"
              role="img"
              aria-label="Growth trend"
            >
              <defs>
                <linearGradient
                  id="text-graph-line-grad"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient
                  id="text-graph-area-grad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isDark ? "rgba(59,130,246,0.30)" : "rgba(59,130,246,0.18)"}
                  />
                  <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                </linearGradient>
                <filter
                  id="text-glow"
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

              {/* area fill */}
              <path
                d={areaPath}
                fill="url(#text-graph-area-grad)"
                className="graph-area-animate"
              />

              {/* line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#text-graph-line-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#text-glow)"
                className="graph-line-animate"
              />

              {/* start dot */}
              <circle
                cx={points[0].x}
                cy={points[0].y}
                r="3.5"
                className={isDark ? "fill-slate-500" : "fill-slate-300"}
              />

              {/* end dot */}
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="5"
                className="fill-blue-500 graph-endpoint-pulse"
              />
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="2"
                className="fill-blue-100"
              />
            </svg>
          </div>
        )}

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
