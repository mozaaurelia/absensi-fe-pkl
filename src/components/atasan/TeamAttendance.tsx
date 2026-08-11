"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { AttendanceRecord } from "@/lib/services/attendance";
import { isLateRecord } from "@/lib/attendanceStats";

interface Props {
  records: AttendanceRecord[];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toHHMM(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function statusBadge(status: string) {
  switch (status) {
    case "late":
      return "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30";
    case "present":
      return "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-500/30";
    case "absent":
      return "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30";
    default:
      return "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
  }
}

export default function TeamAttendance({ records }: Props) {
  const { t } = useLanguage();

  const items = useMemo(
    () =>
      records.map((r) => {
        const isLate = isLateRecord(r, 9);
        const status = r.status || (isLate ? "late" : r.clock_in_time ? "present" : "absent");
        const labelKey =
          status === "present" || status === "late" || status === "absent"
            ? status
            : "notCheckedIn";
        return {
          id: r.id,
          name: r.employee_name || r.employee_id || "-",
          checkIn: toHHMM(r.clock_in_time),
          checkOut: toHHMM(r.clock_out_time),
          status,
          labelKey,
        };
      }),
    [records],
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("atasan.teamAttendance")}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{t("atasan.teamAttendanceDesc")}</p>
      </div>

      {items.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-400">{t("atasan.emptyAttendance")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-3 font-semibold">{t("atasan.employee")}</th>
                <th className="px-6 py-3 font-semibold">{t("atasan.checkIn")}</th>
                <th className="px-6 py-3 font-semibold">{t("atasan.checkOut")}</th>
                <th className="px-6 py-3 font-semibold">{t("atasan.status")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                >
                  <td className="px-6 py-3.5 font-semibold text-gray-800 dark:text-gray-100">
                    {item.name}
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">{item.checkIn}</td>
                  <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">{item.checkOut}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(item.status)}`}>
                      {t(`atasan.${item.labelKey}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
