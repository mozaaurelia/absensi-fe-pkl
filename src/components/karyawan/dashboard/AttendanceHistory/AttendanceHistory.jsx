export default function AttendanceHistory() {
  const logs = [
    { date: "Senin, 6 Juli 2026", masuk: "08:56", pulang: "18:03", total: "9j 07m", status: "Hadir", color: "bg-green-100 text-green-700" },
    { date: "Selasa, 7 Juli 2026", masuk: "09:14", pulang: "18:00", total: "8j 46m", status: "Terlambat", color: "bg-amber-100 text-amber-700" },
    { date: "Rabu, 8 Juli 2026", masuk: "--:--", pulang: "--:--", total: "0j 00m", status: "Belum Absen", color: "bg-amber-100 text-amber-700" },
    { date: "Kamis, 9 Juli 2026", masuk: "-", pulang: "-", total: "-", status: "Terjadwal", color: "bg-gray-100 text-gray-500" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900">Log Absensi Minggu Ini</h3>
        <p className="text-xs text-gray-400">Periode: 6 - 12 Juli 2026</p>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Ringkasan pencatatan masuk dan pulang karyawan.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">Jam Masuk</th>
              <th className="pb-3 font-medium">Jam Pulang</th>
              <th className="pb-3 font-medium">Total Jam</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.date} className="border-b border-gray-50 last:border-0">
                <td className="py-3 text-gray-800">{log.date}</td>
                <td className="py-3 text-gray-600">{log.masuk}</td>
                <td className="py-3 text-gray-600">{log.pulang}</td>
                <td className="py-3 font-semibold text-gray-800">{log.total}</td>
                <td className="py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${log.color}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}