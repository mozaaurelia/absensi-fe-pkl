"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { FiCalendar, FiClock, FiPlusCircle, FiSend, FiTag, FiType } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import { createPersonalAgenda } from "@/lib/services/agenda";
import DatePicker from "../common/DatePicker";

interface Props {
  onCreated?: () => void;
}

export default function ScheduleForm({ onCreated }: Props) {
  const { t } = useLanguage();
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [kategori, setKategori] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tanggal || !judul.trim()) {
      setInfo(t("scheduleForm.required"));
      setSuccess(false);
      return;
    }

    setSubmitting(true);
    setInfo(null);
    try {
      await createPersonalAgenda({
        agenda_date: tanggal,
        title: judul.trim(),
        description: kategori || undefined,
        start_time: jam || undefined,
        end_time: undefined,
      });
      setSuccess(true);
      setInfo(t("scheduleForm.success"));
      setJudul("");
      setTanggal("");
      setJam("");
      setKategori("");
      onCreated?.();
    } catch (err) {
      setSuccess(false);
      setInfo(err instanceof ApiError ? err.message : t("scheduleForm.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-full shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <FiPlusCircle size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("scheduleForm.title")}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t("scheduleForm.desc")}</p>
          </div>
        </div>
        <span className="bg-[#1E3A5F]/10 dark:bg-blue-500/15 text-[#1E3A5F] dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shrink-0">
          {t("scheduleHeader.badge")}
        </span>
      </div>

      {info && (
        <p
          className={`text-xs rounded-lg px-4 py-3 mb-4 ${
            success
              ? "text-green-200 bg-green-500/15"
              : "text-amber-200 bg-amber-500/15"
          }`}
        >
          {info}
        </p>
      )}

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          <FiType size={14} className="text-rose-500 dark:text-rose-400" />
          {t("scheduleForm.titleLabel")}
        </label>
        <input
          type="text"
          placeholder={t("scheduleForm.titlePlaceholder")}
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiCalendar size={14} className="text-rose-500 dark:text-rose-400" />
            {t("scheduleForm.dateLabel")}
          </label>
          <DatePicker
            value={tanggal}
            onChange={setTanggal}
            placeholder={t("scheduleForm.dateLabel")}
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiClock size={14} className="text-rose-500 dark:text-rose-400" />
            {t("scheduleForm.timeLabel")}
          </label>
          <input
            type="time"
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          <FiTag size={14} className="text-rose-500 dark:text-rose-400" />
          {t("scheduleForm.categoryLabel")}
        </label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        >
          <option value="">{t("scheduleForm.categoryPlaceholder")}</option>
          <option value="rapat">{t("scheduleForm.meeting")}</option>
          <option value="tugas">{t("scheduleForm.task")}</option>
          <option value="personal">{t("scheduleForm.personal")}</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <FiSend size={14} />
        {submitting ? t("scheduleForm.saving") : t("scheduleForm.submit")}
      </button>
    </form>
  );
}
