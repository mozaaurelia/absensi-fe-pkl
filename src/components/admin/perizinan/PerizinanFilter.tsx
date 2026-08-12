import type { PerizinanStatus } from "./types";

export type FilterStatus = "all" | PerizinanStatus;

interface PerizinanFilterProps {
  search: string;
  filter: FilterStatus;
  counts: Record<FilterStatus, number>;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: FilterStatus) => void;
}

const TABS: { id: FilterStatus; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Menunggu" },
  { id: "approved", label: "Disetujui" },
  { id: "rejected", label: "Ditolak" },
];

export default function PerizinanFilter({
  search,
  filter,
  counts,
  onSearchChange,
  onFilterChange,
}: PerizinanFilterProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
      <div className="relative flex-1">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama karyawan, jenis izin, atau alasan..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
        />
      </div>

      <div className="flex items-center gap-1 bg-gray-100/80 rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filter === tab.id
                ? "bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                filter === tab.id ? "bg-white/20" : "bg-gray-200 text-gray-500"
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
