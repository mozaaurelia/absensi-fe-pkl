interface EmployeeStatsProps {
  total: number;
  aktif: number;
  nonaktif: number;
  contractEndingSoon: number;
}

export default function EmployeeStats({
  total,
  aktif,
  nonaktif,
  contractEndingSoon,
}: EmployeeStatsProps) {
  const stats = [
    { label: "Total Karyawan", value: total, accent: "text-gray-900" },
    { label: "Karyawan Aktif", value: aktif, accent: "text-green-600" },
    { label: "Nonaktif / Resign", value: nonaktif, accent: "text-gray-400" },
    { label: "Kontrak Akan Berakhir", value: contractEndingSoon, accent: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}