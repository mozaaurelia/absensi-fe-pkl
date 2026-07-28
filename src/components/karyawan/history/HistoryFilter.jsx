"use client";

import { useState } from "react";

export default function HistoryFilter() {
  const [status, setStatus] = useState("Hadir, Sakit, Terlambat");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("Semua Lokasi");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Filter Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#1E3A5F]"
          >
            <option>Hadir, Sakit, Terlambat</option>
            <option>Hadir</option>
            <option>Terlambat</option>
            <option>Sakit</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Cari Tanggal
          </label>
          <input
            type="text"
            placeholder="Contoh: 12 Juni 2026"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Lokasi
          </label>
          <select
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-[#1E3A5F]"
          >
            <option>Semua Lokasi</option>
            <option>Kantor Pusat Jakarta</option>
            <option>Kantor Cabang Bandung</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Aksi
          </label>
          <button className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#16304f] transition-colors">
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}