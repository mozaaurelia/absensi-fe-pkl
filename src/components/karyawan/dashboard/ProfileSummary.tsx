"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getMyProfile, type EmployeeProfile } from "@/lib/services/employee";
import { FiHash, FiGrid, FiUser, FiCheckCircle } from "react-icons/fi";

export default function ProfileSummary() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);

  const load = useCallback(async () => {
    try {
      setProfile(await getMyProfile());
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = [
    { label: t("profileSummary.email"), value: profile?.email ?? "—", icon: FiHash, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/15" },
    { label: t("profileSummary.division"), value: profile?.department_name ?? "—", icon: FiGrid, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/15" },
    { label: t("profileSummary.supervisor"), value: profile?.supervisor_name ?? "—", icon: FiUser, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/15" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
          <FiUser size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("profileSummary.title")}</h3>
          <p className="text-xs text-gray-400">{t("profileSummary.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="rounded-xl px-4 py-3 flex items-center gap-3 opacity-0 animate-fade-slide-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-9 h-9 rounded-lg ${row.bg} ${row.color} flex items-center justify-center shrink-0`}>
                <Icon size={17} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{row.value}</p>
              </div>
            </div>
          );
        })}

        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FiCheckCircle size={17} />
          </div>
          <div>
            <p className="text-xs text-[#1E3A5F] dark:text-blue-300 font-semibold">{t("profileSummary.lastSubmission")}</p>
            <p className="text-sm font-semibold text-[#1E3A5F] dark:text-blue-300">{t("profileSummary.lastSubmissionValue")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
