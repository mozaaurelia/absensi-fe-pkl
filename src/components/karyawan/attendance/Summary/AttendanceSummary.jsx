"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function AttendanceSummary({ selectedDate }) {
  const { t } = useLanguage();
  const stats = useMemo(() => {
    const monday = getMonday(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hadir = 0;
    let belum = 0;
    let tidak = 0;
    let todayBelum = false;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const diffDays = Math.floor((d - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        if (i < 2) {
          hadir++;
        } else {
          tidak++;
        }
      } else if (diffDays === 0) {
        if (i < 2) {
          hadir++;
        } else {
          todayBelum = true;
          belum++;
        }
      } else {
        belum++;
      }
    }

    return { hadir, belum, tidak, todayBelum };
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
        <p className="text-3xl font-bold text-green-600">{stats.hadir}</p>
        <p className="text-sm font-medium text-green-700 mt-1">{t("attendanceSummary.checkedIn")}</p>
      </div>
      <div className={`rounded-2xl border p-5 text-center ${
        stats.todayBelum
          ? "bg-red-50 border-red-200"
          : "bg-gray-50 border-gray-200"
      }`}>
        <p className={`text-3xl font-bold ${
          stats.todayBelum ? "text-red-600" : "text-gray-600"
        }`}>{stats.belum}</p>
        <p className={`text-sm font-medium mt-1 ${
          stats.todayBelum ? "text-red-700" : "text-gray-700"
        }`}>{t("attendanceSummary.notCheckedIn")}</p>
      </div>
      <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-center">
        <p className="text-3xl font-bold text-red-600">{stats.tidak}</p>
        <p className="text-sm font-medium text-red-700 mt-1">{t("attendanceSummary.absent")}</p>
      </div>
    </div>
  );
}
