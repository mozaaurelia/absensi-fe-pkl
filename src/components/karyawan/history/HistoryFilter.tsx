"use client";

import { useLanguage } from "@/context/LanguageContext";

interface Props {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateQuery: string;
  onDateQueryChange: (value: string) => void;
  locationQuery: string;
  onLocationChange: (value: string) => void;
}

export default function HistoryFilter({
  statusFilter,
  onStatusChange,
  dateQuery,
  onDateQueryChange,
  locationQuery,
  onLocationChange,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {t("historyFilter.status")}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#1E3A5F]"
          >
            <option value="all">{t("historyFilter.allStatuses")}</option>
            <option value="present">{t("historyFilter.present")}</option>
            <option value="late">{t("historyFilter.late")}</option>
            <option value="sick">{t("historyFilter.sick")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {t("historyFilter.searchDate")}
          </label>
          <input
            type="text"
            placeholder={t("historyFilter.datePlaceholder")}
            value={dateQuery}
            onChange={(e) => onDateQueryChange(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {t("historyFilter.location")}
          </label>
          <select
            value={locationQuery}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#1E3A5F]"
          >
            <option value="all">{t("historyFilter.allLocations")}</option>
            <option value="jakarta">{t("historyFilter.jakartaOffice")}</option>
            <option value="bandung">{t("historyFilter.bandungOffice")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {t("historyFilter.action")}
          </label>
          <button
            type="button"
            className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#16304f] transition-colors"
          >
            {t("historyFilter.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
