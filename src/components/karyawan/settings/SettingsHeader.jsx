"use client";

import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsHeader() {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t("settingsHeader.title")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {t("settingsHeader.desc")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CancelButton />
        <SaveButton form="profile-form" />
      </div>
    </div>
  );
}
