"use client";

import { useMemo } from "react";
import { FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
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

function formatDuration(record: AttendanceRecord): string {
  if (!record.clock_in_time) return "-";
  const start = new Date(record.clock_in_time).getTime();
  const end = record.clock_out_time
    ? new Date(record.clock_out_time).getTime()
    : Date.now();
  const diffMs = end - start;
  if (diffMs < 0) return "-";
  const minutes = Math.min(Math.round(diffMs / 60000), 8 * 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function lateMinutes(record: AttendanceRecord): number {
  if (!record.clock_in_time) return 0;
  if (record.late_minutes != null) return record.late_minutes;
  if (!isLateRecord(record, 9)) return 0;
  const d = new Date(record.clock_in_time);
  return Math.max(0, (d.getHours() - 9) * 60 + d.getMinutes());
}

type AttendanceStatus = "present" | "late" | "empty";

interface AttendanceCardData {
  id: string;
  day: string;
  date: string;
  inTime: string;
  outTime: string;
  total: string;
  status: AttendanceStatus;
  lateText: string;
  location: string;
}

function buildCard(record: AttendanceRecord, daysFull: string[]): AttendanceCardData {
  const d = record.clock_in_time ? new Date(record.clock_in_time) : null;
  const late = isLateRecord(record, 9);
  const status: AttendanceStatus = late
    ? "late"
    : record.clock_in_time
      ? "present"
      : "empty";
  return {
    id: record.id,
    day: d ? daysFull[d.getDay()] : "-",
    date: d
      ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
      : "-",
    inTime: toHHMM(record.clock_in_time),
    outTime: toHHMM(record.clock_out_time),
    total: formatDuration(record),
    status,
    lateText: late ? `${lateMinutes(record)}m` : "0m",
    location: record.location_name || "-",
  };
}

function AttendanceCard({ item }: { item: AttendanceCardData }) {
  const { t } = useLanguage();

  const isLate = item.status === "late";
  const isPresent = item.status === "present";

  const badgeClass = isLate
    ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
    : isPresent
      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30"
      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";

  const badgeText = isLate
    ? t("historyTable.late")
    : isPresent
      ? t("historyTable.onTime")
      : t("historyTable.notAvailable");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 card-hover">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
              isLate
                ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                : "bg-[#1E3A5F]/10 dark:bg-blue-500/15 text-[#1E3A5F] dark:text-blue-300"
            }`}
          >
            {isLate ? "◔" : "✓"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {item.day}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{item.date}</p>
          </div>
        </div>

        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap shrink-0 ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-2 py-2 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">{t("historyTable.checkIn")}</p>
          <p className="text-base font-bold text-[#1E3A5F] dark:text-blue-300 tabular-nums">{item.inTime}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-2 py-2 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">{t("historyTable.checkOut")}</p>
          <p className="text-base font-bold text-[#1E3A5F] dark:text-blue-300 tabular-nums">{item.outTime}</p>
        </div>
        <div className="bg-[#1E3A5F] dark:bg-blue-600/90 rounded-xl px-2 py-2 text-center">
          <p className="text-[10px] text-blue-100/80 mb-0.5">{t("historyTable.totalHours")}</p>
          <p className="text-base font-bold text-white tabular-nums">{item.total}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-700 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 min-w-0">
          <FiMapPin size={12} className="shrink-0 text-[#1E3A5F] dark:text-blue-300" />
          <span className="truncate">{item.location}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
            isLate ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"
          }`}
        >
          {isLate ? <FiClock size={12} /> : <FiCheckCircle size={12} />}
          {isLate ? item.lateText : t("historyTable.onTime")}
        </div>
      </div>
    </div>
  );
}

export default function HistoryTable({ records }: Props) {
  const { daysFull, t } = useLanguage();

  const items = useMemo(
    () => records.map((r) => buildCard(r, daysFull)),
    [records, daysFull],
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden card-hover mt-6">
      <div className="bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a] text-white px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{t("historyTable.title")}</h3>
            <p className="text-xs text-blue-100/80 mt-0.5">{t("historyTable.desc")}</p>
          </div>
          <span className="hidden sm:inline-flex items-center bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full shrink-0">
            {items.length} {t("historyTable.present")}
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-400">{t("common.emptyData")}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 p-5">
          {items.map((item) => (
            <AttendanceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
