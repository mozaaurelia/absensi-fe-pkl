interface EmployeeFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function EmployeeFilter({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
}: EmployeeFilterProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau NIK karyawan..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white transition-colors"
        />
      </div>

      <select
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 md:w-48"
      >
        <option value="Semua">Semua Departemen</option>
        <option value="Operasional">Operasional</option>
        <option value="IT">IT</option>
        <option value="Keuangan">Keuangan</option>
        <option value="Marketing">Marketing</option>
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 md:w-40"
      >
        <option value="Semua">Semua Status</option>
        <option value="Aktif">Aktif</option>
        <option value="Nonaktif">Nonaktif</option>
        <option value="Resign">Resign</option>
      </select>
    </div>
  );
}