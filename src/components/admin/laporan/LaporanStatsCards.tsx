interface LaporanStat {
  label: string;
  value: string;
  iconBg: string;
  icon: React.ReactNode;
}

function StatTile({ stat }: { stat: LaporanStat }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.iconBg}`}>
        {stat.icon}
      </span>
      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
      <p className="text-xs text-gray-400">{stat.label}</p>
    </div>
  );
}

export default function LaporanStatsCards() {
  const stats: LaporanStat[] = [
    {
      label: "Total Kehadiran",
      value: "0",
      iconBg: "bg-green-50 text-green-600",
      icon: <UserCheckIcon />,
    },
    {
      label: "Ketidakhadiran",
      value: "0",
      iconBg: "bg-red-50 text-red-500",
      icon: <UserXIcon />,
    },
    {
      label: "Rata-rata Jam Kerja",
      value: "0h",
      iconBg: "bg-purple-50 text-purple-600",
      icon: <ClockIcon />,
    },
    {
      label: "Keterlambatan",
      value: "0",
      iconBg: "bg-amber-50 text-amber-600",
      icon: <LateIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={stat.label} className="animate-fade-slide-up" style={{ animationDelay: `${i * 70}ms` }}>
          <StatTile stat={stat} />
        </div>
      ))}
    </div>
  );
}

function UserCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 19c0-3.1-2.9-5.5-6.5-5.5S3 15.9 3 19M9.5 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM15 8l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 19c0-3.1-2.9-5.5-6.5-5.5S3 15.9 3 19M9.5 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM16 8l4 4M20 8l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

function LateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 3v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
