import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const Icon = {
  Logo: (p: IconProps) => (
    <svg {...base(p)} fill="none">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H17a3 3 0 0 1 3 3v13a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
      <path d="M8 3v18M11.5 8.5h5M11.5 12h5" />
    </svg>
  ),
  Dashboard: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  Notebook: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 4a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V4Z" />
      <path d="M5 6H3M5 12H3M5 18H3M9 7h6M9 11h6" />
    </svg>
  ),
  Upload: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
  Chat: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4v-4H6a2 2 0 0 1-2-2V5Z" />
      <path d="M8 8h8M8 11h5" />
    </svg>
  ),
  Summary: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
  Quiz: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3" />
      <path d="M12 17h.01" />
    </svg>
  ),
  Flashcard: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="6" width="14" height="12" rx="2" />
      <path d="M7 16h6" />
      <path d="M8 4h11a2 2 0 0 1 2 2v9" />
    </svg>
  ),
  Canvas: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="6.5" r="1.4" />
      <circle cx="12" cy="17.5" r="1.4" />
      <circle cx="6.5" cy="12" r="1.4" />
      <circle cx="17.5" cy="12" r="1.4" />
    </svg>
  ),
  Link: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M10 13a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5" />
      <path d="M14 11a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5" />
    </svg>
  ),
  Analytics: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6M20 16v-2" />
    </svg>
  ),
  Settings: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.9 7.9 0 0 0 0-3l1.7-1.3-1.8-3.1-2 .8a7.6 7.6 0 0 0-2.6-1.5L14.3 2h-4.6l-.4 2.4a7.6 7.6 0 0 0-2.6 1.5l-2-.8-1.8 3.1 1.7 1.3a7.9 7.9 0 0 0 0 3l-1.7 1.3 1.8 3.1 2-.8a7.6 7.6 0 0 0 2.6 1.5l.4 2.4h4.6l.4-2.4a7.6 7.6 0 0 0 2.6-1.5l2 .8 1.8-3.1-1.7-1.3Z" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Bell: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  ChevronDown: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  ChevronRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  ChevronLeft: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  CheckCircle: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5L16 9" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Sparkles: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </svg>
  ),
  Copy: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Refresh: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36M21 4v4h-4" />
    </svg>
  ),
  ThumbUp: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M7 10v11H4V10h3Z" />
      <path d="M7 10l4-7a2 2 0 0 1 2.7.9c.2.4.3.9.2 1.4L13 10h5.5a2 2 0 0 1 2 2.4l-1.3 6A2 2 0 0 1 17.2 21H7" />
    </svg>
  ),
  ThumbDown: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M17 14V3h3v11h-3Z" />
      <path d="M17 14l-4 7a2 2 0 0 1-2.7-.9c-.2-.4-.3-.9-.2-1.4L11 14H5.5a2 2 0 0 1-2-2.4l1.3-6A2 2 0 0 1 6.8 3H17" />
    </svg>
  ),
  Bookmark: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </svg>
  ),
  File: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" />
      <path d="M14 2v5h5" />
    </svg>
  ),
  FilePdf: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" />
      <path d="M14 2v5h5" />
      <path d="M8.5 16.5h1a1 1 0 0 0 0-2h-1v3.5M13 14.5v3.5h.8a1.2 1.2 0 0 0 0-3.5H13Z" strokeWidth="1.2" />
    </svg>
  ),
  Image: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m4 18 5-4 4 3 3-2 4 3" />
    </svg>
  ),
  Video: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="5" width="13" height="14" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </svg>
  ),
  Doc: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
  User: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  ),
  Logout: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  Google: (p: IconProps) => (
    <svg width={18} height={18} viewBox="0 0 24 24" {...p}>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6.1 12 6.1Z" />
    </svg>
  ),
  Info: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  Warning: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  AlertCircle: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  ),
  Clock: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Trash: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  ),
  Dots: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </svg>
  ),
  Send: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  ),
  Book: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
      <path d="M4 19a2 2 0 0 1 2-2h13" />
    </svg>
  ),
  Lightning: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3 4 6v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Target: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </svg>
  ),
  Graduation: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  ),
  Quote: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M7 7H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7c0-2-1-3-3-4M19 7h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7c0-2-1-3-3-4" />
    </svg>
  ),
  Layers: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5M3 18l9 5 9-5" strokeWidth="1.4" />
    </svg>
  ),
  Eye: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Globe: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  ),
  Lock: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
};

export type IconName = keyof typeof Icon;
