"use client";

import { useEditor } from "./EditorProvider";

export default function HandleSection() {
  const { state, dispatch } = useEditor();

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          @
        </span>
        <input
          value={state.handle}
          onChange={(e) =>
            dispatch({ type: "SET_HANDLE", payload: e.target.value })
          }
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          placeholder="yourhandle"
        />
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400">
        Connect your X/Twitter identity
      </p>
    </div>
  );
}
