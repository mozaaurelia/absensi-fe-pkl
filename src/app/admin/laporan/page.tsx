"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import { useLanguage } from "@/context/LanguageContext";
import {
  getAttendanceReport,
  getDepartments,
  type AttendanceReportRow,
  type Department,
} from "@/lib/services/admin";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toHHMM(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const statusStyles: Record<string, string> = {
  hadir:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  telat: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  alpha: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors";

export default function AdminReportPage() {
  const { t } = useLanguage();

  const [rows, setRows] = useState<AttendanceReportRow[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<{
    department_id: string;
    status: string;
    start_date: string;
    end_date: string;
  }>({ department_id: "", status: "", start_date: "", end_date: "" });

  const loadData = useCallback(
    async (f: typeof filters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttendanceReport({
          department_id: f.department_id || undefined,
          status: f.status || undefined,
          start_date: f.start_date || undefined,
          end_date: f.end_date || undefined,
        });
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const depts = await getDepartments();
        if (active) setDepartments(Array.isArray(depts) ? depts : []);
      } catch {
        if (active) setDepartments([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    loadData({ department_id: "", status: "", start_date: "", end_date: "" });
  }, [loadData]);

  const deptName = useMemo(
    () => (id?: string | null) => departments.find((d) => d.id === id)?.name ?? "-",
    [departments]
  );

  const applyFilters = () => {
    loadData(filters);
  };

  const resetFilters = () => {
    const empty = { department_id: "", status: "", start_date: "", end_date: "" };
    setFilters(empty);
    loadData(empty);
  };

  return (
    <AdminCrudPage titleKey="adminReport.title">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              {t("adminReport.department")}
            </label>
            <select
              value={filters.department_id}
              onChange={(e) => setFilters((p) => ({ ...p, department_id: e.target.value }))}
              className={inputClass}
            >
              <option value="">{t("adminReport.all")}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              {t("adminReport.status")}
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
              className={inputClass}
            >
              <option value="">{t("adminReport.all")}</option>
              <option value="hadir">{t("adminReport.present")}</option>
              <option value="telat">{t("adminReport.late")}</option>
              <option value="alpha">{t("adminReport.absent")}</option>
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              {t("adminReport.startDate")}
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters((p) => ({ ...p, start_date: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              {t("adminReport.endDate")}
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters((p) => ({ ...p, end_date: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="bg-[#1E3A5F] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors"
            >
              {t("adminReport.apply")}
            </button>
            <button
              onClick={resetFilters}
              className="border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t("adminReport.reset")}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">{t("common.loading")}</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">{t("adminReport.empty")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
                  <th className="px-6 py-3 font-semibold">{t("adminReport.employee")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminReport.department")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminReport.date")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminReport.checkIn")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminReport.checkOut")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminReport.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {row.employee_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {deptName(row.department_id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(row.clock_in_time)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {toHHMM(row.clock_in_time)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {toHHMM(row.clock_out_time)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[row.status ?? ""] ??
                          "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {row.status ?? "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminCrudPage>
  );
}