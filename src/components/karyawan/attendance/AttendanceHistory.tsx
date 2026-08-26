"use client";

import { useState, useEffect, useMemo } from "react";
import { FiList, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { getMyAttendance, AttendanceRecord } from "@/lib/services/attendance";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getDateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function normalizeKey(date?: string | null) {
  if (!date) return null;
  const p = String(date).split("-");
  if (p.length !== 3) return null;
  return `${Number(p[0])}-${Number(p[1])}-${Number(p[2])}`;
}

function toHHMM(time?: string | null) {
  if (!time) return "-";
  const parts = time.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
}

function statusOf(record?: AttendanceRecord, isWeekend?: boolean, inFuture?: boolean) {
  if (!record) {
    if (isWeekend) return { key: "-", color: "bg-gray-100 text-gray-500" };
    if (inFuture) return { key: "scheduled", color: "bg-gray-100 text-gray-500" };
    return { key: "notCheckedIn", color: "bg-amber-100 text-amber-700" };
  }
  switch (record.status) {
    case "hadir":
      return { key: "present", color: "bg-green-100 text-green-700" };
    case "telat":
      return { key: "late", color: "bg-amber-100 text-amber-700" };
    case "alpha":
      return { key: "notCheckedIn", color: "bg-amber-100 text-amber-700" };
    default:
      return { key: "notCheckedIn", color: "bg-amber-100 text-amber-700" };
  }
}

export default function AttendanceHistory({ selectedDate }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { months, daysFull, t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMyAttendance()
      .then((data) => {
        if (!cancelled) setRecords(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || t("common.loadErrorDesc"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const { logs, period } = useMemo(() => {
    const monday = getMonday(selectedDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const now = new Date();

    const periodText = `${monday.getDate()} ${months[monday.getMonth()]} - ${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;

    const logs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = getDateKey(d);
      const record = records.find((r) => normalizeKey(r.date) === dateKey);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const inFuture = d.getTime() > startOfToday;
      const status = statusOf(record, isWeekend, inFuture);
      logs.push({
        no: i + 1,
        date: `${daysFull[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
        dateKey,
        masuk: record ? toHHMM(record.clock_in_time) : "-",
        pulang: record ? toHHMM(record.clock_out_time) : "-",
        lokasi: record?.location_name || null,
        statusKey: status.key,
        color: status.color,
      });
    }

    return { logs, period: periodText };
  }, [selectedDate, records, months, daysFull]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <FiList size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("attendanceHistory.title")}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t("attendanceHistory.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-400">
          <FiCalendar size={13} />
          <span>{period}</span>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-2xl bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <table className="w-full text-sm text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="text-left text-xs text-white bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a]">
              <th className="py-2 px-3 font-medium w-8">{t("attendanceHistory.no")}</th>
              <th className="py-2 px-3 font-medium">{t("attendanceHistory.photo")}</th>
              <th className="py-2 px-3 font-medium">{t("attendanceHistory.date")}</th>
              <th className="py-2 px-3 font-medium">{t("attendanceHistory.checkIn")}</th>
              <th className="py-2 px-3 font-medium">{t("attendanceHistory.checkOut")}</th>
              <th className="py-2 px-3 font-medium">{t("attendanceHistory.location")}</th>
              <th className="py-2 px-3 font-medium">{t("attendanceHistory.status")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr
                key={log.date}
                className="border-b border-gray-100 dark:border-gray-700 last:border-0 opacity-0 animate-fade-slide-in"
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <td className="py-2 px-3 text-gray-400 text-xs font-medium">{log.no}</td>
                <td className="py-2 px-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </td>
                <td className="py-2 px-3 text-gray-800 dark:text-gray-100 font-medium whitespace-nowrap">{log.date}</td>
                <td className="py-2 px-3 text-gray-500">{log.masuk}</td>
                <td className="py-2 px-3 text-gray-500">{log.pulang}</td>
                <td className="py-2 px-3 max-w-35">
                  {log.lokasi ? (
                    <span className="text-xs text-gray-500 truncate block" title={log.lokasi}>
                      {log.lokasi}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="py-2 px-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${log.color}`}>
                    {log.statusKey === "-" ? "-" : t(`attendanceHistory.${log.statusKey}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {logs.map((log, i) => (
          <div
            key={log.date}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 opacity-0 animate-fade-slide-in"
            style={{ animationDelay: `${0.2 + i * 0.08}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{log.date.split(",")[0]}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{log.date.split(",")[1]?.trim()}</p>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${log.color}`}>
                {log.statusKey === "-" ? "-" : t(`attendanceHistory.${log.statusKey}`)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{t("attendanceHistory.checkIn")}</p>
                <p className="text-sm font-bold text-[#1E3A5F] dark:text-blue-300">{log.masuk}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{t("attendanceHistory.checkOut")}</p>
                <p className="text-sm font-bold text-[#1E3A5F] dark:text-blue-300">{log.pulang}</p>
              </div>
            </div>
            {log.lokasi && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">📍 {log.lokasi}</p>
            )}
          </div>
        ))}
      </div>

      {(loading || error) && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-gray-300 border-t-[#4F46E5] rounded-full animate-spin" />
              {t("common.loading")}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FiAlertCircle size={13} />
              {error}
            </span>
          )}
        </div>
      )}
    </div>
  );
}