"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Workflow() {
  const { t } = useLanguage();
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = -rect.height;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const offset = (progress - 0.5) * 120;
      el.style.transform = `translateX(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = t("workflow.steps");

  const recap = [
    { name: "Andi Pratama", status: t("workflow.statusPresent"), color: "bg-green-100 text-green-700" },
    { name: "Sinta Rahma", status: t("workflow.statusSick"), color: "bg-purple-100 text-purple-700" },
    { name: "Maya Lestari", status: t("workflow.statusLate"), color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <section id="alur" className="bg-slate-50 py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center mb-16">
        <p className="text-xs font-bold text-[#1E3A5F] tracking-wide uppercase mb-3">
          {t("workflow.eyebrow")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t("workflow.title")}
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-20">
        <div
          ref={stepsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5"
          style={{ willChange: "transform" }}
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="step-card bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="step-number w-8 h-8 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="bg-black rounded-[28px] p-3">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {t("workflow.portalTitle")}
                </p>
                <p className="text-xs text-gray-400">
                  {t("workflow.portalDesc")}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A5F] text-xs font-bold flex items-center justify-center">
                HR
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                [t("workflow.kpiEmployee"), "150"],
                [t("workflow.kpiPresent"), "94%"],
                [t("workflow.kpiLeave"), "5"],
                [t("workflow.kpiAbsent"), "2"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">
                {t("workflow.recapTitle")}
              </p>
              <span className="bg-[#1E3A5F] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                {t("workflow.export")}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {recap.map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-700">{row.name}</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.color}`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-[#1E3A5F] tracking-wide uppercase mb-3">
            {t("workflow.responsiveEyebrow")}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {t("workflow.responsiveTitle")}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {t("workflow.responsiveDesc")}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-1">{t("workflow.desktopTitle")}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t("workflow.desktopDesc")}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-1">{t("workflow.mobileTitle")}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t("workflow.mobileDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
