"use client";

interface Props {
  totalLocations: number;
  activeLocations: number;
  totalEmployees: number;
  checkInToday: number;
  checkOutToday: number;
  loading: boolean;
}

const cardClass =
  "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5";

export default function LocationStatsCards({
  totalLocations,
  activeLocations,
  totalEmployees,
  checkInToday,
  checkOutToday,
  loading,
}: Props) {
  const stats = [
    {
      label: "Total Lokasi",
      desc: `${activeLocations} aktif`,
      value: totalLocations,
      icon: <LocationIcon />,
    },
    {
      label: "Total Karyawan",
      desc: "Terdaftar",
      value: totalEmployees,
      icon: <UsersIcon />,
    },
    {
      label: "Check-in Hari Ini",
      desc: "Semua lokasi",
      value: checkInToday,
      icon: <LogInIcon />,
    },
    {
      label: "Check-out Hari Ini",
      desc: "Semua lokasi",
      value: checkOutToday,
      icon: <LogOutIcon />,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${cardClass} animate-pulse`}>
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 mb-4" />
            <div className="w-14 h-7 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
            <div className="w-24 h-4 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className={cardClass}>
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A5F] flex items-center justify-center mb-4">
            {stat.icon}
          </span>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">
            {stat.label}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
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

function LogInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 17l5-5-5-5M4 12h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M8 12h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
