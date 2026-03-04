"use client";

import Link from "next/link";
import SidebarSection from "./SidebarSection";
import CardTypeSection from "./CardTypeSection";
import RatioSection from "./RatioSection";
import AppearanceSection from "./AppearanceSection";
import ContentSection from "./ContentSection";
import ExportButton from "./ExportButton";

export default function Sidebar() {
  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-slate-900 hover:text-blue-600 transition"
        >
          MetricCard
        </Link>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-slate-400">
          Editor
        </span>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        <SidebarSection title="Card Type" collapsible={false}>
          <CardTypeSection />
        </SidebarSection>

        <SidebarSection title="Aspect Ratio" defaultOpen={true}>
          <RatioSection />
        </SidebarSection>

        <SidebarSection title="Appearance" defaultOpen={true}>
          <AppearanceSection />
        </SidebarSection>

        <SidebarSection title="Content" defaultOpen={true}>
          <ContentSection />
        </SidebarSection>
      </div>

      {/* Sticky export */}
      <div className="border-t border-slate-100 px-4 py-3">
        <ExportButton />
      </div>
    </aside>
  );
}
