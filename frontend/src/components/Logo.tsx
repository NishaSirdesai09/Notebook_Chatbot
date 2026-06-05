import Link from "next/link";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-purple text-white shadow-soft">
        <Icon.Logo className="h-5 w-5" />
      </span>
      <span className="text-[17px] font-bold tracking-tight text-ink-900">
        Notebook<span className="gradient-text">Chatbot</span>
      </span>
    </Link>
  );
}
