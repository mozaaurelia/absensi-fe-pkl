"use client";

import { useCallback, useEffect, useState } from "react";
import { getAttendanceReport } from "@/lib/services/admin";

interface Activity {
  name: string;
  action: string;
  time: string;
}

function toTime(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getAttendanceReport();
      const list = (Array.isArray(rows) ? rows : [])
        .filter((r) => r.clock_in_time)
        .slice(0, 6)
        .map((r) => ({
          name: r.employee_name || "-",
          action: r.status === "telat" ? "Clock-in (Terlambat)" : "Clock-in",
          time: toTime(r.clock_in_time),
        }));
      setActivities(list);
    } catch {
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-4">Aktivitas Terkini</h3>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
          Belum ada aktivitas.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1E3A5F] dark:bg-blue-300 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{activity.name}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{activity.time} WIB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}