import type { SceneType } from "./types";

export interface SceneConfig {
  id: SceneType;
  label: string;
  /** CSS background for the card overlay layer */
  darkBg: string;
  lightBg: string;
  /** Small swatch preview color for the selector */
  swatchDark: string;
  swatchLight: string;
}

export const SCENES: Record<SceneType, SceneConfig> = {
  studio: {
    id: "studio",
    label: "Studio",
    darkBg: "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.20), transparent 52%)",
    lightBg: "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.10), transparent 52%)",
    swatchDark: "linear-gradient(135deg, #1e293b, #1e40af30)",
    swatchLight: "linear-gradient(135deg, #f1f5f9, #3b82f620)",
  },
  noise: {
    id: "noise",
    label: "Noise",
    darkBg:
      "repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px, radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08), transparent 70%)",
    lightBg:
      "repeating-conic-gradient(rgba(0,0,0,0.03) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px, radial-gradient(circle at 50% 50%, rgba(59,130,246,0.06), transparent 70%)",
    swatchDark: "linear-gradient(135deg, #1e293b, #334155)",
    swatchLight: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
  },
  grid: {
    id: "grid",
    label: "Grid",
    darkBg:
      "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
    lightBg:
      "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
    swatchDark: "linear-gradient(135deg, #0f172a, #1e293b)",
    swatchLight: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  },
  spotlight: {
    id: "spotlight",
    label: "Spotlight",
    darkBg:
      "radial-gradient(ellipse at 50% -20%, rgba(59,130,246,0.35), transparent 60%)",
    lightBg:
      "radial-gradient(ellipse at 50% -20%, rgba(59,130,246,0.18), transparent 60%)",
    swatchDark: "radial-gradient(circle at 50% 20%, #3b82f640, #0f172a)",
    swatchLight: "radial-gradient(circle at 50% 20%, #3b82f620, #f8fafc)",
  },
  aurora: {
    id: "aurora",
    label: "Aurora",
    darkBg:
      "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(6,182,212,0.15) 50%, rgba(59,130,246,0.20) 100%)",
    lightBg:
      "linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(6,182,212,0.08) 50%, rgba(59,130,246,0.10) 100%)",
    swatchDark: "linear-gradient(135deg, #581c87, #164e63, #1e3a5f)",
    swatchLight: "linear-gradient(135deg, #e9d5ff, #a5f3fc, #bfdbfe)",
  },
  onyx: {
    id: "onyx",
    label: "Onyx",
    darkBg: "linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(2,6,23,0.8) 100%)",
    lightBg: "linear-gradient(180deg, rgba(241,245,249,0.5) 0%, rgba(226,232,240,0.6) 100%)",
    swatchDark: "linear-gradient(180deg, #0f172a, #020617)",
    swatchLight: "linear-gradient(180deg, #f1f5f9, #e2e8f0)",
  },
  hologram: {
    id: "hologram",
    label: "Hologram",
    darkBg:
      "conic-gradient(from 45deg at 50% 50%, rgba(244,63,94,0.12), rgba(251,146,60,0.10), rgba(250,204,21,0.10), rgba(52,211,153,0.10), rgba(59,130,246,0.12), rgba(168,85,247,0.12), rgba(244,63,94,0.12))",
    lightBg:
      "conic-gradient(from 45deg at 50% 50%, rgba(244,63,94,0.06), rgba(251,146,60,0.05), rgba(250,204,21,0.05), rgba(52,211,153,0.05), rgba(59,130,246,0.06), rgba(168,85,247,0.06), rgba(244,63,94,0.06))",
    swatchDark: "conic-gradient(from 45deg, #f43f5e30, #f59e0b30, #3b82f630, #a855f730, #f43f5e30)",
    swatchLight: "conic-gradient(from 45deg, #fda4af, #fde68a, #93c5fd, #d8b4fe, #fda4af)",
  },
  nebula: {
    id: "nebula",
    label: "Nebula",
    darkBg:
      "radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.25), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.20), transparent 50%)",
    lightBg:
      "radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.10), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.08), transparent 50%)",
    swatchDark: "linear-gradient(135deg, #4c1d95, #1e3a8a)",
    swatchLight: "linear-gradient(135deg, #ede9fe, #dbeafe)",
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    darkBg: "none",
    lightBg: "none",
    swatchDark: "#0f172a",
    swatchLight: "#ffffff",
  },
};

const SCENE_ORDER: SceneType[] = ["aurora", "hologram", "nebula", "minimal", "onyx", "noise"];
export const SCENE_LIST: SceneConfig[] = SCENE_ORDER.map((id) => SCENES[id]);

export function getSceneBg(scene: SceneType, theme: "dark" | "light"): string {
  const config = SCENES[scene];
  return theme === "dark" ? config.darkBg : config.lightBg;
}

export function getGridBgSize(scene: SceneType): string | undefined {
  if (scene === "grid") return "24px 24px";
  return undefined;
}
