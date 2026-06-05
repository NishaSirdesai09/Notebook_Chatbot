"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Select, Badge, ProgressBar } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { notebooks, quizQuestions } from "@/lib/mock-data";
import { api } from "@/lib/api/endpoints";
import type { QuizQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase = "setup" | "taking" | "results";

export default function QuizzesPage() {
  const toast = useToast();
  const [phase, setPhase] = React.useState<Phase>("setup");
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [config, setConfig] = React.useState({
    notebook: notebooks[0].id,
    count: "5",
    difficulty: "Medium",
    type: "MCQ",
    topic: "All chapters",
  });

  async function generate() {
    setLoading(true);
    try {
      const q = (await api.quizzes.generate({
        notebookId: config.notebook,
        count: Number(config.count),
        difficulty: config.difficulty,
        type: config.type,
      })) as QuizQuestion[];
      setQuestions(q);
      setAnswers({});
      setPhase("taking");
      toast.success("Quiz ready", `${q.length} questions generated.`);
    } catch {
      toast.error("Could not generate quiz");
    } finally {
      setLoading(false);
    }
  }

  const score = questions.filter((q) => answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <PageContainer>
      <PageHeader
        title="Quizzes"
        description="Generate practice quizzes from your material and test your knowledge."
        actions={
          phase !== "setup" && (
            <Button variant="secondary" onClick={() => setPhase("setup")}>
              <Icon.Plus className="h-4 w-4" /> New Quiz
            </Button>
          )
        }
      />

      {phase === "setup" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-base font-semibold text-ink-900">Quiz settings</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label">Notebook</label>
                <Select value={config.notebook} onChange={(e) => setConfig({ ...config, notebook: e.target.value })}>
                  {notebooks.map((n) => (
                    <option key={n.id} value={n.id}>{n.title}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="label">Topic / chapter</label>
                <Select value={config.topic} onChange={(e) => setConfig({ ...config, topic: e.target.value })}>
                  <option>All chapters</option>
                  <option>Ch. 15 — Nucleophilic Substitution</option>
                  <option>Ch. 16 — Spectroscopy</option>
                  <option>Ch. 17 — Synthesis</option>
                </Select>
              </div>
              <div>
                <label className="label">Number of questions</label>
                <Select value={config.count} onChange={(e) => setConfig({ ...config, count: e.target.value })}>
                  {["5", "10", "15", "20"].map((c) => (
                    <option key={c} value={c}>{c} questions</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="label">Question type</label>
                <Select value={config.type} onChange={(e) => setConfig({ ...config, type: e.target.value })}>
                  <option>MCQ</option>
                  <option>Short Answer</option>
                  <option>True/False</option>
                  <option>Mixed</option>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Difficulty</label>
                <div className="flex gap-2">
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setConfig({ ...config, difficulty: d })}
                      className={cn(
                        "flex-1 rounded-xl border py-2.5 text-sm font-medium transition",
                        config.difficulty === d ? "border-brand-300 bg-brand-50 text-brand-700" : "border-slate-200 text-ink-600 hover:bg-slate-50"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button className="mt-6" size="lg" loading={loading} onClick={generate}>
              <Icon.Sparkles className="h-4 w-4" /> Generate Quiz
            </Button>
          </Card>

          <Card className="h-fit border-brand-100 bg-brand-50/40 p-6 lg:col-span-1">
            <Icon.Quiz className="h-8 w-8 text-brand-600" />
            <h3 className="mt-3 text-base font-semibold text-ink-900">How quizzes work</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {["Questions are generated only from your uploaded material", "Each answer comes with an explanation", "Your score is tracked in Analytics"].map((t) => (
                <li key={t} className="flex gap-2">
                  <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {phase === "taking" && (
        <div className="mt-6 mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-600">{answeredCount} of {questions.length} answered</p>
            <Badge tone="brand">{config.difficulty}</Badge>
          </div>
          <div className="mb-6"><ProgressBar value={(answeredCount / questions.length) * 100} /></div>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <Card key={q.id} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-700">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral">{q.type}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-ink-900">{q.question}</p>
                    {q.options ? (
                      <div className="mt-3 space-y-2">
                        {q.options.map((opt) => (
                          <label
                            key={opt}
                            className={cn(
                              "flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-sm transition",
                              answers[q.id] === opt ? "border-brand-300 bg-brand-50/50 text-ink-900" : "border-slate-200 text-ink-600 hover:bg-slate-50"
                            )}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === opt}
                              onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                              className="h-4 w-4 text-brand-600 focus:ring-brand-400"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        className="input mt-3"
                        placeholder="Type your answer…"
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button
            className="mt-6"
            size="lg"
            fullWidth
            disabled={answeredCount < questions.length}
            onClick={() => setPhase("results")}
          >
            Submit Quiz
          </Button>
        </div>
      )}

      {phase === "results" && (
        <div className="mt-6 mx-auto max-w-3xl">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-brand-600 to-accent-purple p-8 text-center text-white">
              <p className="text-sm font-medium text-white/80">Your score</p>
              <p className="mt-1 text-5xl font-bold">{score}/{questions.length}</p>
              <p className="mt-2 text-white/80">
                {score === questions.length ? "Perfect! 🎉" : score >= questions.length / 2 ? "Good work — review the misses below." : "Keep practicing — review the explanations."}
              </p>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {questions.map((q, i) => {
                  const correct = answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim();
                  return (
                    <div key={q.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start gap-2">
                        {correct ? (
                          <Icon.CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        ) : (
                          <Icon.AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ink-900">{i + 1}. {q.question}</p>
                          <p className="mt-1.5 text-xs text-ink-500">
                            Your answer: <span className={correct ? "font-medium text-emerald-600" : "font-medium text-red-600"}>{answers[q.id] || "—"}</span>
                          </p>
                          {!correct && (
                            <p className="text-xs text-ink-500">Correct answer: <span className="font-medium text-emerald-600">{q.answer}</span></p>
                          )}
                          <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs text-ink-600">
                            <span className="font-semibold text-ink-700">Explanation: </span>{q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant="secondary" onClick={() => { setAnswers({}); setPhase("taking"); }}>
                  <Icon.Refresh className="h-4 w-4" /> Retake
                </Button>
                <Button onClick={() => setPhase("setup")}>
                  <Icon.Plus className="h-4 w-4" /> New Quiz
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {phase === "setup" && questions.length === 0 && quizQuestions.length === 0 && (
        <EmptyState icon="Quiz" title="No quizzes yet" description="Generate your first quiz from a notebook." />
      )}
    </PageContainer>
  );
}
