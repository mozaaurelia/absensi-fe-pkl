"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { EmployeeProfile } from "@/lib/services/employee";

interface Props {
  profile: EmployeeProfile | null;
  isLoading: boolean;
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = value.slice(0, 10);
  return date || "-";
}

export default function AccountSummary({ profile, isLoading }: Props) {
  const { t } = useLanguage();

  const rows = [
    {
      id: "role",
      label: t("accountSummary.role"),
      value: profile?.role_name ?? "-",
    },
    {
      id: "department",
      label: t("accountSummary.department"),
      value: profile?.department_name ?? "-",
    },
    {
      id: "position",
      label: t("accountSummary.position"),
      value: profile?.position_name ?? "-",
    },
    {
      id: "supervisor",
      label: t("accountSummary.supervisor"),
      value: profile?.supervisor_name ?? "-",
    },
    {
      id: "company",
      label: t("accountSummary.company"),
      value: profile?.company_name ?? "-",
    },
    {
      id: "join-date",
      label: t("accountSummary.joinDate"),
      value: formatDate(profile?.join_date),
    },
    {
      id: "marital-status",
      label: t("accountSummary.maritalStatus"),
      value: t("accountSummary.notMarried"),
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        {t("accountSummary.title")}
      </h2>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3"
          >
            <p className="text-xs text-gray-400 mb-1">{row.label}</p>

            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {isLoading && !profile ? "Loading..." : row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
