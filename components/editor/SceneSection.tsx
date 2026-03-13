"use client";

import { useEditor } from "./EditorProvider";
import { SCENE_LIST } from "@/lib/scenes";

export default function SceneSection() {
  const { state, dispatch } = useEditor();

  return (
    <div className="grid grid-cols-3 gap-2">
      {SCENE_LIST.map((scene) => {
        const selected = state.scene === scene.id;
        const swatch = scene.swatchLight;

        return (
          <button
            key={scene.id}
            type="button"
            onClick={() => dispatch({ type: "SET_SCENE", payload: scene.id })}
            className={`group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition ${
              selected
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className="h-8 w-full rounded-md border border-slate-200/50"
              style={{ background: swatch }}
            />
            <span
              className={`text-[9px] font-semibold ${
                selected ? "text-blue-600" : "text-slate-500"
              }`}
            >
              {scene.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
