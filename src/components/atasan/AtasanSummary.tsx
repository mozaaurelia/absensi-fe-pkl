"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { TeamAttendanceSummary } from "@/lib/services/dashboard";

interface Props {
  summary: TeamAttendanceSummary | null;
  pendingLeaveCount?: number;
}

export default function AtasanSummary({ summary, pendingLeaveCount = 0 }: Props) {
  const { t } = useLanguage();

  const stats = [
    {
      label: t("atasan.present"),
      value: String(summary?.present ?? 0),
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
    {
      label: t("atasan.late"),
      value: String(summary?.late ?? 0),
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      label: t("atasan.absent"),
      value: String(summary?.absent ?? 0),
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-500/10",
    },
    {
      label: t("atasan.notCheckedIn"),
      value: String(summary?.not_checked_in ?? 0),
      color: "text-gray-600",
      bg: "bg-gray-100 dark:bg-gray-700",
    },
    {
      label: t("atasan.pendingApproval"),
      value: String(pendingLeaveCount ?? 0),
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
            <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
          </div>
          <p className="text-xs text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
