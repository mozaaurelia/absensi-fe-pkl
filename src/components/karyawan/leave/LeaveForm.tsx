"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import { createLeaveRequest, type LeaveType } from "@/lib/services/leave";

interface Props {
  leaveTypes: LeaveType[];
  onSubmitted?: () => Promise<void> | void;
}

export default function LeaveForm({ leaveTypes, onSubmitted }: Props) {
  const { t } = useLanguage();
  const [jenisIzin, setJenisIzin] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!jenisIzin) {
      setError(t("leaveForm.typeRequired"));
      return;
    }
    if (!tanggalMulai || !tanggalSelesai) {
      setError(t("leaveForm.dateRequired"));
      return;
    }
    if (!alasan.trim()) {
      setError(t("leaveForm.reasonRequired"));
      return;
    }

    setSubmitting(true);
    try {
      await createLeaveRequest({
        leave_type_id: jenisIzin,
        start_date: tanggalMulai,
        end_date: tanggalSelesai,
        reason: alasan.trim(),
      });
      setJenisIzin("");
      setTanggalMulai("");
      setTanggalSelesai("");
      setAlasan("");
      setSuccess(true);
      if (onSubmitted) await onSubmitted();
    } catch (err) {
      if (err instanceof ApiError && err.code === "INSUFFICIENT_QUOTA") {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : t("leaveForm.submitFailed"));
      }
    } finally {
      setSubmitting(false);
    }
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

      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-lg px-4 py-3 mb-4">
          {t("leaveForm.submitSuccess")}
        </p>
      )}

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("leaveForm.typeLabel")}
        </label>
        <select
          value={jenisIzin}
          onChange={(e) => setJenisIzin(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        >
          <option value="">{t("leaveForm.typePlaceholder")}</option>
          {leaveTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
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
            required
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
            required
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
          required
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#16304f] transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {submitting ? t("common.saving") : t("leaveForm.submit")}
      </button>
    </form>
  );
}
