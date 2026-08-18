"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  triggerCronJob,
} from "@/lib/services/admin";

export default function AdminToolsPanel() {
  const { t } = useLanguage();

  const [cronError, setCronError] = useState<string | null>(null);
  const [cronSuccess, setCronSuccess] = useState<string | null>(null);
  const [cronRunning, setCronRunning] = useState<string | null>(null);

  const runJob = async (job: "auto-alpha" | "monthly-quota" | "monthly-recap") => {
    setCronRunning(job);
    setCronError(null);
    setCronSuccess(null);
    try {
      const res = await triggerCronJob(job);
      setCronSuccess(res.message);
    } catch (err) {
      setCronError(err instanceof Error ? err.message : t("adminTools.cronFailed"));
    } finally {
      setCronRunning(null);
    }
  };

  const cronJobs = [
    { job: "auto-alpha" as const, labelKey: "adminTools.autoAlpha", descKey: "adminTools.autoAlphaDesc" },
    { job: "monthly-quota" as const, labelKey: "adminTools.monthlyQuota", descKey: "adminTools.monthlyQuotaDesc" },
    { job: "monthly-recap" as const, labelKey: "adminTools.monthlyRecap", descKey: "adminTools.monthlyRecapDesc" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
          {t("adminTools.cronTitle")}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
          {t("adminTools.cronDesc")}
        </p>

        {cronError && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400 rounded-lg">
            {cronError}
          </div>
        )}
        {cronSuccess && (
          <div className="mb-4 px-4 py-3 bg-green-50 dark:bg-green-500/10 text-xs text-green-600 dark:text-green-400 rounded-lg">
            {cronSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cronJobs.map((item) => (
            <div
              key={item.job}
              className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col"
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                {t(item.labelKey)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 flex-1">
                {t(item.descKey)}
              </p>
              <button
                onClick={() => runJob(item.job)}
                disabled={cronRunning !== null}
                className="bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
              >
                {cronRunning === item.job ? t("common.saving") : t("adminTools.run")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}