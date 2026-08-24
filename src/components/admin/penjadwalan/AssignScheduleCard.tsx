"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { AdminEmployee, OfficeLocation, Shift, WorkingDayPattern } from "./types";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors";

interface AssignScheduleCardProps {
  employees: AdminEmployee[];
  shifts: Shift[];
  locations: OfficeLocation[];
  patterns: WorkingDayPattern[];
  loading: boolean;
  loadError: string | null;
  selectedEmployee: string;
  onSelectedEmployeeChange: (id: string) => void;
  shiftId: string;
  onShiftIdChange: (id: string) => void;
  locationId: string;
  onLocationIdChange: (id: string) => void;
  patternId: string;
  onPatternIdChange: (id: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  saving: boolean;
  error: string | null;
  success: string | null;
  onSubmit: () => void;
}

export default function AssignScheduleCard(props: AssignScheduleCardProps) {
  const { t } = useLanguage();
  const {
    employees,
    shifts,
    locations,
    patterns,
    loading,
    loadError,
    saving,
    error,
    success,
  } = props;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
        {t("adminScheduling.assignTitle")}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
        {t("adminScheduling.assignDesc")}
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 dark:bg-green-500/10 text-xs text-green-600 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      {loading ? (
        <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
      ) : loadError ? (
        <p className="text-sm text-gray-400">{loadError}</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminScheduling.employee")} *
            </label>
            <select
              value={props.selectedEmployee}
              onChange={(e) => props.onSelectedEmployeeChange(e.target.value)}
              className={inputClass}
            >
              <option value="">{t("adminMaster.placeholder")}</option>
              {employees
                .filter((e) => e.status === "active")
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminScheduling.shift")} *
            </label>
            <select
              value={props.shiftId}
              onChange={(e) => props.onShiftIdChange(e.target.value)}
              className={inputClass}
            >
              <option value="">{t("adminMaster.placeholder")}</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.start_time} - {s.end_time})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminScheduling.location")} *
            </label>
            <select
              value={props.locationId}
              onChange={(e) => props.onLocationIdChange(e.target.value)}
              className={inputClass}
            >
              <option value="">{t("adminMaster.placeholder")}</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminScheduling.pattern")}
            </label>
            <select
              value={props.patternId}
              onChange={(e) => props.onPatternIdChange(e.target.value)}
              className={inputClass}
            >
              <option value="">{t("adminMaster.placeholder")}</option>
              {patterns.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminScheduling.startDate")} *
            </label>
            <input
              type="date"
              value={props.startDate}
              onChange={(e) => props.onStartDateChange(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            onClick={props.onSubmit}
            disabled={saving}
            className="w-full bg-[#1E3A5F] text-white text-sm font-semibold py-3 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("adminScheduling.save")}
          </button>
        </div>
      )}
    </div>
  );
}
