"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { NotebookCard } from "@/components/app/NotebookCard";
import { CreateNotebookModal } from "@/components/app/CreateNotebookModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/primitives";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { notebooks as seed } from "@/lib/mock-data";
import type { Notebook, NotebookStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: ("All" | NotebookStatus)[] = ["All", "Ready", "Processing", "Failed"];

function NotebooksInner() {
  const params = useSearchParams();
  const toast = useToast();
  const [list, setList] = React.useState<Notebook[]>(seed);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("All");
  const [openCreate, setOpenCreate] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (params.get("create") === "1") setOpenCreate(true);
  }, [params]);

  const filtered = list.filter((n) => {
    const matchesQuery =
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.course.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || n.status === filter;
    return matchesQuery && matchesFilter;
  });

  function handleDelete(id: string) {
    setList((l) => l.filter((n) => n.id !== id));
    toast.success("Notebook deleted");
  }

  return (
    <PageContainer>
      <PageHeader
        title="My Notebooks"
        description="Your study spaces — one per course or subject."
        actions={
          <Button onClick={() => setOpenCreate(true)}>
            <Icon.Plus className="h-4 w-4" /> Create New Notebook
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input
            className="pl-9"
            placeholder="Search notebooks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                filter === f ? "bg-brand-600 text-white" : "bg-white text-ink-600 ring-1 ring-slate-200 hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingState label="Loading your notebooks…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="Notebook"
            title={query || filter !== "All" ? "No notebooks match your filters" : "No notebooks yet"}
            description="Create your first notebook to start uploading materials and chatting with them."
            action={
              <Button onClick={() => setOpenCreate(true)}>
                <Icon.Plus className="h-4 w-4" /> Create Notebook
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((n) => (
              <NotebookCard key={n.id} notebook={n} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <CreateNotebookModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={(n) => setList((l) => [n, ...l])}
      />
    </PageContainer>
  );
}

export default function NotebooksPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NotebooksInner />
    </Suspense>
  );
}
