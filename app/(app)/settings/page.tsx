"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [defaultTheme, setDefaultTheme] = useState<"dark" | "light">("dark");
  const [defaultCard, setDefaultCard] = useState<"text" | "growth" | "payout">("text");

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your account and preferences.</p>

      {/* Profile */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">Profile</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-bold text-white">
            G
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Guest User</p>
            <p className="text-xs text-slate-400">Sign up to save your profile</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Display Name</span>
            <input
              type="text"
              value="Guest User"
              disabled
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Email</span>
            <input
              type="email"
              value=""
              placeholder="Sign up to add email"
              disabled
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
            />
          </label>
        </div>
        <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-600">
          Sign up to save your cards and sync across devices.
        </p>
      </div>

      {/* Preferences */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">Preferences</h2>
        <div className="mt-4 space-y-4">
          {/* Default Theme */}
          <div>
            <label className="text-xs font-medium text-slate-500">Default Theme</label>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setDefaultTheme("dark")}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  defaultTheme === "dark"
                    ? "border-slate-700 bg-slate-800 text-slate-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setDefaultTheme("light")}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  defaultTheme === "light"
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Light
              </button>
            </div>
          </div>

          {/* Default Card Type */}
          <div>
            <label className="text-xs font-medium text-slate-500">Default Card Type</label>
            <div className="mt-2 flex gap-2">
              {(["text", "growth", "payout"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDefaultCard(type)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition ${
                    defaultCard === type
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 rounded-xl border border-red-100 bg-white p-6">
        <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
        <p className="mt-2 text-xs text-slate-500">
          Permanently delete your account and all data. This action cannot be undone.
        </p>
        <button
          disabled
          className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
