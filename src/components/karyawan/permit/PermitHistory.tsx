"use client";

import { useMemo } from "react";
import LeaveCard from "./LeaveCard";
import { useLanguage } from "@/context/LanguageContext";
import type { LeaveRequest } from "@/lib/services/leave";

interface Props {
  requests: LeaveRequest[];
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function PermitHistory({ requests }: Props) {
  const { t } = useLanguage();

  const items = useMemo(
    () =>
      requests.map((req) => ({
        id: req.id,
        tipe: req.leave_type_name || "-",
        statusKey: (req.status ?? "pending").toLowerCase(),
        tanggal:
          req.start_date && req.end_date && req.start_date !== req.end_date
            ? `${formatDate(req.start_date)} - ${formatDate(req.end_date)}`
            : formatDate(req.start_date),
        durasi:
          req.total_days != null
            ? `${req.total_days} ${t("leaveHistory.daysUnit")}`
            : "-",
      })),
    [requests, t],
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("leaveHistory.title")}</h3>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
          {items.slice(0, 3).length} {t("leaveHistory.dataLabel")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        {t("leaveHistory.desc")}
      </p>

      {items.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">{t("common.emptyData")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.slice(0, 3).map((item) => (
            <LeaveCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
