"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authReady || loading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, authReady, router]);

  if (!authReady || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
