interface JadwalKerjaHeaderProps {
  onAddEvent: () => void;
  onBulkAssign: () => void;
}

export default function JadwalKerjaHeader({ onAddEvent, onBulkAssign }: JadwalKerjaHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Jadwal Kerja Karyawan</h1>
        <p className="text-xs text-gray-400 mt-1">
          Kelola shift harian dan lokasi kerja karyawan
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onBulkAssign}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#1E3A5F] hover:border-blue-200 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" />
          </svg>
          Atur Massal
        </button>

        <button
          onClick={onAddEvent}
          className="flex items-center gap-2 bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#16304f] transition-colors shadow-sm"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
          Event Baru
        </button>
      </div>
    </div>
  );
}
