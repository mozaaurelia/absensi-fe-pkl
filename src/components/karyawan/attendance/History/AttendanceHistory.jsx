"use client";

import { useState, useEffect, useMemo } from "react";
import { FiList, FiCalendar } from "react-icons/fi";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const dayNamesFull = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(d) {
  return `${dayNamesFull[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function getDateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function AttendanceHistory({ selectedDate }) {
  const [storedData, setStoredData] = useState({});

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

  const { logs, period } = useMemo(() => {
    const monday = getMonday(selectedDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const periodText = `${monday.getDate()} ${monthNames[monday.getMonth()]} - ${sunday.getDate()} ${monthNames[sunday.getMonth()]} ${sunday.getFullYear()}`;

    const logs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = getDateKey(d);
      const entry = storedData[dateKey] || {};
      logs.push({
        no: i + 1,
        date: formatDate(d),
        dateKey,
        masuk: i < 4 ? (i === 0 ? "08:56" : i === 1 ? "09:14" : i === 2 ? "--:--" : "-") : "-",
        pulang: i < 4 ? (i === 0 ? "18:03" : i === 1 ? "18:00" : i === 2 ? "--:--" : "-") : "-",
        status: i === 0 ? "Hadir" : i === 1 ? "Terlambat" : i === 2 ? "Belum Absen" : i === 3 ? "Terjadwal" : "-",
        color: i === 0 ? "bg-green-100 text-green-700" : i === 1 ? "bg-amber-100 text-amber-700" : i === 2 ? "bg-amber-100 text-amber-700" : i === 3 ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-500",
        selfie: entry.selfie || null,
        lokasi: entry.lokasi || null,
      });
    }

    return { logs, period: periodText };
  }, [selectedDate, storedData]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <FiList size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Log Absensi Minggu Ini</h3>
            <p className="text-xs text-gray-400">Ringkasan pencatatan masuk dan pulang</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <FiCalendar size={13} />
          <span>{period}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium w-8">No</th>
              <th className="pb-3 font-medium">Foto</th>
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">Jam Masuk</th>
              <th className="pb-3 font-medium">Jam Pulang</th>
              <th className="pb-3 font-medium">Lokasi</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr
                key={log.date}
                className="border-b border-gray-50 last:border-0 opacity-0 animate-fade-slide-in"
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <td className="py-3 text-gray-400 text-xs font-medium">{log.no}</td>
                <td className="py-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                    {log.selfie ? (
                      <img
                        src={log.selfie}
                        alt="selfie"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className="py-3 text-gray-800 font-medium whitespace-nowrap">{log.date}</td>
                <td className="py-3 text-gray-600">{log.masuk}</td>
                <td className="py-3 text-gray-600">{log.pulang}</td>
                <td className="py-3 max-w-[140px]">
                  {log.lokasi ? (
                    <span className="text-xs text-gray-500 truncate block" title={log.lokasi.address || `${log.lokasi.lat}, ${log.lokasi.lng}`}>
                      {log.lokasi.address
                        ? log.lokasi.address.split(",").slice(0, 2).join(",")
                        : `${log.lokasi.lat.toFixed(4)}, ${log.lokasi.lng.toFixed(4)}`}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">-</span>
                  )}
                </td>
                <td className="py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${log.color}`}>
                    {log.status}
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