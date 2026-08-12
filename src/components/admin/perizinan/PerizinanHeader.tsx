interface PerizinanHeaderProps {
  count: number;
  pendingCount: number;
}

export default function PerizinanHeader({ count, pendingCount }: PerizinanHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Manajemen Perizinan</h1>
        <p className="text-xs text-gray-400 mt-1">
          Proses permohonan izin & cuti karyawan. · {count} pengajuan, {pendingCount} menunggu
        </p>
      </div>

      <span className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        Menunggu persetujuan: {pendingCount}
      </span>
    </div>
  );
}
