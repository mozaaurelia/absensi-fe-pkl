"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CheckOutButton({ onClick, checkedOut = false, clockOpen = true }) {
  const { t } = useLanguage();
  const isGray = checkedOut || !clockOpen;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-3"
    >
      <span
        className={`relative w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 group-active:scale-95 ${
          isGray
            ? "bg-linear-to-br from-gray-400 to-gray-500 shadow-gray-900/20"
            : "bg-linear-to-br from-red-500 to-rose-600 shadow-red-900/20"
        }`}
      >
        {!isGray && (
          <span className="absolute inset-0 rounded-2xl bg-red-400/30 animate-ping" />
        )}
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="relative">
          <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="15" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3" y="15" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="11" y="11" width="2" height="2" rx="0.5" fill="currentColor" />
          <rect x="15" y="11" width="2" height="2" rx="0.5" fill="currentColor" />
          <rect x="11" y="15" width="2" height="2" rx="0.5" fill="currentColor" />
          <rect x="15" y="15" width="2" height="2" rx="0.5" fill="currentColor" />
        </svg>
      </span>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {checkedOut ? t("checkOutButton.done") : t("checkOutButton.label")}
      </span>
    </button>
  );
}