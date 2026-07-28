export default function ProfileSummary() {
  const rows = [
    { label: "NIK", value: "EMP-00124" },
    { label: "Divisi", value: "Operasional" },
    { label: "Atasan", value: "Surya Prasetya" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-1">Ringkasan Saya</h3>
      <p className="text-xs text-gray-400 mb-5">
        Informasi personal dan status terbaru.
      </p>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">{row.label}</p>
            <p className="text-sm font-semibold text-gray-800">{row.value}</p>
          </div>
        ))}

        <div className="bg-blue-50 rounded-lg px-4 py-3">
          <p className="text-xs text-[#1E3A5F] font-semibold mb-1">
            Pengajuan Terakhir
          </p>
          <p className="text-sm font-semibold text-[#1E3A5F]">
            Cuti Tahunan · Disetujui
          </p>
        </div>
      </div>
    </div>
  );
}