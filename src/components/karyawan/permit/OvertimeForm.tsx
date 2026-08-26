"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FiAlignLeft, FiAlertTriangle, FiCalendar, FiClock, FiList, FiSend, FiUserCheck } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import { createOvertimeRequest } from "@/lib/services/attendance";
import { getHolidays } from "@/lib/services/admin";
import DatePicker from "../common/DatePicker";

const MAX_OVERTIME_HOURS = 2;

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + hours * 60) % (24 * 60);
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function diffMinutes(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export default function OvertimeForm() {
  const { t } = useLanguage();
  const [tanggalLembur, setTanggalLembur] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [kategori, setKategori] = useState("");
  const [alasan, setAlasan] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [holidayMap, setHolidayMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const staticMap = getStaticHolidayMap(new Date().getFullYear());
    const merged: Record<string, string> = {};
    Object.entries(staticMap).forEach(([k, v]) => { merged[k] = v.name; });
    getHolidays()
      .then((list) => {
        list.forEach((h) => { merged[h.date] = h.name; });
        setHolidayMap(merged);
      })
      .catch(() => {
        setHolidayMap(merged);
      });
  }, []);

  const maxEnd = jamMulai ? addHours(jamMulai, MAX_OVERTIME_HOURS) : "";
  const durationMinutes = diffMinutes(jamMulai, jamSelesai);
  const overLimit = durationMinutes > MAX_OVERTIME_HOURS * 60;
  const holidayName = tanggalLembur ? holidayMap[tanggalLembur] ?? null : null;

  const formatDuration = (minutes: number): string => {
    if (minutes <= 0) return "-";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hu = t("overtimeForm.hourUnit");
    const mu = t("overtimeForm.minuteUnit");
    if (h === 0) return `${m}${mu}`;
    if (m === 0) return `${h}${hu}`;
    return `${h}${hu} ${m}${mu}`;
  };

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJamMulai(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!tanggalLembur || !jamMulai || !jamSelesai) {
      setInfo(t("overtimeForm.required"));
      setSuccess(false);
      return;
    }

    if (overLimit) {
      setInfo(t("overtimeForm.durationWarning", { max: maxEnd }));
      setSuccess(false);
      return;
    }

    setSubmitting(true);
    setInfo(null);
    try {
      await createOvertimeRequest({
        overtime_date: tanggalLembur,
        start_time: jamMulai,
        end_time: jamSelesai,
        category: kategori,
        reason: alasan,
      });
      setSuccess(true);
      setInfo(t("overtimeForm.success"));
      setTanggalLembur("");
      setJamMulai("");
      setJamSelesai("");
      setKategori("");
      setAlasan("");
    } catch (err) {
      setSuccess(false);
      setInfo(err instanceof ApiError ? err.message : t("overtimeForm.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
            <FiClock size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("overtimeForm.title")}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t("overtimeForm.desc")}</p>
          </div>
        </div>
        <span className="bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shrink-0">
          {t("overtimeForm.badge")}
        </span>
      </div>

      {info && (
        <p
          className={`text-xs rounded-lg px-4 py-3 mb-4 ${
            success
              ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10"
              : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10"
          }`}
        >
          {info}
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiCalendar size={14} className="text-purple-600 dark:text-purple-300" />
            {t("overtimeForm.date")}
          </label>
          <DatePicker
            value={tanggalLembur}
            onChange={setTanggalLembur}
            placeholder={t("overtimeForm.date")}
          />
          {holidayName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
              <FiAlertTriangle size={12} className="shrink-0" />
              {t("overtimeForm.holidayWarning", { name: holidayName })}
            </p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiClock size={14} className="text-purple-600 dark:text-purple-300" />
            {t("overtimeForm.startTime")}
          </label>
          <input
            type="time"
            value={jamMulai}
            onChange={handleStartChange}
            required
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiClock size={14} className="text-purple-600 dark:text-purple-300" />
            {t("overtimeForm.endTime")}
          </label>
          <input
            type="time"
            value={jamSelesai}
            max={maxEnd || undefined}
            onChange={(e) => setJamSelesai(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
          {maxEnd && (
            <p className="mt-1 text-xs text-gray-400">
              {t("overtimeForm.maxHint", { max: maxEnd })}
            </p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiClock size={14} className="text-purple-600 dark:text-purple-300" />
            {t("overtimeForm.estDuration")}
          </label>
          <div
            className={`w-full rounded-lg border px-4 py-3 text-sm font-semibold ${
              overLimit
                ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300"
                : "border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300"
            }`}
          >
            {jamMulai && jamSelesai ? formatDuration(durationMinutes) : t("overtimeForm.durationValue")}
          </div>
        </div>
      </div>

      {overLimit && (
        <p className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400 mb-5">
          <FiAlertTriangle size={14} className="shrink-0" />
          {t("overtimeForm.durationWarning", { max: maxEnd })}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiList size={14} className="text-purple-600 dark:text-purple-300" />
            {t("overtimeForm.category")}
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          >
            <option value="">{t("overtimeForm.categoryPlaceholder")}</option>
            <option value="project">{t("overtimeForm.project")}</option>
            <option value="operasional">{t("overtimeForm.operational")}</option>
            <option value="lainnya">{t("overtimeForm.others")}</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <FiUserCheck size={14} className="text-purple-600 dark:text-purple-300" />
            {t("overtimeForm.approval")}
          </label>
          <select
            disabled
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none transition-colors disabled:opacity-60"
          >
            <option>{t("overtimeForm.supervisorOption")}</option>
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          <FiAlignLeft size={14} className="text-purple-600 dark:text-purple-300" />
          {t("overtimeForm.reason")}
        </label>
        <textarea
          rows={3}
          placeholder={t("overtimeForm.reasonPlaceholder")}
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <FiSend size={14} />
        {submitting ? t("overtimeForm.submitting") : t("overtimeForm.submit")}
      </button>
    </form>
  );
}
