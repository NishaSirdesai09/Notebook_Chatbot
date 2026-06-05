"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/icons";

const steps: { icon: IconName; step: string; title: string; desc: string }[] = [
  { icon: "Notebook", step: "Step 1", title: "Create your first notebook", desc: "A notebook is a dedicated space for one course or subject — like a smart binder." },
  { icon: "Upload", step: "Step 2", title: "Upload a textbook, PDF, notes, or paste a reference link", desc: "Add the materials you actually study from. We support PDFs, slides, docs, images, and links." },
  { icon: "Chat", step: "Step 3", title: "Ask questions from your material", desc: "Chat naturally — every answer is grounded in your content and cites its source." },
  { icon: "Sparkles", step: "Step 4", title: "Generate summaries, quizzes, flashcards, and citations", desc: "Turn any topic into revision notes, practice questions, and flip cards in seconds." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [active, setActive] = React.useState(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <ButtonLink href="/dashboard" variant="ghost" size="sm">
            Skip for now <Icon.ChevronRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <span className="section-eyebrow">Welcome to Notebook Chatbot</span>
          <h1 className="mt-4 text-3xl font-bold text-ink-900">Let&apos;s get you set up in 4 steps</h1>
          <p className="mt-3 text-ink-500">
            Here&apos;s how to turn your course materials into a personal study assistant.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {steps.map((s, i) => {
            const IconCmp = Icon[s.icon];
            const done = i < active;
            const current = i === active;
            return (
              <button
                key={s.step}
                onClick={() => setActive(i)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                  current
                    ? "border-brand-300 bg-white shadow-card ring-1 ring-brand-100"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    done
                      ? "bg-emerald-50 text-emerald-600"
                      : current
                        ? "bg-gradient-to-br from-brand-600 to-accent-purple text-white"
                        : "bg-slate-100 text-ink-400"
                  }`}
                >
                  {done ? <Icon.Check className="h-5 w-5" /> : <IconCmp className="h-5 w-5" />}
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

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-8 bg-brand-600" : "w-2.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {active < steps.length - 1 ? (
              <Button onClick={() => setActive((a) => Math.min(a + 1, steps.length - 1))}>
                Next <Icon.ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => router.push("/notebooks?create=1")}>
                <Icon.Plus className="h-4 w-4" /> Create Notebook
              </Button>
            )}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-6 text-center">
          <h3 className="text-lg font-semibold text-ink-900">Ready to dive in?</h3>
          <p className="mt-1 text-sm text-ink-500">Create your first notebook and start chatting with your materials.</p>
          <Button className="mt-4" size="lg" onClick={() => router.push("/notebooks?create=1")}>
            <Icon.Plus className="h-4 w-4" /> Create Notebook
          </Button>
        </div>
      </main>
    </div>
  );
}
