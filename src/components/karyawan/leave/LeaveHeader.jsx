"use client";

import { useAuth } from "@/context/AuthContext";

export default function LeaveHeader() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Pengajuan Izin, Cuti & Lembur Karyawan
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Ajukan izin, cuti, lembur, dan pantau status persetujuan secara
          transparan.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
          Riwayat Pengajuan
        </button>
        <button className="bg-[#1E3A5F] text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-[#16304f] transition-colors whitespace-nowrap">
          Buat Pengajuan Baru
        </button>
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
