interface EmployeeHeaderProps {
  onAddClick: () => void;
}

export default function EmployeeHeader({ onAddClick }: EmployeeHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Data Karyawan</h1>
        <p className="text-xs text-gray-400 mt-1">
          Kelola informasi seluruh karyawan dalam organisasi Anda.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Import Excel
        </button>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
          Tambah Karyawan
        </button>
      </div>
    </div>
  );
}