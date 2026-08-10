import StatCard from "./StatCard";

export default function StatsGrid() {
  const stats = [
    {
      label: "Karyawan Aktif",
      value: "148",
      delta: "+3 bulan ini",
      trend: "up" as const,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <EmployeeIcon />,
    },
    {
      label: "Hadir Hari Ini",
      value: "132 (89%)",
      delta: "+4% dari kemarin",
      trend: "up" as const,
      iconBg: "bg-green-50 text-green-600",
      icon: <CheckIcon />,
    },
    {
      label: "Terlambat Hari Ini",
      value: "9",
      delta: "-2 dari kemarin",
      trend: "down" as const,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <ClockIcon />,
    },
    {
      label: "Pengajuan Pending",
      value: "14",
      delta: "Perlu ditinjau",
      trend: "neutral" as const,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <InboxIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function EmployeeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5M16 8.5a3 3 0 1 0 0-6M18.5 14c2.2.5 3.9 2.3 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
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
function InboxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h4l2 3h6l2-3h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}