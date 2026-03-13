"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getRatioConfig } from "@/lib/ratios";
import { useEditor } from "./EditorProvider";
import TextCard from "../cards/TextCard";
import GrowthCard from "../cards/GrowthCard";
import PayoutCard from "../cards/PayoutCard";

export default function PreviewCanvas() {
  const { state, dispatch, exportCardRef } = useEditor();
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const config = getRatioConfig(state.ratio);
  const cardW = config.width;
  const cardH = config.height;
  const showWatermark = true;

  // Shared props for all card types
  const sharedProps = {
    theme: state.theme,
    ratio: state.ratio,
    showWatermark,
    handle: state.handle,
    badge: state.badge,
    scene: state.scene,
  } as const;

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
    if (state.cardType === "text") {
      return (
        <TextCard
          metricLabel={state.metricLabel}
          metricStartDate={state.metricStartDate}
          metricEndDate={state.metricEndDate}
          metricStartValue={state.metricStartValue}
          metricEndValue={state.metricEndValue}
          metricPoints={state.metricPoints}
          onPointsChange={(points) => dispatch({ type: "SET_METRIC_POINTS", payload: points })}
          {...sharedProps}
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
          {...sharedProps}
        />
      );
    }

    return (
      <GrowthCard
        startValue={state.growthStart}
        endValue={state.growthEnd}
        label={state.growthLabel}
        durationMonths={state.growthDurationMonths}
        {...sharedProps}
      />
    );
  }, [state, showWatermark, dispatch]);

  const exportCard = useMemo(() => {
    if (state.cardType === "text") {
      return (
        <TextCard
          metricLabel={state.metricLabel}
          metricStartDate={state.metricStartDate}
          metricEndDate={state.metricEndDate}
          metricStartValue={state.metricStartValue}
          metricEndValue={state.metricEndValue}
          metricPoints={state.metricPoints}
          {...sharedProps}
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
          {...sharedProps}
        />
      );
    }
    return (
      <GrowthCard
        startValue={state.growthStart}
        endValue={state.growthEnd}
        label={state.growthLabel}
        durationMonths={state.growthDurationMonths}
        {...sharedProps}
      />
    );
  }, [state, showWatermark]);

  return (
    <>
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

      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[10000px] top-0 opacity-0"
      >
        <div ref={exportCardRef}>{exportCard}</div>
      </div>
    </>
  );
}
