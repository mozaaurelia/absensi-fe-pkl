"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { EmployeeSchedule } from "./types";
import { normalizedDatePart } from "./types";

interface CurrentScheduleCardProps {
  selectedEmployee: string;
  loading: boolean;
  schedule: EmployeeSchedule | null;
  saving: boolean;
  onEndSchedule: () => void;
}

export default function CurrentScheduleCard({
  selectedEmployee,
  loading,
  schedule,
  saving,
  onEndSchedule,
}: CurrentScheduleCardProps) {
  const { t } = useLanguage();

  const startDate = schedule ? normalizedDatePart(schedule.start_date) : null;
  const endDate = schedule ? normalizedDatePart(schedule.end_date) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
        {t("adminScheduling.currentTitle")}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
        {t("adminScheduling.currentDesc")}
      </p>

      {!selectedEmployee ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">
          {t("adminScheduling.selectFirst")}
        </p>
      ) : loading ? (
        <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
      ) : !schedule ? (
        <div className="text-center py-10">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t("adminScheduling.noSchedule")}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("adminScheduling.noScheduleDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {schedule.shift_name || "-"}
              </p>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                {t("adminScheduling.active")}
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <p>
                {t("adminScheduling.hours")}: {schedule.start_time} -{" "}
                {schedule.end_time}
              </p>
              <p>
                {t("adminScheduling.location")}:{" "}
                {schedule.location_name || "-"}
              </p>
              <p>
                {t("adminScheduling.startDate")}: {startDate ?? "-"}
                {endDate ? ` — ${endDate}` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={onEndSchedule}
            disabled={saving}
            className="w-full border border-red-200 dark:border-red-500/30 text-red-500 text-sm font-semibold py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("adminScheduling.endSchedule")}
          </button>
        </div>
      )}
    </div>
  );
}
