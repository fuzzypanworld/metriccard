"use client";

import { useState } from "react";

interface SidebarSectionProps {
  title: string;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: React.ReactNode;
}

export default function SidebarSection({
  title,
  defaultOpen = true,
  collapsible = true,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 pb-3">
      <button
        type="button"
        onClick={() => collapsible && setOpen((o) => !o)}
        className={`flex w-full items-center justify-between py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
          collapsible ? "cursor-pointer hover:text-slate-600" : "cursor-default"
        }`}
      >
        {title}
        {collapsible && (
          <svg
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {open && <div className="space-y-2.5 pt-1">{children}</div>}
    </div>
  );
}
