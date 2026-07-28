"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/karyawan/dashboard/Sidebar/Sidebar";
import Overview from "@/components/karyawan/dashboard/Overview/Overview";
import Attendance from "@/components/karyawan/dashboard/Attendance/Attendance";
import WeeklyWork from "@/components/karyawan/dashboard/WeeklyWork/WeeklyWork";
import ProfileSummary from "@/components/karyawan/dashboard/ProfileSummary/ProfileSummary";
import AttendanceHistory from "@/components/karyawan/dashboard/AttendanceHistory/AttendanceHistory";
import Agenda from "@/components/karyawan/dashboard/Agenda/Agenda";

export default function DashboardKaryawanPage() {
  const { user, isLoaded } = useAuth();
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
        <p className="text-gray-500 text-sm">Akses ditolak. Mengalihkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Halo, Andi Pratama
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Rabu, 8 Juli 2026 · Dashboard Karyawan
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Karyawan</p>
              <p className="text-xs text-gray-400">Operasional</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1E3A5F] font-bold text-sm flex items-center justify-center">
              AP
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Overview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Attendance />
          <WeeklyWork />
          <ProfileSummary />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AttendanceHistory />
          </div>
          <Agenda />
        </div>
      </main>
    </div>
  );
}