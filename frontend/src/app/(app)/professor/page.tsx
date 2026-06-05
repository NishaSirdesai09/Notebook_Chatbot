"use client";

import * as React from "react";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Button } from "@/components/ui/Button";
import { Card, Badge, ProgressBar } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { relativeTime } from "@/lib/utils";

const courseNotebooks = [
  { id: "p1", title: "Organic Chemistry II", code: "CHEM 302", students: 128, materials: 24, updatedAt: "2026-06-04T09:00:00Z" },
  { id: "p2", title: "Intro to Algorithms", code: "CS 201", students: 96, materials: 38, updatedAt: "2026-06-03T14:00:00Z" },
  { id: "p3", title: "Thermodynamics", code: "PHYS 240", students: 74, materials: 19, updatedAt: "2026-06-01T11:00:00Z" },
];

const questionTrends = [
  { q: "What's the difference between SN1 and SN2?", count: 64, trend: "up" },
  { q: "How do I read an NMR spectrum?", count: 47, trend: "up" },
  { q: "When is a reaction first-order?", count: 33, trend: "flat" },
  { q: "Why are tertiary carbocations stable?", count: 28, trend: "down" },
];

const weakAreas = [
  { topic: "Stereochemistry", mastery: 38 },
  { topic: "Reaction Energetics", mastery: 44 },
  { topic: "Spectroscopy Interpretation", mastery: 51 },
];

const materials = [
  { name: "Lecture 12 — Spectroscopy.pptx", views: 412, type: "ppt" },
  { name: "Problem Set 6 Solutions.pdf", views: 388, type: "pdf" },
  { name: "Clayden Ch.15 reading.pdf", views: 301, type: "pdf" },
];

export default function ProfessorPage() {
  const toast = useToast();

  return (
    <PageContainer>
      <PageHeader
        title="Professor Dashboard"
        description="Understand how your class engages with course material."
        actions={
          <>
            <Button variant="secondary" onClick={() => toast.info("Open resource manager")}>
              <Icon.File className="h-4 w-4" /> Manage Resources
            </Button>
            <Button onClick={() => toast.success("Course material added")}>
              <Icon.Plus className="h-4 w-4" /> Add Course Resource
            </Button>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="Graduation" label="Students" value={298} delta="+24" tone="brand" />
        <StatCard icon="Chat" label="Questions asked" value="5.1k" delta="+12%" tone="teal" />
        <StatCard icon="File" label="Course materials" value={81} tone="purple" />
        <StatCard icon="Quiz" label="Class avg score" value="74%" delta="-2%" tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Course notebooks */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-ink-900">Course notebooks</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courseNotebooks.map((c) => (
              <Card key={c.id} className="p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple text-white">
                    <Icon.Notebook className="h-5 w-5" />
                  </span>
                  <Badge tone="brand">{c.code}</Badge>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink-900">{c.title}</h3>
                <div className="mt-2 flex items-center gap-4 text-xs text-ink-400">
                  <span className="flex items-center gap-1"><Icon.User className="h-3.5 w-3.5" /> {c.students} students</span>
                  <span className="flex items-center gap-1"><Icon.File className="h-3.5 w-3.5" /> {c.materials} files</span>
                </div>
                <p className="mt-1 text-xs text-ink-400">Updated {relativeTime(c.updatedAt)}</p>
                <Link href="/analytics" className="btn btn-secondary btn-sm mt-4 w-full">
                  View analytics <Icon.ChevronRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Question trends */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink-900">Student question trends</h2>
          <Card className="divide-y divide-slate-100">
            {questionTrends.map((q) => (
              <div key={q.q} className="flex items-start gap-3 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink-500">
                  <Icon.Chat className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-800">{q.q}</p>
                  <p className="text-xs text-ink-400">{q.count} times asked</p>
                </div>
                <Icon.Analytics className={cnTrend(q.trend)} />
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Icon.Target className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-semibold text-ink-900">Common weak areas</h2>
          </div>
          <p className="text-sm text-ink-500">Topics where the class scores lowest.</p>
          <div className="mt-4 space-y-4">
            {weakAreas.map((w) => (
              <div key={w.topic}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-800">{w.topic}</span>
                  <span className="text-ink-400">{w.mastery}% mastery</span>
                </div>
                <div className="mt-1.5"><ProgressBar value={w.mastery} tone="brand" /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Icon.Eye className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold text-ink-900">Content usage</h2>
          </div>
          <p className="text-sm text-ink-500">Most engaged course materials.</p>
          <div className="mt-4 space-y-2">
            {materials.map((m) => (
              <div key={m.name} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-ink-500">
                  {m.type === "pdf" ? <Icon.FilePdf className="h-4 w-4" /> : <Icon.Doc className="h-4 w-4" />}
                </span>
                <p className="flex-1 truncate text-sm font-medium text-ink-800">{m.name}</p>
                <span className="text-xs text-ink-400">{m.views} views</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

function cnTrend(trend: string) {
  if (trend === "up") return "h-4 w-4 text-emerald-500";
  if (trend === "down") return "h-4 w-4 rotate-180 text-red-500";
  return "h-4 w-4 text-ink-300";
}
