"use client";

import { useCallback, useEffect, useState } from "react";
import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import LemburContent from "@/components/admin/lembur/LemburContent";
import { useLanguage } from "@/context/LanguageContext";
import { getTeamOvertimeRequests, type OvertimeTeamRequest } from "@/lib/services/attendance";

export default function AdminOvertimePage() {
  const { t } = useLanguage();

  const [overtime, setOvertime] = useState<OvertimeTeamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTeamOvertimeRequests();
      setOvertime(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AdminCrudPage titleKey="adminCrud.overtimeTitle">
      {isLoading ? (
        <div className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#16304f] transition-colors"
          >
            {t("common.retry")}
          </button>
        </div>
      ) : (
        <LemburContent requests={overtime} onProcessed={loadData} />
      )}
    </AdminCrudPage>
  );
}