import type { RatioConfig, RatioPreset } from "./types";

export const RATIO_PRESETS: Record<RatioPreset, RatioConfig> = {
  square: {
    id: "square",
    label: "Square",
    tag: "1:1",
    description: "X / Instagram feed",
    width: 500,
    height: 500,
    proOnly: false,
  },
  portrait: {
    id: "portrait",
    label: "Portrait",
    tag: "4:5",
    description: "Instagram / Facebook",
    width: 500,
    height: 625,
    proOnly: false,
  },
  landscape: {
    id: "landscape",
    label: "Landscape",
    tag: "1.91:1",
    description: "X card / LinkedIn / OG",
    width: 500,
    height: 262,
    proOnly: true,
  },
  story: {
    id: "story",
    label: "Story",
    tag: "9:16",
    description: "IG Story / TikTok",
    width: 500,
    height: 889,
    proOnly: true,
  },
  "credit-card": {
    id: "credit-card",
    label: "Credit Card",
    tag: "1.586:1",
    description: "Badge / card style",
    width: 500,
    height: 315,
    proOnly: true,
  },
  wide: {
    id: "wide",
    label: "Wide",
    tag: "16:9",
    description: "YouTube / presentations",
    width: 500,
    height: 281,
    proOnly: true,
  },
};

export const RATIO_LIST: RatioConfig[] = Object.values(RATIO_PRESETS);

export const DEFAULT_RATIO: RatioPreset = "square";

export function getRatioConfig(id: RatioPreset): RatioConfig {
  return RATIO_PRESETS[id];
}
