"use client";

import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { NotebookCard } from "@/components/app/NotebookCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, ProgressBar } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/icons";
import { activities, currentUser, documents, notebooks, revisionTopics } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";

const activityIcon: Record<string, IconName> = {
  upload: "Upload",
  chat: "Chat",
  quiz: "Quiz",
  summary: "Summary",
  notebook: "Notebook",
};

export default function DashboardPage() {
  const ready = notebooks.filter((n) => n.status === "Ready");

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]} 👋`}
        description="Here's what's happening across your study workspace."
        actions={
          <>
            <ButtonLink href="/upload" variant="secondary">
              <Icon.Upload className="h-4 w-4" /> Upload
            </ButtonLink>
            <ButtonLink href="/notebooks?create=1">
              <Icon.Plus className="h-4 w-4" /> New Notebook
            </ButtonLink>
          </>
        }
      />

      {/* Overview cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon="Notebook" label="Total notebooks" value={notebooks.length} delta="+2 this week" tone="brand" />
        <StatCard icon="File" label="Uploaded documents" value={44} delta="+8" tone="teal" />
        <StatCard icon="Chat" label="Questions asked" value={720} delta="+64" tone="purple" />
        <StatCard icon="Quiz" label="Quizzes generated" value={18} delta="+3" tone="amber" />
        <StatCard icon="Flashcard" label="Flashcards" value={126} delta="+22" tone="brand" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent notebooks */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Recent notebooks</h2>
            <Link href="/notebooks" className="text-sm font-medium text-brand-700 hover:underline">View all</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {notebooks.slice(0, 4).map((n) => (
              <NotebookCard key={n.id} notebook={n} />
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink-900">Recent activity</h2>
          <Card className="divide-y divide-slate-100">
            {activities.map((a) => {
              const IconCmp = Icon[activityIcon[a.type]];
              return (
                <div key={a.id} className="flex items-start gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink-500">
                    <IconCmp className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm text-ink-800">{a.text}</p>
                    <p className="text-xs text-ink-400">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Continue studying */}
        <Card className="p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold text-ink-900">Continue studying</h2>
          <p className="text-sm text-ink-500">Pick up where you left off.</p>
          <div className="mt-4 space-y-3">
            {ready.slice(0, 3).map((n) => (
              <Link
                key={n.id}
                href={`/chat?notebook=${n.id}`}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${n.color} text-white`}>
                  <Icon.Book className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{n.title}</p>
                  <p className="text-xs text-ink-400">{relativeTime(n.updatedAt)}</p>
                </div>
                <Icon.ChevronRight className="h-4 w-4 text-ink-300" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Suggested revision topics */}
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Suggested revision</h2>
            <Icon.Target className="h-5 w-5 text-brand-500" />
          </div>
          <p className="text-sm text-ink-500">Topics where you could use more practice.</p>
          <div className="mt-4 space-y-4">
            {revisionTopics.map((t) => (
              <div key={t.topic}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-800">{t.topic}</span>
                  <span className="text-ink-400">{t.strength}%</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar value={t.strength} tone={t.strength < 50 ? "brand" : "green"} />
                </div>
                <p className="mt-1 text-xs text-ink-400">{t.notebook}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recently uploaded */}
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Recently uploaded</h2>
            <Link href="/upload" className="text-sm font-medium text-brand-700 hover:underline">Upload</Link>
          </div>
          <div className="mt-4 space-y-2">
            {documents.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-ink-500">
                  <Icon.File className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-800">{d.name}</p>
                  <p className="text-xs text-ink-400">{d.size} · {relativeTime(d.uploadedAt)}</p>
                </div>
                {d.status === "ready" ? (
                  <Icon.CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
