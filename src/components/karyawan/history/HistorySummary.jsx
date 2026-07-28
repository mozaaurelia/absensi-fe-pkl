export default function HistorySummary() {
  const stats = [
    { label: "Total Hari Hadir", value: "21" },
    { label: "Total Jam Kerja", value: "168j 30m" },
    { label: "Terlambat", value: "3 Hari" },
    { label: "Izin / Sakit", value: "2 Hari" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
          <p className="font-bold text-gray-900 text-lg">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}