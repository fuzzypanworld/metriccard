export type ThemeMode = "light" | "dark";

export type PlanMode = "free" | "pro";

export type CardType = "text" | "growth" | "payout";

export type RatioPreset =
  | "square"
  | "portrait"
  | "landscape"
  | "story"
  | "credit-card"
  | "wide";

export interface RatioConfig {
  id: RatioPreset;
  label: string;
  tag: string;
  description: string;
  width: number;
  height: number;
  proOnly: boolean;
}
