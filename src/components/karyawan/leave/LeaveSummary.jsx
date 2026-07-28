import SummaryCard from "./SummaryCard";

export default function LeaveSummary() {
  const stats = [
    { label: "Sisa Cuti Tahunan", value: "12 Hari", note: "Masih tersedia", noteColor: "text-green-600" },
    { label: "Cuti Terpakai", value: "2 Hari", note: "Tahun berjalan", noteColor: "text-blue-600" },
    { label: "Pengajuan Pending", value: "1", note: "Menunggu atasan", noteColor: "text-orange-500" },
    { label: "Pengajuan Ditolak", value: "1", note: "Perlu revisi", noteColor: "text-red-600" },
    { label: "Lembur Bulan Ini", value: "6j 30m", note: "Sudah tercatat", noteColor: "text-purple-600" },
    { label: "Lembur Pending", value: "2", note: "Butuh approval", noteColor: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat) => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}