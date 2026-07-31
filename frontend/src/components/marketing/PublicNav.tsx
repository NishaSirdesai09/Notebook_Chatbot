"use client";

import * as React from "react";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

const links = [{ label: "How it works", href: "#how-it-works" }];

export function PublicNav() {
  const { user, ready } = useAuth();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-slate-100"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {ready && user ? (
            <>
              <ButtonLink href="/settings" variant="ghost" size="md">
                Settings
              </ButtonLink>
              <ButtonLink href="/dashboard" variant="primary" size="md">
                Dashboard
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/signin" variant="ghost" size="md">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup" variant="primary" size="md">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-ink-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <Icon.Close className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-100"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {ready && user ? (
              <>
                <ButtonLink href="/settings" variant="secondary" fullWidth>
                  Settings
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="primary" fullWidth>
                  Dashboard
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink href="/signin" variant="secondary" fullWidth>
                  Sign in
                </ButtonLink>
                <ButtonLink href="/signup" variant="primary" fullWidth>
                  Get started
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
