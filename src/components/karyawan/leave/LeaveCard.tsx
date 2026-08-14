"use client";

import StatusBadge from "./StatusBadge";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  tipe: string;
  statusKey: string;
  tanggal: string;
  durasi: string;
  highlight?: boolean;
  attachmentUrl?: string | null;
}

function attachmentName(url?: string | null): string {
  if (!url) return "lampiran";
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").filter(Boolean).pop() ?? "lampiran");
  } catch {
    return "lampiran";
  }
}

export default function LeaveCard({ tipe, statusKey, tanggal, durasi, highlight, attachmentUrl }: Props) {
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

      {attachmentUrl && (
        <a
          href={attachmentUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] dark:text-blue-300 hover:underline"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("leaveCard.viewAttachment")} · {attachmentName(attachmentUrl)}
        </a>
      )}
    </div>
  );
}