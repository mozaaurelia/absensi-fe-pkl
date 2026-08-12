"use client";

import { useMemo } from "react";
import { FiCalendar, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import SummaryCard from "./SummaryCard";
import { useLanguage } from "@/context/LanguageContext";
import type { LeaveRequest, LeaveQuota } from "@/lib/services/leave";

interface Props {
  quota: LeaveQuota | LeaveQuota[] | null;
  requests: LeaveRequest[];
}

export default function LeaveSummary({ quota, requests }: Props) {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const quotas = Array.isArray(quota) ? quota : quota ? [quota] : [];
    const used = quotas.reduce((sum, q) => sum + (Number(q.used) || 0), 0);
    const remaining = quotas.reduce((sum, q) => sum + (Number(q.remaining) || 0), 0);

    const pending = requests.filter(
      (r) => (r.status ?? "").toLowerCase() === "pending",
    ).length;
    const rejected = requests.filter(
      (r) => (r.status ?? "").toLowerCase() === "rejected",
    ).length;

    return { used, remaining, pending, rejected };
  }, [quota, requests]);

  const statsList = [
    { label: t("leaveSummary.leaveRemaining"), value: String(stats.remaining), note: t("leaveSummary.stillAvailable"), noteColor: "text-green-300", icon: <FiCalendar size={16} /> },
    { label: t("leaveSummary.leaveUsed"), value: String(stats.used), note: t("leaveSummary.thisYear"), noteColor: "text-blue-200", icon: <FiCheckCircle size={16} /> },
    { label: t("leaveSummary.pendingRequests"), value: String(stats.pending), note: t("leaveSummary.waitingSupervisor"), noteColor: "text-amber-300", icon: <FiClock size={16} /> },
    { label: t("leaveSummary.rejectedRequests"), value: String(stats.rejected), note: t("leaveSummary.needsRevision"), noteColor: "text-red-300", icon: <FiXCircle size={16} /> },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsList.map((stat) => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
