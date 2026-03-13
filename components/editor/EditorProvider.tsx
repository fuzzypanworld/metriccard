"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type {
  BadgeType,
  CardType,
  CelebrateType,
  PlanMode,
  RatioPreset,
  SceneType,
  ThemeMode,
} from "@/lib/types";
import { getRatioConfig } from "@/lib/ratios";
import { exportNodeAsPng } from "@/lib/exportCardAsPng";

// ── State ──

interface EditorState {
  cardType: CardType;
  theme: ThemeMode;
  ratio: RatioPreset;
  plan: PlanMode;
  isDownloading: boolean;
  // Identity
  handle: string;
  badge: BadgeType;
  // Content — text / metric card
  text: string;
  metricLabel: string;
  metricStartDate: string;
  metricEndDate: string;
  metricStartValue: string;
  metricEndValue: string;
  metricPoints: number[]; // 8 values between start and end (linear by default)
  // Content — growth
  growthStart: string;
  growthEnd: string;
  growthLabel: string;
  growthDurationMonths: number;
  // Content — payout
  payoutPlatform: string;
  payoutAmount: string;
  payoutTime: string;
  payoutSubtitle: string;
  payoutVerified: boolean;
  // Style
  scene: SceneType;
  celebrate: CelebrateType;
}

const defaultText = `Shipped 2.4K new signups this week
MRR grew by 6.3M%
CAC down 18.5%
Revenue hit 171,24$ in one launch`;

const initialState: EditorState = {
  cardType: "growth",
  theme: "light",
  ratio: "wide",
  plan: "free",
  isDownloading: false,
  handle: "",
  badge: "none",
  text: defaultText,
  metricLabel: "Revenue",
  metricStartDate: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().slice(0, 10);
  })(),
  metricEndDate: new Date().toISOString().slice(0, 10),
  metricStartValue: "0",
  metricEndValue: "1200",
  metricPoints: [150, 280, 220, 400, 380, 600, 750, 950],
  growthStart: "0",
  growthEnd: "2400",
  growthLabel: "Followers",
  growthDurationMonths: 6,
  payoutPlatform: "X",
  payoutAmount: "$171,240",
  payoutTime: "Last 30 days",
  payoutSubtitle: "First payout from creator revenue",
  payoutVerified: true,
  scene: "aurora",
  celebrate: "none",
};

// ── Actions ──

type EditorAction =
  | { type: "SET_CARD_TYPE"; payload: CardType }
  | { type: "SET_THEME"; payload: ThemeMode }
  | { type: "SET_RATIO"; payload: RatioPreset }
  | { type: "SET_PLAN"; payload: PlanMode }
  | { type: "SET_DOWNLOADING"; payload: boolean }
  | { type: "SET_HANDLE"; payload: string }
  | { type: "SET_BADGE"; payload: BadgeType }
  | { type: "SET_TEXT"; payload: string }
  | { type: "SET_METRIC_LABEL"; payload: string }
  | { type: "SET_METRIC_START_DATE"; payload: string }
  | { type: "SET_METRIC_END_DATE"; payload: string }
  | { type: "SET_METRIC_START_VALUE"; payload: string }
  | { type: "SET_METRIC_END_VALUE"; payload: string }
  | { type: "SET_METRIC_POINTS"; payload: number[] }
  | { type: "SET_GROWTH_START"; payload: string }
  | { type: "SET_GROWTH_END"; payload: string }
  | { type: "SET_GROWTH_LABEL"; payload: string }
  | { type: "SET_GROWTH_DURATION_MONTHS"; payload: number }
  | { type: "SET_PAYOUT_PLATFORM"; payload: string }
  | { type: "SET_PAYOUT_AMOUNT"; payload: string }
  | { type: "SET_PAYOUT_TIME"; payload: string }
  | { type: "SET_PAYOUT_SUBTITLE"; payload: string }
  | { type: "SET_PAYOUT_VERIFIED"; payload: boolean }
  | { type: "SET_SCENE"; payload: SceneType }
  | { type: "SET_CELEBRATE"; payload: CelebrateType };

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_CARD_TYPE":
      return { ...state, cardType: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_RATIO": {
      const config = getRatioConfig(action.payload);
      if (config.proOnly && state.plan === "free") return state;
      return { ...state, ratio: action.payload };
    }
    case "SET_PLAN": {
      const next = { ...state, plan: action.payload };
      if (action.payload === "free") {
        const currentConfig = getRatioConfig(state.ratio);
        if (currentConfig.proOnly) {
          next.ratio = "wide";
        }
      }
      return next;
    }
    case "SET_DOWNLOADING":
      return { ...state, isDownloading: action.payload };
    case "SET_HANDLE":
      return { ...state, handle: action.payload };
    case "SET_BADGE":
      return { ...state, badge: action.payload };
    case "SET_TEXT":
      return { ...state, text: action.payload };
    case "SET_METRIC_LABEL":
      return { ...state, metricLabel: action.payload };
    case "SET_METRIC_START_DATE":
      return { ...state, metricStartDate: action.payload };
    case "SET_METRIC_END_DATE":
      return { ...state, metricEndDate: action.payload };
    case "SET_METRIC_START_VALUE": {
      const start = parseFloat(String(action.payload).replace(/[^0-9.-]/g, "")) || 0;
      const end = parseFloat(String(state.metricEndValue).replace(/[^0-9.-]/g, "")) || 0;
      const points = Array.from({ length: 8 }, (_, i) =>
        start + (end - start) * ((i + 1) / 9)
      );
      return { ...state, metricStartValue: action.payload, metricPoints: points };
    }
    case "SET_METRIC_END_VALUE": {
      const start = parseFloat(String(state.metricStartValue).replace(/[^0-9.-]/g, "")) || 0;
      const end = parseFloat(String(action.payload).replace(/[^0-9.-]/g, "")) || 0;
      const points = Array.from({ length: 8 }, (_, i) =>
        start + (end - start) * ((i + 1) / 9)
      );
      return { ...state, metricEndValue: action.payload, metricPoints: points };
    }
    case "SET_METRIC_POINTS":
      return { ...state, metricPoints: action.payload };
    case "SET_GROWTH_START":
      return { ...state, growthStart: action.payload };
    case "SET_GROWTH_END":
      return { ...state, growthEnd: action.payload };
    case "SET_GROWTH_LABEL":
      return { ...state, growthLabel: action.payload };
    case "SET_GROWTH_DURATION_MONTHS":
      return { ...state, growthDurationMonths: action.payload };
    case "SET_PAYOUT_PLATFORM":
      return { ...state, payoutPlatform: action.payload };
    case "SET_PAYOUT_AMOUNT":
      return { ...state, payoutAmount: action.payload };
    case "SET_PAYOUT_TIME":
      return { ...state, payoutTime: action.payload };
    case "SET_PAYOUT_SUBTITLE":
      return { ...state, payoutSubtitle: action.payload };
    case "SET_PAYOUT_VERIFIED":
      return { ...state, payoutVerified: action.payload };
    case "SET_SCENE":
      return { ...state, scene: action.payload };
    case "SET_CELEBRATE":
      return { ...state, celebrate: action.payload };
    default:
      return state;
  }
}

// ── Context ──

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  exportCardRef: React.RefObject<HTMLDivElement>;
  handleDownload: () => Promise<void>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

// ── Provider ──

export default function EditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const exportCardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    const node = exportCardRef.current;
    if (!node || state.isDownloading) return;

    dispatch({ type: "SET_DOWNLOADING", payload: true });
    try {
      await exportNodeAsPng(node, `metriccard-${state.ratio}.png`);
    } finally {
      dispatch({ type: "SET_DOWNLOADING", payload: false });
    }
  }, [state.isDownloading, state.ratio]);

  const value = useMemo<EditorContextValue>(
    () => ({ state, dispatch, exportCardRef, handleDownload }),
    [state, handleDownload]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}
