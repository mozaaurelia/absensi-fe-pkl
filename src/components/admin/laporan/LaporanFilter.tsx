"use client";

import type { Department } from "@/lib/services/admin";
import { useLanguage } from "@/context/LanguageContext";

interface LaporanFilterProps {
  reportType: string;
  period: string;
  departmentId: string;
  departments: Department[];
  onReportTypeChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-700 px-3.5 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors cursor-pointer";

export default function LaporanFilter({
  reportType,
  period,
  departmentId,
  departments,
  onReportTypeChange,
  onPeriodChange,
  onDepartmentChange,
}: LaporanFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
            {t("adminReport.reportType")}
          </label>
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            className={selectClass}
          >
            <option value="attendance">{t("adminReport.attendance")}</option>
            <option value="late">{t("adminReport.lateReport")}</option>
            <option value="absent">{t("adminReport.absentReport")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
            {t("adminReport.period")}
          </label>
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            className={selectClass}
          >
            <option value="today">{t("adminReport.today")}</option>
            <option value="week">{t("adminReport.thisWeek")}</option>
            <option value="month">{t("adminReport.thisMonth")}</option>
            <option value="year">{t("adminReport.thisYear")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
            {t("adminReport.department")}
          </label>
          <select
            value={departmentId}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className={selectClass}
          >
            <option value="">{t("adminReport.all")}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
