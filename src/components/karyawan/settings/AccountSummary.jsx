"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AccountSummary() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const rows = [
    { label: t("accountSummary.role"), value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : t("login.roleEmployee") },
    { label: t("accountSummary.department"), value: user?.divisi || "Operasional" },
    { label: t("accountSummary.device"), value: t("accountSummary.deviceValue") },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full">
      <h3 className="font-bold text-gray-900 mb-5">{t("accountSummary.title")}</h3>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">{row.label}</p>
            <p className="text-sm font-semibold text-gray-800">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
