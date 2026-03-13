"use client";

import Link from "next/link";

interface AppSidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

export default function AppSidebarLink({ href, label, icon, isActive }: AppSidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={`h-5 w-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
