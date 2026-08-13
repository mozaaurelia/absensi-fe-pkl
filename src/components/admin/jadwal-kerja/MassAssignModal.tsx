"use client";

import { useState } from "react";
import type { ShiftTemplate, WeekDay } from "./types";
import { DAYS } from "./types";

interface MassAssignModalProps {
  shifts: ShiftTemplate[];
  days: WeekDay[];
  onClose: () => void;
  onApply: (shiftId: string | null, dayIndexes: number[]) => void;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all appearance-none cursor-pointer";

export default function MassAssignModal({ shifts, days, onClose, onApply }: MassAssignModalProps) {
  const [shiftId, setShiftId] = useState("");
  const [allDays, setAllDays] = useState(true);
  const [selected, setSelected] = useState<number[]>(DAYS.map((_, i) => i));
  const [error, setError] = useState("");

  const toggleDay = (i: number) => {
    setSelected((prev) => (prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i]));
  };

  const toggleAllDays = () => {
    const next = !allDays;
    setAllDays(next);
    setSelected(next ? DAYS.map((_, i) => i) : []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftId) {
      setError("Pilih shift terlebih dahulu.");
      return;
    }
    if (selected.length === 0) {
      setError("Pilih minimal satu hari.");
      return;
    }
    setError("");
    onApply(shiftId === "libur" ? null : shiftId, selected);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A5F] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              Atur Massal
            </h3>
            <p className="text-xs text-gray-400 mt-1.5">Terapkan shift ke semua karyawan sekaligus</p>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shift</label>
            <select
              value={shiftId}
              onChange={(e) => {
                setShiftId(e.target.value);
                if (error) setError("");
              }}
              className={inputClass}
            >
              <option value="">Pilih shift...</option>
              <option value="libur">Libur (kosongkan)</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.startTime} - {s.endTime})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">Hari</label>
              <button
                type="button"
                onClick={toggleAllDays}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] hover:text-[#16304f] transition-colors"
              >
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    allDays ? "bg-[#1E3A5F] border-[#1E3A5F]" : "border-gray-300"
                  }`}
                >
                  {allDays && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                Semua Hari
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {days.map((day, i) => {
                const active = selected.includes(i);
                return (
                  <button
                    key={day.name}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`rounded-lg border px-2 py-2.5 text-xs font-semibold transition-colors ${
                      active
                        ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {day.name.slice(0, 3)}
                    <span className={`block text-[10px] ${active ? "text-blue-100" : "text-gray-400"}`}>
                      {day.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
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
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E3A5F] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#16304f] transition-colors"
          >
            Terapkan
          </button>
        </div>
      </form>
    </div>
  );
}
