"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/User";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth getUser error:", error.message);
        return;
      }
      if (data?.user) {
        const u: User = {
          id: data.user.id,
          name: data.user.email?.split("@")[0] ?? "User",
          email: data.user.email ?? "",
        };
        setUser(u);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const current = session?.user
          ? { id: session.user.id, name: session.user.email?.split("@")[0] ?? "User", email: session.user.email ?? "" }
          : null;
        setUser(current);
      },
    );

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    setUser(null);
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