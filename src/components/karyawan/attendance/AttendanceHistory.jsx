"use client";

import { useMemo } from "react";

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

export default function AttendanceHistory({ selectedDate }) {
  const { logs, period } = useMemo(() => {
    const monday = getMonday(selectedDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const periodText = `${monday.getDate()} ${monthNames[monday.getMonth()]} - ${sunday.getDate()} ${monthNames[sunday.getMonth()]} ${sunday.getFullYear()}`;

    const logs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      logs.push({
        date: formatDate(d),
        masuk: i < 4 ? (i === 0 ? "08:56" : i === 1 ? "09:14" : i === 2 ? "--:--" : "-") : "-",
        pulang: i < 4 ? (i === 0 ? "18:03" : i === 1 ? "18:00" : i === 2 ? "--:--" : "-") : "-",
        status: i === 0 ? "Hadir" : i === 1 ? "Terlambat" : i === 2 ? "Belum Absen" : i === 3 ? "Terjadwal" : "-",
        color: i === 0 ? "bg-green-100 text-green-700" : i === 1 ? "bg-amber-100 text-amber-700" : i === 2 ? "bg-amber-100 text-amber-700" : i === 3 ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-500",
      });
    }

    return { logs, period: periodText };
  }, [selectedDate]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900">Log Absensi Minggu Ini</h3>
        <p className="text-xs text-gray-400">Periode: {period}</p>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Ringkasan pencatatan masuk dan pulang karyawan.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">Jam Masuk</th>
              <th className="pb-3 font-medium">Jam Pulang</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={log.date} className="border-b border-gray-50 last:border-0 opacity-0 animate-fade-slide-in" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                <td className="py-3 text-gray-800">{log.date}</td>
                <td className="py-3 text-gray-600">{log.masuk}</td>
                <td className="py-3 text-gray-600">{log.pulang}</td>
                <td className="py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${log.color}`}>
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
