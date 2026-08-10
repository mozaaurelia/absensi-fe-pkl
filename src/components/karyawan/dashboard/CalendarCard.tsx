"use client";

import { useMemo } from "react";
import { FiCalendar } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  return [...blanks, ...days];
}

export default function CalendarCard() {
  const { months, daysShort, t } = useLanguage();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDate = today.getDate();

  const calendarDays = useMemo(
    () => getCalendarDays(year, month),
    [year, month]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#1E3A5F]/30 text-[#1E3A5F] dark:text-blue-300 flex items-center justify-center">
          <FiCalendar size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {t("calendarCard.title")}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("calendarCard.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {months[month]} {year}
        </p>
        <span className="text-[11px] font-medium text-[#1E3A5F] dark:text-blue-300 bg-blue-100 dark:bg-[#1E3A5F]/30 px-2.5 py-1 rounded-full">
          {t("calendarCard.todayLabel")}: {currentDate}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2 text-[11px] uppercase text-gray-500 dark:text-gray-400 mb-2">
        {daysShort.map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-700 dark:text-gray-200">
        {calendarDays.map((day, index) => {
          const isToday = day === currentDate;
          return (
            <div
              key={`${day ?? "blank"}-${index}`}
              className={`h-10 rounded-2xl flex items-center justify-center ${
                isToday
                  ? "bg-[#1E3A5F] text-white shadow-sm"
                  : day
                  ? "bg-gray-50 dark:bg-gray-700/50"
                  : "bg-transparent"
              }`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>

    </div>
  );
}
