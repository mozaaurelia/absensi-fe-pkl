"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "@/components/karyawan/dashboard/SidebarWidget";
import SettingsHeader from "@/components/karyawan/settings/SettingsHeader";
import SettingsContent from "@/components/karyawan/settings/SettingsContent";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== "employee")) {
      router.replace("/auth/login");
    }
  }, [status, user, router]);

  const handleCancel = useCallback(() => {
    setResetSignal((s) => s + 1);
  }, []);

  const handleSavingChange = useCallback((saving: boolean) => {
    setIsSaving(saving);
  }, []);

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
        <SettingsHeader isSaving={isSaving} onCancel={handleCancel} />
        <SettingsContent
          isSaving={isSaving}
          onSavingChange={handleSavingChange}
          resetSignal={resetSignal}
        />
      </main>
    </div>
  );
}
