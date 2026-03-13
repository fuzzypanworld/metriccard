"use client";

import { useEditor } from "./EditorProvider";

export default function AppearanceSection() {
  const { state, dispatch } = useEditor();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "SET_THEME",
            payload: state.theme === "dark" ? "light" : "dark",
          })
        }
        className={`flex-1 rounded-lg border px-3 py-2 text-[11px] font-semibold ${
          state.theme === "dark"
            ? "border-slate-700 bg-slate-800 text-slate-200"
            : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        {state.theme === "dark" ? "Dark" : "Light"}
      </button>
    </div>
  );
}
