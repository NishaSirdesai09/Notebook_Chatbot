"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Card, Badge, ProgressBar } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

const studyActivity = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 72 },
  { day: "Sat", value: 30 },
  { day: "Sun", value: 48 },
];

const topTopics = [
  { topic: "Porter's Five Forces", count: 48 },
  { topic: "NPV vs IRR", count: 39 },
  { topic: "Market Segmentation", count: 27 },
  { topic: "WACC & Cost of Capital", count: 21 },
  { topic: "Case Analysis Framework", count: 18 },
];

const weakConcepts = [
  { topic: "Capital Budgeting", score: 38 },
  { topic: "Competitive Strategy", score: 45 },
  { topic: "Financial Statement Analysis", score: 41 },
];

const quizPerf = [
  { quiz: "Strategic Management Midterm", score: 90 },
  { quiz: "Corporate Finance — NPV", score: 80 },
  { quiz: "Marketing 4Ps", score: 65 },
  { quiz: "Accounting Ratios", score: 72 },
];

const profFAQ = [
  { q: "How do I apply Porter's Five Forces?", count: 64 },
  { q: "When do NPV and IRR conflict?", count: 41 },
  { q: "How should I structure a case write-up?", count: 33 },
];

function BarChart() {
  const max = Math.max(...studyActivity.map((d) => d.value));
  return (
    <div className="flex h-40 items-end justify-between gap-3">
      {studyActivity.map((d) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-accent-purple transition-all"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-ink-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [view, setView] = React.useState<"student" | "professor">("student");

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Insights into study activity, performance, and topics that need attention."
        actions={
          <div className="flex rounded-xl bg-slate-100 p-1">
            {(["student", "professor"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition",
                  view === v ? "bg-white text-ink-900 shadow-soft" : "text-ink-500"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {view === "student" ? (
          <>
            <StatCard icon="Chat" label="Questions this week" value={64} delta="+18%" tone="brand" />
            <StatCard icon="Quiz" label="Avg quiz score" value="78%" delta="+5%" tone="teal" />
            <StatCard icon="Clock" label="Study time" value="9.4h" delta="+1.2h" tone="purple" />
            <StatCard icon="Flashcard" label="Cards mastered" value={84} delta="+22" tone="amber" />
          </>
        ) : (
          <>
            <StatCard icon="User" label="Active students" value={128} delta="+12" tone="brand" />
            <StatCard icon="Chat" label="Questions asked" value="2.4k" delta="+8%" tone="teal" />
            <StatCard icon="Quiz" label="Class avg score" value="74%" delta="-2%" tone="purple" />
            <StatCard icon="File" label="Materials engaged" value="92%" delta="+4%" tone="amber" />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">Study activity</h2>
            <Badge tone="brand">Last 7 days</Badge>
          </div>
          <div className="mt-5"><BarChart /></div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-ink-900">
            {view === "student" ? "Most asked topics" : "Frequently asked questions"}
          </h2>
          <div className="mt-4 space-y-3">
            {(view === "student" ? topTopics : profFAQ.map((f) => ({ topic: f.q, count: f.count }))).map((t) => (
              <div key={t.topic} className="flex items-center justify-between gap-2">
                <span className="line-clamp-1 text-sm text-ink-700">{t.topic}</span>
                <Badge tone="neutral">{t.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Icon.Target className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-semibold text-ink-900">
              {view === "student" ? "Weak concepts" : "Difficult topics across class"}
            </h2>
          </div>
          <p className="text-sm text-ink-500">{view === "student" ? "Suggested revision areas based on your performance." : "Topics where students struggle most."}</p>
          <div className="mt-4 space-y-4">
            {weakConcepts.map((w) => (
              <div key={w.topic}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-800">{w.topic}</span>
                  <span className="text-ink-400">{w.score}%</span>
                </div>
                <div className="mt-1.5"><ProgressBar value={w.score} tone="brand" /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Icon.Quiz className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold text-ink-900">
              {view === "student" ? "Quiz performance" : "Quiz performance trends"}
            </h2>
          </div>
          <div className="mt-4 space-y-4">
            {quizPerf.map((q) => (
              <div key={q.quiz}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-800">{q.quiz}</span>
                  <span className="text-ink-400">{q.score}%</span>
                </div>
                <div className="mt-1.5"><ProgressBar value={q.score} tone={q.score >= 75 ? "green" : "brand"} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
