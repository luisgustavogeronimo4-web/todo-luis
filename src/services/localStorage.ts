export const AUTH_STORAGE_KEY = "auth.user";

export const authStorage = {
  getUser: () => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: any) => {
    try {
      const data = JSON.stringify(user);
      localStorage.setItem(AUTH_STORAGE_KEY, data);
    } catch {
      // ignore storage errors
    }
  },
  clearUser: () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  },
};