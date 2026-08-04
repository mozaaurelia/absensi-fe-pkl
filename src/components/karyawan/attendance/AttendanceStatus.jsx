"use client";

import { useLanguage } from "@/context/LanguageContext";

const styles = {
  notCheckedIn: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  present: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  late: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

export default function AttendanceStatus({ statusKey = "notCheckedIn" }) {
  const { t } = useLanguage();

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
        styles[statusKey] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {t(`attendanceStatus.${statusKey}`)}
    </span>
  );
}