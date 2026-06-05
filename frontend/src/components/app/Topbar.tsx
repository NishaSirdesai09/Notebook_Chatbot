"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/ui/primitives";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, title: "Macroeconomics is ready", desc: "Indexing finished — 5 documents ready to chat.", time: "5m ago", unread: true },
  { id: 2, title: "Quiz graded", desc: "You scored 8/10 on Graph Algorithms.", time: "2h ago", unread: true },
  { id: 3, title: "Canvas sync complete", desc: "CHEM 302 synced 24 new files.", time: "Yesterday", unread: false },
];

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const [openNotif, setOpenNotif] = React.useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setOpenNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setOpenProfile(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-lg sm:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-ink-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
        <Icon.Menu />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          placeholder="Search notebooks, documents, topics…"
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setOpenNotif((o) => !o)}
            className="relative rounded-xl p-2.5 text-ink-600 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Icon.Bell />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          {openNotif && (
            <div className="absolute right-0 mt-2 w-80 animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-ink-900">Notifications</p>
                <button className="text-xs font-medium text-brand-700 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-3 border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50">
                    <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", n.unread ? "bg-brand-500" : "bg-slate-200")} />
                    <div>
                      <p className="text-sm font-medium text-ink-900">{n.title}</p>
                      <p className="text-xs text-ink-500">{n.desc}</p>
                      <p className="mt-0.5 text-[11px] text-ink-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile + settings dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile((o) => !o)}
            className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
          >
            <Avatar name={currentUser.name} size={32} />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-ink-900">{currentUser.name}</span>
              <span className="block text-xs leading-tight text-ink-400">{currentUser.role}</span>
            </span>
            <Icon.ChevronDown className="hidden h-4 w-4 text-ink-400 sm:block" />
          </button>
          {openProfile && (
            <div className="absolute right-0 mt-2 w-56 animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-card">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-ink-900">{currentUser.name}</p>
                <p className="text-xs text-ink-400">{currentUser.email}</p>
              </div>
              {[
                { label: "Profile settings", icon: Icon.User, href: "/settings" },
                { label: "Preferences", icon: Icon.Settings, href: "/settings" },
                { label: "Analytics", icon: Icon.Analytics, href: "/analytics" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpenProfile(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-slate-50"
                >
                  <item.icon className="h-4 w-4 text-ink-400" /> {item.label}
                </Link>
              ))}
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => router.push("/")}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Icon.Logout className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
