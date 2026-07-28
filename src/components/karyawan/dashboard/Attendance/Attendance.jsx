"use client";

import { useEffect, useState } from "react";

export default function Attendance() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time
    ? time.toLocaleTimeString("id-ID", { hour12: false })
    : "--:--:--";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">Absensi Hari Ini</h3>
        <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
          Belum Absen
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Gunakan tombol berikut untuk mencatat waktu kerja.
      </p>

      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 mb-2">Waktu Server</p>
        <p className="text-4xl font-bold text-gray-900 tracking-wide tabular-nums">
          {formatted}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Shift Kerja: 09:00 - 18:00 · Kantor Pusat Jakarta
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button className="bg-green-600 text-white font-semibold text-sm py-3 rounded-lg hover:bg-green-700 transition-colors">
          Masuk Kerja
        </button>
        <button className="bg-red-600 text-white font-semibold text-sm py-3 rounded-lg hover:bg-red-700 transition-colors">
          Pulang Kerja
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">Lokasi</p>
          <p className="text-sm font-semibold text-gray-800">Kantor Pusat</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">Verifikasi</p>
          <p className="text-sm font-semibold text-gray-800">GPS Valid</p>
        </div>
      </div>
    </div>
  );
}