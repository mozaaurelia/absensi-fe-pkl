"use client";

import { useSession } from "next-auth/react";
import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  isSaving?: boolean;
  onCancel?: () => void;
}

export default function SettingsHeader({ isSaving = false, onCancel }: Props) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-[#1E3A5F] dark:text-blue-300 font-bold text-base flex items-center justify-center overflow-hidden shrink-0">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : user?.name ? (
            user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          ) : (
            "AD"
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("settingsHeader.title")}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {t("settingsHeader.desc")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton form="profile-form" loading={isSaving} />
      </div>
    </div>
  );
}
