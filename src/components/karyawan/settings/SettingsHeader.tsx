"use client";

import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  isSaving?: boolean;
  onCancel?: () => void;
}

export default function SettingsHeader({ isSaving = false, onCancel }: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("settingsHeader.title")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {t("settingsHeader.desc")}
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <CancelButton onClick={onCancel} />
        <SaveButton form="profile-form" loading={isSaving} />
      </div>
    </div>
  );
}
