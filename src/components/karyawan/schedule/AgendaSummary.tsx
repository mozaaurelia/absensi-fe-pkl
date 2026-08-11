"use client";

import { useEffect, useState } from "react";
import AgendaSummaryCard from "./AgendaSummaryCard";
import { useLanguage } from "@/context/LanguageContext";
import { getEmployeeDashboard, type DashboardEmployeeData } from "@/lib/services/dashboard";

function toHHMM(value?: string | null): string | null {
  if (!value) return null;
  const p = value.split(":");
  return p.length >= 2 ? `${p[0]}:${p[1]}` : value;
}

export default function AgendaSummary() {
  const { t } = useLanguage();
  const [dash, setDash] = useState<DashboardEmployeeData | null>(null);

  useEffect(() => {
    let cancelled = false;
    getEmployeeDashboard()
      .then((data) => {
        if (!cancelled) setDash(data);
      })
      .catch(() => {
        if (!cancelled) setDash(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const start = toHHMM(dash?.current_schedule?.start_time);
  const end = toHHMM(dash?.current_schedule?.end_time);
  const shiftValue =
    start && end ? `${start} - ${end}` : t("agendaSummary.shiftValue");

  const remaining = dash?.leave_quota_balance?.remaining;
  const leaveValue =
    remaining != null
      ? `${remaining} ${t("leaveHistory.daysUnit")}`
      : t("agendaSummary.leaveValue");

  const stats = [
    { label: t("agendaSummary.shiftActive"), value: shiftValue, note: t("agendaSummary.today"), noteColor: "text-green-300" },
    { label: t("agendaSummary.todayAgenda"), value: t("agendaSummary.todayValue"), note: t("agendaList.today"), noteColor: "text-blue-200" },
    { label: t("agendaSummary.leaveRemaining"), value: leaveValue, note: t("agendaSummary.thisYear"), noteColor: "text-amber-300" },
    { label: t("agendaSummary.monthAgenda"), value: t("agendaSummary.monthValue"), note: t("agendaSummary.thisMonth"), noteColor: "text-purple-300" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <AgendaSummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}