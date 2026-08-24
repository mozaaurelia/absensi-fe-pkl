"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DateCarousel from "./DateCarousel";
import type { EmployeeWithSchedule, WorkingDayPattern } from "./types";
import { getScheduleOnDate, isWorkingDayFor } from "./types";

interface DailyScheduleTableProps {
  rows: EmployeeWithSchedule[];
  patterns: WorkingDayPattern[];
  loading: boolean;
  selectedDate: string;
  onSelectedDateChange: (isoDate: string) => void;
}

export default function DailyScheduleTable({
  rows,
  patterns,
  loading,
  selectedDate,
  onSelectedDateChange,
}: DailyScheduleTableProps) {
  const { t, locale } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
            {t("adminScheduling.dailyTitle")}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("adminScheduling.dailyDesc")}
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("adminScheduling.searchPlaceholder")}
          className="w-full sm:w-64 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3.5 py-2.5 text-xs text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors"
        />
      </div>

      <DateCarousel value={selectedDate} onChange={onSelectedDateChange} />

      {loading ? (
        <div className="h-56 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-12">
          {t("adminScheduling.noData")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/60 text-left text-xs uppercase tracking-wide text-gray-400 dark:text-gray-400">
                <th className="px-4 py-3 font-semibold">{t("adminScheduling.employee")}</th>
                <th className="px-4 py-3 font-semibold">{t("adminScheduling.colDepartment")}</th>
                <th className="px-4 py-3 font-semibold">{t("adminScheduling.shift")}</th>
                <th className="px-4 py-3 font-semibold">{t("adminScheduling.hours")}</th>
                <th className="px-4 py-3 font-semibold">{t("adminScheduling.location")}</th>
                <th className="px-4 py-3 font-semibold">{t("adminScheduling.colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const works = isWorkingDayFor(r.schedule, patterns, selectedDate);
                const info = getScheduleOnDate(r.schedule, selectedDate);
                return (
                  <tr
                    key={r.id}
                    className="border-t border-gray-50 dark:border-gray-700 hover:bg-blue-50/40 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {r.department}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {works ? info.shiftName : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {works && info.startTime ? `${info.startTime} - ${info.endTime}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {works ? info.locationName : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {works ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                          {t("adminScheduling.statusWork")}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300">
                          {t("adminScheduling.statusOff")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">
        {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
