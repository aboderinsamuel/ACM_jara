import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { email: string; id?: string } | null;

type AuthContextValue = {
  user: User;
  session: { token: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, token: string, id?: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ token: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage token
    try {
      const token = localStorage.getItem("auth_token");
      const email = localStorage.getItem("auth_email");
      setSession({ token: token || null });
      setUser(email ? { email } : null);
    } catch {
      setSession({ token: null });
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Keep state in sync across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "auth_email") {
        const token = localStorage.getItem("auth_token");
        const email = localStorage.getItem("auth_email");
        setSession({ token: token || null });
        setUser(email ? { email } : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const [user, setUser] = useState<User>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signOut: async () => {
        try {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_email");
        } catch {}
        setSession({ token: null });
        setUser(null);
      },
      signIn: (email: string, token: string, id?: string) => {
        try {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("auth_email", email);
          if (id) localStorage.setItem("auth_user_id", id);
        } catch {}
        setSession({ token });
        setUser({ email, id });
      },
    }),
    [session, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!user) {
    // Simple redirect
    if (typeof window !== "undefined") {
      const r = new URL("/auth/login", window.location.origin);
      r.searchParams.set(
        "next",
        window.location.pathname + window.location.search,
      );
      window.location.replace(r.toString());
    }
    return null;
  }
  return <>{children}</>;
}
