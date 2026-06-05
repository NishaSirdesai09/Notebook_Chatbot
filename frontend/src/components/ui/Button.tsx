import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4Z" />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("btn", variantClass[variant], sizeClass[size], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  href,
  ...props
}: BaseProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link
      href={href}
      className={cn("btn", variantClass[variant], sizeClass[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
