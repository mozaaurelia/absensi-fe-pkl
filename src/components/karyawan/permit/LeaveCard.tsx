"use client";

import StatusBadge from "./StatusBadge";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  tipe: string;
  statusKey: string;
  tanggal: string;
  durasi: string;
  highlight?: boolean;
  onRequestLetter?: () => void;
}

export default function LeaveCard({ tipe, statusKey, tanggal, durasi, highlight, onRequestLetter }: Props) {
  const { t } = useLanguage();

  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "bg-purple-50/60 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/30"
          : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">{t("leaveCard.type")}</p>
          <p
            className={`text-sm font-bold ${
              highlight ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {tipe}
          </p>
        </div>
        <StatusBadge statusKey={statusKey} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">{t("leaveCard.date")}</p>
          <p
            className={`text-sm font-semibold ${
              highlight ? "text-purple-700 dark:text-purple-300" : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {tanggal}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">{t("leaveCard.duration")}</p>
          <p
            className={`text-sm font-semibold ${
              highlight ? "text-purple-700 dark:text-purple-300" : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {durasi}
          </p>
        </div>
      </div>

      {statusKey === "approved" && onRequestLetter && (
        <button
          onClick={onRequestLetter}
          className="mt-3 w-full flex items-center justify-center gap-1.5 border border-[#1E3A5F] dark:border-blue-400/40 text-[#1E3A5F] dark:text-blue-300 text-xs font-semibold py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Unduh Surat Resmi
        </button>
      )}
    </div>
  );
}
