"use client";

import * as React from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full animate-scale-in rounded-2xl bg-white shadow-card",
          sizeClass
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            {title && <h3 className="text-lg font-semibold text-ink-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-slate-100 hover:text-ink-700"
            aria-label="Close"
          >
            <Icon.Close className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin p-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-slate-100 p-5">{footer}</div>
        )}
      </div>
    </div>
  );
}
