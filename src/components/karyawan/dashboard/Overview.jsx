"use client";

import { useState, useEffect } from "react";
import { FiClock, FiBriefcase, FiCalendar, FiAlertTriangle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { getWeeklyStats, formatHours, formatHoursEn } from "@/lib/workHours";

const iconMap = [FiClock, FiBriefcase, FiCalendar, FiAlertTriangle];
const colorMap = [
  { bg: "bg-amber-50", ic: "text-amber-600" },
  { bg: "bg-green-50", ic: "text-green-600" },
  { bg: "bg-blue-50", ic: "text-blue-600" },
  { bg: "bg-red-50", ic: "text-red-600" },
];

function getTodayStatusTag(totalMinutes, t) {
  if (totalMinutes === 0) return { text: t("overview.pendingTag"), color: "bg-amber-100 text-amber-700" };
  return { text: t("overview.activeTag"), color: "bg-green-100 text-green-700" };
}

function getWeekHoursTag(progress, t) {
  if (progress >= 100) return { text: t("overview.completeTag"), color: "bg-green-100 text-green-700" };
  if (progress >= 60) return { text: t("overview.normalTag"), color: "bg-green-100 text-green-700" };
  return { text: t("overview.inProgressTag"), color: "bg-amber-100 text-amber-700" };
}

function getLateCount() {
  let count = 0;
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (d > now) break;
    const key = `checkin_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const ct = new Date(parseInt(raw, 10));
    if (ct.getHours() > 9 || (ct.getHours() === 9 && ct.getMinutes() > 0)) {
      count++;
    }
  }
  return count;
}

export default function Overview() {
  const { lang, t } = useLanguage();
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [lateCount, setLateCount] = useState(0);

  useEffect(() => {
    setWeeklyStats(getWeeklyStats());
    setLateCount(getLateCount());
    const interval = setInterval(() => {
      setWeeklyStats(getWeeklyStats());
      setLateCount(getLateCount());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fmt = lang === "en" ? formatHoursEn : formatHours;
  const totalMin = weeklyStats?.totalMinutes ?? 0;
  const progress = weeklyStats?.progress ?? 0;
  const weekHoursText = fmt(totalMin);
  const statusTag = getTodayStatusTag(totalMin, t);
  const weekTag = getWeekHoursTag(progress, t);

  const stats = [
    { label: t("overview.todayStatus"), value: t("overview.notCheckedIn"), tag: statusTag.text, tagColor: statusTag.color },
    { label: t("overview.weekHours"), value: weekHoursText, tag: weekTag.text, tagColor: weekTag.color },
    { label: t("overview.leaveRemaining"), value: `12 ${t("overview.daysUnit")}`, tag: t("overview.activeTag"), tagColor: "bg-blue-100 text-blue-700" },
    { label: t("overview.lateThisMonth"), value: `${lateCount} ${t("overview.timesUnit")}`, tag: lateCount > 0 ? t("overview.needsReviewTag") : t("overview.normalTag"), tagColor: lateCount > 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[i];
        const colors = colorMap[i];
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 card-hover opacity-0 animate-fade-slide-up"
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
            <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
