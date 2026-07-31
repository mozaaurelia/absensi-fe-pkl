"use client";

import { useLanguage } from "@/context/LanguageContext";

function buildDate(y, m, d) {
  return new Date(y, m - 1, d);
}

function formatDate(date, daysFull, months) {
  return `${daysFull[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function HistoryTable() {
  const { daysFull, months, t } = useLanguage();
  const y = 2026;
  const m = 6;
  const logs = [
    { date: formatDate(buildDate(y, m, 1), daysFull, months), masuk: "08:55", pulang: "18:02", lokasi: "jakartaOffice", status: "present", color: "bg-green-100 text-green-700", total: "9j 07m" },
    { date: formatDate(buildDate(y, m, 2), daysFull, months), masuk: "09:12", pulang: "18:05", lokasi: "jakartaOffice", status: "late", color: "bg-amber-100 text-amber-700", total: "8j 53m" },
    { date: formatDate(buildDate(y, m, 3), daysFull, months), masuk: "08:48", pulang: "17:58", lokasi: "jakartaOffice", status: "present", color: "bg-green-100 text-green-700", total: "9j 10m" },
    { date: formatDate(buildDate(y, m, 4), daysFull, months), masuk: "--:--", pulang: "--:--", lokasi: "notAvailable", status: "sick", color: "bg-purple-100 text-purple-700", total: "0j 00m" },
    { date: formatDate(buildDate(y, m, 5), daysFull, months), masuk: "08:51", pulang: "17:45", lokasi: "bandungOffice", status: "present", color: "bg-green-100 text-green-700", total: "8j 54m" },
    { date: formatDate(buildDate(y, m, 8), daysFull, months), masuk: "09:20", pulang: "18:10", lokasi: "jakartaOffice", status: "late", color: "bg-amber-100 text-amber-700", total: "8j 50m" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900">{t("historyTable.title")}</h3>
        <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Export XLSX
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        {t("historyTable.desc")}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
              <th className="pb-3 pt-3 px-3 font-medium">{t("historyTable.date")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("historyTable.checkIn")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("historyTable.checkOut")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("historyTable.location")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("historyTable.status")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("historyTable.totalHours")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.date} className="border-b border-gray-50 last:border-0">
                <td className="py-3 px-3 font-semibold text-gray-800">{log.date}</td>
                <td className="py-3 px-3 text-gray-600">{log.masuk}</td>
                <td className="py-3 px-3 text-gray-600">{log.pulang}</td>
                <td className="py-3 px-3 text-gray-600">{t(`historyTable.${log.lokasi}`)}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${log.color}`}>
                    {t(`historyTable.${log.status}`)}
                  </span>
                </td>
                <td className="py-3 px-3 font-semibold text-gray-800">{log.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
