"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/ui/primitives";
import { useAuth } from "@/context/AuthContext";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [openProfile, setOpenProfile] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setOpenProfile(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-ink-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
        <Icon.Menu />
      </button>

      <p className="hidden text-sm text-ink-500 sm:block">
        Chat with your course materials — cases, slides, and professor references.
      </p>

      <div className="relative ml-auto" ref={profileRef}>
        <button
          onClick={() => setOpenProfile((o) => !o)}
          className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
        >
          <Avatar name={user.name} size={32} />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink-900">{user.name}</span>
            <span className="block text-xs leading-tight text-ink-400">{user.role}</span>
          </span>
          <Icon.ChevronDown className="hidden h-4 w-4 text-ink-400 sm:block" />
        </button>
        {openProfile && (
          <div className="absolute right-0 mt-2 w-52 animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-ink-900">{user.name}</p>
              <p className="truncate text-xs text-ink-400">{user.email}</p>
            </div>
            <Link
              href="/settings"
              onClick={() => setOpenProfile(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-slate-50"
            >
              <Icon.Settings className="h-4 w-4 text-ink-400" /> Settings
            </Link>
            <button
              onClick={() => {
                signOut();
                router.push("/signin");
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <Icon.Logout className="h-4 w-4" /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
