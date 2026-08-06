"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  const stats = [
    { value: "150+", label: t("hero.employees") },
    { value: "94%", label: t("hero.attendance") },
    { value: "3 Role", label: t("hero.mainUsers") },
  ];

  return (
    <section
      id="beranda"
      className="relative bg-[#1E3A5F] overflow-hidden pb-24 pt-16"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <span className="inline-block bg-white/10 text-blue-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          {t("hero.badge")}
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          {t("hero.title")}
        </h1>

        <p className="text-blue-200/80 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
          {t("hero.desc")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="/auth/login"
            className="bg-white text-[#1E3A5F] font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {t("hero.tryDemo")}
          </a>
          <a
            href="/auth/login"
            className="border border-white/30 text-white font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {t("hero.seeFeatures")}
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-xl px-4 py-4">
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-blue-200/70 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}