"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "@/components/karyawan/dashboard/Sidebar/Sidebar";
import DashboardHeader from "@/components/karyawan/dashboard/DashboardHeader/DashboardHeader";
import Overview from "@/components/karyawan/dashboard/Overview/Overview";
import Attendance from "@/components/karyawan/dashboard/Attendance/Attendance";
import WeeklyWork from "@/components/karyawan/dashboard/WeeklyWork/WeeklyWork";

import Agenda from "@/components/karyawan/dashboard/Agenda/Agenda";

export default function DashboardKaryawanPage() {
  const { user, isLoaded } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && (!user || user.role !== "karyawan")) {
      router.replace("/auth/login");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  if (!user || user.role !== "karyawan") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">{t("accessDenied")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
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

        <Agenda />
      </main>
    </div>
  );
}
