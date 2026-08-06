"use client";

import { useState, useEffect } from "react";
import { FiBarChart2, FiTarget } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import {
  getWeeklyStats,
  formatHours,
  formatHoursEn,
} from "@/lib/workHours";

export default function WeeklyWork() {
  const { daysShort, lang, t } = useLanguage();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats(getWeeklyStats());
    const interval = setInterval(() => {
      setStats(getWeeklyStats());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const { days, dailyPercentages, totalMinutes, progress, targetHours } = stats;
  const fmt = lang === "en" ? formatHoursEn : formatHours;

  const dayLabels = days.map((d) => daysShort[d.getDay()]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <FiBarChart2 size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("weeklyWork.title")}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("weeklyWork.target")}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FiTarget size={13} />
          {t("weeklyWork.progress")}
        </div>
        <p className="text-xs font-bold text-[#1E3A5F] dark:text-blue-400">{progress}%</p>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-[#1E3A5F] to-blue-500 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-6">
        {fmt(totalMinutes)} / {targetHours}{lang === "en" ? "h" : "j"}
      </p>

      <div className="flex items-end justify-between gap-3 h-32">
        {dailyPercentages.map((pct, i) => (
          <div
            key={dayLabels[i]}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-end h-24 overflow-hidden">
              <div
                className="w-full rounded-lg animate-bar-grow transition-[height] duration-700"
                style={{
                  height: `${pct}%`,
                  animationDelay: `${0.3 + i * 0.1}s`,
                  background: `linear-gradient(to top, #1E3A5F, ${
                    pct > 70 ? "#3b82f6" : pct > 40 ? "#60a5fa" : "#93c5fd"
                  })`,
                }}
              />
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{dayLabels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
