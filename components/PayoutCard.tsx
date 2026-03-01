"use client";

type ThemeMode = "light" | "dark";
type CardRatio = "square" | "portrait";

type PayoutCardProps = {
  platform: string;
  amount: string;
  timePeriod: string;
  subtitle: string;
  verified: boolean;
  theme: ThemeMode;
  ratio: CardRatio;
  showWatermark: boolean;
};

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

  const cardClasses = isDark
    ? "border-slate-800 bg-slate-950 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const labelClasses = isDark ? "text-slate-400" : "text-slate-500";
  const watermarkClasses = isDark
    ? "text-slate-500 ring-slate-800"
    : "text-slate-400 ring-slate-200";

  const displayPlatform = platform.trim() || "Platform";
  const displayAmount = amount.trim() || "$0";
  const displayTime = timePeriod.trim() || "This period";
  const displaySubtitle = subtitle.trim();

  return (
    <article
      className={`relative w-[800px] overflow-hidden rounded-[36px] border shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] ${cardClasses} ${
        ratio === "square" ? "h-[800px]" : "h-[1000px]"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.20),transparent_50%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_50%)]"
        }`}
      />
      <div className="relative flex h-full flex-col p-10">
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${labelClasses}`}
            >
              {displayPlatform}
            </p>
            <p className={`mt-1 text-xs ${labelClasses}`}>{displayTime}</p>
          </div>
          {verified && (
            <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
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

        <div className="mt-10">
          <p
            className={`text-[11px] uppercase tracking-wider ${labelClasses}`}
          >
            Amount received
          </p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-blue-500">
            {displayAmount}
          </p>
        </div>

        {displaySubtitle && (
          <p
            className={`mt-5 max-w-[85%] text-xl leading-relaxed ${labelClasses}`}
          >
            {displaySubtitle}
          </p>
        )}

        <div className="flex-1" />

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
