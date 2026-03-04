"use client";

import EditorProvider from "../../components/editor/EditorProvider";
import Sidebar from "../../components/editor/Sidebar";
import PreviewCanvas from "../../components/editor/PreviewCanvas";

export default function EditorPage() {
  return (
    <EditorProvider>
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-100/60">
        <PreviewCanvas />
      </main>
    </EditorProvider>
  );
}
