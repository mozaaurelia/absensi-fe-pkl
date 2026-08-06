"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LoginLeftSection() {
  const { t } = useLanguage();

  const stats = [
    { value: "150+", label: t("login.statEmployees") },
    { value: "94%", label: t("login.statAttendance") },
    { value: "24/7", label: t("login.statMonitoring") },
  ];

  return (
    <div className="hidden lg:flex w-1/2 bg-[#1E3A5F] flex-col justify-center px-16 py-12">
      <div className="max-w-md">
        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-8">
          <span className="text-white font-bold text-lg">EA</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">{t("common.appName")}</h1>
        <p className="text-blue-200/80 mb-10">{t("login.subtitle")}</p>

        <h2 className="text-2xl font-bold text-white leading-snug mb-4">
          {t("login.heroTitle")}
        </h2>
        <p className="text-blue-200/70 text-sm leading-relaxed mb-10">
          {t("login.heroDesc")}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 rounded-xl px-4 py-3"
            >
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-blue-200/70 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 rounded-xl px-5 py-4 flex items-center gap-4 flex-1">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <circle cx="12" cy="12" r="3" />
              <circle cx="16" cy="9" r="1" fill="white" />
              <path d="M12 15v2" />
            </svg>
            <div>
              <p className="text-white text-sm font-semibold">{t("login.faceLabel")}</p>
              <p className="text-blue-200/70 text-xs">{t("login.faceDesc")}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl px-5 py-4 flex items-center gap-4 flex-1">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <p className="text-white text-sm font-semibold">{t("login.locationLabel")}</p>
              <p className="text-blue-200/70 text-xs">{t("login.locationDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
