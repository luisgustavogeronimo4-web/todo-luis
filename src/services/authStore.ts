"use client";

type User = {
  id: string;
  email: string;
  name?: string;
};

let currentUser: User | null = null;

/**
 * Store the authenticated user in memory.
 * This data is cleared when the page is refreshed,
 * preventing persistence in localStorage.
 */
export const authStore = {
  setUser(user: User) {
    currentUser = user;
  },
  getUser(): User | null {
    return currentUser;
  },
  clear() {
    currentUser = null;
  },
};