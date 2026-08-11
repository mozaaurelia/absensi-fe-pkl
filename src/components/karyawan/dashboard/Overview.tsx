"use client";

import { useMemo } from "react";
import { FiClock, FiBriefcase, FiCalendar, FiAlertTriangle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { formatHours, formatHoursEn } from "@/lib/workHours";
import { computeWeeklyStats, countLateThisMonth } from "@/lib/attendanceStats";
import type { AttendanceRecord } from "@/lib/services/attendance";
import type { DashboardTodayAttendance, LeaveQuotaBalance } from "@/lib/services/dashboard";

const iconMap = [FiClock, FiBriefcase, FiCalendar, FiAlertTriangle];

interface Props {
  todayAttendance?: DashboardTodayAttendance | null;
  leaveQuota?: LeaveQuotaBalance | null;
  attendanceList: AttendanceRecord[];
}

export default function Overview({ todayAttendance, leaveQuota, attendanceList }: Props) {
  const { lang, t } = useLanguage();

  const weeklyStats = useMemo(() => computeWeeklyStats(attendanceList), [attendanceList]);
  const lateCount = useMemo(() => countLateThisMonth(attendanceList, 9), [attendanceList]);

  const hasCheckedIn = !!todayAttendance?.clock_in_time;
  const isLate = todayAttendance?.status === "telat";

  const fmt = lang === "en" ? formatHoursEn : formatHours;
  const totalMin = weeklyStats.totalMinutes ?? 0;
  const progress = weeklyStats.progress ?? 0;
  const weekHoursText = fmt(totalMin);

  const leaveRemaining = leaveQuota?.remaining ?? 0;

  const todayTag = hasCheckedIn
    ? { text: isLate ? t("overview.needsReviewTag") : t("overview.activeTag"), color: isLate ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700" }
    : { text: t("overview.pendingTag"), color: "bg-amber-100 text-amber-700" };

  const todayValue = hasCheckedIn
    ? isLate
      ? t("overview.needsReviewTag")
      : t("overview.activeTag")
    : t("overview.notCheckedIn");

  const weekTag =
    progress >= 100
      ? { text: t("overview.completeTag"), color: "bg-green-100 text-green-700" }
      : progress >= 60
        ? { text: t("overview.normalTag"), color: "bg-green-100 text-green-700" }
        : { text: t("overview.inProgressTag"), color: "bg-amber-100 text-amber-700" };

  const stats = [
    { label: t("overview.todayStatus"), value: todayValue, tag: todayTag.text, tagColor: todayTag.color },
    { label: t("overview.weekHours"), value: weekHoursText, tag: weekTag.text, tagColor: weekTag.color },
    { label: t("overview.leaveRemaining"), value: `${leaveRemaining} ${t("overview.daysUnit")}`, tag: t("overview.activeTag"), tagColor: "bg-blue-100 text-blue-700" },
    { label: t("overview.lateThisMonth"), value: `${lateCount} ${t("overview.timesUnit")}`, tag: lateCount > 0 ? t("overview.needsReviewTag") : t("overview.normalTag"), tagColor: lateCount > 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[i];
        return (
          <div
            key={stat.label}
            className="bg-[#1E3A5F] text-white rounded-2xl p-5 card-hover opacity-0 animate-fade-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 text-blue-100 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${stat.tagColor}`}
              >
                {stat.tag}
              </span>
            </div>
            <p className="font-bold text-white text-lg">{stat.value}</p>
            <p className="text-xs text-blue-200/80 mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}