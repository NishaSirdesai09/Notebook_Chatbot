"use client";

import * as React from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
