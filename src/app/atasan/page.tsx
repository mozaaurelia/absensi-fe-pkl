"use client";

import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/common/LanguageToggle";

export default function DashboardAtasanPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      <div className="absolute top-6 right-6">
        <LanguageToggle dark={false} />
      </div>
      <p className="text-gray-500 text-sm">{t("atasan.comingSoon")}</p>
    </div>
  );
}
