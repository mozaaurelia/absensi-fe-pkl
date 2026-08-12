"use client";

import { useState } from "react";
import type { Department } from "./types";
import { COLOR_MAP } from "./types";
import AttendanceStatsPanel from "./AttendanceStatsPanel";

interface DepartmentCardProps {
  department: Department;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = COLOR_MAP[department.color];
  const belowTarget = department.attendanceRate < department.minAttendance;
  const active = department.status === "active";

  return (
    <div className="card-hover group bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <span
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color.bg} ${color.text}`}
          >
            {color.emoji}
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{department.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{department.head || "Belum ada kepala"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full ${
              active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
            {active ? "Aktif" : "Nonaktif"}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 flex items-center justify-center transition-colors"
              title="Edit"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
              title="Hapus"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="flex items-center gap-1.5 text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
            <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {department.employeeCount} karyawan
        </span>
        <span className={`font-semibold ${belowTarget ? "text-red-500" : "text-green-600"}`}>
          {department.attendanceRate}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full ${color.dot} transition-all duration-700 ease-out`}
          style={{ width: `${department.attendanceRate}%` }}
        />
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-[#1E3A5F] hover:bg-blue-50 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {expanded ? "Sembunyikan Statistik" : "Statistik Kehadiran"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {expanded && <AttendanceStatsPanel department={department} />}
        </div>
      </div>
    </div>
  );
}
