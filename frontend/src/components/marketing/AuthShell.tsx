import { Logo } from "@/components/Logo";
import { Icon } from "@/components/icons";

const highlights = [
  "Chat with your own textbooks & notes",
  "Every answer cites the exact source",
  "Auto summaries, quizzes & flashcards",
  "Sync your real Canvas course material",
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* brand side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-purple lg:block">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative flex h-full flex-col justify-center px-12 text-white">
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Your course materials, now a study assistant you can talk to.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Join thousands of students and professors learning faster with AI grounded in their own
            content.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                  <Icon.Check className="h-4 w-4" />
                </span>
                <span className="text-white/90">{h}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm italic text-white/90">
              “I uploaded my whole biology textbook and now I just ask it questions before exams. It
              even tells me which page the answer is on.”
            </p>
            <p className="mt-3 text-sm font-semibold">Priya S. — Pre-med, Class of 2027</p>
          </div>
        </div>
      </div>
    </div>
  );
}
