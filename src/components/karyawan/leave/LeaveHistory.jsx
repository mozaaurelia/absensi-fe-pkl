"use client";

import LeaveCard from "./LeaveCard";
import { useLanguage } from "@/context/LanguageContext";

export default function LeaveHistory() {
  const { t } = useLanguage();

  const data = [
    { tipe: t("leaveHistory.annualLeave"), statusKey: "approved", tanggal: "3 - 4 Mei 2026", durasi: t("leaveHistory.days2") },
    { tipe: t("leaveHistory.sick"), statusKey: "pending", tanggal: "12 Juli 2026", durasi: t("leaveHistory.days1") },
    { tipe: t("leaveHistory.projectOvertime"), statusKey: "pending", tanggal: "15 Juli 2026", durasi: t("leaveHistory.duration230"), highlight: true },
    { tipe: t("leaveHistory.operationalOvertime"), statusKey: "approved", tanggal: "8 Juli 2026", durasi: t("leaveHistory.duration400") },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900">{t("leaveHistory.title")}</h3>
        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          {data.length} {t("leaveHistory.dataLabel")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        {t("leaveHistory.desc")}
      </p>

      <div className="flex flex-col gap-3">
        {data.map((item, i) => (
          <LeaveCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
