"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { getStaticHolidayMap } from "@/lib/holidays";

type ApiHoliday = { id: string; date: string; name: string };

let apiHolidaysCache: Record<string, string> | null = null;
let apiHolidaysPromise: Promise<Record<string, string>> | null = null;

function fetchApiHolidays(): Promise<Record<string, string>> {
  if (apiHolidaysCache) return Promise.resolve(apiHolidaysCache);
  if (!apiHolidaysPromise) {
    apiHolidaysPromise = apiFetch<ApiHoliday[]>("/holidays")
      .then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((h) => {
          map[String(h.date).slice(0, 10)] = h.name;
        });
        apiHolidaysCache = map;
        return map;
      })
      .catch(() => {
        apiHolidaysPromise = null;
        return {};
      });
  }
  return apiHolidaysPromise;
}

function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  id?: string;
}

export default function DatePicker({ value, onChange, placeholder, min }: Props) {
  const { months, daysShort, locale, t } = useLanguage();
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [apiHolidays, setApiHolidays] = useState<Record<string, string>>(apiHolidaysCache ?? {});
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [view, setView] = useState(() => {
    const base = value ? new Date(value + "T00:00:00") : new Date();
    return { y: base.getFullYear(), m: base.getMonth() };
  });
  const rootRef = useRef<HTMLDivElement>(null);

  const staticMap = useMemo(() => getStaticHolidayMap(view.y), [view.y]);

  const mergedHolidays = useMemo(() => {
    const merged: Record<string, string> = {};
    Object.entries(staticMap).forEach(([k, v]) => {
      merged[k] = locale === "en" ? v.nameEn : v.name;
    });
    Object.entries(apiHolidays).forEach(([k, v]) => {
      merged[k] = v;
    });
    return merged;
  }, [staticMap, apiHolidays, locale]);

  useEffect(() => {
    fetchApiHolidays().then(setApiHolidays);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open && value) {
      const base = new Date(value + "T00:00:00");
      setView({ y: base.getFullYear(), m: base.getMonth() });
    }
  }, [open, value]);

  const grid = useMemo(() => {
    const firstDow = new Date(view.y, view.m, 1).getDay();
    const offset = (firstDow + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells: ({ day: number; dateKey: string } | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, dateKey: dateKey(view.y, view.m, d) });
    }
    return cells;
  }, [view]);

  const move = (delta: number) =>
    setView(({ y, m }) => {
      const nm = m + delta;
      return { y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 };
    });

  const todayKeyVal = dateKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  const mondayFirstDays = [
    daysShort[1],
    daysShort[2],
    daysShort[3],
    daysShort[4],
    daysShort[5],
    daysShort[6],
    daysShort[0],
  ];

  const displayLabel = value
    ? new Date(value + "T00:00:00").toLocaleDateString(
        locale === "id" ? "id-ID" : "en-GB",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-left outline-none focus:border-[#1E3A5F] transition-colors"
      >
        <span className={value ? "text-gray-700 dark:text-gray-100" : "text-gray-400"}>
          {displayLabel || placeholder || "--/--/----"}
        </span>
        <FiCalendar size={15} className="text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-72 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
              {months[view.m]} {view.y}
            </p>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="prev"
                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setView({ y: new Date().getFullYear(), m: new Date().getMonth() })
                }
                className="text-[9px] font-semibold text-[#1E3A5F] dark:text-blue-300 px-1.5 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                {t("datePicker.today")}
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="next"
                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-0.5">
            {mondayFirstDays.map((d, i) => (
              <div
                key={d}
                className={`text-center text-[9px] font-semibold uppercase ${
                  i === 6 ? "text-red-400" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {grid.map((cell, i) => {
              if (!cell) return <div key={`b-${i}`} />;
              const dow = new Date(cell.dateKey + "T00:00:00").getDay();
              const isSunday = dow === 0;
              const holidayName = mergedHolidays[cell.dateKey];
              const isHoliday = !!holidayName;
              const isToday = cell.dateKey === todayKeyVal;
              const isSelected = cell.dateKey === value;
              const isDisabledByMin = !!min && cell.dateKey < min;
              const isDisabled = isDisabledByMin || isHoliday;

              return (
                <div key={cell.dateKey} className="relative flex justify-center">
                  <button
                    type="button"
                    disabled={isDisabled}
                    onMouseEnter={() => isHoliday && setHoveredKey(cell.dateKey)}
                    onMouseLeave={() => setHoveredKey(null)}
                    onClick={() => {
                      if (isDisabled) return;
                      onChange(cell.dateKey);
                      setOpen(false);
                    }}
                    className={`relative h-8 w-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                      isSelected && !isHoliday
                        ? "bg-[#1E3A5F] text-white font-bold"
                        : isDisabled
                          ? isHoliday
                            ? "text-red-400 dark:text-red-400 cursor-not-allowed"
                            : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : isSunday
                            ? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                            : isToday
                              ? "ring-1 ring-[#1E3A5F] dark:ring-blue-400 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                    }`}
                  >
                    {cell.day}
                    {isHoliday && !isSelected && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
                    )}
                  </button>

                  {isHoliday && hoveredKey === cell.dateKey && (
                    <div
                      className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-[11px] font-semibold whitespace-nowrap pointer-events-none shadow-md ${
                        isDark
                          ? "bg-gray-700 text-gray-100 border border-gray-600"
                          : "bg-white text-[#1E3A5F] border border-gray-200"
                      }`}
                    >
                      {holidayName}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1 ${
                          isDark
                            ? "bg-gray-700 border-b border-r border-gray-600"
                            : "bg-white border-b border-r border-gray-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-[9px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {t("datePicker.holidayLegend")}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#1E3A5F]" />
              {t("datePicker.selected")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
