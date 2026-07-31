"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function HistorySummary() {
  const { t } = useLanguage();
  const stats = [
    { label: t("historySummary.presentDays"), value: "21" },
    { label: t("historySummary.totalHours"), value: "168j 30m" },
    { label: t("historySummary.late"), value: `3 ${t("historySummary.daysUnit")}` },
    { label: t("historySummary.permitSick"), value: `2 ${t("historySummary.daysUnit")}` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
          <p className="font-bold text-gray-900 text-lg">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}