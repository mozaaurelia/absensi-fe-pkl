"use client";

import { useState } from "react";

export default function OvertimeForm() {
  const [tanggalLembur, setTanggalLembur] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [kategori, setKategori] = useState("");
  const [alasan, setAlasan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hubungkan ke API pengajuan lembur
    console.log({ tanggalLembur, jamMulai, jamSelesai, kategori, alasan });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900">Form Pengajuan Lembur</h3>
        <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          Fitur Lembur
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        Ajukan lembur untuk pekerjaan tambahan di luar jam kerja normal.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Tanggal Lembur
          </label>
          <input
            type="date"
            value={tanggalLembur}
            onChange={(e) => setTanggalLembur(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Jam Mulai
          </label>
          <input
            type="time"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Jam Selesai
          </label>
          <input
            type="time"
            value={jamSelesai}
            onChange={(e) => setJamSelesai(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Estimasi Durasi
          </label>
          <div className="w-full rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700">
            2j 30m
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Kategori Lembur
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          >
            <option value="">Penyelesaian Project / Operasional</option>
            <option value="project">Penyelesaian Project</option>
            <option value="operasional">Operasional</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Persetujuan Atasan
          </label>
          <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors">
            <option>Surya Prasetya · Supervisor Operasional</option>
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Alasan Lembur
        </label>
        <textarea
          rows={3}
          placeholder="Contoh: menyelesaikan laporan operasional akhir bulan dan validasi data presensi..."
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#16304f] transition-colors"
      >
        Kirim Pengajuan Lembur
      </button>
    </form>
  );
}