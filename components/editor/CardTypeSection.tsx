"use client";

import type { CardType } from "../../lib/types";
import { useEditor } from "./EditorProvider";

const TYPES: { id: CardType; label: string }[] = [
  { id: "text", label: "Metric" },
  { id: "growth", label: "Growth" },
  { id: "payout", label: "Payout" },
];

export default function CardTypeSection() {
  const { state, dispatch } = useEditor();

  return (
    <div className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-50 p-0.5">
      {TYPES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dispatch({ type: "SET_CARD_TYPE", payload: t.id })}
          className={`flex-1 rounded-md px-3 py-1.5 text-[11px] font-semibold ${
            state.cardType === t.id
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
