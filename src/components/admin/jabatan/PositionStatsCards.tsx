import type { Position } from "./types";

interface PositionStatsCardsProps {
  positions: Position[];
}

export default function PositionStatsCards({ positions }: PositionStatsCardsProps) {
  const total = positions.length;
  const filled = positions.reduce((sum, p) => sum + p.employeeCount, 0);

  const stats = [
    {
      label: "Total Jabatan",
      desc: "Semua jabatan terdaftar",
      value: total,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <BriefcaseIcon />,
    },
    {
      label: "Terisi (Karyawan)",
      desc: "Karyawan dengan jabatan",
      value: filled,
      iconBg: "bg-green-50 text-green-600",
      icon: <UsersIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
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

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v1.5h4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
