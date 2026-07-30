"use client";

import { useAuth } from "@/context/AuthContext";

export default function HistoryHeader() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Riwayat Kehadiran Saya
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Pantau seluruh data absensi dan total jam kerja personal.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-right">
          <p className="text-xs text-gray-400">Rentang Tanggal</p>
          <p className="text-sm font-semibold text-gray-800">
            1 Juni 2026 - 30 Juni 2026
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1E3A5F] font-bold text-sm flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user?.initials || "AP"
          )}
        </div>
      </div>
    </div>
  );
}
