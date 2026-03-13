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
  wide: {
    id: "wide",
    label: "Wide",
    tag: "3:2",
    description: "Nice card",
    width: 500,
    height: 334,
    proOnly: false,
  },
};

const RATIO_ORDER: RatioPreset[] = ["square", "portrait", "wide"];
export const RATIO_LIST: RatioConfig[] = RATIO_ORDER.map((id) => RATIO_PRESETS[id]);

export const DEFAULT_RATIO: RatioPreset = "wide";

export function getRatioConfig(id: RatioPreset): RatioConfig {
  return RATIO_PRESETS[id];
}
