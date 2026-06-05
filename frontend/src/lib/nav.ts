import type { IconName } from "@/components/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: IconName;
};

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "Dashboard" },
  { label: "My Notebooks", href: "/notebooks", icon: "Notebook" },
  { label: "Upload Material", href: "/upload", icon: "Upload" },
  { label: "Chat", href: "/chat", icon: "Chat" },
  { label: "Summaries", href: "/summaries", icon: "Summary" },
  { label: "Quizzes", href: "/quizzes", icon: "Quiz" },
  { label: "Flashcards", href: "/flashcards", icon: "Flashcard" },
  { label: "Canvas Sync", href: "/canvas", icon: "Canvas" },
  { label: "Reference Links", href: "/references", icon: "Link" },
  { label: "Analytics", href: "/analytics", icon: "Analytics" },
];

export const footerNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export const professorNav: NavItem[] = [
  { label: "Professor View", href: "/professor", icon: "Graduation" },
];
