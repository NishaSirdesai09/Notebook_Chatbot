"use client";

import * as React from "react";
import { api } from "@/lib/api/endpoints";
import type { Document } from "@/lib/types";

type DocumentsContextValue = {
  documents: Document[];
  forNotebook: (notebookId: string) => Document[];
  refresh: (notebookId?: string) => Promise<void>;
  ready: boolean;
};

const DocumentsContext = React.createContext<DocumentsContextValue | null>(null);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [ready, setReady] = React.useState(true);

  const refresh = React.useCallback(async (notebookId?: string) => {
    if (!notebookId) return;
    setReady(false);
    try {
      const docs = await api.documents.listByNotebook(notebookId);
      setDocuments((prev) => {
        const others = prev.filter((d) => d.notebookId !== notebookId);
        return [...docs, ...others];
      });
    } finally {
      setReady(true);
    }
  }, []);

  const forNotebook = React.useCallback(
    (notebookId: string) => documents.filter((d) => d.notebookId === notebookId),
    [documents],
  );

  return (
    <DocumentsContext.Provider value={{ documents, forNotebook, refresh, ready }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const ctx = React.useContext(DocumentsContext);
  if (!ctx) throw new Error("useDocuments must be used within DocumentsProvider");
  return ctx;
}
