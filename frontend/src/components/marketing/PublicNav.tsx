"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/icons";

const links = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#faq" },
];

export function PublicNav() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled ? "border-slate-200 bg-white/85 backdrop-blur-lg" : "border-transparent bg-white/0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-slate-100 hover:text-ink-900"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/signin" variant="ghost" size="md">
            Sign In
          </ButtonLink>
          <ButtonLink href="/signup" variant="primary" size="md">
            Get Started
          </ButtonLink>
        </div>
        <button
          className="rounded-lg p-2 text-ink-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <Icon.Close /> : <Icon.Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-100"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <ButtonLink href="/signin" variant="secondary" fullWidth>
              Sign In
            </ButtonLink>
            <ButtonLink href="/signup" variant="primary" fullWidth>
              Get Started
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
