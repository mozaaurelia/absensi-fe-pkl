"use client";

import { FiClock, FiBriefcase, FiCalendar, FiAlertTriangle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const iconMap = [FiClock, FiBriefcase, FiCalendar, FiAlertTriangle];
const colorMap = [
  { bg: "bg-amber-50", ic: "text-amber-600" },
  { bg: "bg-green-50", ic: "text-green-600" },
  { bg: "bg-blue-50", ic: "text-blue-600" },
  { bg: "bg-red-50", ic: "text-red-600" },
];

export default function Overview() {
  const { t } = useLanguage();

  const stats = [
    { label: t("overview.todayStatus"), value: t("overview.notCheckedIn"), tag: t("overview.pendingTag"), tagColor: "bg-amber-100 text-amber-700" },
    { label: t("overview.weekHours"), value: "32j 14m", tag: t("overview.normalTag"), tagColor: "bg-green-100 text-green-700" },
    { label: t("overview.leaveRemaining"), value: `12 ${t("overview.daysUnit")}`, tag: t("overview.activeTag"), tagColor: "bg-blue-100 text-blue-700" },
    { label: t("overview.lateThisMonth"), value: `2 ${t("overview.timesUnit")}`, tag: t("overview.needsReviewTag"), tagColor: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[i];
        const colors = colorMap[i];
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 card-hover opacity-0 animate-fade-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center ${colors.ic}`}>
                <Icon size={20} />
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${stat.tagColor}`}
              >
                {stat.tag}
              </span>
            </div>
            <p className="font-bold text-gray-900 text-lg">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
