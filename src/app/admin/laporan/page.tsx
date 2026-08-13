"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import LaporanStatsCards from "@/components/admin/laporan/LaporanStatsCards";
import LaporanFilter from "@/components/admin/laporan/LaporanFilter";
import { getDepartments, type Department } from "@/lib/services/admin";

type SectionTab = "overview" | "departemen";

const SECTION_TABS: { id: SectionTab; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <EyeIcon /> },
  { id: "departemen", label: "Departemen", icon: <BuildingIcon /> },
];

export default function AdminReportPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [reportType, setReportType] = useState("attendance");
  const [period, setPeriod] = useState("month");
  const [departmentId, setDepartmentId] = useState("");
  const [section, setSection] = useState<SectionTab>("overview");

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

  return (
    <AdminCrudPage titleKey="adminReport.title">
      <LaporanStatsCards />

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

      {section === "overview" ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-sm text-gray-400">
            Ringkasan laporan {reportType} akan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-sm text-gray-400">
            Laporan per departemen akan ditampilkan di sini.
          </p>
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
