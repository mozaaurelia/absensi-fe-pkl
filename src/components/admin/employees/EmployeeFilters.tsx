import { FiFilter, FiSearch } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import type { Department } from "@/lib/services/admin";

interface Props {
  search: string;
  onSearch: (value: string) => void;
  departmentFilter: string;
  onDepartmentFilter: (value: string) => void;
  statusFilter: string;
  onStatusFilter: (value: string) => void;
  departments: Department[];
}

const selectClass =
  "rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-9 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors appearance-none";

export default function EmployeeFilters({
  search,
  onSearch,
  departmentFilter,
  onDepartmentFilter,
  statusFilter,
  onStatusFilter,
  departments,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100 dark:border-gray-700">
      <div className="relative flex-1">
        <FiSearch
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("adminCrud.searchEmployee")}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-10 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        />
      </div>

      <div className="relative">
        <FiFilter
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value)}
          className={`${selectClass} sm:w-44`}
        >
          <option value="">{t("adminCrud.allStatuses")}</option>
          <option value="active">{t("adminCrud.active")}</option>
          <option value="resigned">{t("adminCrud.resigned")}</option>
        </select>
      </div>

      <div className="relative">
        <FiFilter
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <select
          value={departmentFilter}
          onChange={(e) => onDepartmentFilter(e.target.value)}
          className={`${selectClass} sm:w-56`}
        >
          <option value="">{t("adminCrud.allDepartments")}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
