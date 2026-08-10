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
import { getToken, setToken, removeToken } from "@/lib/tokenStorage";

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
  login: (email: string, password: string, remember?: boolean) => Promise<AuthUser>;
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

function normalizeUser(data: Partial<AuthUser> & { role_name?: string }): AuthUser {
  const name = data.name ?? data.nama ?? "";
  return {
    ...data,
    name,
    role: data.role ?? data.role_name,
    initials: getInitials(name),
  };
}

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
    const token = getToken();
    if (!token) {
      setIsLoaded(true);
      return;
    }
    apiFetch<AuthUser>("/auth/me")
      .then((data) => {
        if (getToken() === token) {
          setUser(normalizeUser(data));
        }
      })
      .catch(() => removeToken())
      .finally(() => setIsLoaded(true));
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember = true) => {
      const result = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(result.token, remember);
      const me = await apiFetch<AuthUser>("/auth/me");
      const userData = normalizeUser(me);
      setUser(userData);
      return userData; // biar LoginForm bisa tau role-nya buat redirect ke halaman yang benar
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
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
