"use client";

import { useEditor } from "./EditorProvider";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white";

export default function ContentSection() {
  const { state, dispatch } = useEditor();

  if (state.cardType === "text") {
    return (
      <div className="space-y-2">
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Metric name
          <input
            value={state.metricLabel}
            onChange={(e) => dispatch({ type: "SET_METRIC_LABEL", payload: e.target.value })}
            className={inputClass}
            placeholder="e.g. Revenue, Followers"
          />
        </label>
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Start date
          <input
            type="date"
            value={state.metricStartDate}
            onChange={(e) => dispatch({ type: "SET_METRIC_START_DATE", payload: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          End date
          <input
            type="date"
            value={state.metricEndDate}
            onChange={(e) => dispatch({ type: "SET_METRIC_END_DATE", payload: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Start value
          <input
            value={state.metricStartValue}
            onChange={(e) => dispatch({ type: "SET_METRIC_START_VALUE", payload: e.target.value })}
            className={inputClass}
            placeholder="0"
          />
        </label>
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          End value
          <input
            value={state.metricEndValue}
            onChange={(e) => dispatch({ type: "SET_METRIC_END_VALUE", payload: e.target.value })}
            className={inputClass}
            placeholder="1200"
          />
        </label>
        <p className="text-[10px] text-slate-500">
          Drag the points on the graph in the preview to create spikes and lows.
        </p>
      </div>
    );
  }

  if (state.cardType === "growth") {
    const durations = [3, 6, 12] as const;

    return (
      <div className="space-y-2">
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Starting number
          <input
            value={state.growthStart}
            onChange={(e) => dispatch({ type: "SET_GROWTH_START", payload: e.target.value })}
            className={inputClass}
            placeholder="0"
          />
        </label>
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Ending number
          <input
            value={state.growthEnd}
            onChange={(e) => dispatch({ type: "SET_GROWTH_END", payload: e.target.value })}
            className={inputClass}
            placeholder="2,400"
          />
        </label>
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Label
          <input
            value={state.growthLabel}
            onChange={(e) => dispatch({ type: "SET_GROWTH_LABEL", payload: e.target.value })}
            className={inputClass}
            placeholder="Followers"
          />
        </label>
        <label className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Duration
          <select
            value={state.growthDurationMonths}
            onChange={(e) =>
              dispatch({
                type: "SET_GROWTH_DURATION_MONTHS",
                payload: Number(e.target.value),
              })
            }
            className={inputClass}
          >
            {durations.map((m) => (
              <option key={m} value={m}>
                {m} month{(m as number) !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  // payout
  const fields = [
    { label: "Platform", value: state.payoutPlatform, action: "SET_PAYOUT_PLATFORM" as const, ph: "X" },
    { label: "Amount", value: state.payoutAmount, action: "SET_PAYOUT_AMOUNT" as const, ph: "$171,240" },
    { label: "Time period", value: state.payoutTime, action: "SET_PAYOUT_TIME" as const, ph: "Last 30 days" },
    { label: "Subtitle", value: state.payoutSubtitle, action: "SET_PAYOUT_SUBTITLE" as const, ph: "Optional subtitle" },
  ];

  return (
    <div className="space-y-2">
      {fields.map((f) => (
        <label key={f.label} className="block space-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {f.label}
          <input
            value={f.value}
            onChange={(e) => dispatch({ type: f.action, payload: e.target.value })}
            className={inputClass}
            placeholder={f.ph}
          />
        </label>
      ))}
      <button
        type="button"
        onClick={() =>
          dispatch({ type: "SET_PAYOUT_VERIFIED", payload: !state.payoutVerified })
        }
        className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
          state.payoutVerified
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-600"
        }`}
      >
        {state.payoutVerified ? "Verified ✓" : "Verified: Off"}
      </button>
    </div>
  );
}
