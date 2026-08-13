"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { AttendanceRecord } from "@/lib/services/attendance";
import { isLateRecord } from "@/lib/attendanceStats";

interface Props {
  records: AttendanceRecord[];
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}j`;
  return `${h}j ${m}m`;
}

export default function HistorySummary({ records }: Props) {
  const { lang, t } = useLanguage();
  // Date.now() is impure; capture it in state on the client after mount.
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => { setNowMs(Date.now()); }, []);

  const stats = useMemo(() => {
    const presentDays = records.filter((r) => r.clock_in_time).length;

    const totalMinutes = records.reduce((sum, r) => {
      if (!r.clock_in_time) return sum;
      const start = new Date(r.clock_in_time).getTime();
      const end = r.clock_out_time
        ? new Date(r.clock_out_time).getTime()
        : (nowMs ?? start);
      const diff = end - start;
      if (diff < 0) return sum;
      return sum + Math.min(diff / 60000, 8 * 60);
    }, 0);

    const lateCount = records.filter((r) => isLateRecord(r, 9)).length;

    return { presentDays, totalMinutes, lateCount };
  }, [records, nowMs]);

  const statsList = [
    { label: t("historySummary.presentDays"), value: String(stats.presentDays) },
    {
      label: t("historySummary.totalHours"),
      value: lang === "en" ? `${Math.floor(stats.totalMinutes / 60)}h ${Math.round(stats.totalMinutes % 60)}m` : formatHours(stats.totalMinutes),
    },
    { label: t("historySummary.late"), value: `${stats.lateCount} ${t("historySummary.daysUnit")}` },
    { label: t("historySummary.permitSick"), value: "-" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsList.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{stat.label}</p>
          <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
