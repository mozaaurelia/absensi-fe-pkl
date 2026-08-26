"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

type Holiday = { id: string; date: string; name: string };
type CalendarEvent = { id: string; event_date: string; title: string };

function key(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function InfoCalendar() {
  const { months, daysShort, t } = useLanguage();
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [holidays, setHolidays] = useState<Record<string, string>>({});
  const [events, setEvents] = useState<Record<string, string>>({});

  useEffect(() => {
    apiFetch<Holiday[]>("/holidays")
      .then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((h) => { map[String(h.date).slice(0, 10)] = h.name; });
        setHolidays(map);
      })
      .catch(() => {});
    apiFetch<CalendarEvent[]>("/calendar-events")
      .then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((e) => { map[String(e.event_date).slice(0, 10)] = e.title; });
        setEvents(map);
      })
      .catch(() => {});
  }, []);

  const grid = useMemo(() => {
    const firstDow = new Date(view.y, view.m, 1).getDay(); // 0=Sun
    const offset = (firstDow + 6) % 7; // Monday-first
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells: ({ day: number; dateKey: string } | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, dateKey: key(view.y, view.m, d) });
    return cells;
  }, [view]);

  const monthItems = useMemo(() => {
    const prefix = `${view.y}-${String(view.m + 1).padStart(2, "0")}-`;
    const items = [
      ...Object.entries(holidays).filter(([k]) => k.startsWith(prefix)).map(([k, name]) => ({ dateKey: k, name, kind: "holiday" as const })),
      ...Object.entries(events).filter(([k]) => k.startsWith(prefix)).map(([k, name]) => ({ dateKey: k, name, kind: "event" as const })),
    ];
    return items.sort((a, b) => a.dateKey.localeCompare(b.dateKey)).slice(0, 4);
  }, [holidays, events, view]);

  const move = (delta: number) =>
    setView(({ y, m }) => {
      const nm = m + delta;
      return { y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 };
    });

  const mondayFirstDays = [daysShort[1], daysShort[2], daysShort[3], daysShort[4], daysShort[5], daysShort[6], daysShort[0]];
  const todayKeyVal = key(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {months[view.m]} {view.y}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => move(-1)}
            aria-label={t("common.previous")}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiChevronLeft size={15} />
          </button>
          <button
            onClick={() => setView({ y: today.getFullYear(), m: today.getMonth() })}
            className="text-[10px] font-semibold text-[#1E3A5F] dark:text-blue-300 px-2 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
          >
            {t("calendarCard.todayLabel")}
          </button>
          <button
            onClick={() => move(1)}
            aria-label={t("common.next")}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {mondayFirstDays.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10px] font-semibold uppercase ${i === 6 ? "text-red-400" : "text-gray-400 dark:text-gray-500"}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, i) => {
          if (!cell) return <div key={`b-${i}`} />;
          const dow = new Date(cell.dateKey + "T00:00:00").getDay();
          const isSunday = dow === 0;
          const holidayName = holidays[cell.dateKey];
          const eventName = events[cell.dateKey];
          const isRed = isSunday || !!holidayName;
          const isToday = cell.dateKey === todayKeyVal;
          return (
            <div
              key={cell.dateKey}
              title={[holidayName, eventName].filter(Boolean).join(" · ") || undefined}
              className={`relative h-9 rounded-lg flex items-center justify-center text-xs font-medium cursor-default ${
                isToday
                  ? "bg-[#1E3A5F] text-white font-bold shadow-sm"
                  : isRed
                    ? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              {cell.day}
              {eventName && !isToday && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-500" />
              )}
              {holidayName && !isSunday && (
                <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-red-400" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-red-200 dark:bg-red-500/30" />
          Tanggal Merah
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Agenda
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1E3A5F]" />
          Hari Ini
        </span>
      </div>

      {monthItems.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {monthItems.map((item) => (
            <div key={`${item.kind}-${item.dateKey}`} className="flex items-center gap-2 text-[11px]">
              <span
                className={`shrink-0 w-11 text-center rounded px-1 py-0.5 font-semibold ${
                  item.kind === "holiday"
                    ? "bg-red-50 dark:bg-red-500/10 text-red-500"
                    : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300"
                }`}
              >
                {item.dateKey.slice(8)}
              </span>
              <span className="truncate text-gray-600 dark:text-gray-300">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
