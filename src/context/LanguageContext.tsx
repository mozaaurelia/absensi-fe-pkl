"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { id } from "@/locales/id";
import { en } from "@/locales/en";

const STORAGE_KEY = "absensi_lang";
const LEGACY_STORAGE_KEY = "lang";
const translations: Record<string, typeof id> = { id, en };

function loadLang(): "id" | "en" {
  if (typeof window === "undefined") return "id";
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return saved === "en" ? "en" : "id";
  } catch {
    return "id";
  }
}

function lookup(obj: any, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

type LanguageContextValue = {
  lang: string;
  locale: string;
  months: string[];
  daysShort: string[];
  daysFull: string[];
  setLang: (lang: string) => void;
  toggleLang: () => void;
  t: (key: string, params?: Record<string, string | number>) => any;
};

const defaultLanguageValue: LanguageContextValue = {
  lang: "id",
  locale: "id-ID",
  months: id.common.months,
  daysShort: id.common.daysShort,
  daysFull: id.common.daysFull,
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
};

const LanguageContext = createContext(defaultLanguageValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState("id");

  useEffect(() => {
    setLangState(loadLang());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  const setLang = useCallback((l: string) => {
    setLangState(l === "en" ? "en" : "id");
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "id" ? "en" : "id"));
  }, []);

  const dict = translations[lang] || id;

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let str = lookup(dict, key) ?? lookup(id, key) ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.split(`{${k}}`).join(String(v));
        }
      }
      return str;
    },
    [dict]
  );

  const value = useMemo(
    () => ({
      lang,
      locale: lang === "id" ? "id-ID" : "en-US",
      months: dict.common.months || id.common.months,
      daysShort: dict.common.daysShort || id.common.daysShort,
      daysFull: dict.common.daysFull || id.common.daysFull,
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t, dict]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext) || defaultLanguageValue;
}
