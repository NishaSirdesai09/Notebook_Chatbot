import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card", className)} {...props}>
      {children}
    </div>
  );
}

type BadgeTone = "neutral" | "brand" | "green" | "amber" | "red" | "purple" | "teal";
const badgeTone: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-ink-700",
  brand: "bg-brand-50 text-brand-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  purple: "bg-violet-50 text-violet-700",
  teal: "bg-teal-50 text-teal-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn("chip", badgeTone[tone], className)}>{children}</span>;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn("input", className)} {...props} />;
  }
);

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "input appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_0.75rem_center] bg-no-repeat pr-9",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("label", className)} {...props}>
      {children}
    </label>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Divider({ children }: { children?: React.ReactNode }) {
  if (!children) return <hr className="border-slate-200" />;
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-ink-400">
      <span className="h-px flex-1 bg-slate-200" />
      {children}
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-brand-600" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "teal" | "green" }) {
  const toneClass =
    tone === "teal" ? "bg-teal-500" : tone === "green" ? "bg-emerald-500" : "bg-brand-600";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-slate-100", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

export function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-purple font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </span>
  );
}
