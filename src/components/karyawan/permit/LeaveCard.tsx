"use client";

import StatusBadge from "./StatusBadge";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  tipe: string;
  statusKey: string;
  tanggal: string;
  durasi: string;
  highlight?: boolean;
}

export default function LeaveCard({ tipe, statusKey, tanggal, durasi, highlight }: Props) {
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
    </div>
  );
}
