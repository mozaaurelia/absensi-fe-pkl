"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function OvertimeForm() {
  const { t } = useLanguage();
  const [tanggalLembur, setTanggalLembur] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [kategori, setKategori] = useState("");
  const [alasan, setAlasan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hubungkan ke API pengajuan lembur
    console.log({ tanggalLembur, jamMulai, jamSelesai, kategori, alasan });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("overtimeForm.title")}</h3>
        <span className="bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {t("overtimeForm.badge")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        {t("overtimeForm.desc")}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("overtimeForm.date")}
          </label>
          <input
            type="date"
            value={tanggalLembur}
            onChange={(e) => setTanggalLembur(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("overtimeForm.startTime")}
          </label>
          <input
            type="time"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("overtimeForm.endTime")}
          </label>
          <input
            type="time"
            value={jamSelesai}
            onChange={(e) => setJamSelesai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("overtimeForm.estDuration")}
          </label>
          <div className="w-full rounded-lg border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-700 dark:text-purple-300">
            {t("overtimeForm.durationValue")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("overtimeForm.category")}
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          >
            <option value="">{t("overtimeForm.categoryPlaceholder")}</option>
            <option value="project">{t("overtimeForm.project")}</option>
            <option value="operasional">{t("overtimeForm.operational")}</option>
            <option value="lainnya">{t("overtimeForm.others")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("overtimeForm.approval")}
          </label>
          <select className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors">
            <option>{t("overtimeForm.supervisorOption")}</option>
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("overtimeForm.reason")}
        </label>
        <textarea
          rows={3}
          placeholder={t("overtimeForm.reasonPlaceholder")}
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#16304f] transition-colors"
      >
        {t("overtimeForm.submit")}
      </button>
    </form>
  );
}