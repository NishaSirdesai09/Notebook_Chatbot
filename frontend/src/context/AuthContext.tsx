"use client";

import * as React from "react";
import type { User } from "@/lib/types";
import { clearStoredUser, getStoredUser, storeUser } from "@/lib/session";
import { getAccessToken } from "@/lib/api/client";
import { clearRefreshToken } from "@/lib/refresh-token";

type AuthContextValue = {
  user: User | null;
  setUser: (user: User) => void;
  signOut: () => void;
  ready: boolean;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = React.useState<User | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    async function restore() {
      const token = getAccessToken();
      if (!token) {
        clearStoredUser();
        setReady(true);
        return;
      }
      try {
        const { api } = await import("@/lib/api/endpoints");
        const me = await api.auth.me();
        storeUser(me);
        setUserState(me);
      } catch {
        clearStoredUser();
        const { clearAccessToken } = await import("@/lib/api/client");
        clearAccessToken();
        clearRefreshToken();
      } finally {
        setReady(true);
      }
    }
    void restore();
  }, []);

  const setUser = React.useCallback((u: User) => {
    storeUser(u);
    setUserState(u);
  }, []);

  const signOut = React.useCallback(() => {
    void import("@/lib/api/endpoints").then(({ api }) => api.auth.logout().catch(() => undefined));
    clearStoredUser();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, signOut, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
