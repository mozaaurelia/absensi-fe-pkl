"use client";

import { useCallback, useState } from "react";
import Sidebar from "@/components/karyawan/dashboard/SidebarWidget";
import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import SettingsHeader from "@/components/karyawan/settings/SettingsHeader";
import SettingsContent from "@/components/karyawan/settings/SettingsContent";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const handleCancel = useCallback(() => {
    setResetSignal((s) => s + 1);
  }, []);

  const handleSavingChange = useCallback((saving: boolean) => {
    setIsSaving(saving);
  }, []);

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
