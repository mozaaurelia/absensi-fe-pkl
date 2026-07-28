import LeaveCard from "./LeaveCard";

export default function LeaveHistory() {
  const data = [
    { tipe: "Cuti Tahunan", status: "Disetujui", tanggal: "3 - 4 Mei 2026", durasi: "2 Hari" },
    { tipe: "Sakit", status: "Pending", tanggal: "12 Juli 2026", durasi: "1 Hari" },
    { tipe: "Lembur Project Closing", status: "Pending", tanggal: "15 Juli 2026", durasi: "2j 30m", highlight: true },
    { tipe: "Lembur Operasional", status: "Disetujui", tanggal: "8 Juli 2026", durasi: "4j 00m" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900">Status Pengajuan</h3>
        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          {data.length} Data
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Riwayat izin, cuti, dan lembur terbaru.
      </p>

      <div className="flex flex-col gap-3">
        {data.map((item, i) => (
          <LeaveCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}