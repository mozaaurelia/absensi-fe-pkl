"use client";

import { useLanguage } from "@/context/LanguageContext";

interface Props {
  dark?: boolean;
  className?: string;
}

export default function LanguageToggle({ dark = true, className = "" }: Props) {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      aria-label="Change Language"
      title={lang === "id" ? "English" : "Indonesia"}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
        dark
          ? "bg-white/15 text-white hover:bg-white/25"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15.5 15.5 0 0 1 0 18 15.5 15.5 0 0 1 0-18" />
      </svg>
      <span
        className={`absolute -bottom-0.5 right-0.5 text-[9px] font-bold rounded px-0.5 leading-tight ${
          dark ? "bg-white/20" : "bg-gray-200"
        }`}
      >
        {lang === "id" ? "ID" : "EN"}
      </span>
    </button>
  );
}
