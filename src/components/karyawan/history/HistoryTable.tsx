"use client";

import { useLanguage } from "@/context/LanguageContext";

interface AttendanceLog {
  day: string;
  date: string;
  status: "present" | "late" | "sick";
  checkIn: string;
  checkOut: string;
  total: string;
  location: "jakarta" | "bandung";
}

const attendanceLogs: AttendanceLog[] = [
  {
    day: "Jumat",
    date: "13/03/2026",
    status: "present",
    checkIn: "08:42",
    checkOut: "17:58",
    total: "8j 16m",
    location: "jakarta",
  },
  {
    day: "Kamis",
    date: "12/03/2026",
    status: "present",
    checkIn: "08:50",
    checkOut: "17:55",
    total: "8j 05m",
    location: "jakarta",
  },
  {
    day: "Rabu",
    date: "11/03/2026",
    status: "late",
    checkIn: "08:57",
    checkOut: "17:47",
    total: "8j 50m",
    location: "jakarta",
  },
  {
    day: "Selasa",
    date: "10/03/2026",
    status: "present",
    checkIn: "08:40",
    checkOut: "17:55",
    total: "8j 55m",
    location: "bandung",
  },
];

const statusStyles: Record<AttendanceLog["status"], string> = {
  present:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  late: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  sick: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
};

function StatusDot({ status }: { status: AttendanceLog["status"] }) {
  const dot =
    status === "present"
      ? "bg-emerald-500"
      : status === "late"
        ? "bg-amber-500"
        : "bg-blue-500";

  return <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />;
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export default function HistoryTable() {
  const { t } = useLanguage();

  const statusLabel = (status: AttendanceLog["status"]) =>
    status === "present"
      ? t("historyTable.present")
      : status === "late"
        ? t("historyTable.late")
        : t("historyTable.sick");

  const locationLabel = (location: AttendanceLog["location"]) =>
    location === "jakarta"
      ? t("historyTable.jakartaOffice")
      : t("historyTable.bandungOffice");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
      <div className="bg-[#1E3A5F] text-white px-5 py-4">
        <h3 className="text-lg font-bold">{t("historyTable.title")}</h3>
        <p className="text-xs text-blue-100/80 mt-0.5">{t("historyTable.desc")}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/40">
              <th className="text-left font-semibold text-xs text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                {t("historyTable.date")}
              </th>
              <th className="text-left font-semibold text-xs text-gray-500 dark:text-gray-400 px-4 py-3 whitespace-nowrap">
                {t("historyTable.checkIn")}
              </th>
              <th className="text-left font-semibold text-xs text-gray-500 dark:text-gray-400 px-4 py-3 whitespace-nowrap">
                {t("historyTable.checkOut")}
              </th>
              <th className="text-left font-semibold text-xs text-gray-500 dark:text-gray-400 px-4 py-3 whitespace-nowrap">
                {t("historyTable.location")}
              </th>
              <th className="text-left font-semibold text-xs text-gray-500 dark:text-gray-400 px-4 py-3 whitespace-nowrap">
                {t("historyTable.status")}
              </th>
              <th className="text-right font-semibold text-xs text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                {t("historyTable.totalHours")}
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceLogs.map((item) => (
              <tr
                key={`${item.day}-${item.date}`}
                className="border-b border-gray-50 dark:border-gray-700/60 last:border-0 hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {item.day}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {item.date}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckIcon className="text-gray-400 dark:text-gray-500" />
                    {item.checkIn}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {item.checkOut}
                </td>
                <td className="px-4 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {locationLabel(item.location)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                  >
                    <StatusDot status={item.status} />
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
