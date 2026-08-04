"use client";

const attendanceLogs = [
  {
    day: "Jumat",
    date: "13/03/2026",
    status: "Tepat Waktu",
    statusStyle: "bg-[#dff5e7] text-[#2b8a5b] border border-[#9ad7b0]",
    inTime: "--:--",
    outTime: "--:--",
    total: "0h Om LIVE",
    totalStyle: "bg-[#f3e8ff] text-[#9b4ad7]",
    lateMinutes: "0m",
    punctuality: "0%",
    photoTone: "bg-[#eaf3ff]",
    isLate: false,
  },
  {
    day: "Kamis",
    date: "12/03/2026",
    status: "Tepat Waktu",
    statusStyle: "bg-[#dff5e7] text-[#2b8a5b] border border-[#9ad7b0]",
    inTime: "--:--",
    outTime: "--:--",
    total: "0h Om LIVE",
    totalStyle: "bg-[#f3e8ff] text-[#9b4ad7]",
    lateMinutes: "0m",
    punctuality: "0%",
    photoTone: "bg-[#eaf3ff]",
    isLate: false,
  },
  {
    day: "Rabu",
    date: "11/03/2026",
    status: "Terlambat",
    statusStyle: "bg-[#fde8e8] text-[#d64545] border border-[#f5b5b5]",
    inTime: "08:57",
    outTime: "--:--",
    total: "0h 0m LIVE",
    totalStyle: "bg-[#f3e8ff] text-[#9b4ad7]",
    lateMinutes: "30m",
    punctuality: "100%",
    photoTone: "bg-[#f9e4d5]",
    isLate: true,
  },
  {
    day: "Selasa",
    date: "10/03/2026",
    status: "Tepat Waktu",
    statusStyle: "bg-[#dff5e7] text-[#2b8a5b] border border-[#9ad7b0]",
    inTime: "08:40",
    outTime: "17:55",
    total: "8h 55m",
    totalStyle: "bg-[#f3e8ff] text-[#9b4ad7]",
    lateMinutes: "0m",
    punctuality: "95%",
    photoTone: "bg-[#eaf3ff]",
    isLate: false,
  },
];

function ClockIcon({ className = "" }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function AttendanceCard({ item }) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        item.isLate
          ? "border-[#f0caa0] bg-[#f8f5f2] dark:border-orange-800 dark:bg-gray-800"
          : "border-[#c4dcf5] bg-[#f0f6fd] dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`h-10 w-10 rounded-lg border border-white/80 shadow-sm ${item.photoTone} flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-200 shrink-0`}
          >
            {item.isLate ? "◔" : "✓"}
          </div>

          <div className="min-w-0">
            <div className="text-base font-bold leading-none text-slate-800 dark:text-gray-100 truncate">
              {item.day}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-gray-400">{item.date}</div>
          </div>
        </div>

        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shrink-0 ${item.statusStyle}`}>
          {item.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className="rounded-xl bg-white/80 dark:bg-gray-700/60 border border-slate-200/80 dark:border-gray-600 px-2 py-2 text-center shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-gray-400 mb-0.5">In</div>
          <div className="text-base font-bold text-slate-800 dark:text-gray-100">{item.inTime}</div>
        </div>

        <div className="rounded-xl bg-white/80 dark:bg-gray-700/60 border border-slate-200/80 dark:border-gray-600 px-2 py-2 text-center shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-gray-400 mb-0.5">Out</div>
          <div className="text-base font-bold text-slate-800 dark:text-gray-100">{item.outTime}</div>
        </div>

        <div className={`rounded-xl px-2 py-2 text-center shadow-sm ${item.totalStyle}`}>
          <div className="text-[11px] opacity-80 mb-0.5">Total</div>
          <div className="text-sm font-bold leading-tight">{item.total}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-gray-600 pt-2.5">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <ClockIcon className={item.lateMinutes !== "0m" ? "text-[#d86b1d]" : ""} />
            {item.lateMinutes}
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckIcon className="text-[#3d6ace]" />
            {item.punctuality}
          </span>
        </div>

        <button className="text-sm font-semibold text-[#3d6ace] hover:text-[#244ca9] transition-colors">
          Detail <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}

export default function HistoryTable() {
  return (
    <div className="mt-6">
      <div className="grid gap-5 xl:grid-cols-2">
        {attendanceLogs.map((item) => (
          <AttendanceCard key={`${item.day}-${item.date}`} item={item} />
        ))}
      </div>
    </div>
  );
}
