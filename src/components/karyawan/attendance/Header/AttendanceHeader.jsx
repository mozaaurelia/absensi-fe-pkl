"use client";

import { useEffect, useMemo, useState } from "react";
import { FiUser } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import Notification from "@/components/karyawan/notification/Notification";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function AttendanceHeader({ selectedDate, onPrevDay, onNextDay }) {
  const { daysShort, months, locale, t } = useLanguage();
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const weekDays = useMemo(() => {
    const monday = getMonday(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday = d.getTime() === today.getTime();
      days.push({
        name: daysShort[d.getDay()],
        date: d.getDate().toString(),
        active: isToday,
        full: d,
      });
    }
    return days;
  }, [selectedDate, daysShort]);

  const start = weekDays[0];
  const end = weekDays[6];
  const year = start.full.getFullYear();
  const rangeText =
    start.full.getMonth() === end.full.getMonth()
      ? `${start.date} - ${end.date} ${months[start.full.getMonth()]} ${year}`
      : `${start.date} ${months[start.full.getMonth()]} - ${end.date} ${months[end.full.getMonth()]} ${year}`;

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const timeStr = now
    ? now.toLocaleTimeString(locale, { hour12: false })
    : "--:--:--";

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#1E3A5F] to-[#2a4f7a] p-6 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{t("attendanceHeader.title")}</h3>
          <p className="mt-1 text-sm text-blue-200/80">{rangeText}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-blue-200">
            {t("attendanceHeader.morningShift")}
          </span>
          <Notification />
          <button className="text-white/70 hover:text-white transition">
            <FiUser size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-5 mb-6">
        <button
          onClick={onPrevDay}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          &lt;
        </button>
        <p className="text-xl font-semibold text-white">{dateStr}</p>
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-200/80"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          <span className="text-base font-semibold tabular-nums tracking-wider text-white">
            {timeStr}
          </span>
          <span className="text-blue-200/60 text-[11px]">
            {t("dashboardHeader.timezone")}
          </span>
        </div>
        <button
          onClick={onNextDay}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((item) => (
          <div
            key={item.name + item.date}
            className={`rounded-2xl border p-3 text-center ${
              item.active
                ? "border-white/30 bg-white/15 shadow-sm"
                : "border-white/10 bg-white/5"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                item.active ? "text-white" : "text-blue-200/60"
              }`}
            >
              {item.name}
            </p>
            <div className={`mt-2 flex h-10 items-center justify-center rounded-xl text-sm font-bold ${
              item.active ? "bg-white/20 text-white" : "bg-white/10 text-blue-200/80"
            }`}>
              {item.active ? <span className="text-xl">🔥</span> : <span>{item.date}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
