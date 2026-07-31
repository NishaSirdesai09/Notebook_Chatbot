import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { RootProviders } from "@/components/RootProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Notebook Chatbot — Chat with your textbooks & course materials",
  description:
    "Notebook Chatbot turns books, PDFs, Canvas files, and reference links into an AI study assistant that helps students understand, revise, and learn faster.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white font-sans text-ink-900 antialiased">
        <RootProviders>
          <ToastProvider>{children}</ToastProvider>
        </RootProviders>
      </body>
    </html>
  );
}
