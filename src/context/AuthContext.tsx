import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authStorage } from "@/services/localStorage";
import type { User } from "@/types/User";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error("Email e senha são obrigatórios.");
    }

    const mockUser: User = {
      id: `user-${Date.now()}`,
      name: normalizedEmail.split("@")[0] || "Usuário",
      email: normalizedEmail,
    };

    setUser(mockUser);
    authStorage.setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    authStorage.clearUser();
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return context;
};