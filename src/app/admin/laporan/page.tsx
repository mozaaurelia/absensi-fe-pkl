"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import LaporanStatsCards from "@/components/admin/laporan/LaporanStatsCards";
import LaporanFilter from "@/components/admin/laporan/LaporanFilter";
import {
  getDepartments,
  type Department,
} from "@/lib/services/admin";
import {
  getAdminAllAttendance,
  type AdminAttendanceRow,
} from "@/lib/services/attendance";

type SectionTab = "overview" | "departemen";

const SECTION_TABS: { id: SectionTab; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <EyeIcon /> },
  { id: "departemen", label: "Departemen", icon: <BuildingIcon /> },
];

const REPORT_STATUS: Record<string, string | undefined> = {
  attendance: undefined,
  late: "telat",
  absent: "alpha",
};

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function rangeForPeriod(period: string): { start: string; end: string } {
  const now = new Date();
  if (period === "today") {
    return { start: ymd(now), end: ymd(now) };
  }
  if (period === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start: ymd(start), end: ymd(end) };
  }
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: ymd(start), end: ymd(end) };
  }
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);
  return { start: ymd(start), end: ymd(end) };
}

const thClass =
  "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap";
const tdClass = "px-4 py-3 text-sm text-gray-700 dark:text-gray-200";

export default function AdminReportPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [reportType, setReportType] = useState("attendance");
  const [period, setPeriod] = useState("month");
  const [departmentId, setDepartmentId] = useState("");
  const [section, setSection] = useState<SectionTab>("overview");
  const [rows, setRows] = useState<AdminAttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { start, end } = rangeForPeriod(period);
      const data = await getAdminAllAttendance({
        start_date: start,
        end_date: end,
        department_id: departmentId || undefined,
        status: REPORT_STATUS[reportType],
      });
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat laporan");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [reportType, period, departmentId]);

  useEffect(() => {
    load();
  }, [load]);

  const byEmployee = new Map<string, { name: string; dept: string; hadir: number; telat: number; alpha: number }>();
  for (const r of rows) {
    const key = r.employee_id;
    const cur = byEmployee.get(key) ?? {
      name: r.employee_name,
      dept: r.department_name ?? "-",
      hadir: 0,
      telat: 0,
      alpha: 0,
    };
    if (r.status === "hadir") cur.hadir += 1;
    else if (r.status === "telat") cur.telat += 1;
    else if (r.status === "alpha") cur.alpha += 1;
    byEmployee.set(key, cur);
  }
  const employeeRows = Array.from(byEmployee.values()).sort((a, b) => a.name.localeCompare(b.name));

  const byDept = new Map<string, { name: string; hadir: number; telat: number; alpha: number }>();
  for (const r of rows) {
    const key = r.department_name ?? "-";
    const cur = byDept.get(key) ?? { name: key, hadir: 0, telat: 0, alpha: 0 };
    if (r.status === "hadir") cur.hadir += 1;
    else if (r.status === "telat") cur.telat += 1;
    else if (r.status === "alpha") cur.alpha += 1;
    byDept.set(key, cur);
  }
  const deptRows = Array.from(byDept.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AdminCrudPage titleKey="adminReport.title">
      <LaporanStatsCards rows={rows} />

      <LaporanFilter
        reportType={reportType}
        period={period}
        departmentId={departmentId}
        departments={departments}
        onReportTypeChange={setReportType}
        onPeriodChange={setPeriod}
        onDepartmentChange={setDepartmentId}
      />

      <div className="flex items-stretch border-b border-gray-200 mb-6">
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSection(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              section === tab.id ? "text-[#1E3A5F]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-[#1E3A5F]">{tab.icon}</span>
            {tab.label}
            <span
              className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-opacity ${
                section === tab.id ? "opacity-100" : "opacity-0"
              } bg-[#1E3A5F]`}
            />
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1E3A5F]" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-red-500">
          {error}
        </div>
      ) : section === "overview" ? (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className={thClass}>Karyawan</th>
                  <th className={thClass}>Departemen</th>
                  <th className={`${thClass} text-center`}>Hadir</th>
                  <th className={`${thClass} text-center`}>Telat</th>
                  <th className={`${thClass} text-center`}>Alpha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {employeeRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                      Tidak ada data untuk periode ini.
                    </td>
                  </tr>
                ) : (
                  employeeRows.map((e) => (
                    <tr key={e.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className={tdClass}>{e.name}</td>
                      <td className={tdClass}>{e.dept}</td>
                      <td className={`${tdClass} text-center text-green-600`}>{e.hadir}</td>
                      <td className={`${tdClass} text-center text-amber-600`}>{e.telat}</td>
                      <td className={`${tdClass} text-center text-red-500`}>{e.alpha}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className={thClass}>Departemen</th>
                  <th className={`${thClass} text-center`}>Hadir</th>
                  <th className={`${thClass} text-center`}>Telat</th>
                  <th className={`${thClass} text-center`}>Alpha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {deptRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                      Tidak ada data untuk periode ini.
                    </td>
                  </tr>
                ) : (
                  deptRows.map((d) => (
                    <tr key={d.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className={tdClass}>{d.name}</td>
                      <td className={`${tdClass} text-center text-green-600`}>{d.hadir}</td>
                      <td className={`${tdClass} text-center text-amber-600`}>{d.telat}</td>
                      <td className={`${tdClass} text-center text-red-500`}>{d.alpha}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminCrudPage>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M9 21v-3h6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}