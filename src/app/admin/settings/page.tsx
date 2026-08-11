"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Layout from "@/components/admin/layout/layout";
import SettingsHeader from "@/components/admin/settings/SettingsHeader";
import SettingsContent from "@/components/admin/settings/SettingsContent";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== "admin")) {
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

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">{t("accessDenied")}</p>
      </div>
    );
  }

  return (
    <Layout>
      <SettingsHeader isSaving={isSaving} onCancel={handleCancel} />
      <SettingsContent
        isSaving={isSaving}
        onSavingChange={handleSavingChange}
        resetSignal={resetSignal}
      />
    </Layout>
  );
}
