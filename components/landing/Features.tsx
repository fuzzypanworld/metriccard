const FEATURES = [
  "Text cards with auto-highlights",
  "Growth graphs with animation",
  "Payout visuals",
  "6 aspect ratios",
  "Dark & light themes",
  "PNG export at 2x",
];

export default function Features() {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-500">
      {FEATURES.map((f) => (
        <span
          key={f}
          className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 backdrop-blur"
        >
          {f}
        </span>
      ))}
    </div>
  );
}
