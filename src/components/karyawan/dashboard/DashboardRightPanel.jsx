"use client";

import { useState } from "react";
import { FiBell, FiCalendar, FiChevronLeft, FiChevronRight, FiSearch, FiSun } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardRightPanel() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  const slides = [
    {
      icon: <FiSun size={18} />,
      iconBox: "bg-green-200 text-green-700",
      label: t("dashboardPanel.notification.shiftActive"),
      labelColor: "text-green-300",
      value: t("dashboardPanel.notification.shiftTime"),
    },
    {
      icon: <FiCalendar size={18} />,
      iconBox: "bg-blue-200 text-[#1E3A5F]",
      label: t("dashboardPanel.notification.leaveRemaining"),
      labelColor: "text-blue-200",
      value: t("dashboardPanel.notification.daysLeft"),
    },
    {
      icon: <FiBell size={18} />,
      iconBox: "bg-amber-200 text-amber-700",
      label: t("dashboardPanel.notification.reminder"),
      labelColor: "text-amber-300",
      value: t("dashboardPanel.notification.reminderText"),
    },
  ];

  const slide = slides[index];
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="space-y-6">
      <div className="bg-[#1E3A5F] text-white rounded-3xl p-6 shadow-[0_24px_60px_rgba(30,58,95,0.18)] overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
              {t("dashboardPanel.notification.title")}
            </p>
          </div>
        </div>

        <div className="relative px-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#1E3A5F] shadow-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiChevronLeft size={18} />
          </button>

          <div
            key={index}
            className="rounded-[30px] bg-white/10 p-6 border border-white/15 min-h-[110px] flex items-center animate-fade-slide-in"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${slide.iconBox}`}>
                {slide.icon}
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${slide.labelColor}`}>{slide.label}</p>
                <p className="text-base font-bold text-white leading-snug">{slide.value}</p>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            aria-label="Next"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#1E3A5F] shadow-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiChevronRight size={18} />
          </button>
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
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder={t("dashboardPanel.tasks.searchPlaceholder")}
              className="w-44 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-8 pr-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
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
