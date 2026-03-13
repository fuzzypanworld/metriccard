"use client";

import { useEditor } from "./EditorProvider";

export default function ExportButton() {
  const { state, handleDownload } = useEditor();

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state.isDownloading}
      className="w-full rounded-lg bg-slate-900 py-3 text-center shadow transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      <span className="block text-sm font-semibold text-white">
        {state.isDownloading ? "Exporting..." : "Download PNG"}
      </span>
      {!state.isDownloading && (
        <span className="block mt-0.5 text-[10px] text-slate-400">
          2x Resolution &middot; PNG Format
        </span>
      )}
    </button>
  );
}
