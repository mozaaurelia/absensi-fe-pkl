"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { FiHash, FiGrid, FiUser, FiCheckCircle } from "react-icons/fi";

export default function ProfileSummary() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const rows = [
    { label: "NIK", value: user?.nik || "EMP-00124", icon: FiHash, color: "text-purple-600", bg: "bg-purple-50" },
    { label: t("profileSummary.division"), value: user?.divisi || "Operasional", icon: FiGrid, color: "text-blue-600", bg: "bg-blue-50" },
    { label: t("profileSummary.supervisor"), value: user?.atasan || "Surya Prasetya", icon: FiUser, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
          <FiUser size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{t("profileSummary.title")}</h3>
          <p className="text-xs text-gray-400">{t("profileSummary.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="rounded-xl px-4 py-3 flex items-center gap-3 opacity-0 animate-fade-slide-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-9 h-9 rounded-lg ${row.bg} ${row.color} flex items-center justify-center shrink-0`}>
                <Icon size={17} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm font-semibold text-gray-800">{row.value}</p>
              </div>
            </div>
          );
        })}

        <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FiCheckCircle size={17} />
          </div>
          <div>
            <p className="text-xs text-[#1E3A5F] font-semibold">{t("profileSummary.lastSubmission")}</p>
            <p className="text-sm font-semibold text-[#1E3A5F]">{t("profileSummary.lastSubmissionValue")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
