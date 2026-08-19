"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { OvertimeTeamRequest } from "@/lib/services/attendance";

interface LemburAnalyticsProps {
  requests: OvertimeTeamRequest[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function LemburAnalytics({ requests }: LemburAnalyticsProps) {
  const approved = useMemo(
    () => requests.filter((r) => r.status.toLowerCase() === "approved"),
    [requests]
  );

  const monthly = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; jam: number; pengajuan: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
        label: MONTH_NAMES[d.getMonth()],
        jam: 0,
        pengajuan: 0,
      });
    }
    approved.forEach((r) => {
      const key = (r.overtime_date ?? "").slice(0, 7);
      const bucket = months.find((m) => m.key === key);
      if (!bucket) return;
      bucket.jam += Number(r.total_hours) || 0;
      bucket.pengajuan += 1;
    });
    return months.map((m) => ({ ...m, jam: Math.round(m.jam * 10) / 10 }));
  }, [approved]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    approved.forEach((r) => {
      const key = r.category?.trim() || "Umum";
      map.set(key, (map.get(key) ?? 0) + (Number(r.total_hours) || 0));
    });
    return Array.from(map.entries())
      .map(([name, hours]) => ({ name, hours: Math.round(hours * 10) / 10 }))
      .sort((a, b) => b.hours - a.hours);
  }, [approved]);

  const topEmployees = useMemo(() => {
    const map = new Map<string, number>();
    approved.forEach((r) => {
      if (!r.employee_name) return;
      map.set(r.employee_name, (map.get(r.employee_name) ?? 0) + (Number(r.total_hours) || 0));
    });
    const list = Array.from(map.entries())
      .map(([name, hours]) => ({ name, hours: Math.round(hours * 10) / 10 }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
    const max = list.length > 0 ? list[0].hours : 0;
    return { list, max };
  }, [approved]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-gray-900 text-sm">📊 Analitik Lembur</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Ringkasan statistik pengajuan lembur dari semua data yang tersedia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h4 className="font-bold text-gray-900 text-sm mb-1">Jam Lembur Disetujui per Bulan</h4>
          <p className="text-xs text-gray-400 mb-4">6 bulan terakhir.</p>
          {approved.length === 0 ? (
            <p className="h-56 flex items-center justify-center text-sm text-gray-400">
              Belum ada lembur yang disetujui.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{ borderRadius: 10, border: "1px solid #F1F5F9", fontSize: 12 }}
                  formatter={(value: number | string) => [`${value} jam`, "Total Jam"]}
                />
                <Bar dataKey="jam" fill="#1E3A5F" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h4 className="font-bold text-gray-900 text-sm mb-1">Berdasarkan Kategori</h4>
          <p className="text-xs text-gray-400 mb-4">Jam disetujui per kategori.</p>
          {categories.length === 0 ? (
            <p className="h-56 flex items-center justify-center text-sm text-gray-400">
              Belum ada data.
            </p>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => {
                const maxHours = categories[0].hours || 1;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
                      <span className="text-xs font-semibold text-gray-400">{cat.hours} jam</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94]"
                        style={{ width: `${Math.min(100, (cat.hours / maxHours) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h4 className="font-bold text-gray-900 text-sm mb-1">Karyawan Teratas</h4>
        <p className="text-xs text-gray-400 mb-4">Total jam lembur disetujui per karyawan.</p>
        {topEmployees.list.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">Belum ada data.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {topEmployees.list.map((emp) => (
              <div key={emp.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 truncate">{emp.name}</span>
                  <span className="text-xs font-semibold text-gray-400">{emp.hours} jam</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${topEmployees.max > 0 ? (emp.hours / topEmployees.max) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
