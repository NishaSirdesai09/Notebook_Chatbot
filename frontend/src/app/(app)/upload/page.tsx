"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Select, ProgressBar, Badge, Input } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { notebooks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Stage = "uploading" | "extracting" | "chunking" | "embedding" | "indexing" | "ready" | "failed";

type UploadFile = {
  id: string;
  name: string;
  size: string;
  icon: IconName;
  progress: number;
  stage: Stage;
};

const accepted = [
  { ext: "PDF", icon: "FilePdf" as IconName },
  { ext: "DOCX", icon: "Doc" as IconName },
  { ext: "PPT", icon: "Doc" as IconName },
  { ext: "TXT", icon: "File" as IconName },
  { ext: "Images", icon: "Image" as IconName },
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

export default function UploadPage() {
  const toast = useToast();
  const [notebook, setNotebook] = React.useState(notebooks[0].id);
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const [linkUrl, setLinkUrl] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validExt = /\.(pdf|docx?|pptx?|txt|png|jpe?g|gif|webp)$/i;

  function addFiles(fileList: FileList | File[]) {
    const arr = Array.from(fileList);
    const valid: UploadFile[] = [];
    arr.forEach((f) => {
      if (!validExt.test(f.name)) {
        toast.error("Unsupported file", `${f.name} is not a supported format.`);
        return;
      }
      valid.push({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        icon: iconForName(f.name),
        progress: 0,
        stage: "uploading",
      });
    });
    if (valid.length) {
      setFiles((prev) => [...valid, ...prev]);
      valid.forEach((v) => simulate(v.id));
    }
  }

  function simulate(id: string) {
    const stages: Stage[] = ["uploading", "extracting", "chunking", "embedding", "indexing", "ready"];
    let step = 0;
    const tick = () => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f;
          const nextProgress = Math.min(100, f.progress + 8 + Math.random() * 10);
          let stage = f.stage;
          step = Math.floor((nextProgress / 100) * (stages.length - 1));
          stage = stages[step];
          if (nextProgress >= 100) stage = "ready";
          return { ...f, progress: nextProgress, stage };
        })
      );
    };
    const interval = setInterval(() => {
      tick();
      setFiles((prev) => {
        const f = prev.find((x) => x.id === id);
        if (f && f.progress >= 100) {
          clearInterval(interval);
        }
        return prev;
      });
    }, 450);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function addLink(kind: "link" | "youtube") {
    if (!linkUrl.trim()) {
      toast.error("Enter a URL first");
      return;
    }
    const nf: UploadFile = {
      id: `link-${Date.now()}`,
      name: linkUrl,
      size: "—",
      icon: kind === "youtube" ? "Video" : "Link",
      progress: 0,
      stage: "uploading",
    };
    setFiles((prev) => [nf, ...prev]);
    simulate(nf.id);
    setLinkUrl("");
    toast.success("Link added", "We're indexing it now.");
  }

  return (
    <PageContainer>
      <PageHeader
        title="Upload Material"
        description="Add textbooks, PDFs, slides, notes, images, and links to your notebook."
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
            <Select className="sm:w-56" value={notebook} onChange={(e) => setNotebook(e.target.value)}>
              {notebooks.map((n) => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
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
