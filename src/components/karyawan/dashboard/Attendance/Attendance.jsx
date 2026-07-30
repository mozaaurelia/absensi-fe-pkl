"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiClock, FiMapPin, FiShield } from "react-icons/fi";

export default function Attendance() {
  const router = useRouter();
  const [time, setTime] = useState(null);
  const [hasPulang, setHasPulang] = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time && time.getHours() < 17) {
      setHasPulang(false);
    }
  }, [time]);

  const formatted = time
    ? time.toLocaleTimeString("id-ID", { hour12: false })
    : "--:--:--";

  const hour = time ? time.getHours() : 0;
  const canPulang = !hasPulang && hour >= 17;

  const handlePulang = () => {
    if (!canPulang) return;
    setHasPulang(true);
    router.push("/karyawan/attendance");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiClock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Absensi Hari Ini</h3>
            <p className="text-xs text-gray-400">Status kehadiran</p>
          </div>
        </div>
        <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full animate-pulse-ring">
          Belum Absen
        </span>
      </div>

      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
          <FiClock size={12} />
          Shift Kerja: 09:00 - 18:00 · Kantor Pusat Jakarta
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => router.push("/karyawan/attendance")}
          className="bg-green-600 text-white font-semibold text-sm py-3 rounded-lg hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <FiClock size={15} />
          Masuk Kerja
        </button>
        <button
          onClick={handlePulang}
          disabled={!canPulang}
          className={`font-semibold text-sm py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
            canPulang
              ? "bg-red-600 text-white hover:bg-red-700 active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FiClock size={15} />
          Pulang Kerja
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
          <FiMapPin size={16} className="text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Lokasi</p>
            <p className="text-sm font-semibold text-gray-800">Kantor Pusat</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
          <FiShield size={16} className="text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Verifikasi</p>
            <p className="text-sm font-semibold text-gray-800">GPS Valid</p>
          </div>
        </div>
      </div>
    </div>
  );
}
