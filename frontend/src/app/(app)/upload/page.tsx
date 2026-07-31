"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Select, ProgressBar, Badge, Input } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api/endpoints";
import { useDocuments } from "@/context/DocumentsContext";
import { useNotebooks } from "@/context/NotebooksContext";
import type { DocType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Stage = "uploading" | "extracting" | "chunking" | "embedding" | "indexing" | "ready" | "failed";

type UploadFile = {
  id: string;
  name: string;
  size: string;
  icon: IconName;
  progress: number;
  stage: Stage;
  localKey: string;
};

const accepted = [
  { ext: "Professor refs", icon: "User" as IconName },
  { ext: "Case PDFs", icon: "FilePdf" as IconName },
  { ext: "DOCX", icon: "Doc" as IconName },
  { ext: "PPT", icon: "Doc" as IconName },
  { ext: "TXT", icon: "File" as IconName },
];

const pipeline: { stage: Stage; label: string }[] = [
  { stage: "extracting", label: "Extracting text" },
  { stage: "chunking", label: "Chunking content" },
  { stage: "embedding", label: "Creating embeddings" },
  { stage: "indexing", label: "Indexing knowledge base" },
  { stage: "ready", label: "Ready to chat" },
];

function iconForName(name: string): IconName {
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return "FilePdf";
  if (n.endsWith(".doc") || n.endsWith(".docx")) return "Doc";
  if (n.endsWith(".ppt") || n.endsWith(".pptx")) return "Doc";
  if (n.match(/\.(png|jpg|jpeg|gif|webp)$/)) return "Image";
  if (n.includes("youtube")) return "Video";
  return "File";
}

function docTypeForName(name: string): DocType {
  const n = name.toLowerCase();
  if (/prof[_\s]|professor|reference|hbr_|syllabus/.test(n)) return "reference";
  if (n.endsWith(".pdf")) return "pdf";
  if (n.endsWith(".doc") || n.endsWith(".docx")) return "docx";
  if (n.endsWith(".ppt") || n.endsWith(".pptx")) return "ppt";
  if (n.endsWith(".txt")) return "txt";
  if (/\.(png|jpe?g|gif|webp)$/.test(n)) return "image";
  if (n.includes("youtube")) return "youtube";
  if (n.startsWith("http")) return "link";
  return "txt";
}

export default function UploadPage() {
  const toast = useToast();
  const { refresh: refreshDocs } = useDocuments();
  const { notebooks, ready } = useNotebooks();
  const [notebook, setNotebook] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const [linkUrl, setLinkUrl] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ready && notebooks.length > 0 && !notebook) {
      setNotebook(notebooks[0].id);
    }
  }, [ready, notebooks, notebook]);

  const validExt = /\.(pdf|txt)$/i;

  const stageProgress: Record<Stage, number> = {
    uploading: 15,
    extracting: 35,
    chunking: 55,
    embedding: 75,
    indexing: 90,
    ready: 100,
    failed: 100,
  };

  async function pollStatus(docId: string, localKey: string) {
    const interval = setInterval(async () => {
      try {
        const status = await api.documents.status(docId);
        const stage = status.status as Stage;
        setFiles((prev) =>
          prev.map((f) =>
            f.localKey === localKey
              ? { ...f, id: docId, stage, progress: stageProgress[stage] ?? f.progress }
              : f,
          ),
        );
        if (stage === "ready") {
          clearInterval(interval);
          await refreshDocs(notebook);
          toast.success("Ready to chat", "Your document has been indexed.");
        }
        if (stage === "failed") {
          clearInterval(interval);
          toast.error("Indexing failed", status.errorMessage ?? "Could not process this file.");
        }
      } catch {
        clearInterval(interval);
      }
    }, 1500);
  }

  async function uploadOne(file: File) {
    if (!notebook) {
      toast.error("Select a notebook first");
      return;
    }
    const localKey = `${file.name}-${Date.now()}`;
    const entry: UploadFile = {
      id: localKey,
      localKey,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      icon: iconForName(file.name),
      progress: 5,
      stage: "uploading",
    };
    setFiles((prev) => [entry, ...prev]);

    try {
      const doc = await api.documents.upload(file, notebook, docTypeForName(file.name));
      setFiles((prev) =>
        prev.map((f) => (f.localKey === localKey ? { ...f, id: doc.id, stage: "extracting", progress: 20 } : f)),
      );
      void pollStatus(doc.id, localKey);
    } catch {
      toast.error("Upload failed", `Could not upload ${file.name}.`);
      setFiles((prev) => prev.filter((f) => f.localKey !== localKey));
    }
  }

  function addFiles(fileList: FileList | File[]) {
    Array.from(fileList).forEach((f) => {
      if (!validExt.test(f.name)) {
        toast.error("Unsupported file", `${f.name} — use PDF or TXT for now.`);
        return;
      }
      void uploadOne(f);
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function addLink(_kind: "link" | "youtube") {
    toast.error("Links not supported yet", "Upload a PDF or TXT file for now.");
  }

  return (
    <PageContainer>
      <PageHeader
        title="Upload Material"
        description="Add case studies, lecture slides, professor reference PDFs, and syllabus readings. The AI answers from these materials only."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Notebook selector */}
          <Card className="mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon.Notebook className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">Destination notebook</p>
                <p className="text-xs text-ink-400">Choose where these materials should live.</p>
              </div>
            </div>
            <Select
              className="sm:w-56"
              value={notebook}
              onChange={(e) => setNotebook(e.target.value)}
              disabled={!ready || notebooks.length === 0}
            >
              {notebooks.length === 0 ? (
                <option value="">No notebooks — create one first</option>
              ) : (
                notebooks.map((n) => (
                  <option key={n.id} value={n.id}>{n.title}</option>
                ))
              )}
            </Select>
          </Card>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition",
              dragging ? "border-brand-400 bg-brand-50/60" : "border-slate-300 bg-white"
            )}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon.Upload className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink-900">Drag &amp; drop files here</h3>
            <p className="mt-1 text-sm text-ink-500">or click to browse from your device</p>
            <Button className="mt-4" onClick={() => inputRef.current?.click()}>
              <Icon.Upload className="h-4 w-4" /> Browse files
            </Button>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.webp"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {accepted.map((a) => {
                const IconCmp = Icon[a.icon];
                return (
                  <span key={a.ext} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-ink-600">
                    <IconCmp className="h-3.5 w-3.5" /> {a.ext}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Uploaded list */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-ink-900">Processing {files.length} item{files.length > 1 ? "s" : ""}</h3>
              {files.map((f) => {
                const IconCmp = Icon[f.icon];
                const done = f.stage === "ready";
                return (
                  <Card key={f.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-ink-500")}>
                        <IconCmp className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-900">{f.name}</p>
                        <p className="text-xs text-ink-400">{f.size}</p>
                      </div>
                      {done ? (
                        <Badge tone="green"><Icon.Check className="h-3.5 w-3.5" /> Ready</Badge>
                      ) : (
                        <span className="text-xs font-medium text-brand-600">{Math.round(f.progress)}%</span>
                      )}
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={f.progress} tone={done ? "green" : "brand"} />
                    </div>
                    {!done && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        {pipeline.map((p) => {
                          const idx = pipeline.findIndex((x) => x.stage === p.stage);
                          const curIdx = pipeline.findIndex((x) => x.stage === f.stage);
                          const active = f.stage === p.stage;
                          const complete = curIdx > idx || f.stage === "ready";
                          return (
                            <span key={p.stage} className={cn("inline-flex items-center gap-1.5 text-xs", complete ? "text-emerald-600" : active ? "text-brand-600" : "text-ink-300")}>
                              {complete ? <Icon.Check className="h-3.5 w-3.5" /> : active ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                              {p.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {done && (
                      <p className="mt-2 text-xs text-emerald-600">Indexed and ready to chat.</p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Links sidebar */}
        <div className="space-y-4">
          <Card className="border-violet-100 bg-violet-50/40 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Icon.User className="h-4 w-4 text-violet-600" /> Professor reference PDF
            </h3>
            <p className="mt-1 text-xs text-ink-500">
              Upload curated readings your professor shared — frameworks, syllabus refs, and HBR articles. These are prioritized in chat answers.
            </p>
            <Button
              variant="secondary"
              fullWidth
              className="mt-3"
              onClick={() => inputRef.current?.click()}
            >
              <Icon.Upload className="h-4 w-4" /> Upload professor PDF
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Icon.Link className="h-4 w-4 text-brand-600" /> Add a reference link
            </h3>
            <p className="mt-1 text-xs text-ink-500">Paste an article, documentation, or research paper URL.</p>
            <Input
              className="mt-3"
              placeholder="https://example.com/article"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button variant="secondary" fullWidth className="mt-2" onClick={() => addLink("link")}>
              Add link
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Icon.Video className="h-4 w-4 text-red-500" /> Add a YouTube video
            </h3>
            <p className="mt-1 text-xs text-ink-500">We&apos;ll transcribe and index the video content.</p>
            <Input
              className="mt-3"
              placeholder="https://youtube.com/watch?v=…"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button variant="secondary" fullWidth className="mt-2" onClick={() => addLink("youtube")}>
              Add video
            </Button>
          </Card>

          <Card className="border-brand-100 bg-brand-50/40 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Icon.Canvas className="h-4 w-4 text-brand-600" /> Canvas course files
            </h3>
            <p className="mt-1 text-xs text-ink-500">Sync materials directly from your Canvas courses.</p>
            <Button fullWidth className="mt-3" onClick={() => toast.info("Opening Canvas Sync…")}>
              Go to Canvas Sync
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
