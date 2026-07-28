"use client";

import { useState } from "react";

export default function LeaveForm() {
  const [jenisIzin, setJenisIzin] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [alasan, setAlasan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hubungkan ke API pengajuan izin/cuti
    console.log({ jenisIzin, tanggalMulai, tanggalSelesai, alasan });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900">Form Pengajuan Izin & Cuti</h3>
        <span className="bg-blue-50 text-[#1E3A5F] text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          Izin / Cuti
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        Lengkapi detail pengajuan izin atau cuti berikut.
      </p>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Jenis Izin
        </label>
        <select
          value={jenisIzin}
          onChange={(e) => setJenisIzin(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
        >
          <option value="">Sakit, Cuti, Keperluan Penting</option>
          <option value="sakit">Sakit</option>
          <option value="cuti">Cuti Tahunan</option>
          <option value="penting">Keperluan Penting</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Tanggal Selesai
          </label>
          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Alasan / Keterangan
        </label>
        <textarea
          rows={3}
          placeholder="Tulis alasan pengajuan izin atau cuti secara jelas..."
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="file"
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-400 file:hidden"
          title="Upload surat dokter atau dokumen pendukung"
        />
        <button
          type="submit"
          className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#16304f] transition-colors whitespace-nowrap"
        >
          Kirim Pengajuan
        </button>
      </div>
    </form>
  );
}