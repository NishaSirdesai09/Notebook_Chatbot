"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Input, Badge, Toggle } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { canvasCourses as seed } from "@/lib/mock-data";
import type { CanvasCourse } from "@/lib/types";
import { api } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";

const syncItems = [
  { key: "files", label: "Course files", icon: "File" as const },
  { key: "assignments", label: "Assignments", icon: "Doc" as const },
  { key: "modules", label: "Modules", icon: "Layers" as const },
  { key: "announcements", label: "Announcements", icon: "Bell" as const },
];

export default function CanvasPage() {
  const toast = useToast();
  const [connected, setConnected] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [connecting, setConnecting] = React.useState(false);
  const [courses, setCourses] = React.useState<CanvasCourse[]>(seed);
  const [syncing, setSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState<string | null>("2026-06-04T08:30:00Z");
  const [opts, setOpts] = React.useState({ files: true, assignments: true, modules: true, announcements: false });

  async function connect() {
    if (!token.trim()) {
      toast.error("Enter your Canvas API token");
      return;
    }
    setConnecting(true);
    try {
      await api.canvas.connect({ token });
      setConnected(true);
      toast.success("Canvas connected", "Select courses to sync.");
    } catch {
      toast.error("Connection failed");
    } finally {
      setConnecting(false);
    }
  }

  async function sync() {
    setSyncing(true);
    try {
      const res = (await api.canvas.sync({ courseIds: courses.filter((c) => c.selected).map((c) => c.id) })) as { syncedAt: string };
      setLastSync(res.syncedAt);
      toast.success("Sync complete", "Your course material is ready to chat.");
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Canvas Sync" description="Turn your real course material into a course-specific AI assistant." />

      <Card className="mt-6 border-brand-100 bg-brand-50/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Icon.Canvas className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">What is Canvas Sync?</p>
            <p className="mt-1 text-sm text-ink-600">
              Canvas Sync lets you turn your actual course material into a course-specific AI assistant. Connect your account, pick a course, and we&apos;ll sync its files, modules, assignments, and announcements automatically.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Connect */}
        <Card className="h-fit p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">Connection</h2>
            {connected ? <Badge tone="green"><Icon.Check className="h-3.5 w-3.5" /> Connected</Badge> : <Badge tone="neutral">Not connected</Badge>}
          </div>

          {!connected ? (
            <>
              <div className="mt-4">
                <label className="label">Canvas API token</label>
                <Input type="password" placeholder="Paste your token…" value={token} onChange={(e) => setToken(e.target.value)} />
                <p className="mt-1 text-xs text-ink-400">Find it in Canvas → Account → Settings → New Access Token.</p>
              </div>
              <Button fullWidth className="mt-4" loading={connecting} onClick={connect}>
                <Icon.Canvas className="h-4 w-4" /> Connect Canvas
              </Button>
            </>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
                <Icon.User className="h-4 w-4 text-ink-400" />
                <div className="text-sm">
                  <p className="font-medium text-ink-900">maya.t@university.edu</p>
                  <p className="text-xs text-ink-400">canvas.university.edu</p>
                </div>
              </div>
              <Button variant="secondary" fullWidth onClick={() => setConnected(false)}>Disconnect</Button>
            </div>
          )}

          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-sm font-semibold text-ink-900">What to sync</p>
            <div className="mt-3 space-y-3">
              {syncItems.map((item) => {
                const IconCmp = Icon[item.icon];
                return (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-ink-700">
                      <IconCmp className="h-4 w-4 text-ink-400" /> {item.label}
                    </span>
                    <Toggle
                      checked={opts[item.key as keyof typeof opts]}
                      onChange={(v) => setOpts({ ...opts, [item.key]: v })}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Courses */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-ink-900">Your courses</h2>
                <p className="text-xs text-ink-400">
                  {lastSync ? `Last synced ${new Date(lastSync).toLocaleString()}` : "Never synced"}
                </p>
              </div>
              <Button loading={syncing} disabled={!connected} onClick={sync}>
                <Icon.Refresh className="h-4 w-4" /> Resync now
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {courses.map((c) => (
                <label
                  key={c.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition",
                    c.selected ? "border-brand-300 bg-brand-50/40" : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={c.selected}
                    disabled={!connected}
                    onChange={(e) => setCourses((cs) => cs.map((x) => (x.id === c.id ? { ...x, selected: e.target.checked } : x)))}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                  />
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-ink-500">
                    <Icon.Book className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-400">{c.code} · {c.files} files</p>
                  </div>
                  {c.selected && lastSync && <Badge tone="green">Synced</Badge>}
                </label>
              ))}
            </div>

            {!connected && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                Connect your Canvas account to select and sync courses.
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
