interface DepartmentHeaderProps {
  count: number;
  onAddClick: () => void;
}

export default function DepartmentHeader({ count, onAddClick }: DepartmentHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Kelola Departemen</h1>
        <p className="text-xs text-gray-400 mt-1">
          {count} departemen · Konfigurasi hari kerja, kebijakan WFH & absensi
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="flex items-center gap-2 bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#16304f] transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
        Tambah Departemen
      </button>
    </div>
  );
}
