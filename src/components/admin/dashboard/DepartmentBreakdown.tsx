"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAttendanceReport, getDepartments } from "@/lib/services/admin";

interface DepartmentStat {
  name: string;
  rate: number;
  total: number;
}

export default function DepartmentBreakdown() {
  const [departments, setDepartments] = useState<DepartmentStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rows, depts] = await Promise.all([getAttendanceReport(), getDepartments()]);
      const list = Array.isArray(rows) ? rows : [];
      const deptList = Array.isArray(depts) ? depts : [];

      const map = new Map<string, { total: number; hadir: number }>();
      list.forEach((r) => {
        const id = r.department_id || "";
        const entry = map.get(id) ?? { total: 0, hadir: 0 };
        entry.total += 1;
        if (r.status === "hadir" || r.status === "telat") entry.hadir += 1;
        map.set(id, entry);
      });

      const stats: DepartmentStat[] = Array.from(map.entries())
        .map(([id, v]) => ({
          name: deptList.find((d) => d.id === id)?.name ?? "-",
          rate: v.total > 0 ? Math.round((v.hadir / v.total) * 100) : 0,
          total: v.total,
        }))
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 5);

      setDepartments(stats);
    } catch {
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isEmpty = useMemo(() => departments.length === 0, [departments]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">Kehadiran per Departemen</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Persentase kehadiran dari data absensi.</p>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isEmpty ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
          Belum ada data.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {departments.map((dept) => (
            <div key={dept.name}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{dept.name}</p>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{dept.rate}%</p>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    dept.rate < 85 ? "bg-[#2a4f7a]" : "bg-[#1E3A5F]"
                  }`}
                  style={{ width: `${dept.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}