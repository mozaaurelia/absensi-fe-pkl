"use client";

import { useEffect, useRef, useState } from "react";
import { FiBell, FiCalendar, FiChevronLeft, FiChevronRight, FiSun } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import type { CurrentSchedule, LeaveQuotaBalance } from "@/lib/services/dashboard";
import CompanyChat from "@/components/common/CompanyChat";

interface Props {
  currentSchedule?: CurrentSchedule | null;
  leaveQuota?: number | LeaveQuotaBalance | null;
}

function toTime(value?: string | null): string {
  if (!value) return "--:--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    const match = value.match(/(\d{1,2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : value;
  }
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function DashboardRightPanel({ currentSchedule, leaveQuota }: Props) {
  const { t } = useLanguage();

  const [index, setIndex] = useState(0);

  const shiftStart = toTime(currentSchedule?.start_time);
  const shiftEnd = toTime(currentSchedule?.end_time);
  const daysLeft =
    typeof leaveQuota === "number"
      ? leaveQuota
      : (leaveQuota?.remaining ?? 0);

  const slides = [
    {
      icon: <FiSun size={18} />,
      iconBox: "bg-green-200 text-green-700",
      label: t("dashboardPanel.notification.shiftActive"),
      labelColor: "text-green-300",
      value: `${shiftStart} - ${shiftEnd}`,
    },
    {
      icon: <FiCalendar size={18} />,
      iconBox: "bg-blue-200 text-[#1E3A5F]",
      label: t("dashboardPanel.notification.leaveRemaining"),
      labelColor: "text-blue-200",
      value: `${daysLeft} ${t("overview.daysUnit")}`,
    },
    {
      icon: <FiBell size={18} />,
      iconBox: "bg-amber-200 text-amber-700",
      label: t("dashboardPanel.notification.reminder"),
      labelColor: "text-amber-300",
      value: t("dashboardPanel.notification.reminderText"),
    },
  ];

  const slide = slides[index];
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="space-y-6">
      <div className="bg-[#1E3A5F] text-white rounded-3xl p-6 shadow-[0_24px_60px_rgba(30,58,95,0.18)] overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
              {t("dashboardPanel.notification.title")}
            </p>
          </div>
        </div>

        <div className="relative px-2">
          <button
            onClick={prev}
            aria-label={t("common.previous")}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#1E3A5F] shadow-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiChevronLeft size={18} />
          </button>

          <div
            key={index}
            className="rounded-[30px] bg-white/10 p-6 border border-white/15 min-h-[110px] flex items-center animate-fade-slide-in"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${slide.iconBox}`}>
                {slide.icon}
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${slide.labelColor}`}>{slide.label}</p>
                <p className="text-base font-bold text-white leading-snug">{slide.value}</p>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            aria-label={t("common.next")}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#1E3A5F] shadow-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <CompanyChat />
    </div>
  );
}
