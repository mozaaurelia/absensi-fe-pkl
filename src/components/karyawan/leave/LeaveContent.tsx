"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import LeaveSummary from "./LeaveSummary";
import LeaveForm from "./LeaveForm";
import OvertimeForm from "./OvertimeForm";
import LeaveHistory from "./LeaveHistory";
import {
  getLeaveTypes,
  getMyLeaveRequests,
  getLeaveQuota,
  type LeaveType,
  type LeaveRequest,
  type LeaveQuota,
} from "@/lib/services/leave";

export default function LeaveContent() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [quota, setQuota] = useState<LeaveQuota | LeaveQuota[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const employeeId = session?.user?.id;
    if (!employeeId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [types, reqs, quotaData] = await Promise.all([
        getLeaveTypes(),
        getMyLeaveRequests(),
        getLeaveQuota(employeeId),
      ]);
      setLeaveTypes(Array.isArray(types) ? types : []);
      setRequests(Array.isArray(reqs) ? reqs : []);
      setQuota(quotaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-96 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("common.loadErrorTitle")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={loadData}
          className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#16304f] transition-colors"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <LeaveSummary quota={quota} requests={requests} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <LeaveForm leaveTypes={leaveTypes} onSubmitted={loadData} />
          <OvertimeForm />
        </div>

        <div>
          <LeaveHistory requests={requests} />
        </div>
      </div>
    </div>
  );
}
