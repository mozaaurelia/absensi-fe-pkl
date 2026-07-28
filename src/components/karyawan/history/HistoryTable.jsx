export default function HistoryTable() {
  const logs = [
    { date: "Senin, 1 Juni 2026", masuk: "08:55", pulang: "18:02", lokasi: "Kantor Pusat Jakarta", status: "Hadir", color: "bg-green-100 text-green-700", total: "9j 07m" },
    { date: "Selasa, 2 Juni 2026", masuk: "09:12", pulang: "18:05", lokasi: "Kantor Pusat Jakarta", status: "Terlambat", color: "bg-amber-100 text-amber-700", total: "8j 53m" },
    { date: "Rabu, 3 Juni 2026", masuk: "08:48", pulang: "17:58", lokasi: "Kantor Pusat Jakarta", status: "Hadir", color: "bg-green-100 text-green-700", total: "9j 10m" },
    { date: "Kamis, 4 Juni 2026", masuk: "--:--", pulang: "--:--", lokasi: "Tidak tersedia", status: "Sakit", color: "bg-purple-100 text-purple-700", total: "0j 00m" },
    { date: "Jumat, 5 Juni 2026", masuk: "08:51", pulang: "17:45", lokasi: "Kantor Cabang Bandung", status: "Hadir", color: "bg-green-100 text-green-700", total: "8j 54m" },
    { date: "Senin, 8 Juni 2026", masuk: "09:20", pulang: "18:10", lokasi: "Kantor Pusat Jakarta", status: "Terlambat", color: "bg-amber-100 text-amber-700", total: "8j 50m" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900">Tabel Riwayat Presensi</h3>
        <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Export XLSX
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Data absensi personal berdasarkan tanggal dan lokasi pencatatan.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
              <th className="pb-3 pt-3 px-3 font-medium">Tanggal</th>
              <th className="pb-3 pt-3 px-3 font-medium">Jam Masuk</th>
              <th className="pb-3 pt-3 px-3 font-medium">Jam Pulang</th>
              <th className="pb-3 pt-3 px-3 font-medium">Lokasi</th>
              <th className="pb-3 pt-3 px-3 font-medium">Status</th>
              <th className="pb-3 pt-3 px-3 font-medium">Total Jam Kerja</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.date} className="border-b border-gray-50 last:border-0">
                <td className="py-3 px-3 font-semibold text-gray-800">{log.date}</td>
                <td className="py-3 px-3 text-gray-600">{log.masuk}</td>
                <td className="py-3 px-3 text-gray-600">{log.pulang}</td>
                <td className="py-3 px-3 text-gray-600">{log.lokasi}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${log.color}`}>
                    {log.status}
                  </span>
                </td>
                <td className="py-3 px-3 font-semibold text-gray-800">{log.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}