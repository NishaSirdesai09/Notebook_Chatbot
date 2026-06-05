"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Input, Select, Badge } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/states";
import { Icon, type IconName } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { referenceLinks as seed } from "@/lib/mock-data";
import type { ReferenceLink } from "@/lib/types";
import { api } from "@/lib/api/endpoints";
import { relativeTime } from "@/lib/utils";

const categories = ["Article", "Documentation", "YouTube", "Professor Link", "Research Paper"];

const categoryIcon: Record<string, IconName> = {
  Article: "Globe",
  Documentation: "Doc",
  YouTube: "Video",
  "Professor Link": "User",
  "Research Paper": "File",
};

const statusTone = { Indexed: "green", Indexing: "amber", Failed: "red" } as const;

export default function ReferencesPage() {
  const toast = useToast();
  const [links, setLinks] = React.useState<ReferenceLink[]>(seed);
  const [form, setForm] = React.useState({ url: "", title: "", category: "Article" });
  const [adding, setAdding] = React.useState(false);

  async function add() {
    if (!form.url.trim() || !form.title.trim()) {
      toast.error("URL and title are required");
      return;
    }
    setAdding(true);
    try {
      const link = (await api.references.add(form)) as ReferenceLink;
      setLinks((l) => [link, ...l]);
      setForm({ url: "", title: "", category: "Article" });
      toast.success("Reference added", "We're indexing it now.");
    } catch {
      toast.error("Could not add reference");
    } finally {
      setAdding(false);
    }
  }

  function remove(id: string) {
    setLinks((l) => l.filter((x) => x.id !== id));
    toast.success("Reference removed");
  }

  return (
    <PageContainer>
      <PageHeader title="Reference Links" description="Add external resources to enrich your notebooks' knowledge base." />

      <Card className="mt-6 p-5">
        <h2 className="text-base font-semibold text-ink-900">Add a reference</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <label className="label">URL</label>
            <Input placeholder="https://…" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div className="sm:col-span-4">
            <label className="label">Resource title</label>
            <Input placeholder="e.g. Khan Academy: SN1 Reactions" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="sm:col-span-3">
            <label className="label">Category</label>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
        </div>
        <Button className="mt-4" loading={adding} onClick={add}>
          <Icon.Plus className="h-4 w-4" /> Add link
        </Button>
      </Card>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-ink-900">Indexed links ({links.length})</h2>
        {links.length === 0 ? (
          <EmptyState icon="Link" title="No references yet" description="Add an article, video, or research paper to get started." />
        ) : (
          <Card className="overflow-hidden">
            <div className="hidden grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400 sm:grid">
              <div className="col-span-5">Resource</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Added</div>
              <div className="col-span-1" />
            </div>
            {links.map((l) => {
              const IconCmp = Icon[categoryIcon[l.category] ?? "Link"];
              return (
                <div key={l.id} className="grid grid-cols-1 items-center gap-2 border-b border-slate-50 px-5 py-3.5 last:border-0 hover:bg-slate-50 sm:grid-cols-12 sm:gap-4">
                  <div className="col-span-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink-500">
                      <IconCmp className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{l.title}</p>
                      <p className="truncate text-xs text-ink-400">{l.url}</p>
                    </div>
                  </div>
                  <div className="col-span-2"><Badge tone="neutral">{l.category}</Badge></div>
                  <div className="col-span-2">
                    <Badge tone={statusTone[l.status]}>
                      {l.status === "Indexing" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />}
                      {l.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-sm text-ink-400">{relativeTime(l.addedAt)}</div>
                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => remove(l.id)} className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove">
                      <Icon.Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
