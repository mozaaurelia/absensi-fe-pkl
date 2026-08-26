"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { getStaticHolidayMap } from "@/lib/holidays";

type Holiday = {
  id: string;
  date: string;
  name: string;
};

type CalendarEvent = {
  id: string;
  event_date: string;
  title: string;
  description?: string | null;
};

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  return [...blanks, ...days];
}

function dateKey(value: string): string {
  return String(value).slice(0, 10);
}

export default function CalendarCard() {
  const { months, daysShort, t } = useLanguage();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDate = today.getDate();

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    apiFetch<Holiday[]>("/holidays")
      .then(setHolidays)
      .catch(() => {});
    apiFetch<CalendarEvent[]>("/calendar-events")
      .then(setEvents)
      .catch(() => {});
  }, []);

  const calendarDays = useMemo(
    () => getCalendarDays(year, month),
    [year, month]
  );

  const markers = useMemo(() => {
    const map: Record<string, "holiday" | "event"> = {};
    const staticMap = getStaticHolidayMap(year);
    Object.keys(staticMap).forEach((k) => { map[k] = "holiday"; });
    holidays.forEach((h) => {
      map[dateKey(h.date)] = "holiday";
    });
    events.forEach((e) => {
      map[dateKey(e.event_date)] = "event";
    });
    return map;
  }, [holidays, events, year]);

  const holidayNames = useMemo(() => {
    const map: Record<string, string> = {};
    const staticMap = getStaticHolidayMap(year);
    Object.entries(staticMap).forEach(([k, v]) => { map[k] = v.name; });
    holidays.forEach((h) => { map[dateKey(h.date)] = h.name; });
    return map;
  }, [holidays, year]);

  const upcoming = useMemo(() => {
    const todayKey = dateKey(new Date().toISOString());
    const merged = [
      ...holidays.map((h) => ({ date: dateKey(h.date), name: h.name, kind: "holiday" as const })),
      ...events.map((e) => ({ date: dateKey(e.event_date), name: e.title, kind: "event" as const })),
    ]
      .filter((i) => i.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
    return merged.map((i) => ({
      ...i,
      label: new Date(i.date + "T00:00:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
    }));
  }, [holidays, events]);

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
          const key = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
          const marker = day ? markers[key] : undefined;
          const isHoliday = marker === "holiday";
          const holidayName = day ? holidayNames[key] : undefined;
          return (
            <div
              key={`${day ?? "blank"}-${index}`}
              className={`h-10 rounded-2xl flex flex-col items-center justify-center relative group ${
                isToday
                  ? "bg-[#1E3A5F] text-white shadow-sm"
                  : isHoliday && day
                  ? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 font-semibold"
                  : day
                  ? "bg-gray-50 dark:bg-gray-700/50"
                  : "bg-transparent"
              }`}
            >
              {day || ""}
              {isHoliday && day && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500" />
              )}
              {isHoliday && day && holidayName && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-[10px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                  {holidayName}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {upcoming.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {t("calendarCard.upcoming")}
          </p>
          {upcoming.map((item, idx) => (
            <div
              key={`${item.date}-${idx}`}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.kind === "holiday" ? "bg-red-500" : "bg-blue-500"
                }`}
              />
              <span className="font-medium shrink-0">{item.label}</span>
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 text-xs text-gray-500 dark:text-gray-400">
        {t("calendarCard.note")}
      </div>
    </div>
  );
}