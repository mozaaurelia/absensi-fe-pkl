"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STORAGE_KEY = "absensi_user";

function loadUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(data) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

const defaultAuthValue = {
  user: null,
  isLoaded: false,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  isAuthenticated: false,
};

const AuthContext = createContext(defaultAuthValue);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUser(loadUser());
    setIsLoaded(true);
  }, []);

  const login = useCallback((email, role) => {
    const userData = {
      email,
      role,
      nama: role === "karyawan" ? "Andi Pratama" : role === "supervisor" ? "Budi Santoso" : "Citra Dewi",
      nik: role === "karyawan" ? "EMP-00124" : role === "supervisor" ? "SPV-001" : "ADM-001",
      jabatan: role === "karyawan" ? "Staff Operasional" : role === "supervisor" ? "Supervisor" : "HRD Manager",
      divisi: "Operasional",
      atasan: "Surya Prasetya",
      avatar: null,
    };
    userData.initials = getInitials(userData.nama);
    setUser(userData);
    saveUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateProfile = useCallback((data) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      if (data.nama) updated.initials = getInitials(data.nama);
      saveUser(updated);
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoaded,
      login,
      logout,
      updateProfile,
      isAuthenticated: Boolean(user),
    }),
    [user, isLoaded, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) return defaultAuthValue;
  return context;
}
