"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import ScheduleHeader from "@/components/karyawan/schedule/ScheduleHeader";
import ScheduleContent from "@/components/karyawan/schedule/ScheduleContent";

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== "employee")) {
      router.replace("/auth/login");
    }
  }, [status, user, router]);

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
      <ScheduleHeader />
      <ScheduleContent />
    </KaryawanLayout>
  );
}