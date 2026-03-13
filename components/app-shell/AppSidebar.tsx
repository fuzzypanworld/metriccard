"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppSidebarLink from "./AppSidebarLink";
import UserMenu from "./UserMenu";

const DashboardIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const EditorIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const SettingsIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/editor", label: "Editor", icon: EditorIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

interface AppSidebarProps {
  onClose?: () => void;
}

export default function AppSidebar({ onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-white" fill="currentColor">
              <path d="M2 2h4v4H2zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">MetricCard</span>
        </Link>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <AppSidebarLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t border-slate-100 px-3 py-3">
        <UserMenu />
      </div>
    </aside>
  );
}
