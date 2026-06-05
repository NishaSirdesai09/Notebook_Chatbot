"use client";

import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/primitives";
import type { Citation } from "@/lib/types";

export function DocumentViewer({ citation, onClose }: { citation: Citation | null; onClose: () => void }) {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-xl animate-fade-in flex-col border-l border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Icon.FilePdf className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">{citation.document}</p>
              <p className="text-xs text-ink-400">{citation.chapter} · Page {citation.page}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-slate-100" aria-label="Close">
            <Icon.Close className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-2.5">
          <Badge tone="brand">Page {citation.page}</Badge>
          <div className="flex items-center gap-1 text-xs text-ink-400">
            <button className="rounded-md p-1 hover:bg-slate-200"><Icon.ChevronLeft className="h-4 w-4" /></button>
            <span>{citation.page} / 1280</span>
            <button className="rounded-md p-1 hover:bg-slate-200"><Icon.ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">{citation.chapter}</p>
            <div className="space-y-3 text-sm leading-relaxed text-ink-500">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p className="rounded-lg bg-yellow-100 p-3 text-ink-900 ring-1 ring-yellow-200">
                <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <Icon.Quote className="h-3.5 w-3.5" /> Cited passage
                </span>
                {citation.snippet}
              </p>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          <Button variant="secondary" fullWidth>
            <Icon.File className="h-4 w-4" /> Open full document
          </Button>
        </div>
      </div>
    </div>
  );
}
