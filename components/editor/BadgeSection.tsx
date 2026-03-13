"use client";

import type { BadgeType } from "@/lib/types";
import { useEditor } from "./EditorProvider";

const BADGES: { id: BadgeType; label: string; color: string }[] = [
  { id: "none", label: "None", color: "bg-slate-300" },
  { id: "blue", label: "Blue", color: "bg-blue-500" },
  { id: "gold", label: "Gold", color: "bg-amber-500" },
  { id: "gray", label: "Gray", color: "bg-slate-400" },
];

export default function BadgeSection() {
  const { state, dispatch } = useEditor();

  return (
    <div className="flex gap-1.5">
      {BADGES.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => dispatch({ type: "SET_BADGE", payload: b.id })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-semibold transition ${
            state.badge === b.id
              ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          {b.id !== "none" && (
            <span className={`h-2 w-2 rounded-full ${b.color}`} />
          )}
          {b.label}
        </button>
      ))}
    </div>
  );
}
