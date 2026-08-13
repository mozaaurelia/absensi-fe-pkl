import { useMemo } from "react";
import type { OvertimeTeamRequest } from "@/lib/services/attendance";

interface LemburUpcomingProps {
  requests: OvertimeTeamRequest[];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateKey(value: string): string {
  const d = new Date(value.length <= 10 ? value + "T00:00:00" : value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTime(value?: string): string {
  if (!value) return "--:--";
  const match = value.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : value;
}

function statusOf(status: string) {
  if (status.toLowerCase() === "approved") {
    return { label: "Disetujui", badge: "bg-green-50 text-green-600", dot: "bg-green-500" };
  }
  if (status.toLowerCase() === "rejected") {
    return { label: "Ditolak", badge: "bg-red-50 text-red-500", dot: "bg-red-500" };
  }
  return { label: "Menunggu", badge: "bg-blue-50 text-[#1E3A5F]", dot: "bg-blue-500" };
}

export default function LemburUpcoming({ requests }: LemburUpcomingProps) {
  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, OvertimeTeamRequest[]>();
    requests
      .filter((r) => (r.overtime_date ?? "") >= todayKey)
      .sort((a, b) => (a.overtime_date ?? "").localeCompare(b.overtime_date ?? ""))
      .forEach((r) => {
        const key = toDateKey(r.overtime_date ?? "");
        const list = map.get(key) ?? [];
        list.push(r);
        map.set(key, list);
      });
    return Array.from(map.entries());
  }, [requests, todayKey]);

  const relLabel = (key: string): string => {
    const tomorrow = new Date(`${todayKey}T00:00:00`);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = toDateKey(tomorrow.toISOString().slice(0, 10));
    if (key === todayKey) return "Hari Ini";
    if (key === tomorrowKey) return "Besok";
    const d = new Date(`${key}T00:00:00`);
    if (Number.isNaN(d.getTime())) return key;
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-gray-900 text-sm">📅 Lembur Mendatang</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Pengajuan lembur untuk tanggal hari ini dan seterusnya.
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center animate-fade-slide-up">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-sm text-gray-400">Belum ada lembur mendatang.</p>
        </div>
      ) : (
        groups.map(([date, list], gi) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A5F] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{relLabel(date)}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {list.length} pengajuan
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((req, i) => {
                const status = statusOf(req.status);
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up"
                    style={{ animationDelay: `${(gi + i) * 70}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {req.employee_name
                            ?.split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase() || "?"}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                            {req.employee_name || "-"}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {req.department_name || "-"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {toTime(req.start_time)} - {toTime(req.end_time)}
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 ml-1">
                        {Number(req.total_hours).toFixed(1)} jam
                      </span>
                    </div>

                    {req.category && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {req.category}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
