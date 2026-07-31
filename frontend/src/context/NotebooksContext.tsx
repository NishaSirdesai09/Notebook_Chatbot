"use client";

import * as React from "react";
import { api } from "@/lib/api/endpoints";
import type { Notebook } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

type NotebooksContextValue = {
  notebooks: Notebook[];
  addNotebook: (n: Notebook) => void;
  removeNotebook: (id: string) => Promise<void>;
  getNotebook: (id: string) => Notebook | undefined;
  refresh: () => Promise<void>;
  ready: boolean;
};

const NotebooksContext = React.createContext<NotebooksContextValue | null>(null);

export function NotebooksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notebooks, setNotebooks] = React.useState<Notebook[]>([]);
  const [ready, setReady] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setReady(false);
    try {
      const list = await api.notebooks.list(user?.id);
      setNotebooks(list);
    } finally {
      setReady(true);
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (user) void refresh();
    else {
      setNotebooks([]);
      setReady(true);
    }
  }, [user, refresh]);

  const addNotebook = React.useCallback((n: Notebook) => {
    setNotebooks((prev) => [n, ...prev]);
  }, []);

  const removeNotebook = React.useCallback(async (id: string) => {
    await api.notebooks.remove(id);
    setNotebooks((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNotebook = React.useCallback(
    (id: string) => notebooks.find((n) => n.id === id),
    [notebooks],
  );

  return (
    <NotebooksContext.Provider
      value={{ notebooks, addNotebook, removeNotebook, getNotebook, refresh, ready }}
    >
      {children}
    </NotebooksContext.Provider>
  );
}

export function useNotebooks() {
  const ctx = React.useContext(NotebooksContext);
  if (!ctx) throw new Error("useNotebooks must be used within NotebooksProvider");
  return ctx;
}
