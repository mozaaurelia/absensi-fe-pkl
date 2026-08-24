"use client";

import { useLanguage } from "@/context/LanguageContext";
import { addDays, todayISO } from "./types";

interface DateCarouselProps {
  value: string;
  onChange: (isoDate: string) => void;
}

export default function DateCarousel({ value, onChange }: DateCarouselProps) {
  const { t, locale } = useLanguage();

  const label = new Date(`${value}T00:00:00`).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const isToday = value === todayISO();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(addDays(value, -1))}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          aria-label={t("adminScheduling.prevDay")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="min-w-56 text-center px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{label}</p>
        </div>

        <button
          type="button"
          onClick={() => onChange(addDays(value, 1))}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          aria-label={t("adminScheduling.nextDay")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {!isToday && (
        <button
          type="button"
          onClick={() => onChange(todayISO())}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#1E3A5F]/20 text-[#1E3A5F] dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
        >
          {t("adminScheduling.today")}
        </button>
      )}
    </div>
  );
}
