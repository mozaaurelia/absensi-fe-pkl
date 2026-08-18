"use client";

import { useCallback, useEffect, useState } from "react";
import { FiSearch, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  status: "present" | "late" | "absent";
  checkIn: string;
  checkOut: string;
}

export default function KehadiranContent() {
  const { t } = useLanguage();

  const [rows, setRows] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "present" | "late" | "absent">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("kehadiran");
      const data: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = rows.filter((row) => {
    const matchSearch = row.employeeName.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "all" || row.status === activeTab;
    return matchSearch && matchTab;
  });

  const tabs = [
    { key: "all" as const, label: t("adminAttendance.tabAll"), count: rows.length },
    { key: "present" as const, label: t("adminAttendance.tabPresent"), count: rows.filter((r) => r.status === "present").length },
    { key: "late" as const, label: t("adminAttendance.tabLate"), count: rows.filter((r) => r.status === "late").length },
    { key: "absent" as const, label: t("adminAttendance.tabAbsent"), count: rows.filter((r) => r.status === "absent").length },
  ];

  const statusConfig = {
    present: { icon: <FiCheckCircle size={14} />, color: "text-green-600 bg-green-50 dark:bg-green-500/15 dark:text-green-400" },
    late: { icon: <FiClock size={14} />, color: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400" },
    absent: { icon: <FiXCircle size={14} />, color: "text-red-600 bg-red-50 dark:bg-red-500/15 dark:text-red-400" },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
              {t("adminAttendance.title")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {t("adminAttendance.desc")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("adminAttendance.searchPlaceholder")}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-10 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-1 mt-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-[#1E3A5F] text-white"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-gray-400">{t("common.loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="p-12">
          <div className="flex flex-col items-center text-center">
            <span className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <FiCheckCircle size={24} className="text-gray-300 dark:text-gray-500" />
            </span>
            <p className="text-sm text-gray-400">{t("adminAttendance.empty")}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
                <th className="px-6 py-3 font-semibold">{t("adminAttendance.date")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminAttendance.employee")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminAttendance.status")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminAttendance.checkIn")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminAttendance.checkOut")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map((row) => {
                const cfg = statusConfig[row.status];
                return (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {new Date(row.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {row.employeeName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                        {cfg.icon}
                        {row.status === "present" ? t("adminAttendance.tabPresent") : row.status === "late" ? t("adminAttendance.tabLate") : t("adminAttendance.tabAbsent")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {row.checkIn || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {row.checkOut || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
