"use client";

import SidebarSection from "./SidebarSection";
import HandleSection from "./HandleSection";
import BadgeSection from "./BadgeSection";
import CardTypeSection from "./CardTypeSection";
import ContentSection from "./ContentSection";
import SceneSection from "./SceneSection";
import RatioSection from "./RatioSection";
import ExportButton from "./ExportButton";

export default function Sidebar() {
  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold tracking-tight text-slate-900">
          Creator Studio
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Design your metric card
        </p>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        <SidebarSection title="X Handle" defaultOpen={true}>
          <HandleSection />
        </SidebarSection>

        <SidebarSection title="Badge" defaultOpen={true}>
          <BadgeSection />
        </SidebarSection>

        <SidebarSection title="Mode" collapsible={false}>
          <CardTypeSection />
        </SidebarSection>

        <SidebarSection title="Content" defaultOpen={true}>
          <ContentSection />
        </SidebarSection>

        <SidebarSection title="Scene" defaultOpen={true}>
          <SceneSection />
        </SidebarSection>

        <SidebarSection title="Aspect Ratio" defaultOpen={false}>
          <RatioSection />
        </SidebarSection>
      </div>

      {/* Sticky export */}
      <div className="border-t border-slate-100 px-4 py-3">
        <ExportButton />
      </div>
    </aside>
  );
}
