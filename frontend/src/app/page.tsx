import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/icons";
import { PublicNav } from "@/components/marketing/PublicNav";
import { HeroPreview } from "@/components/marketing/HeroPreview";

const steps: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "Notebook",
    title: "Create a notebook",
    desc: "One space per course — Finance, Strategy, Marketing, etc.",
  },
  {
    icon: "Upload",
    title: "Upload your materials",
    desc: "Case PDFs, lecture slides, and professor reference PDFs.",
  },
  {
    icon: "Chat",
    title: "Ask with citations",
    desc: "Every answer is grounded in your uploads and cites the source.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-hero-glow">
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="section-eyebrow mb-4">Built for business school</p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl">
                Chat with your{" "}
                <span className="gradient-text">course materials</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500">
                Upload cases, slides, and professor reference PDFs. Ask questions and get answers
                grounded in your content — not the open web.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/signup" size="lg">
                  Get started free
                </ButtonLink>
                <ButtonLink href="/signin" variant="secondary" size="lg">
                  Sign in
                </ButtonLink>
              </div>
            </div>
            <HeroPreview />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">How it works</h2>
            <p className="mt-2 text-ink-500">Three steps from upload to cited answers.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => {
              const IconCmp = Icon[s.icon];
              return (
                <div key={s.title} className="card p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    Step {i + 1}
                  </span>
                  <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <IconCmp className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-100 bg-slate-50 py-16">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-ink-900">Ready to study smarter?</h2>
            <p className="mt-2 text-ink-500">Create a free account and set up your first notebook.</p>
            <ButtonLink href="/signup" size="lg" className="mt-6">
              Create your account
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-ink-400">
        © {new Date().getFullYear()} Notebook Chatbot
      </footer>
    </div>
  );
}
