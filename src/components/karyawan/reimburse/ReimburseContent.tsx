"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import ReimburseSummary from "./ReimburseSummary";
import ReimburseForm from "./ReimburseForm";
import ReimburseHistory from "./ReimburseHistory";
import { getMyReimburseRequests, type ReimburseItem } from "@/lib/services/reimburse";

export default function ReimburseContent() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const [requests, setRequests] = useState<ReimburseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const employeeId = session?.user?.id;
    if (!employeeId) return;
    setIsLoading(true);
    setError(null);
    try {
      const reqs = await getMyReimburseRequests();
      setRequests(Array.isArray(reqs) ? reqs : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sorted = useMemo(
    () =>
      [...requests].sort((a, b) =>
        String(b.created_at ?? b.expense_date).localeCompare(String(a.created_at ?? a.expense_date)),
      ),
    [requests],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-96 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("common.loadErrorTitle")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={loadData}
          className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#16304f] transition-colors"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <ReimburseSummary requests={sorted} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReimburseForm onSubmitted={loadData} />
        </div>

        <div>
          <ReimburseHistory requests={sorted} />
        </div>
      </div>
    </div>
  );
}
