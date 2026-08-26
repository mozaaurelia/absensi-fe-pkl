"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import AtasanHeader from "@/components/atasan/AtasanHeader";
import AtasanSummary from "@/components/atasan/AtasanSummary";
import TeamAttendance from "@/components/atasan/TeamAttendance";
import LeaveApproval from "@/components/atasan/LeaveApproval";
import OvertimeApproval from "@/components/atasan/OvertimeApproval";
import { getSupervisorDashboard, type DashboardSupervisorData } from "@/lib/services/dashboard";
import { getTeamAttendance, type AttendanceRecord } from "@/lib/services/attendance";
import { getTeamLeaveRequests, type LeaveRequest } from "@/lib/services/leave";
import { getTeamOvertimeRequests, type OvertimeTeamRequest } from "@/lib/services/attendance";
import CompanyChat from "@/components/common/CompanyChat";
import AtasanLayout from "@/components/atasan/AtasanLayout";

export default function DashboardAtasanPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  const [summary, setSummary] = useState<DashboardSupervisorData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [overtime, setOvertime] = useState<OvertimeTeamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (status !== "authenticated" || !user || (user.role !== "supervisor" && user.role !== "admin")) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [dash, team, leave, ot] = await Promise.all([
        getSupervisorDashboard(),
        getTeamAttendance(),
        getTeamLeaveRequests(),
        getTeamOvertimeRequests(),
      ]);
      setSummary(dash);
      setAttendance(Array.isArray(team) ? team : []);
      setRequests(Array.isArray(leave) ? leave : []);
      setOvertime(Array.isArray(ot) ? ot : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  }, [status, user, t]);

  useEffect(() => {
    if (status === "authenticated" && user && (user.role === "supervisor" || user.role === "admin")) {
      loadData();
    }
  }, [loadData, status, user]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  if (!user || (user.role !== "supervisor" && user.role !== "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">{t("accessDenied")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="space-y-6">
          <div className="h-16 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
            <div className="h-72 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center max-w-md">
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
      </div>
    );
  }

  return (
    <AtasanLayout>
      <AtasanHeader />
      <AtasanSummary summary={summary?.team_today ?? null} pendingLeaveCount={summary?.pending_leave_count} />

      <div id="attendance" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamAttendance records={attendance} />
        <div id="leave"><LeaveApproval requests={requests} onProcessed={loadData} /></div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div id="overtime"><OvertimeApproval requests={overtime} onProcessed={loadData} /></div>
        <div id="chat"><CompanyChat /></div>
      </div>
    </AtasanLayout>
  );
}
