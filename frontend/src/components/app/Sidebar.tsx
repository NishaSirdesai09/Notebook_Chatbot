"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/icons";
import { mainNav, footerNav, professorNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  function NavLink({ href, label, icon }: { href: string; label: string; icon: keyof typeof Icon }) {
    const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    const IconCmp = Icon[icon];
    return (
      <Link
        href={href}
        onClick={onMobileClose}
        title={collapsed ? label : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
          active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-slate-100 hover:text-ink-900",
          collapsed && "justify-center px-2"
        )}
      >
        <IconCmp className={cn("h-5 w-5 shrink-0", active ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600")} />
        {!collapsed && <span className="truncate">{label}</span>}
        {!collapsed && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-600" />}
      </Link>
    );
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 items-center border-b border-slate-100 px-4", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-purple text-white">
            <Icon.Logo className="h-5 w-5" />
          </Link>
        ) : (
          <Logo href="/dashboard" />
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {!collapsed && <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Workspace</p>}
        {mainNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <div className="my-3 border-t border-slate-100" />
        {!collapsed && <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Teaching</p>}
        {professorNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-slate-100 px-3 py-3">
        {footerNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <button
          onClick={onToggle}
          className={cn(
            "hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 transition hover:bg-slate-100 lg:flex",
            collapsed && "justify-center px-2"
          )}
        >
          <Icon.ChevronLeft className={cn("h-5 w-5 transition", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white transition-[width] duration-200 lg:block",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        {content}
      </aside>

      {/* mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute inset-y-0 left-0 w-64 animate-fade-in border-r border-slate-200 bg-white">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
