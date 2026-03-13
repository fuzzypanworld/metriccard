export type ThemeMode = "light" | "dark";

export type PlanMode = "free" | "pro";

export type CardType = "text" | "growth" | "payout";

export type BadgeType = "none" | "blue" | "gold" | "gray";

export type SceneType =
  | "studio"
  | "noise"
  | "grid"
  | "spotlight"
  | "aurora"
  | "onyx"
  | "hologram"
  | "nebula"
  | "minimal";

export type CelebrateType = "none" | "confetti" | "balloons";

export type RatioPreset = "square" | "portrait" | "wide";

export interface RatioConfig {
  id: RatioPreset;
  label: string;
  tag: string;
  description: string;
  width: number;
  height: number;
  proOnly: boolean;
}
