"use client";

import { useEditor } from "./EditorProvider";

export default function ExportButton() {
  const { state, handleDownload } = useEditor();

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state.isDownloading}
      className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {state.isDownloading ? "Exporting..." : "Download PNG"}
    </button>
  );
}
