"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Select, Badge } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { notebooks, summaries as seed } from "@/lib/mock-data";
import { api } from "@/lib/api/endpoints";
import { relativeTime } from "@/lib/utils";
import type { Summary } from "@/lib/types";
import { cn } from "@/lib/utils";

const types: { id: string; label: string; icon: IconName; desc: string }[] = [
  { id: "Chapter Summary", label: "Chapter summary", icon: "Book", desc: "Condense a single chapter into key ideas." },
  { id: "Full Document Summary", label: "Full document", icon: "File", desc: "Summarize an entire document end-to-end." },
  { id: "Exam Revision Summary", label: "Exam revision", icon: "Target", desc: "A focused sheet of what's likely to be tested." },
  { id: "Bullet-point Notes", label: "Bullet notes", icon: "Summary", desc: "Clean, scannable bullet-point notes." },
  { id: "Beginner-friendly", label: "Beginner-friendly", icon: "Lightning", desc: "A plain-English explanation for newcomers." },
];

export default function SummariesPage() {
  const toast = useToast();
  const [notebook, setNotebook] = React.useState(notebooks[0].id);
  const [type, setType] = React.useState(types[0].id);
  const [list, setList] = React.useState<Summary[]>(seed);
  const [loading, setLoading] = React.useState(false);

  async function generate() {
    setLoading(true);
    try {
      const s = await api.summaries.generate({ notebookId: notebook, type });
      const nb = notebooks.find((n) => n.id === notebook)!;
      setList((l) => [{ ...s, notebook: nb.title, title: `${type} — ${nb.title}` }, ...l]);
      toast.success("Summary generated");
    } catch {
      toast.error("Could not generate summary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Summaries"
        description="Turn dense material into clean, exam-ready notes in seconds."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Generator */}
        <Card className="h-fit p-5 lg:col-span-1">
          <h2 className="text-base font-semibold text-ink-900">Generate a summary</h2>
          <div className="mt-4">
            <label className="label">Notebook</label>
            <Select value={notebook} onChange={(e) => setNotebook(e.target.value)}>
              {notebooks.map((n) => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </Select>
          </div>
          <div className="mt-4">
            <label className="label">Summary type</label>
            <div className="space-y-2">
              {types.map((t) => {
                const IconCmp = Icon[t.icon];
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
                      active ? "border-brand-300 bg-brand-50/50" : "border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", active ? "bg-brand-600 text-white" : "bg-slate-100 text-ink-500")}>
                      <IconCmp className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{t.label}</p>
                      <p className="text-xs text-ink-400">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <Button fullWidth className="mt-4" loading={loading} onClick={generate}>
            <Icon.Sparkles className="h-4 w-4" /> Generate Summary
          </Button>
        </Card>

        {/* Generated summaries */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink-900">Your summaries</h2>
          {loading && (
            <Card className="p-5">
              <div className="flex items-center gap-3 text-sm text-brand-600">
                <Icon.Sparkles className="h-5 w-5 animate-pulse" /> Generating your summary…
              </div>
            </Card>
          )}
          {list.map((s) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone="brand">{s.type}</Badge>
                  <h3 className="mt-2 text-base font-semibold text-ink-900">{s.title}</h3>
                  <p className="text-xs text-ink-400">{s.notebook} · {relativeTime(s.createdAt)}</p>
                </div>
                <button className="rounded-lg p-1.5 text-ink-400 hover:bg-slate-100" aria-label="Options">
                  <Icon.Dots className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{s.content}</p>
              <ul className="mt-3 space-y-1.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-ink-700">
                    <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-1">
                <Button variant="ghost" size="sm"><Icon.Copy className="h-4 w-4" /> Copy</Button>
                <Button variant="ghost" size="sm"><Icon.Bookmark className="h-4 w-4" /> Save</Button>
                <Button variant="ghost" size="sm"><Icon.Flashcard className="h-4 w-4" /> Make flashcards</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
