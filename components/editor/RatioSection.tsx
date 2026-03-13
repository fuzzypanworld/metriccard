"use client";

import { RATIO_LIST } from "../../lib/ratios";
import { useEditor } from "./EditorProvider";

export default function RatioSection() {
  const { state, dispatch } = useEditor();

  return (
    <div className="grid grid-cols-2 gap-2">
      {RATIO_LIST.map((r) => {
        const selected = state.ratio === r.id;
        const aspect = r.width / r.height;

        return (
          <button
            key={r.id}
            type="button"
            onClick={() => dispatch({ type: "SET_RATIO", payload: r.id })}
            className={`group relative flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center transition ${
              selected
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`rounded-[3px] border ${
                selected
                  ? "border-blue-400 bg-blue-100"
                  : "border-slate-300 bg-slate-100"
              }`}
              style={{
                width: aspect >= 1 ? 36 : 36 * aspect,
                height: aspect >= 1 ? 36 / aspect : 36,
              }}
            />
            <span className={`text-[10px] font-semibold ${selected ? "text-blue-600" : "text-slate-700"}`}>
              {r.label}
            </span>
            <span className={`text-[9px] ${selected ? "text-blue-500" : "text-slate-400"}`}>
              {r.tag}
            </span>
          </button>
        );
      })}
    </div>
  );
}
