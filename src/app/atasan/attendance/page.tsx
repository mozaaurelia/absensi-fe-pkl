"use client";

import { useCallback, useEffect, useState } from "react";
import AtasanAccessGuard from "@/components/atasan/AtasanAccessGuard";
import AtasanLayout from "@/components/atasan/AtasanLayout";
import AtasanHeader from "@/components/atasan/AtasanHeader";
import TeamAttendance from "@/components/atasan/TeamAttendance";
import { getTeamAttendance, type AttendanceRecord } from "@/lib/services/attendance";
import { useLanguage } from "@/context/LanguageContext";

export default function AtasanAttendancePage() {
  const { t } = useLanguage();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeamAttendance();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AtasanAccessGuard>
      <AtasanLayout>
        <AtasanHeader />
        {loading ? <PageLoading /> : error ? <PageError message={error} onRetry={loadData} /> : <TeamAttendance records={records} />}
      </AtasanLayout>
    </AtasanAccessGuard>
  );
}

function PageLoading() {
  return <div className="h-72 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />;
}

function PageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { t } = useLanguage();
  return <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center"><p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p><button onClick={onRetry} className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#16304f] transition-colors">{t("common.retry")}</button></div>;
}