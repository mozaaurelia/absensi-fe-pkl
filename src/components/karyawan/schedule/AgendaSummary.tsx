"use client";

import AgendaSummaryCard from "./AgendaSummaryCard";
import { useLanguage } from "@/context/LanguageContext";

export default function AgendaSummary() {
  const { t } = useLanguage();

  const stats = [
    { label: t("agendaSummary.shiftActive"), value: t("agendaSummary.shiftValue"), note: t("agendaSummary.today"), noteColor: "text-green-600" },
    { label: t("agendaSummary.todayAgenda"), value: t("agendaSummary.todayValue"), note: t("agendaList.today"), noteColor: "text-blue-600" },
    { label: t("agendaSummary.leaveRemaining"), value: t("agendaSummary.leaveValue"), note: t("agendaSummary.thisYear"), noteColor: "text-amber-600" },
    { label: t("agendaSummary.monthAgenda"), value: t("agendaSummary.monthValue"), note: t("agendaSummary.thisMonth"), noteColor: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <AgendaSummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
