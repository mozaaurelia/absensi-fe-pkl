export default function Overview() {
  const stats = [
    { label: "Status Hari Ini", value: "Belum Absen", tag: "Pending", tagColor: "bg-amber-100 text-amber-700" },
    { label: "Jam Kerja Minggu Ini", value: "32j 14m", tag: "Normal", tagColor: "bg-green-100 text-green-700" },
    { label: "Sisa Cuti Tahunan", value: "12 Hari", tag: "Aktif", tagColor: "bg-blue-100 text-blue-700" },
    { label: "Terlambat Bulan Ini", value: "2 Kali", tag: "Perlu Cek", tagColor: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-400">{stat.label}</p>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${stat.tagColor}`}
            >
              {stat.tag}
            </span>
          </div>
          <p className="font-bold text-gray-900 text-lg">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}