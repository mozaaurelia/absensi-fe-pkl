import type { Employee, ShiftTemplate, Assignments } from "./types";
import { DAYS } from "./types";
import { useLanguage } from "@/context/LanguageContext";

interface DailyAttendanceStatsProps {
  employees: Employee[];
  shifts: ShiftTemplate[];
  assignments: Assignments;
}

export default function DailyAttendanceStats({ employees, shifts, assignments }: DailyAttendanceStatsProps) {
  const { t } = useLanguage();
  const shiftMap = new Map(shifts.map((s) => [s.id, s]));
  const todayIdx = (new Date().getDay() + 6) % 7; // 0=Senin, 6=Minggu

  let wfo = 0;
  let wfh = 0;
  let libur = 0;

  for (const emp of employees) {
    const shiftId = assignments[emp.id]?.[todayIdx] ?? null;
    const shift = shiftId ? shiftMap.get(shiftId) ?? null : null;
    if (!shift) libur += 1;
    else if (shift.name.toLowerCase().includes("wfh")) wfh += 1;
    else wfo += 1;
  }

  const stats = [
    {
      label: t("adminSchedule.totalEmployeeLabel"),
      desc: t("adminSchedule.totalEmployeeDesc"),
      value: employees.length,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <UsersIcon />,
    },
    {
      label: t("adminSchedule.wfoToday"),
      desc: t("adminSchedule.dayDesc", { day: DAYS[todayIdx] }),
      value: wfo,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <OfficeIcon />,
    },
    {
      label: t("adminSchedule.wfhToday"),
      desc: t("adminSchedule.dayDesc", { day: DAYS[todayIdx] }),
      value: wfh,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <HomeIcon />,
    },
    {
      label: t("adminSchedule.liburToday"),
      desc: t("adminSchedule.dayDesc", { day: DAYS[todayIdx] }),
      value: libur,
      iconBg: "bg-gray-100 text-gray-500",
      icon: <MoonIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
              {stat.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
              {i === 0 ? t("adminSchedule.totalTag") : t("adminSchedule.todayTag")}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5M16 8.5a3 3 0 1 0 0-6M18.5 14c2.2.5 3.9 2.3 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OfficeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M3 21h18M8 7h2M8 11h2M8 15h2M12 7h2M12 11h2M12 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-8 9 8M5 10v10a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
