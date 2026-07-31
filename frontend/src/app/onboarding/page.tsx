"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/icons";

const steps: { icon: IconName; step: string; title: string; desc: string }[] = [
  { icon: "Notebook", step: "Step 1", title: "Create your first notebook", desc: "One space per course — Corporate Finance, Strategy, Marketing, etc." },
  { icon: "Upload", step: "Step 2", title: "Upload cases, slides, or professor reference PDFs", desc: "The AI answers only from these materials and cites the source." },
  { icon: "Chat", step: "Step 3", title: "Ask questions with citations", desc: "Chat naturally — every answer is grounded in your uploaded content." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [active, setActive] = React.useState(0);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Logo />
            <ButtonLink href="/dashboard" variant="ghost" size="sm">
              Go to dashboard
            </ButtonLink>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-ink-900">Get started in 3 steps</h1>
            <p className="mt-3 text-ink-500">
              Turn your business school course materials into a personal study assistant.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {steps.map((s, i) => {
              const IconCmp = Icon[s.icon];
              const current = i === active;
              return (
                <button
                  key={s.step}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    current
                      ? "border-brand-300 bg-white shadow-card"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      current
                        ? "bg-gradient-to-br from-brand-600 to-accent-purple text-white"
                        : "bg-slate-100 text-ink-400"
                    }`}
                  >
                    <IconCmp className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{s.step}</p>
                    <h3 className="mt-0.5 text-base font-semibold text-ink-900">{s.title}</h3>
                    <p className="mt-1 text-sm text-ink-500">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            {active < steps.length - 1 ? (
              <Button onClick={() => setActive((a) => a + 1)}>
                Next <Icon.ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => router.push("/notebooks?create=1")}>
                <Icon.Plus className="h-4 w-4" /> Create your first notebook
              </Button>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
