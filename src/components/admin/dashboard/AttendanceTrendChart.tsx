"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Sen", hadir: 138, telat: 8 },
  { day: "Sel", hadir: 141, telat: 5 },
  { day: "Rab", hadir: 129, telat: 12 },
  { day: "Kam", hadir: 135, telat: 9 },
  { day: "Jum", hadir: 132, telat: 9 },
  { day: "Sab", hadir: 40, telat: 2 },
];

export default function AttendanceTrendChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900 text-sm">Tren Kehadiran Minggu Ini</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-2 h-2 rounded-full bg-[#1E3A5F]" /> Hadir
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-2 h-2 rounded-full bg-gray-300" /> Terlambat
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Perbandingan jumlah hadir dan terlambat per hari.
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="hadirGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A5F" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#1E3A5F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #F1F5F9",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="hadir"
            stroke="#1E3A5F"
            strokeWidth={2.5}
            fill="url(#hadirGradient)"
          />
          <Area
            type="monotone"
            dataKey="telat"
            stroke="#D1D5DB"
            strokeWidth={2}
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}