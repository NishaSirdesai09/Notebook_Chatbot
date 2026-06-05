"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/primitives";
import { relativeTime } from "@/lib/utils";
import type { Notebook, NotebookStatus } from "@/lib/types";

const statusTone: Record<NotebookStatus, { tone: "green" | "amber" | "red"; label: string }> = {
  Ready: { tone: "green", label: "Ready" },
  Processing: { tone: "amber", label: "Processing" },
  Failed: { tone: "red", label: "Failed" },
};

export function NotebookCard({ notebook, onDelete }: { notebook: Notebook; onDelete?: (id: string) => void }) {
  const [menu, setMenu] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const st = statusTone[notebook.status];

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="card group flex flex-col p-5 transition hover:shadow-card">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${notebook.color} text-white`}>
          <Icon.Notebook className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1">
          <Badge tone={st.tone}>
            {notebook.status === "Processing" && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            )}
            {st.label}
          </Badge>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenu((m) => !m)}
              className="rounded-lg p-1.5 text-ink-400 opacity-0 transition hover:bg-slate-100 group-hover:opacity-100"
              aria-label="More options"
            >
              <Icon.Dots className="h-4 w-4" />
            </button>
            {menu && (
              <div className="absolute right-0 z-10 mt-1 w-40 animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-card">
                <Link href={`/chat?notebook=${notebook.id}`} className="block px-3 py-2 text-sm text-ink-700 hover:bg-slate-50">Open chat</Link>
                <Link href="/upload" className="block px-3 py-2 text-sm text-ink-700 hover:bg-slate-50">Add materials</Link>
                <Link href="/summaries" className="block px-3 py-2 text-sm text-ink-700 hover:bg-slate-50">Summarize</Link>
                <button
                  onClick={() => onDelete?.(notebook.id)}
                  className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold text-ink-900">{notebook.title}</h3>
      <p className="text-xs font-medium text-brand-600">{notebook.course}</p>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-500">{notebook.description}</p>

      <div className="mt-4 flex items-center gap-4 text-xs text-ink-400">
        <span className="flex items-center gap-1"><Icon.File className="h-3.5 w-3.5" /> {notebook.files} files</span>
        <span className="flex items-center gap-1"><Icon.Clock className="h-3.5 w-3.5" /> {relativeTime(notebook.updatedAt)}</span>
      </div>

      <Link
        href={`/chat?notebook=${notebook.id}`}
        className="btn btn-secondary btn-sm mt-4 w-full"
      >
        Open <Icon.ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
