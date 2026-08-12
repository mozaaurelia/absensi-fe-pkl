"use client";

import { useEffect, useState } from "react";
import type { Department } from "./types";
import { COLOR_MAP } from "./types";

export default function AttendanceStatsPanel({ department }: { department: Department }) {
  const [loading, setLoading] = useState(true);
  const color = COLOR_MAP[department.color];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const hadir = department.attendanceRate;
  const telat = Math.min(100 - hadir, Math.round((100 - hadir) * 0.6));
  const alfa = Math.max(0, 100 - hadir - telat);

  const bars = [
    { label: "Hadir", value: hadir, className: "bg-green-500" },
    { label: "Terlambat", value: telat, className: "bg-amber-400" },
    { label: "Alfa", value: alfa, className: "bg-red-400" },
  ];

  return (
    <div className="pt-4 mt-4 border-t border-gray-100">
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-gray-400 py-3">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 border-t-gray-400 animate-spin" />
          Memuat statistik...
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 animate-fade-slide-up">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500">{bar.label}</span>
                <span className="text-[11px] font-semibold text-gray-700">{bar.value}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${bar.className}`}
                  style={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          ))}

          {hadir < department.minAttendance && (
            <div className={`flex items-center gap-1.5 text-[11px] font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-1`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.3 4.5L2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a1.5 1.5 0 0 0-2.6 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Di bawah target kehadiran ({department.minAttendance}%)
            </div>
          )}
        </div>
      )}
    </div>
  );
}