import type { User } from "@/types/User";

export const AUTH_STORAGE_KEY = "auth.user";

export const authStorage = {
  getUser: (): User | null => {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) as User : null;
  },

  setUser: (user: User) => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  clearUser: () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};