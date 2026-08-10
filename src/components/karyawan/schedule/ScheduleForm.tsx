"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ScheduleForm() {
  const { t } = useLanguage();
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [kategori, setKategori] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: hubungkan ke API penambahan agenda
    console.log({ judul, tanggal, jam, kategori });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a] rounded-2xl border border-white/10 p-6 shadow-lg"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-white">{t("scheduleForm.title")}</h3>
        <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {t("scheduleHeader.badge")}
        </span>
      </div>
      <p className="text-xs text-blue-200/80 mb-6">
        {t("scheduleForm.desc")}
      </p>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-blue-100 mb-2">
          {t("scheduleForm.titleLabel")}
        </label>
        <input
          type="text"
          placeholder={t("scheduleForm.titlePlaceholder")}
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#2a4f7a] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-blue-100 mb-2">
            {t("scheduleForm.dateLabel")}
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#2a4f7a] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-100 mb-2">
            {t("scheduleForm.timeLabel")}
          </label>
          <input
            type="time"
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#2a4f7a] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-blue-100 mb-2">
          {t("scheduleForm.categoryLabel")}
        </label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#2a4f7a] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        >
          <option value="">{t("scheduleForm.categoryPlaceholder")}</option>
          <option value="rapat">{t("scheduleForm.meeting")}</option>
          <option value="tugas">{t("scheduleForm.task")}</option>
          <option value="personal">{t("scheduleForm.personal")}</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-white text-[#1E3A5F] font-semibold text-sm py-3 rounded-lg hover:bg-blue-50 transition-colors"
      >
        {t("scheduleForm.submit")}
      </button>
    </form>
  );
}
