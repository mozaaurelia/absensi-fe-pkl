"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import HistoryFilter from "./HistoryFilter";
import HistorySummary from "./HistorySummary";
import HistoryTable from "./HistoryTable";
import { getMyAttendance, type AttendanceRecord } from "@/lib/services/attendance";
import { dateKey } from "@/lib/attendanceStats";

export default function HistoryContent() {
  const { t } = useLanguage();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("all");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyAttendance();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    return records.filter((record) => {
      if (statusFilter !== "all" && record.status !== statusFilter) {
        return false;
      }
      if (locationQuery !== "all" && record.location_name) {
        if (!record.location_name.toLowerCase().includes(locationQuery)) {
          return false;
        }
      }
      if (dateQuery) {
        const raw = record.clock_in_time || record.date;
        if (!raw) return false;
        const normalized = dateQuery.replace(/[^0-9]/g, "");
        const match = dateKey(new Date(raw)).replace(/[^0-9]/g, "");
        if (!match.includes(normalized)) return false;
      }
      return true;
    });
  }, [records, statusFilter, locationQuery, dateQuery]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("common.loadErrorTitle")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={loadData}
          className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#16304f] transition-colors"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <HistoryFilter
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateQuery={dateQuery}
        onDateQueryChange={setDateQuery}
        locationQuery={locationQuery}
        onLocationChange={setLocationQuery}
      />
      <HistorySummary records={filtered} />
      <HistoryTable records={filtered} />
    </div>
  );
}
