"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Avatar, Badge } from "@/components/ui/primitives";
import { LoadingState } from "@/components/ui/states";
import { DocumentViewer } from "@/components/app/DocumentViewer";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api/client";
import { api } from "@/lib/api/endpoints";
import { api } from "@/lib/api/endpoints";
import { SUGGESTED_PROMPTS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useDocuments } from "@/context/DocumentsContext";
import { useNotebooks } from "@/context/NotebooksContext";
import type { ChatMessage, Citation } from "@/lib/types";
import { cn } from "@/lib/utils";

function parseApiErrorMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { message?: string | string[] };
    const msg = parsed.message;
    if (Array.isArray(msg)) return msg.join(". ");
    if (typeof msg === "string") return msg;
  } catch {
    // plain text response
  }
  return raw || "Request failed";
}

function ChatInner() {
  const params = useSearchParams();
  const toast = useToast();
  const { user } = useAuth();
  const { forNotebook, refresh: refreshDocs } = useDocuments();
  const { notebooks, ready: notebooksReady } = useNotebooks();
  const initialNotebook = params.get("notebook") || notebooks[0]?.id || "";
  const [activeNotebook, setActiveNotebook] = React.useState(initialNotebook);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [activeCitation, setActiveCitation] = React.useState<Citation | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (notebooksReady && notebooks.length > 0 && !notebooks.find((n) => n.id === activeNotebook)) {
      setActiveNotebook(notebooks[0].id);
    }
  }, [notebooksReady, notebooks, activeNotebook]);

  React.useEffect(() => {
    if (!activeNotebook) return;
    setLoadingHistory(true);
    Promise.all([api.chat.history(activeNotebook), refreshDocs(activeNotebook)])
      .then(([history]) => setMessages(history))
      .catch(() => toast.error("Could not load chat history"))
      .finally(() => setLoadingHistory(false));
  }, [activeNotebook, refreshDocs, toast]);

  const notebook = notebooks.find((n) => n.id === activeNotebook);
  const notebookDocs = activeNotebook ? forNotebook(activeNotebook) : [];
  const userName = user?.name ?? "You";
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && !m.notFound);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || streaming || !activeNotebook) return;

    const optimisticUser: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: q };
    setMessages((m) => [...m, optimisticUser]);
    setInput("");
    setStreaming(true);

    try {
      const answer = await api.chat.ask({
        notebookId: activeNotebook,
        message: q,
      });
      setMessages((m) => [...m, answer]);
    } catch (err) {
      const detail =
        err instanceof ApiError
          ? parseApiErrorMessage(err.message)
          : "Check that your materials are indexed and the LLM is configured.";
      toast.error("Could not get an answer", detail);
      setMessages((m) => m.filter((msg) => msg.id !== optimisticUser.id));
    } finally {
      setStreaming(false);
    }
  }

  function setFeedback(id: string, fb: "up" | "down") {
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, feedback: msg.feedback === fb ? null : fb } : msg)));
    toast.success(fb === "up" ? "Thanks for the feedback!" : "We'll improve this answer.");
  }

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      setMessages((m) => {
        const idx = m.findLastIndex((x) => x.role === "assistant");
        return idx >= 0 ? m.slice(0, idx) : m;
      });
      setTimeout(() => send(lastUser.content), 50);
    }
  }

  if (!notebooksReady) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingState label="Loading chat…" />
      </div>
    );
  }

  if (!notebook) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <Icon.Notebook className="h-12 w-12 text-ink-300" />
        <h2 className="text-xl font-bold text-ink-900">Create a notebook first</h2>
        <p className="max-w-md text-sm text-ink-500">
          Chat is tied to a course notebook. Create one, upload materials, then ask questions with citations.
        </p>
        <ButtonLink href="/notebooks?create=1">Create notebook</ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left: notebook + sources */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-100 p-4">
          <label className="label">Notebook</label>
          <select
            value={activeNotebook}
            onChange={(e) => {
              setActiveNotebook(e.target.value);
              setMessages([]);
            }}
            className="input"
          >
            {notebooks.map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between px-4 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Sources ({notebookDocs.length})</p>
          <Icon.Layers className="h-4 w-4 text-ink-300" />
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin p-4">
          {notebookDocs.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-3 text-xs text-ink-400">No documents yet. Upload material to this notebook.</p>
          )}
          {notebookDocs.map((d) => {
            const IconCmp =
              d.type === "reference" ? Icon.User : d.type === "pdf" ? Icon.FilePdf : d.type === "youtube" ? Icon.Video : Icon.Doc;
            return (
              <div key={d.id} className="flex items-center gap-2.5 rounded-lg border border-slate-100 p-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-ink-500">
                  <IconCmp className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-ink-900">{d.name}</p>
                  <p className="text-[11px] text-ink-400">{d.pages ? `${d.pages} pages` : d.size}</p>
                </div>
                {d.status === "ready" ? (
                  <Icon.CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Center: conversation */}
      <div className="flex flex-1 flex-col bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${notebook.color} text-white`}>
              <Icon.Notebook className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">{notebook.title}</p>
              <p className="text-xs text-ink-400">{notebook.course} · {notebookDocs.length} sources</p>
            </div>
          </div>
          <Badge tone="green"><Icon.Shield className="h-3.5 w-3.5" /> Grounded in your material</Badge>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {loadingHistory ? (
            <div className="flex h-full items-center justify-center">
              <LoadingState label="Loading conversation…" />
            </div>
          ) : messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-purple text-white shadow-glow">
                <Icon.Sparkles className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink-900">Ask anything about {notebook.title}</h2>
              <p className="mt-1.5 text-sm text-ink-500">Every answer is grounded in your uploaded materials and cites its source.</p>
              <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left text-sm text-ink-700 transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <Icon.Sparkles className="h-4 w-4 shrink-0 text-brand-500" />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end gap-3">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand-600 px-4 py-2.5 text-sm text-white">
                      {m.content}
                    </div>
                    <Avatar name={userName} size={32} />
                  </div>
                ) : (
                  <AssistantMessage
                    key={m.id}
                    message={m}
                    streaming={streaming}
                    onCitation={setActiveCitation}
                    onFeedback={setFeedback}
                    onRegenerate={regenerate}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="mx-auto max-w-3xl">
            {messages.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-ink-600 transition hover:bg-slate-200"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask a question about your material…"
                className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <Button onClick={() => send(input)} disabled={!input.trim() || streaming} size="md" className="shrink-0">
                <Icon.Send className="h-4 w-4" /> Send
              </Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-ink-400">
              Notebook Chatbot only answers from your uploaded course material.
            </p>
          </div>
        </div>
      </div>

      {/* Right: citations panel */}
      <aside className="hidden w-80 shrink-0 flex-col border-l border-slate-200 bg-white xl:flex">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <Icon.Quote className="h-4 w-4 text-brand-600" />
          <p className="text-sm font-semibold text-ink-900">Source citations</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {lastAssistant?.citations?.length ? (
            <div className="space-y-3">
              {lastAssistant.citations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCitation(c)}
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-600">
                      <Icon.FilePdf className="h-3.5 w-3.5" />
                    </span>
                    <p className="truncate text-xs font-semibold text-ink-900">{c.document}</p>
                  </div>
                  <p className="mt-2 text-[11px] font-medium text-brand-600">{c.chapter} · Page {c.page}</p>
                  <p className="mt-1.5 line-clamp-3 text-xs text-ink-500">{c.snippet}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-brand-700">
                    View source <Icon.ChevronRight className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Icon.Quote className="h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-ink-400">Citations from the AI&apos;s answer will appear here.</p>
            </div>
          )}
        </div>
      </aside>

      <DocumentViewer citation={activeCitation} onClose={() => setActiveCitation(null)} />
    </div>
  );
}

function AssistantMessage({
  message,
  streaming,
  onCitation,
  onFeedback,
  onRegenerate,
}: {
  message: ChatMessage;
  streaming: boolean;
  onCitation: (c: Citation) => void;
  onFeedback: (id: string, fb: "up" | "down") => void;
  onRegenerate: () => void;
}) {
  const toast = useToast();
  const isStreamingThis = streaming && !message.keyPoints && !message.notFound;

  if (message.notFound) {
    return (
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Icon.Warning className="h-4 w-4" />
        </span>
        <div className="rounded-2xl rounded-tl-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-purple text-white">
        <Icon.Sparkles className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        {/* Direct answer */}
        <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-600">Answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            {message.content}
            {isStreamingThis && <span className="ml-0.5 inline-block h-4 w-1.5 animate-blink bg-brand-500 align-middle" />}
          </p>
        </div>

        {!isStreamingThis && (
          <>
            {message.explanation && (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                  <Icon.Lightning className="h-3.5 w-3.5" /> Simple explanation
                </p>
                <p className="text-sm leading-relaxed text-ink-600">{message.explanation}</p>
              </div>
            )}

            {message.keyPoints && (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-600">
                  <Icon.Target className="h-3.5 w-3.5" /> Key points
                </p>
                <ul className="space-y-1.5">
                  {message.keyPoints.map((k) => (
                    <li key={k} className="flex gap-2 text-sm text-ink-700">
                      <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /> {k}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {message.citations && (
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onCitation(c)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-ink-700 transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <Icon.Quote className="h-3.5 w-3.5 text-brand-500" />
                    {c.document.replace(/\.[^.]+$/, "")} · p.{c.page}
                  </button>
                ))}
              </div>
            )}

            {message.practiceQuestion && (
              <div className="rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3">
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                  <Icon.Quiz className="h-3.5 w-3.5" /> Related practice question
                </p>
                <p className="text-sm text-ink-700">{message.practiceQuestion}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-1">
              <ActionBtn icon="Copy" label="Copy" onClick={() => { navigator.clipboard?.writeText(message.content); toast.success("Answer copied"); }} />
              <ActionBtn icon="Refresh" label="Regenerate" onClick={onRegenerate} />
              <ActionBtn icon="Bookmark" label="Save to notes" onClick={() => toast.success("Saved to notes")} />
              <div className="ml-1 flex items-center gap-0.5">
                <button
                  onClick={() => onFeedback(message.id, "up")}
                  className={cn("rounded-lg p-1.5 transition hover:bg-slate-100", message.feedback === "up" ? "text-emerald-600" : "text-ink-400")}
                  aria-label="Like"
                >
                  <Icon.ThumbUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onFeedback(message.id, "down")}
                  className={cn("rounded-lg p-1.5 transition hover:bg-slate-100", message.feedback === "down" ? "text-red-600" : "text-ink-400")}
                  aria-label="Dislike"
                >
                  <Icon.ThumbDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick }: { icon: keyof typeof Icon; label: string; onClick: () => void }) {
  const IconCmp = Icon[icon];
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-ink-500 transition hover:bg-slate-100 hover:text-ink-800"
    >
      <IconCmp className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ChatInner />
    </Suspense>
  );
}
