"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function HistoryHeader() {
  const { user } = useAuth();
  const { months, t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("historyHeader.title")}
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {t("historyHeader.desc")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("historyHeader.dateRange")}</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            1 {months[5]} 2026 - 30 {months[5]} 2026
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1E3A5F] font-bold text-sm flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user?.initials || "AP"
          )}
        </div>
      </div>
    </div>
  );
}
