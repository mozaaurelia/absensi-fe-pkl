"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AttendanceInformation() {
  const { t } = useLanguage();

  const info = [
    { label: t("attendanceInfo.location"), value: t("attendanceInfo.headOffice") },
    { label: t("attendanceInfo.verification"), value: t("attendanceInfo.gpsValid") },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-6">
      {info.map((item) => (
        <div key={item.label} className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">{item.label}</p>
          <p className="text-sm font-semibold text-gray-800">{item.value}</p>
        </div>
      ))}
    </div>
  );
}