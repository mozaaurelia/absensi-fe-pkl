"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import AttendanceHeader from "@/components/karyawan/attendance/AttendanceHeader";
import AttendanceContent from "@/components/karyawan/attendance/AttendanceContent";


export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, user, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950" />;
  }

  if (!user || user.role !== "employee") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("accessDenied")}</p>
      </div>
    );
  }

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  return (
    <KaryawanLayout contentClassName="flex-1 p-4 md:p-8 space-y-6">
      <AttendanceHeader
        selectedDate={selectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />

      <AttendanceContent selectedDate={selectedDate} />
    </KaryawanLayout>
  );
}
