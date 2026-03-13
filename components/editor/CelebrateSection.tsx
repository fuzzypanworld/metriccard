"use client";

import type { CelebrateType } from "@/lib/types";
import { useEditor } from "./EditorProvider";

const CELEBRATES: { id: CelebrateType; label: string; icon: string }[] = [
  { id: "none", label: "None", icon: "" },
  { id: "confetti", label: "Confetti", icon: "🎉" },
  { id: "balloons", label: "Balloons", icon: "🎈" },
];

export default function CelebrateSection() {
  const { state, dispatch } = useEditor();

  return (
    <div className="flex gap-1.5">
      {CELEBRATES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => dispatch({ type: "SET_CELEBRATE", payload: c.id })}
          className={`flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[11px] font-semibold transition ${
            state.celebrate === c.id
              ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          {c.icon && <span className="text-xs">{c.icon}</span>}
          {c.label}
        </button>
      ))}
    </div>
  );
}
