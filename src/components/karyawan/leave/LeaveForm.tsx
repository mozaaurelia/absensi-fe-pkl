"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LeaveForm() {
  const { t } = useLanguage();
  const [jenisIzin, setJenisIzin] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [alasan, setAlasan] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: hubungkan ke API pengajuan izin/cuti
    console.log({ jenisIzin, tanggalMulai, tanggalSelesai, alasan });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("leaveForm.title")}</h3>
        <span className="bg-blue-50 dark:bg-blue-500/15 text-[#1E3A5F] dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {t("leaveForm.badge")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        {t("leaveForm.desc")}
      </p>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("leaveForm.typeLabel")}
        </label>
        <select
          value={jenisIzin}
          onChange={(e) => setJenisIzin(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        >
          <option value="">{t("leaveForm.typePlaceholder")}</option>
          <option value="sakit">{t("leaveForm.sick")}</option>
          <option value="cuti">{t("leaveForm.annualLeave")}</option>
          <option value="penting">{t("leaveForm.important")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("leaveForm.startDate")}
          </label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("leaveForm.endDate")}
          </label>
          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("leaveForm.reason")}
        </label>
        <textarea
          rows={3}
          placeholder={t("leaveForm.reasonPlaceholder")}
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="file"
          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-xs text-gray-400 file:hidden"
          title={t("leaveForm.fileTitle")}
        />
        <button
          type="submit"
          className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#16304f] transition-colors whitespace-nowrap"
        >
          {t("leaveForm.submit")}
        </button>
      </div>
    </form>
  );
}