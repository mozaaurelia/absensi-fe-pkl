"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#1E3A5F] pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="bg-white/10 rounded-3xl p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="text-xs font-bold text-blue-200 tracking-wide uppercase mb-3">
              {t("cta.eyebrow")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 max-w-lg">
              {t("cta.title")}
            </h2>
            <p className="text-blue-200/70 text-sm max-w-lg leading-relaxed">
              {t("cta.desc")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="#kontak"
              className="bg-white text-[#1E3A5F] font-semibold text-sm px-6 py-3 rounded-lg text-center hover:bg-blue-50 transition-colors"
            >
              {t("cta.scheduleDemo")}
            </a>
            <a
              href="#kontak"
              className="border border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-lg text-center hover:bg-white/10 transition-colors"
            >
              {t("cta.contactAdmin")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}