"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ProfileForm from "./ProfileForm";
import AccountSummary from "./AccountSummary";
import SecurityForm from "./SecurityForm";
import { getMe, type Profile } from "@/lib/services/profile";

interface Props {
  isSaving: boolean;
  onSavingChange: (saving: boolean) => void;
  resetSignal: number;
}

export default function SettingsContent({
  isSaving,
  onSavingChange,
  resetSignal,
}: Props) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProfile(await getMe());
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-96 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
        <div className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("common.loadErrorTitle")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={loadProfile}
          className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#16304f] transition-colors"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileForm
            profile={profile}
            isLoading={isLoading}
            isSaving={isSaving}
            onSavingChange={onSavingChange}
            onProfileUpdated={loadProfile}
            resetSignal={resetSignal}
          />
        </div>
        <div>
          <AccountSummary profile={profile} />
        </div>
      </div>

      <SecurityForm />
    </div>
  );
}
