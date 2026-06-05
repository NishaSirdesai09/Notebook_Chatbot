import Link from "next/link";
import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "Product",
    links: ["Features", "How It Works", "Pricing", "Canvas Integration", "Changelog"],
  },
  {
    title: "For Education",
    links: ["For Students", "For Professors", "For Universities", "Case Studies"],
  },
  {
    title: "Resources",
    links: ["Docs", "API Reference", "Help Center", "Community", "Blog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Privacy", "Terms", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-500">
              The AI study assistant that turns your textbooks, notes, and course materials into
              answers you can trust.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink-900">{col.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-ink-500 transition hover:text-ink-900">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-sm text-ink-400">© 2026 Notebook Chatbot. All rights reserved.</p>
          <p className="text-sm text-ink-400">Built for students, professors & universities.</p>
        </div>
      </div>
    </footer>
  );
}
