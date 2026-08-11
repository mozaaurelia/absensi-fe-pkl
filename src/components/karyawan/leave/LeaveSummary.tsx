"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SummaryCard from "./SummaryCard";
import { useLanguage } from "@/context/LanguageContext";
import type { LeaveRequest, LeaveQuota } from "@/lib/services/leave";
import { getMyOvertimeRequests, type OvertimeRequest } from "@/lib/services/attendance";

interface Props {
  quota: LeaveQuota | LeaveQuota[] | null;
  requests: LeaveRequest[];
}

export default function LeaveSummary({ quota, requests }: Props) {
  const { t } = useLanguage();
  const [overtime, setOvertime] = useState<OvertimeRequest[]>([]);

  const loadOvertime = useCallback(async () => {
    try {
      const rows = await getMyOvertimeRequests();
      setOvertime(Array.isArray(rows) ? rows : []);
    } catch {
      setOvertime([]);
    }
  }, []);

  useEffect(() => {
    loadOvertime();
  }, [loadOvertime]);

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

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthApproved = overtime
      .filter((o) => (o.status ?? "").toLowerCase() === "approved")
      .filter((o) => (o.overtime_date ?? "").startsWith(monthKey))
      .reduce((sum, o) => sum + (Number(o.total_hours) || 0), 0);
    const overtimePending = overtime.filter(
      (o) => (o.status ?? "").toLowerCase() === "pending",
    ).length;

    return { used, remaining, pending, rejected, monthApproved, overtimePending };
  }, [quota, requests, overtime]);

  const statsList = [
    { label: t("leaveSummary.leaveRemaining"), value: String(stats.remaining), note: t("leaveSummary.stillAvailable"), noteColor: "text-green-600" },
    { label: t("leaveSummary.leaveUsed"), value: String(stats.used), note: t("leaveSummary.thisYear"), noteColor: "text-blue-600" },
    { label: t("leaveSummary.pendingRequests"), value: String(stats.pending), note: t("leaveSummary.waitingSupervisor"), noteColor: "text-orange-500" },
    { label: t("leaveSummary.rejectedRequests"), value: String(stats.rejected), note: t("leaveSummary.needsRevision"), noteColor: "text-red-600" },
    { label: t("leaveSummary.overtimeMonth"), value: String(stats.monthApproved), note: t("leaveSummary.recorded"), noteColor: "text-purple-600" },
    { label: t("leaveSummary.overtimePending"), value: String(stats.overtimePending), note: t("leaveSummary.needsApproval"), noteColor: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {statsList.map((stat) => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
