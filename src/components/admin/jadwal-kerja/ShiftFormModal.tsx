"use client";

import { useState } from "react";
import type { ShiftTemplate, ShiftColor } from "./types";
import { SHIFT_COLOR_MAP } from "./types";

interface ShiftFormModalProps {
  initialData: ShiftTemplate | null;
  onClose: () => void;
  onSave: (shift: ShiftTemplate) => void;
}

const emptyForm = { name: "", startTime: "08:00", endTime: "17:00", color: "blue" as ShiftColor };

export default function ShiftFormModal({ initialData, onClose, onSave }: ShiftFormModalProps) {
  const [form, setForm] = useState(initialData ?? { id: crypto.randomUUID(), ...emptyForm });
  const [nameError, setNameError] = useState("");
  const colors = Object.keys(SHIFT_COLOR_MAP) as ShiftColor[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = form.name.trim();
    if (!trimmed) {
      setNameError("Nama shift wajib diisi.");
      return;
    }
    setNameError("");
    onSave({ ...form, name: trimmed });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>⏰</span> {initialData ? "Edit Shift" : "Tambah Shift Baru"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Konfigurasi template shift kerja</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Shift</label>
            <input
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (nameError) setNameError("");
              }}
              placeholder="Contoh: Shift Pagi"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
            />
            {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jam Mulai</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jam Selesai</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Warna Label</label>
            <div className="flex items-center gap-2.5">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-9 h-9 rounded-xl ${SHIFT_COLOR_MAP[color].dot} transition-all ${
                    form.color === color ? "ring-2 ring-offset-2 ring-[#1E3A5F] scale-110" : "hover:scale-105"
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-lg py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] text-white rounded-lg py-3 text-sm font-semibold hover:brightness-110 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {initialData ? "Simpan Perubahan" : "Tambah Shift"}
          </button>
        </div>
      </form>
    </div>
  );
}
