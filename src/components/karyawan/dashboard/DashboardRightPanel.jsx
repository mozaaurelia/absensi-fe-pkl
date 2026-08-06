"use client";

import { FiArrowRight, FiBell, FiPlus } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardRightPanel() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-[#1E3A5F] text-white rounded-3xl p-6 shadow-[0_24px_60px_rgba(30,58,95,0.18)] overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
              {t("dashboardPanel.notification.title")}
            </p>
            <h3 className="mt-3 text-xl font-bold leading-tight">
              {t("dashboardPanel.notification.heading")}
            </h3>
          </div>
          <button className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200 hover:text-white transition">
            {t("dashboardPanel.notification.viewAll")}
          </button>
        </div>

        <div className="rounded-[30px] bg-white/10 p-5 border border-white/15">
          <p className="text-sm font-semibold text-white mb-2">{t("dashboardPanel.notification.itemTitle")}</p>
          <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
            {t("dashboardPanel.notification.itemDesc")}
          </p>
          <div className="flex items-center justify-between text-[11px] uppercase text-blue-100/80 font-semibold">
            <span>{t("dashboardPanel.notification.itemTime")}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <FiArrowRight size={14} /> {t("dashboardPanel.notification.open")}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {t("dashboardPanel.tasks.title")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("dashboardPanel.tasks.subtitle")}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#1E3A5F] text-white px-4 py-2 text-xs font-semibold hover:bg-[#162f50] transition">
            <FiPlus size={14} /> {t("dashboardPanel.tasks.add")}
          </button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="rounded-3xl border border-gray-100 dark:border-gray-700 p-4 text-sm text-gray-700 dark:text-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{t(`dashboardPanel.tasks.task${index}.title`)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {t(`dashboardPanel.tasks.task${index}.time`)}
                  </p>
                </div>
                <span className="h-3 w-3 rounded-full bg-cyan-500 mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
