"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import DashboardHeader from "@/components/karyawan/dashboard/DashboardHeader";
import Overview from "@/components/karyawan/dashboard/Overview";
import Attendance from "@/components/karyawan/dashboard/Attendance";
import WeeklyWork from "@/components/karyawan/dashboard/WeeklyWork";
import CalendarCard from "@/components/karyawan/dashboard/CalendarCard";
import ProfileSummary from "@/components/karyawan/dashboard/ProfileSummary";
import Agenda from "@/components/karyawan/dashboard/Agenda";
import DashboardRightPanel from "@/components/karyawan/dashboard/DashboardRightPanel";
import {
  getEmployeeDashboard,
  type DashboardEmployeeData,
} from "@/lib/services/dashboard";
import { getMyAttendance, type AttendanceRecord } from "@/lib/services/attendance";

export default function DashboardKaryawanPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardEmployeeData | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== "employee")) {
      router.replace("/auth/login");
    }
  }, [status, user?.role, router]);

  const loadData = useCallback(async () => {
    if (status !== "authenticated" || !user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [dash, att] = await Promise.all([
        getEmployeeDashboard(),
        getMyAttendance(),
      ]);
      setDashboard(dash);
      setAttendanceList(Array.isArray(att) ? att : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.loadErrorDesc"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [status, user, t]);

  useEffect(() => {
    if (status === "authenticated" && user?.role === "employee") {
      loadData();
    }
  }, [status, user, loadData]);

  if (status === "loading") {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  if (!user || user.role !== "employee") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">{t("accessDenied")}</p>
      </div>
    );
  }

  return (
    <KaryawanLayout>
      <DashboardHeader user={user} />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#1E3A5F]/15 dark:bg-gray-800 rounded-2xl h-36 animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
            <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      ) : error ? (
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
      ) : (
        <>
          <div className="mb-6">
            <Overview
              todayAttendance={dashboard?.today_attendance}
              leaveQuota={dashboard?.leave_quota_balance}
              attendanceList={attendanceList}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Attendance
              todayAttendance={dashboard?.today_attendance}
              currentSchedule={dashboard?.current_schedule}
            />
            <WeeklyWork attendanceList={attendanceList} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6 mb-6">
            <div className="space-y-6">
              <ProfileSummary />
              <Agenda />
              <CalendarCard />
            </div>
            <DashboardRightPanel
              currentSchedule={dashboard?.current_schedule}
              leaveQuota={dashboard?.leave_quota_balance}
            />
          </div>
        </>
      )}
    </KaryawanLayout>
  );
}