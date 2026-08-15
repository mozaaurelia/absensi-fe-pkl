"use client";

import { FiCalendar, FiCheckSquare, FiFilter, FiMapPin } from "react-icons/fi";
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
          <FiFilter size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("historyFilter.title")}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-400">{t("historyFilter.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            <FiCheckSquare size={13} className="text-[#1E3A5F] dark:text-blue-300" />
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
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            <FiCalendar size={13} className="text-[#1E3A5F] dark:text-blue-300" />
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
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            <FiMapPin size={13} className="text-[#1E3A5F] dark:text-blue-300" />
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
            className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#16304f] transition-colors flex items-center justify-center gap-2"
          >
            <FiFilter size={14} />
            {t("historyFilter.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
