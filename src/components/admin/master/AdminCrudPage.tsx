"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Layout from "@/components/admin/layout/layout";

interface Props {
  titleKey: string;
  children: ReactNode;
  hideTitle?: boolean;
}

export default function AdminCrudPage({ titleKey, children, hideTitle = false }: Props) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && user?.role !== "admin")
    ) {
      router.replace("/auth/login");
    }
  }, [status, user, router]);

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
      {!hideTitle && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t(titleKey)}
          </h2>
        </div>
      )}
      {children}
    </Layout>
  );
}