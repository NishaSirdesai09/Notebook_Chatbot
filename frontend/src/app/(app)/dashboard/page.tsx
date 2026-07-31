"use client";

import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { NotebookCard } from "@/components/app/NotebookCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useDocuments } from "@/context/DocumentsContext";
import { useNotebooks } from "@/context/NotebooksContext";
import { relativeTime } from "@/lib/utils";

const steps = [
  {
    step: "1",
    title: "Create a notebook",
    desc: "One space per course — Corporate Finance, Strategy, Marketing, etc.",
    href: "/notebooks?create=1",
    cta: "New notebook",
    icon: "Notebook" as const,
  },
  {
    step: "2",
    title: "Upload course materials",
    desc: "Add case PDFs, lecture slides, and professor reference PDFs.",
    href: "/upload",
    cta: "Upload files",
    icon: "Upload" as const,
  },
  {
    step: "3",
    title: "Chat with citations",
    desc: "Ask questions grounded in your materials — every answer cites its source.",
    href: "/chat",
    cta: "Open chat",
    icon: "Chat" as const,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { notebooks, ready: notebooksReady } = useNotebooks();
  const { documents, ready: docsReady } = useDocuments();

  const firstName = user?.name.split(" ")[0] ?? "there";
  const readyNotebooks = notebooks.filter((n) => n.status === "Ready");
  const docCount = documents.length;

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome, ${firstName}`}
        description="Your AI study assistant for business school — grounded in your own course materials."
        actions={
          <ButtonLink href="/chat">
            <Icon.Chat className="h-4 w-4" /> Start chatting
          </ButtonLink>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-ink-500">Notebooks</p>
          <p className="mt-1 text-3xl font-bold text-ink-900">{notebooksReady ? notebooks.length : "—"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-500">Your uploads</p>
          <p className="mt-1 text-3xl font-bold text-ink-900">{docsReady ? docCount : "—"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-500">Ready to chat</p>
          <p className="mt-1 text-3xl font-bold text-ink-900">{notebooksReady ? readyNotebooks.length : "—"}</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-ink-900">How it works</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {steps.map((s) => {
            const IconCmp = Icon[s.icon];
            return (
              <Card key={s.step} className="flex flex-col p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <IconCmp className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-600">Step {s.step}</p>
                <h3 className="mt-1 font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-500">{s.desc}</p>
                <Link href={s.href} className="mt-4 text-sm font-semibold text-brand-700 hover:underline">
                  {s.cta} →
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Your notebooks</h2>
            <Link href="/notebooks" className="text-sm font-medium text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          {notebooks.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-ink-500">No notebooks yet. Create one to get started.</p>
              <ButtonLink href="/notebooks?create=1" className="mt-4">
                Create notebook
              </ButtonLink>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {notebooks.slice(0, 4).map((n) => (
                <NotebookCard key={n.id} notebook={n} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Continue studying</h2>
            <Link href="/chat" className="text-sm font-medium text-brand-700 hover:underline">
              Open chat
            </Link>
          </div>
          <Card className="divide-y divide-slate-100">
            {readyNotebooks.length === 0 ? (
              <div className="p-6 text-center text-sm text-ink-500">
                Upload materials to a notebook, then chat with them here.
              </div>
            ) : (
              readyNotebooks.slice(0, 4).map((n) => (
                <Link
                  key={n.id}
                  href={`/chat?notebook=${n.id}`}
                  className="flex items-center gap-3 p-4 transition hover:bg-slate-50"
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
              ))
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
