"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "@/components/karyawan/dashboard/SidebarWidget";
import DashboardHeader from "@/components/karyawan/dashboard/DashboardHeader";
import Overview from "@/components/karyawan/dashboard/Overview";
import Attendance from "@/components/karyawan/dashboard/Attendance";
import WeeklyWork from "@/components/karyawan/dashboard/WeeklyWork";
import CalendarCard from "@/components/karyawan/dashboard/CalendarCard";
import DashboardRightPanel from "@/components/karyawan/dashboard/DashboardRightPanel";

export default function DashboardKaryawanPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== "employee")) {
      router.replace("/auth/login");
    }
  }, [status, user?.role, router]);

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 p-8">
        <DashboardHeader user={user} />

        <div className="mb-6">
          <Overview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Attendance />
          <WeeklyWork />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6 mb-6">
          <CalendarCard />
          <DashboardRightPanel />
        </div>
      </main>
    </div>
  );
}
