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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("settingsHeader.title")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {t("settingsHeader.desc")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton form="profile-form" loading={isSaving} />
      </div>
    </div>
  );
}
