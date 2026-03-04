"use client";

import { useEditor } from "./EditorProvider";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white";

export default function ContentSection() {
  const { state, dispatch } = useEditor();

  if (state.cardType === "text") {
    return (
      <textarea
        value={state.text}
        onChange={(e) => dispatch({ type: "SET_TEXT", payload: e.target.value })}
        className="h-44 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        placeholder="Paste your build-in-public post..."
      />
    );
  }

  if (state.cardType === "growth") {
    const fields = [
      { label: "Starting number", value: state.growthStart, action: "SET_GROWTH_START" as const, ph: "0" },
      { label: "Ending number", value: state.growthEnd, action: "SET_GROWTH_END" as const, ph: "2,400" },
      { label: "Label", value: state.growthLabel, action: "SET_GROWTH_LABEL" as const, ph: "Followers" },
      { label: "Time period", value: state.growthTime, action: "SET_GROWTH_TIME" as const, ph: "30 days" },
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
