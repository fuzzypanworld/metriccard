"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function getInitial(name: string | null, email: string | null): string {
  if (name?.trim()) return name.trim().slice(0, 1).toUpperCase();
  if (email?.trim()) return email.trim().slice(0, 1).toUpperCase();
  return "?";
}

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const displayName = user?.displayName || user?.email || "User";
  const initial = getInitial(user?.displayName || null, user?.email || null);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-400">Free Plan</p>
        </div>
        <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
