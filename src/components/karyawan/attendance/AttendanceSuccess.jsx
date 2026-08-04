"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AttendanceSuccess({ mode = "in", onFinish }) {
  const { locale, t } = useLanguage();
  const isCheckIn = mode === "in";
  const now = new Date().toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-500/15 flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
        {isCheckIn ? t("attendanceSuccess.checkIn") : t("attendanceSuccess.checkOut")}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-1 max-w-xs">
        {t("attendanceSuccess.desc")}
      </p>
      <p className="text-2xl font-bold text-[#1E3A5F] dark:text-blue-300 mb-6 tabular-nums">
        {now}
      </p>

      <button
        onClick={onFinish}
        className="w-full bg-linear-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-blue-900/20"
      >
        {t("attendanceSuccess.backHome")}
      </button>
    </div>
  );
}