"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/ui/states";

/** Redirects unauthenticated users to sign-in. Wrap all `(app)` routes. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/signin");
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingState label="Loading your workspace…" />
      </div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}

/** Redirects authenticated users away from sign-in / sign-up. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoadingState />
      </div>
    );
  }

  if (user) return null;
  return <>{children}</>;
}
