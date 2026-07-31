"use client";

import { useLanguage } from "@/context/LanguageContext";

const styles = {
  notCheckedIn: "bg-amber-100 text-amber-700",
  present: "bg-green-100 text-green-700",
  late: "bg-amber-100 text-amber-700",
};

export default function AttendanceStatus({ statusKey = "notCheckedIn" }) {
  const { t } = useLanguage();

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
        styles[statusKey] || "bg-gray-100 text-gray-600"
      }`}
    >
      {t(`attendanceStatus.${statusKey}`)}
    </span>
  );
}