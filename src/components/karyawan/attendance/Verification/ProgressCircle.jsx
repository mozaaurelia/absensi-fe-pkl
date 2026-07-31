"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ProgressCircle({ step = 1 }) {
  const { t } = useLanguage();
  const steps = [
    { id: 1, label: t("progressCircle.location") },
    { id: 2, label: t("progressCircle.photo") },
    { id: 3, label: t("progressCircle.done") },
  ];

  return (
    <div className="flex items-center mb-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step > s.id
                  ? "bg-[#1E3A5F] text-white"
                  : step === s.id
                  ? "bg-gradient-to-br from-[#1E3A5F] to-[#4F46E5] text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s.id ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                s.id
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-2 mb-4 rounded-full ${
                step > s.id ? "bg-[#1E3A5F]" : "bg-gray-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}