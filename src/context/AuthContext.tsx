"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export interface AuthUser {
  name?: string;
  nama?: string;
  nik?: string;
  email?: string;
  jabatan?: string;
  divisi?: string;
  atasan?: string;
  role?: string;
  avatar?: string;
  initials?: string;
}

interface LoginResponse extends AuthUser {
  token: string;
}

type AuthContextValue = {
  user: AuthUser | null;
  isLoaded: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  updateProfile?: (data: Partial<AuthUser>) => void;
};

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const TOKEN_KEY = "sams_token";

const defaultAuthValue: AuthContextValue = {
  user: null,
  isLoaded: false,
  login: async () => ({}),
  logout: () => {},
  isAuthenticated: false,
};

const AuthContext = createContext(defaultAuthValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      setIsLoaded(true);
      return;
    }
    apiFetch<AuthUser>("/auth/me")
      .then((data) => setUser({ ...data, initials: getInitials(data.name) }))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoaded(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    const me = await apiFetch<AuthUser>("/auth/me");
    const userData = { ...me, initials: getInitials(me.name) };
    setUser(userData);
    return userData; // biar LoginForm bisa tau role-nya buat redirect ke halaman yang benar
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isLoaded, login, logout, isAuthenticated: Boolean(user) }),
    [user, isLoaded, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) return defaultAuthValue;
  return context;
}
