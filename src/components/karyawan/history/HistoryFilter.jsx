"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function HistoryFilter() {
  const { t } = useLanguage();
  const [status, setStatus] = useState(t("historyFilter.allStatuses"));
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState(t("historyFilter.allLocations"));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            {t("historyFilter.status")}
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#1E3A5F]"
          >
            <option>{t("historyFilter.allStatuses")}</option>
            <option>{t("historyFilter.present")}</option>
            <option>{t("historyFilter.late")}</option>
            <option>{t("historyFilter.sick")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            {t("historyFilter.searchDate")}
          </label>
          <input
            type="text"
            placeholder={t("historyFilter.datePlaceholder")}
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            {t("historyFilter.location")}
          </label>
          <select
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#1E3A5F]"
          >
            <option>{t("historyFilter.allLocations")}</option>
            <option>{t("historyFilter.jakartaOffice")}</option>
            <option>{t("historyFilter.bandungOffice")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            {t("historyFilter.action")}
          </label>
          <button className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#16304f] transition-colors">
            {t("historyFilter.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}