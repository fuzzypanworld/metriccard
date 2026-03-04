"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getRatioConfig } from "../../lib/ratios";
import { useEditor } from "./EditorProvider";
import TextCard from "../cards/TextCard";
import GrowthCard from "../cards/GrowthCard";
import PayoutCard from "../cards/PayoutCard";

export default function PreviewCanvas() {
  const { state, exportCardRef } = useEditor();
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const config = getRatioConfig(state.ratio);
  const cardW = config.width;
  const cardH = config.height;
  const isPro = state.plan === "pro";
  const showWatermark = !isPro;

  useEffect(() => {
    const node = shellRef.current;
    if (!node) return;

    const updateScale = () => {
      const aw = node.clientWidth - 48; // padding
      const ah = node.clientHeight - 48;
      const next = Math.min(1, aw / cardW, ah / cardH);
      setScale(next > 0 ? next : 1);
    };

    updateScale();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, [cardW, cardH]);

  const activeCard = useMemo(() => {
    if (state.cardType === "growth") {
      return (
        <GrowthCard
          startValue={state.growthStart}
          endValue={state.growthEnd}
          label={state.growthLabel}
          timePeriod={state.growthTime}
          theme={state.theme}
          ratio={state.ratio}
          showWatermark={showWatermark}
        />
      );
    }

    if (state.cardType === "payout") {
      return (
        <PayoutCard
          platform={state.payoutPlatform}
          amount={state.payoutAmount}
          timePeriod={state.payoutTime}
          subtitle={state.payoutSubtitle}
          verified={state.payoutVerified}
          theme={state.theme}
          ratio={state.ratio}
          showWatermark={showWatermark}
        />
      );
    }

    return (
      <TextCard
        text={state.text}
        theme={state.theme}
        ratio={state.ratio}
        showWatermark={showWatermark}
      />
    );
  }, [state, showWatermark]);

  return (
    <>
      {/* Visible preview */}
      <div
        ref={shellRef}
        className="flex h-full items-center justify-center overflow-hidden p-6"
      >
        <div
          style={{
            width: cardW * scale,
            height: cardH * scale,
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {activeCard}
          </div>
        </div>
      </div>

      {/* Off-screen export target */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[10000px] top-0 opacity-0"
      >
        <div ref={exportCardRef}>{activeCard}</div>
      </div>
    </>
  );
}
