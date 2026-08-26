"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";

export default function AtasanAccessGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const isSupervisor = session?.user?.role === "supervisor";

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
  }, [status, router]);

  if (status === "loading") return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;

  if (!isSupervisor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("accessDenied")}</p>
      </div>
    );
  }

  return <>{children}</>;
}