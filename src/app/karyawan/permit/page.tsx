"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import PermitHeader from "@/components/karyawan/permit/PermitHeader";
import PermitContent from "@/components/karyawan/permit/PermitContent";

export default function PermitPage() {
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

  return (
    <KaryawanLayout>
      <PermitHeader />
      <PermitContent />
    </KaryawanLayout>
  );
}
