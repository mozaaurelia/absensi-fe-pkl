import type { Employee, ShiftTemplate, Assignments } from "./types";
import { getShiftDuration } from "./types";

interface ScheduleStatsCardsProps {
  shifts: ShiftTemplate[];
  employees: Employee[];
  assignments: Assignments;
}

export default function ScheduleStatsCards({ shifts, employees, assignments }: ScheduleStatsCardsProps) {
  const shiftMap = new Map(shifts.map((s) => [s.id, s]));

  const scheduledCount = employees.filter((emp) =>
    (assignments[emp.id] ?? []).some(Boolean)
  ).length;

  const totalHours = employees.reduce((sum, emp) => {
    return (
      sum +
      (assignments[emp.id] ?? []).reduce((acc, shiftId) => {
        const shift = shiftId ? shiftMap.get(shiftId) : undefined;
        return acc + (shift ? getShiftDuration(shift) : 0);
      }, 0)
    );
  }, 0);

  const stats = [
    {
      label: "Total Shift",
      desc: "Template shift aktif",
      value: shifts.length,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <ClockIcon />,
    },
    {
      label: "Karyawan Terjadwal",
      desc: `${employees.length} karyawan total`,
      value: scheduledCount,
      iconBg: "bg-teal-50 text-teal-600",
      icon: <UsersIcon />,
    },
    {
      label: "Total Jam Mingguan",
      desc: "Seluruh penugasan",
      value: `${totalHours}j`,
      iconBg: "bg-indigo-50 text-indigo-600",
      icon: <HoursIcon />,
    },
    {
      label: "Belum Terjadwal",
      desc: "Perlu penjadwalan",
      value: employees.length - scheduledCount,
      iconBg: "bg-purple-50 text-purple-600",
      icon: <AlertIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="card-hover bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.iconBg}`}>
            {stat.icon}
          </span>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
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

function HoursIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V8M10 19V4M16 19v-6M20 19v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10.3 4.5L2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a1.5 1.5 0 0 0-2.6 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
