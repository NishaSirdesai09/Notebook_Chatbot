import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/icons";
import { PublicNav } from "@/components/marketing/PublicNav";
import { Footer } from "@/components/marketing/Footer";
import { HeroPreview } from "@/components/marketing/HeroPreview";

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-ink-500">{subtitle}</p>}
    </div>
  );
}

const features: { icon: IconName; title: string; desc: string }[] = [
  { icon: "Chat", title: "Chat with your materials", desc: "Ask questions and get answers grounded only in your uploaded books, notes, and slides." },
  { icon: "Quote", title: "Trusted citations", desc: "Every answer links back to the exact page, chapter, or slide it came from." },
  { icon: "Summary", title: "Instant summaries", desc: "Turn dense chapters into clean bullet notes and exam-ready revision sheets." },
  { icon: "Quiz", title: "Auto-generated quizzes", desc: "Practice with MCQs, short answers, and true/false questions from your content." },
  { icon: "Flashcard", title: "Smart flashcards", desc: "Generate flip-card decks and track what you know versus what needs review." },
  { icon: "Canvas", title: "Canvas integration", desc: "Sync real course files, modules, and assignments into a course-specific assistant." },
];

const howItWorks: { icon: IconName; step: string; title: string; desc: string }[] = [
  { icon: "Notebook", step: "01", title: "Create a notebook", desc: "Set up a space for each course or subject you're studying." },
  { icon: "Upload", step: "02", title: "Upload materials", desc: "Add PDFs, slides, notes, Canvas files, or reference links." },
  { icon: "Layers", step: "03", title: "We index everything", desc: "Text is extracted, chunked, embedded, and indexed for retrieval." },
  { icon: "Sparkles", step: "04", title: "Learn faster", desc: "Chat, summarize, quiz, and revise — all grounded in your content." },
];

const studentBenefits = [
  "Understand hard topics with beginner-friendly explanations",
  "Revise faster with auto summaries and flashcards",
  "Test yourself with quizzes generated from your own notes",
  "Never lose context — every answer cites its source",
];

const professorBenefits = [
  "See the questions your students ask most",
  "Spot difficult topics across the whole class",
  "Turn course materials into a 24/7 teaching assistant",
  "Track engagement and quiz performance trends",
];

const comparison = [
  { feature: "Answers grounded in your course material", us: true, them: false },
  { feature: "Page & chapter level citations", us: true, them: false },
  { feature: "Canvas course sync", us: true, them: false },
  { feature: "Auto quizzes & flashcards from your files", us: true, them: false },
  { feature: "Refuses to answer outside your material", us: true, them: false },
  { feature: "Generic web knowledge", us: true, them: true },
];

const pricing = [
  {
    name: "Student",
    price: "$0",
    period: "forever",
    desc: "Everything you need to study smarter.",
    features: ["3 notebooks", "50 documents", "Unlimited chat", "Quizzes & flashcards"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    desc: "For serious students and TAs.",
    features: ["Unlimited notebooks", "Unlimited documents", "Canvas sync", "Advanced analytics", "Priority AI"],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Campus",
    price: "Custom",
    period: "",
    desc: "For departments & universities.",
    features: ["SSO & admin controls", "LMS integration", "Shared class notebooks", "Usage analytics", "Dedicated support"],
    cta: "Contact sales",
    featured: false,
  },
];

const faqs = [
  { q: "Where do the answers come from?", a: "Notebook Chatbot only answers from the materials you upload — your textbooks, notes, slides, Canvas files, and reference links. If something isn't in your material, it tells you instead of guessing." },
  { q: "What file types can I upload?", a: "PDF, DOCX, PPT, TXT, and images, plus reference links, YouTube videos, and Canvas course files." },
  { q: "How does Canvas Sync work?", a: "Connect your Canvas account with an API token, pick a course, and we sync its files, modules, assignments, and announcements into a course-specific AI assistant." },
  { q: "Is my data private?", a: "Yes. Notebooks are private by default. You choose whether to share a notebook with your class." },
  { q: "Can professors use it too?", a: "Absolutely. Professors get a dashboard showing common questions, difficult topics, and content engagement across the class." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section id="product" className="relative overflow-hidden bg-hero-glow">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <Badge tone="brand" className="mb-5">
              <Icon.Sparkles className="h-3.5 w-3.5" /> AI study assistant for your own materials
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Chat with your <span className="gradient-text">textbooks</span>, lecture notes &amp;
              course materials.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-500">
              Notebook Chatbot turns books, PDFs, Canvas files, and reference links into an AI study
              assistant that helps students understand, revise, and learn faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup" size="lg">
                Get Started <Icon.ChevronRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary" size="lg">
                <Icon.Eye className="h-4 w-4" /> View Demo
              </ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-400">
              <span className="flex items-center gap-1.5"><Icon.Check className="h-4 w-4 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Icon.Check className="h-4 w-4 text-emerald-500" /> Free for students</span>
              <span className="flex items-center gap-1.5"><Icon.Check className="h-4 w-4 text-emerald-500" /> Cited answers</span>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Logos / trust */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-400">
            Trusted by students &amp; faculty at leading universities
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-ink-300">
            {["Stanford", "MIT", "Berkeley", "Oxford", "NUS", "Toronto"].map((u) => (
              <span key={u}>{u}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-8">
            <Badge tone="red" className="mb-4"><Icon.Warning className="h-3.5 w-3.5" /> The Problem</Badge>
            <h3 className="text-2xl font-bold text-ink-900">Studying from scattered material is hard</h3>
            <ul className="mt-5 space-y-3 text-ink-600">
              {[
                "Textbooks are long and dense — finding the right page takes forever.",
                "Generic chatbots hallucinate and can't cite your actual course content.",
                "Notes, slides, and PDFs live in a dozen different places.",
                "Revising for exams means re-reading everything from scratch.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Icon.Close className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-8">
            <Badge tone="green" className="mb-4"><Icon.Sparkles className="h-3.5 w-3.5" /> The Solution</Badge>
            <h3 className="text-2xl font-bold text-ink-900">One assistant that actually knows your material</h3>
            <ul className="mt-5 space-y-3 text-ink-600">
              {[
                "Upload everything once — books, notes, slides, links, Canvas files.",
                "Ask questions and get answers grounded only in your content.",
                "Every answer cites the exact page, chapter, or slide.",
                "Generate summaries, quizzes, and flashcards in seconds.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Icon.CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to learn from your own content"
            subtitle="A complete study workspace built around the materials you already have."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const IconCmp = Icon[f.icon];
              return (
                <div key={f.title} className="card p-6 transition hover:shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <IconCmp className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="From upload to understanding in four steps"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s) => {
            const IconCmp = Icon[s.icon];
            return (
              <div key={s.step} className="relative card p-6">
                <span className="absolute right-5 top-5 text-3xl font-bold text-slate-100">{s.step}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-purple text-white">
                  <IconCmp className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="card p-8">
            <Badge tone="brand" className="mb-4"><Icon.Graduation className="h-3.5 w-3.5" /> For Students</Badge>
            <h3 className="text-2xl font-bold text-ink-900">Study smarter, not longer</h3>
            <ul className="mt-5 space-y-3">
              {studentBenefits.map((b) => (
                <li key={b} className="flex gap-3 text-ink-600">
                  <Icon.CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-8">
            <Badge tone="purple" className="mb-4"><Icon.User className="h-3.5 w-3.5" /> For Professors</Badge>
            <h3 className="text-2xl font-bold text-ink-900">Understand your class like never before</h3>
            <ul className="mt-5 space-y-3">
              {professorBenefits.map((b) => (
                <li key={b} className="flex gap-3 text-ink-600">
                  <Icon.CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-purple" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Canvas integration */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="card overflow-hidden border-brand-100 bg-gradient-to-br from-brand-600 to-accent-purple text-white">
          <div className="grid items-center gap-8 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <Badge className="mb-4 bg-white/15 text-white"><Icon.Canvas className="h-3.5 w-3.5" /> Canvas Integration</Badge>
              <h3 className="text-3xl font-bold">Turn your real course into an AI assistant</h3>
              <p className="mt-4 text-white/80">
                Canvas Sync lets you turn your actual course material into a course-specific AI
                assistant. Sync files, modules, assignments, and announcements in one click.
              </p>
              <div className="mt-6">
                <ButtonLink href="/signup" variant="secondary" size="lg">
                  Connect Canvas <Icon.ChevronRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
            <div className="space-y-3">
              {["Course files", "Modules", "Assignments", "Announcements"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="flex items-center gap-2.5 font-medium">
                    <Icon.Check className="h-5 w-5" /> {item}
                  </span>
                  <span className="text-sm text-white/70">Synced</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Notebook Chatbot"
            title="Not just another generic chatbot"
            subtitle="Generic AI guesses. Notebook Chatbot answers from your actual course material — with receipts."
          />
          <div className="mt-12 overflow-hidden card">
            <div className="grid grid-cols-12 border-b border-slate-100 bg-slate-50 px-6 py-4 text-sm font-semibold text-ink-700">
              <div className="col-span-6">Capability</div>
              <div className="col-span-3 text-center text-brand-700">Notebook Chatbot</div>
              <div className="col-span-3 text-center">Generic Chatbot</div>
            </div>
            {comparison.map((row) => (
              <div key={row.feature} className="grid grid-cols-12 items-center border-b border-slate-100 px-6 py-4 text-sm last:border-0">
                <div className="col-span-6 text-ink-700">{row.feature}</div>
                <div className="col-span-3 flex justify-center">
                  {row.us ? <Icon.CheckCircle className="h-5 w-5 text-emerald-500" /> : <Icon.Close className="h-5 w-5 text-slate-300" />}
                </div>
                <div className="col-span-3 flex justify-center">
                  {row.them ? <Icon.CheckCircle className="h-5 w-5 text-emerald-500" /> : <Icon.Close className="h-5 w-5 text-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing for every learner"
          subtitle="Start free. Upgrade when you're ready. Campus plans for whole departments."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`card relative p-8 ${plan.featured ? "border-brand-300 shadow-glow ring-1 ring-brand-200" : ""}`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{plan.desc}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold text-ink-900">{plan.price}</span>
                <span className="mb-1 text-sm text-ink-400">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-ink-600">
                    <Icon.Check className="h-5 w-5 shrink-0 text-brand-600" /> {f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/signup"
                variant={plan.featured ? "primary" : "secondary"}
                fullWidth
                className="mt-7"
              >
                {plan.cta}
              </ButtonLink>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-ink-900">
                  {f.q}
                  <Icon.ChevronDown className="h-5 w-5 text-ink-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-16 text-center sm:px-12">
          <div className="absolute inset-0 bg-hero-glow opacity-40" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Start chatting with your course materials today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Create your first notebook, upload your materials, and turn studying into a conversation.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/signup" size="lg">
                Get Started Free <Icon.ChevronRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/signin" variant="secondary" size="lg" className="bg-white/10 text-white ring-white/20 hover:bg-white/20">
                Sign In
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
