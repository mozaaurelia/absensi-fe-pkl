"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { ReimburseItem } from "@/lib/services/reimburse";

interface Props {
  requests: ReimburseItem[];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
  approved: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300",
  rejected: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300",
};

const CATEGORY_COLORS: Record<string, string> = {
  transport: "#3B82F6",
  meal: "#F59E0B",
  health: "#EF4444",
  education: "#8B5CF6",
  other: "#6B7280",
};

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(String(value).length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function ReimburseHistory({ requests }: Props) {
  const { t, locale } = useLanguage();

  const items = useMemo(() => {
    const fmt = (value: number) =>
      new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(value);
    return requests.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category || "other",
      status: (r.status ?? "pending").toLowerCase(),
      expenseDate: formatDate(r.expense_date),
      amount: fmt(Number(r.amount) || 0),
      note: r.approval_note ?? null,
      attachmentUrl: r.attachment_url ?? null,
    }));
  }, [requests, locale]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          {t("karyawanReimburse.historyTitle")}
        </h3>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
          {requests.length} {t("karyawanReimburse.dataLabel")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">{t("karyawanReimburse.historyDesc")}</p>

      {items.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">{t("common.emptyData")}</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other }}
                  />
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                    {item.title}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    STATUS_STYLES[item.status] ?? STATUS_STYLES.pending
                  }`}
                >
                  {t(`karyawanReimburse.status_${item.status}`)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>{t(`karyawanReimburse.cat_${item.category}`)}</span>
                <span>{item.expenseDate}</span>
              </div>
              <div className="flex items-center justify-between gap-3 mt-2">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.amount}</p>
                {item.attachmentUrl && (
                  <a
                    href={item.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#1E3A5F] dark:text-blue-300 hover:underline"
                  >
                    {t("karyawanReimburse.viewAttachment")}
                  </a>
                )}
              </div>
              {item.note && (
                <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                  {t("karyawanReimburse.noteLabel")} {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
