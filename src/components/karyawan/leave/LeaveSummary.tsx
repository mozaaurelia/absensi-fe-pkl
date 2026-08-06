"use client";

import SummaryCard from "./SummaryCard";
import { useLanguage } from "@/context/LanguageContext";

export default function LeaveSummary() {
  const { t } = useLanguage();
  const stats = [
    { label: t("leaveSummary.leaveRemaining"), value: t("leaveSummary.leaveRemainingValue"), note: t("leaveSummary.stillAvailable"), noteColor: "text-green-600" },
    { label: t("leaveSummary.leaveUsed"), value: t("leaveSummary.leaveUsedValue"), note: t("leaveSummary.thisYear"), noteColor: "text-blue-600" },
    { label: t("leaveSummary.pendingRequests"), value: t("leaveSummary.pendingValue"), note: t("leaveSummary.waitingSupervisor"), noteColor: "text-orange-500" },
    { label: t("leaveSummary.rejectedRequests"), value: t("leaveSummary.rejectedValue"), note: t("leaveSummary.needsRevision"), noteColor: "text-red-600" },
    { label: t("leaveSummary.overtimeMonth"), value: t("leaveSummary.overtimeMonthValue"), note: t("leaveSummary.recorded"), noteColor: "text-purple-600" },
    { label: t("leaveSummary.overtimePending"), value: t("leaveSummary.overtimePendingValue"), note: t("leaveSummary.needsApproval"), noteColor: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat) => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}