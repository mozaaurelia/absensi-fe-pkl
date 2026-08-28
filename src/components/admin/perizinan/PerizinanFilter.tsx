import type { PerizinanStatus } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export type FilterStatus = "all" | PerizinanStatus;

interface PerizinanFilterProps {
  search: string;
  filter: FilterStatus;
  counts: Record<FilterStatus, number>;
  types: string[];
  departments: string[];
  typeFilter: string;
  deptFilter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: FilterStatus) => void;
  onTypeChange: (value: string) => void;
  onDeptChange: (value: string) => void;
}

const TABS: { id: FilterStatus; labelKey: string }[] = [
  { id: "all", labelKey: "adminPermits.tabAll" },
  { id: "pending", labelKey: "adminPermits.tabPending" },
  { id: "approved", labelKey: "adminPermits.tabApproved" },
  { id: "rejected", labelKey: "adminPermits.tabRejected" },
];

const selectClass =
  "appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all cursor-pointer";

export default function PerizinanFilter({
  search,
  filter,
  counts,
  types,
  departments,
  typeFilter,
  deptFilter,
  onSearchChange,
  onFilterChange,
  onTypeChange,
  onDeptChange,
}: PerizinanFilterProps) {
  const { t } = useLanguage();
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
          placeholder={t("adminPermits.searchPlaceholder")}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className={`${selectClass} sm:w-52`}
          >
            <option value="">{t("adminPermits.allTypes")}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="relative">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
          </svg>
          <select
            value={deptFilter}
            onChange={(e) => onDeptChange(e.target.value)}
            className={`${selectClass} sm:w-52`}
          >
            <option value="">{t("adminPermits.allDepartments")}</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex items-center gap-1 bg-gray-100/80 rounded-xl p-1 overflow-x-auto">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => onFilterChange(tb.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === tb.id
                  ? "bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t(tb.labelKey)}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === tb.id ? "bg-white/20" : "bg-gray-200 text-gray-500"
                }`}
              >
                {counts[tb.id]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
