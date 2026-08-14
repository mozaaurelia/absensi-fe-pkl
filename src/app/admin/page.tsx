"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Layout from "@/components/admin/layout/layout";
import DashboardContent from "@/components/admin/dashboard/DashboardContent";
import { getAdminDashboard, type DashboardAdminData } from "@/lib/services/dashboard";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  const [data, setData] = useState<DashboardAdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  const loadData = useCallback(async () => {
    if (status !== "authenticated" || !user) return;
    setIsLoading(true);
    setError(null);
    try {
      setData(await getAdminDashboard());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.loadErrorDesc"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [status, user, t]);

  useEffect(() => {
    if (status === "authenticated" && user?.role === "admin") {
      loadData();
    }
  }, [status, user, loadData]);

  if (status === "loading") {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">{t("accessDenied")}</p>
      </div>
    );
  }

  return (
    <Layout>
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
            <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      ) : error ? (
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
      ) : (
        <DashboardContent data={data} />
      )}
    </Layout>
  );
}