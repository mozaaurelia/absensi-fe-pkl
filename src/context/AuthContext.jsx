"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const defaultAuthValue = {
  user: null,
  isLoaded: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
};

const AuthContext = createContext(defaultAuthValue);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = window.sessionStorage.getItem("auth_user");
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Gagal memuat sesi auth:", error);
      window.sessionStorage.removeItem("auth_user");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
    } finally {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true);
    }
  }, []);

  const login = (email, role) => {
    const userData = { email, role };
    setUser(userData);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("auth_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("auth_user");
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoaded,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, isLoaded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    return defaultAuthValue;
  }

  return context;
}
