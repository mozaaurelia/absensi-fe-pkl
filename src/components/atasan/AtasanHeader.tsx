"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { clearAccessToken } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/common/LanguageToggle";
import AttendanceShortcut from "@/components/common/AttendanceShortcut";

export default function AtasanHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("atasan.title")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {t("atasan.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <AttendanceShortcut dark={false} />
        <LanguageToggle dark={false} />
        <button
          onClick={() => {
            clearAccessToken();
            signOut({ callbackUrl: "/auth/login" });
          }}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("common.logout")}
        </button>
      </div>

      {user?.name && (
        <p className="text-xs text-gray-400 sm:hidden">{user.name}</p>
      )}
    </div>
  );
}
