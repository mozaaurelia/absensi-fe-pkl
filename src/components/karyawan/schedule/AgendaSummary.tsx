"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiFileText, FiList } from "react-icons/fi";
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

  const quota = dash?.leave_quota_balance;
  const remaining =
    typeof quota === "number" ? quota : (quota?.remaining ?? null);
  const leaveValue =
    remaining != null
      ? `${remaining} ${t("leaveHistory.daysUnit")}`
      : t("agendaSummary.leaveValue");

  const stats = [
    { label: t("agendaSummary.shiftActive"), value: shiftValue, note: t("agendaSummary.today"), noteColor: "text-green-600 dark:text-green-300", icon: <FiClock size={18} />, iconBox: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400" },
    { label: t("agendaSummary.todayAgenda"), value: t("agendaSummary.todayValue"), note: t("agendaList.today"), noteColor: "text-blue-600 dark:text-blue-300", icon: <FiCalendar size={18} />, iconBox: "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" },
    { label: t("agendaSummary.leaveRemaining"), value: leaveValue, note: t("agendaSummary.thisYear"), noteColor: "text-amber-600 dark:text-amber-300", icon: <FiFileText size={18} />, iconBox: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" },
    { label: t("agendaSummary.monthAgenda"), value: t("agendaSummary.monthValue"), note: t("agendaSummary.thisMonth"), noteColor: "text-purple-600 dark:text-purple-300", icon: <FiList size={18} />, iconBox: "bg-sky-50 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <AgendaSummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}