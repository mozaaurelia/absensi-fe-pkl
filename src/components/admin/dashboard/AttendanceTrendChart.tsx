"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAttendanceReport } from "@/lib/services/admin";

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function AttendanceTrendChart() {
  const [data, setData] = useState<{ day: string; hadir: number; telat: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getAttendanceReport();
      const list = Array.isArray(rows) ? rows : [];

      const buckets = new Map<
        number,
        { hadir: number; telat: number }
      >();
      for (let i = 0; i < 7; i++) {
        buckets.set(i, { hadir: 0, telat: 0 });
      }

      list.forEach((r) => {
        if (!r.clock_in_time) return;
        const d = new Date(r.clock_in_time);
        if (Number.isNaN(d.getTime())) return;
        const idx = d.getDay();
        const bucket = buckets.get(idx);
        if (!bucket) return;
        if (r.status === "telat") bucket.telat += 1;
        else if (r.status === "hadir") bucket.hadir += 1;
      });

      setData(
        Array.from(buckets.entries())
          .map(([idx, b]) => ({ day: dayNames[idx], hadir: b.hadir, telat: b.telat }))
      );
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isEmpty = useMemo(() => data.every((d) => d.hadir === 0 && d.telat === 0), [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Tren Kehadiran Minggu Ini</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#1E3A5F]" /> Hadir
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500" /> Terlambat
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Perbandingan jumlah hadir dan terlambat per hari.
      </p>

      {isLoading ? (
        <div className="h-56 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
      ) : isEmpty ? (
        <p className="h-56 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          Belum ada data absensi.
        </p>
      ) : (
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
      )}
    </div>
  );
}