import type { OvertimeTeamRequest } from "@/lib/services/attendance";

interface LemburStatsCardsProps {
  requests: OvertimeTeamRequest[];
}

export default function LemburStatsCards({ requests }: LemburStatsCardsProps) {
  const pending = requests.filter((r) => r.status.toLowerCase() === "pending").length;
  const approved = requests.filter((r) => r.status.toLowerCase() === "approved").length;
  const rejected = requests.filter((r) => r.status.toLowerCase() === "rejected").length;
  const totalHours = requests
    .filter((r) => r.status.toLowerCase() === "approved")
    .reduce((sum, r) => sum + (Number(r.total_hours) || 0), 0);

  const stats = [
    {
      label: "Pending",
      desc: "Perlu diproses",
      value: pending,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <ClockIcon />,
    },
    {
      label: "Disetujui",
      desc: "Telah disetujui",
      value: approved,
      iconBg: "bg-green-50 text-green-600",
      icon: <CheckIcon />,
    },
    {
      label: "Ditolak",
      desc: "Tidak disetujui",
      value: rejected,
      iconBg: "bg-red-50 text-red-500",
      icon: <XIcon />,
    },
    {
      label: "Total Jam",
      desc: "Jam lembur disetujui",
      value: totalHours.toFixed(1),
      iconBg: "bg-purple-50 text-purple-600",
      icon: <HourglassIcon />,
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

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h10M7 21h10M8 3v3l4 6-4 6v3M16 3v3l-4 6 4 6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
