import type { IconName } from "@/components/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: IconName;
};

/** MVP navigation — focused on the core study loop. */
export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "Dashboard" },
  { label: "Notebooks", href: "/notebooks", icon: "Notebook" },
  { label: "Upload", href: "/upload", icon: "Upload" },
  { label: "Chat", href: "/chat", icon: "Chat" },
];

export const footerNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: "Settings" },
];
