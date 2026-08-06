"use client";

import { useState, useEffect, useMemo } from "react";
import { FiList, FiCalendar, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getDateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function AttendanceHistory({ selectedDate }) {
  const [storedData, setStoredData] = useState({});
  const { months, daysFull, t } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = {};
    for (let i = 0; i < 7; i++) {
      const monday = getMonday(selectedDate);
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = getDateKey(d);
      data[dateKey] = {
        selfie: localStorage.getItem("selfie_" + dateKey),
        lokasi: (() => {
          const raw = localStorage.getItem("lokasi_" + dateKey);
          return raw ? JSON.parse(raw) : null;
        })(),
      };
    }
    setStoredData(data);
  }, [selectedDate]);

  const deletePhoto = (dateKey) => {
    localStorage.removeItem("selfie_" + dateKey);
    setStoredData((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] || {}), selfie: null },
    }));
  };

  const { logs, period } = useMemo(() => {
    const monday = getMonday(selectedDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const periodText = `${monday.getDate()} ${months[monday.getMonth()]} - ${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;

    const logs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = getDateKey(d);
      const entry = storedData[dateKey] || {};
      logs.push({
        no: i + 1,
        date: `${daysFull[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
        dateKey,
        masuk: i < 4 ? (i === 0 ? "08:56" : i === 1 ? "09:14" : i === 2 ? "--:--" : "-") : "-",
        pulang: i < 4 ? (i === 0 ? "18:03" : i === 1 ? "18:00" : i === 2 ? "--:--" : "-") : "-",
        statusKey: i === 0 ? "present" : i === 1 ? "late" : i === 2 ? "notCheckedIn" : i === 3 ? "scheduled" : "-",
        color: i === 0 ? "bg-green-100 text-green-700" : i === 1 ? "bg-amber-100 text-amber-700" : i === 2 ? "bg-amber-100 text-amber-700" : i === 3 ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-500",
        selfie: entry.selfie || null,
        lokasi: entry.lokasi || null,
      });
    }

    return { logs, period: periodText };
  }, [selectedDate, storedData, months, daysFull]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <FiList size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("attendanceHistory.title")}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t("attendanceHistory.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-400">
          <FiCalendar size={13} />
          <span>{period}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <table className="w-full text-sm text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="text-left text-xs text-white bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a]">
              <th className="pb-3 pt-3 px-3 font-medium w-8">{t("attendanceHistory.no")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("attendanceHistory.photo")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("attendanceHistory.date")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("attendanceHistory.checkIn")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("attendanceHistory.checkOut")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("attendanceHistory.location")}</th>
              <th className="pb-3 pt-3 px-3 font-medium">{t("attendanceHistory.status")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr
                key={log.date}
                className="border-b border-gray-100 dark:border-gray-700 last:border-0 opacity-0 animate-fade-slide-in"
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <td className="py-3 px-3 text-gray-400 text-xs font-medium">{log.no}</td>
                <td className="py-3 px-3">
                  <div className="group relative w-12 h-12">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {log.selfie ? (
                        <img
                          src={log.selfie}
                          alt="selfie"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    {log.selfie && (
                      <button
                        type="button"
                        onClick={() => deletePhoto(log.dateKey)}
                        title={t("attendanceHistory.deletePhoto")}
                        aria-label={t("attendanceHistory.deletePhoto")}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={10} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-800 dark:text-gray-100 font-medium whitespace-nowrap">{log.date}</td>
                <td className="py-3 px-3 text-gray-500">{log.masuk}</td>
                <td className="py-3 px-3 text-gray-500">{log.pulang}</td>
                <td className="py-3 px-3 max-w-[140px]">
                  {log.lokasi ? (
                    <span className="text-xs text-gray-500 truncate block" title={log.lokasi.address || `${log.lokasi.lat}, ${log.lokasi.lng}`}>
                      {log.lokasi.address
                        ? log.lokasi.address.split(",").slice(0, 2).join(",")
                        : `${log.lokasi.lat.toFixed(4)}, ${log.lokasi.lng.toFixed(4)}`}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${log.color}`}>
                    {log.statusKey === "-" ? "-" : t(`attendanceHistory.${log.statusKey}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
