import { Icon } from "@/components/icons";

export function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-200/40 via-accent-purple/20 to-accent-teal/30 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-glow">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <div className="ml-3 flex h-6 flex-1 items-center rounded-md bg-white px-3 text-[11px] text-ink-400 ring-1 ring-slate-200">
            app.notebookchatbot.com/chat/strategic-management
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-4 hidden flex-col gap-3 border-r border-slate-100 bg-slate-50/60 p-4 sm:flex">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Sources</p>
            <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 ring-1 ring-violet-200">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-violet-600">
                <Icon.User className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-ink-900">Prof. Porter Reference.pdf</p>
                <p className="text-[10px] text-ink-400">12 pages · Professor ref</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 ring-1 ring-slate-200">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600">
                <Icon.FilePdf className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-ink-900">Tesla Case Study.pdf</p>
                <p className="text-[10px] text-ink-400">24 pages · Ready</p>
              </div>
            </div>
            <div className="mt-2 rounded-xl bg-gradient-to-br from-brand-600 to-accent-purple p-3 text-white">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                <Icon.Quiz className="h-3.5 w-3.5" /> Quiz generated
              </div>
              <p className="mt-1 text-[10px] text-white/80">10 questions · Strategy midterm</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/25">
                <div className="h-full w-2/3 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-3 p-4 sm:col-span-8">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2 text-[12px] text-white">
              Explain Porter&apos;s Five Forces using our professor&apos;s reference PDF.
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-slate-50 px-3.5 py-3 ring-1 ring-slate-100">
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-brand-700">
                <Icon.Sparkles className="h-3.5 w-3.5" /> AI Answer
              </div>
              <p className="text-[12px] leading-relaxed text-ink-700">
                Five Forces analyzes industry rivalry, new entrants, substitutes, and buyer/supplier
                power to explain why some markets earn higher{" "}
                <span className="font-semibold text-ink-900">profit margins</span> than others.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-ink-600 ring-1 ring-slate-200">
                  <Icon.Quote className="h-3 w-3 text-brand-500" /> Prof. Reference, p.4
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-ink-600 ring-1 ring-slate-200">
                  <Icon.Quote className="h-3 w-3 text-brand-500" /> Case Study, p.9
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
              <span className="text-[12px] text-ink-400">Ask a question…</span>
              <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Icon.Send className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
