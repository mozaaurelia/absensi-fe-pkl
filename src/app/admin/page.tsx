"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "@/components/admin/layout/Sidebar";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useSession } from "next-auth/react";


export default function DashboardAdminPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== "admin")) {
      router.replace("/auth/login");
    }
  }, [user, status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  if (!user || user.role !== "admin") {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("adminSidebar.dashboard")}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{t("admin.comingSoon")}</p>
          </div>
          <LanguageToggle dark={false} />
        </div>
      </main>
    </div>
  );
}
