interface PerizinanHeaderProps {
  count: number;
  pendingCount: number;
}

export default function PerizinanHeader({ count, pendingCount }: PerizinanHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-gray-900">Manajemen Perizinan</h1>
        <p className="text-xs text-gray-400 mt-1">
          Proses permohonan izin & cuti karyawan. · {count} pengajuan, {pendingCount} menunggu
        </p>
      </div>

      <span className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 shrink-0 w-fit">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        Menunggu persetujuan: {pendingCount}
      </span>
    </div>
  );
}
