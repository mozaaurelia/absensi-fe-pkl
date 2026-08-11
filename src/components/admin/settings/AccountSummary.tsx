"use client";

import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import type { Profile } from "@/lib/services/profile";

interface Props {
  profile: Profile | null;
}

export default function AccountSummary({ profile }: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  const rows = [
    { label: t("accountSummary.role"), value: profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Administrator") },
    { label: t("accountSummary.department"), value: profile?.department || "Operasional" },
    { label: t("accountSummary.device"), value: t("accountSummary.deviceValue") },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-full">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-5">{t("accountSummary.title")}</h3>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">{row.label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
