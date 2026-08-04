"use client";

import { FiCalendar, FiSun, FiBell, FiSend } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function Agenda() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <FiCalendar size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("agenda.title")}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("agenda.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-linear-to-br from-green-50 to-green-100/60 rounded-xl px-4 py-4 opacity-0 animate-fade-slide-in" style={{ animationDelay: "0.2s" }}>
          <div className="w-8 h-8 rounded-lg bg-green-200 text-green-700 flex items-center justify-center mb-2">
            <FiSun size={16} />
          </div>
          <p className="text-xs text-green-700 font-semibold mb-0.5">{t("agenda.shiftActive")}</p>
          <p className="text-sm font-bold text-green-800">09:00 - 18:00</p>
        </div>
        <div className="bg-linear-to-br from-blue-50 to-blue-100/60 rounded-xl px-4 py-4 opacity-0 animate-fade-slide-in" style={{ animationDelay: "0.25s" }}>
          <div className="w-8 h-8 rounded-lg bg-blue-200 text-blue-700 flex items-center justify-center mb-2">
            <FiCalendar size={16} />
          </div>
          <p className="text-xs text-[#1E3A5F] font-semibold mb-0.5">{t("agenda.leaveRemaining")}</p>
          <p className="text-sm font-bold text-[#1E3A5F]">{t("agenda.daysLeft")}</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-amber-50 to-amber-100/60 rounded-xl px-4 py-4 mb-5 opacity-0 animate-fade-slide-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <FiBell size={16} />
          </div>
          <div>
            <p className="text-xs text-amber-700 font-semibold mb-1">{t("agenda.reminder")}</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              {t("agenda.reminderText")}
            </p>
          </div>
        </div>
      </div>

      <button className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#16304f] transition-all active:scale-95 flex items-center justify-center gap-2">
        <FiSend size={15} />
        {t("agenda.submit")}
      </button>
    </div>
  );
}
