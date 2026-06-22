import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/User";
import { authStorage } from "@/services/localStorage";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());

  // Keep Supabase session in sync with our local state
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const current = session?.user
          ? { id: session.user.id, name: session.user.email?.split("@")[0] ?? "User", email: session.user.email ?? "" }
          : null;
        setUser(current);
        if (current) authStorage.setUser(current);
        else authStorage.clearUser();
      },
    );
    // initial load (in case a session already exists)
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const u = {
          id: data.user.id,
          name: data.user.email?.split("@")[0] ?? "User",
          email: data.user.email ?? "",
        };
        setUser(u);
        authStorage.setUser(u);
      }
    })();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange will update the state
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // after sign‑up Supabase sends a confirmation email; we keep the session as is
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    // state cleared by onAuthStateChange
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};