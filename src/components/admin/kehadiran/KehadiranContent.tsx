"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUsers,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import {
  getAdminAttendanceReport,
  type AdminAttendanceReportRow,
} from "@/lib/services/attendance";
import { getDepartments } from "@/lib/services/admin";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] transition-colors";

type SectionTab = "history" | "leave" | "late";

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 5l2 2M5 5L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function KehadiranContent() {
  const { t } = useLanguage();

  const [rows, setRows] = useState<AdminAttendanceReportRow[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "leave" | "late">("history");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  });

  const load = useCallback(
    async (targetDate: string, deptId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminAttendanceReport({
          date: targetDate,
          department_id: deptId || undefined,
        });
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    load(date, department);
  }, [load, date, department]);

  useEffect(() => {
    getDepartments()
      .then((data) => setDepartments(Array.isArray(data) ? data : []))
      .catch(() => setDepartments([]));
  }, []);

  const stats = useMemo(() => {
    const present = rows.filter((r) => r.status === "present").length;
    const late = rows.filter((r) => r.status === "late").length;
    const absent = rows.filter((r) => r.status === "absent").length;
    return { present, late, absent, total: rows.length };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch =
        !search || row.employee_name.toLowerCase().includes(search.toLowerCase());

      if (activeTab === "history") return matchSearch;
      if (activeTab === "late") return matchSearch && row.status === "late";
      if (activeTab === "leave") return matchSearch && row.status === "absent";
      return matchSearch;
    });
  }, [rows, search, activeTab]);

  const tabs: { id: SectionTab; label: string; icon: ReactNode }[] = [
    { id: "history", label: t("adminAttendance.tabHistory"), icon: <HistoryIcon /> },
    { id: "leave", label: t("adminAttendance.tabLeave"), icon: <LeaveIcon /> },
    { id: "late", label: t("adminAttendance.tabLate"), icon: <LateIcon /> },
  ];

  const statusConfig = {
    present: {
      icon: <FiCheckCircle size={14} />,
      color: "text-green-600 bg-green-50 dark:bg-green-500/15 dark:text-green-400",
    },
    late: {
      icon: <FiClock size={14} />,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400",
    },
    absent: {
      icon: <FiXCircle size={14} />,
      color: "text-red-600 bg-red-50 dark:bg-red-500/15 dark:text-red-400",
    },
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-[#1E3A5F]">
              <FiUsers size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {loading ? "-" : String(stats.present)}
          </p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t("adminAttendance.totalAbsensi")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("adminAttendance.totalAbsensiDesc")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
              <FiAlertCircle size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {loading ? "-" : String(stats.late)}
          </p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t("adminAttendance.totalLate")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("adminAttendance.totalLateDesc")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-500">
              <FiCalendar size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {loading ? "-" : String(stats.absent)}
          </p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t("adminAttendance.totalLeave")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("adminAttendance.totalLeaveDesc")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
              <FiClock size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {loading ? "-" : String(stats.total)}
          </p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t("adminAttendance.totalOvertime")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("adminAttendance.totalOvertimeDesc")}
          </p>
        </div>
      </div>

      {/* Main Table Card */}
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
            <input
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors"
            />
          </div>

          {/* Section Tabs */}
          <div className="flex items-stretch border-b border-gray-100 dark:border-gray-700 -mx-6 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "text-[#1E3A5F]"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <span className="text-[#1E3A5F]">{tab.icon}</span>
                {tab.label}
                <span
                  className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-opacity ${
                    activeTab === tab.id ? "opacity-100" : "opacity-0"
                  } bg-[#1E3A5F]`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="relative">
              <FiSearch
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("adminAttendance.searchNameOrId")}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] transition-colors"
              />
            </div>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={inputClass}
            >
              <option value="">{t("adminAttendance.allDepartments")}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <div className="text-xs text-gray-400 flex items-center">
              {loading ? t("common.loading") : `${stats.total} ${t("adminAttendance.employee")}`}
            </div>
          </div>
        </div>

        {/* Table */}
        {error ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => load(date, department)}
              className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-[#1E3A5F] rounded-xl hover:opacity-90"
            >
              {t("common.retry")}
            </button>
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            {t("common.loading")}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12">
            <div className="flex flex-col items-center text-center">
              <span className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <FiCheckCircle
                  size={24}
                  className="text-gray-300 dark:text-gray-500"
                />
              </span>
              <p className="text-sm text-gray-400">{t("adminAttendance.empty")}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
                  <th className="px-6 py-3 font-semibold">
                    {t("adminAttendance.date")}
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    {t("adminAttendance.employee")}
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    {t("adminAttendance.status")}
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    {t("adminAttendance.checkIn")}
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    {t("adminAttendance.checkOut")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.map((row) => {
                  const cfg = statusConfig[row.status];
                  return (
                    <tr
                      key={row.employee_id + row.date}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                        {new Date(row.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {row.employee_name}
                        </p>
                        <p className="text-xs text-gray-400">{row.department_name || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}
                        >
                          {cfg.icon}
                          {row.status === "present"
                            ? t("adminAttendance.tabPresent")
                            : row.status === "late"
                              ? t("adminAttendance.tabLate")
                              : t("adminAttendance.tabAbsent")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {row.check_in || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {row.check_out || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}