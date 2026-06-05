"use client";

import * as React from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";
type Toast = { id: number; type: ToastType; title: string; message?: string };

type ToastContextValue = {
  toast: (t: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const config: Record<ToastType, { icon: React.ReactNode; ring: string; text: string }> = {
  success: { icon: <Icon.CheckCircle className="h-5 w-5" />, ring: "text-emerald-600", text: "text-emerald-600" },
  error: { icon: <Icon.AlertCircle className="h-5 w-5" />, ring: "text-red-600", text: "text-red-600" },
  info: { icon: <Icon.Info className="h-5 w-5" />, ring: "text-brand-600", text: "text-brand-600" },
  warning: { icon: <Icon.Warning className="h-5 w-5" />, ring: "text-amber-600", text: "text-amber-600" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const remove = React.useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = React.useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random();
      setToasts((cur) => [...cur, { ...t, id }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (title, message) => toast({ type: "success", title, message }),
      error: (title, message) => toast({ type: "error", title, message }),
      info: (title, message) => toast({ type: "info", title, message }),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex animate-fade-in items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-card"
          >
            <span className={cn("mt-0.5", config[t.type].ring)}>{config[t.type].icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">{t.title}</p>
              {t.message && <p className="mt-0.5 text-xs text-ink-500">{t.message}</p>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="rounded-md p-1 text-ink-400 hover:bg-slate-100"
              aria-label="Dismiss"
            >
              <Icon.Close className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
