import { FiBriefcase, FiEdit2, FiEye, FiHash, FiHome, FiMail, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import type { AdminEmployee, Department, Position } from "@/lib/services/admin";
import EmployeeAvatar from "./EmployeeAvatar";
import EmployeeStatusBadge from "./EmployeeStatusBadge";

interface Props {
  rows: AdminEmployee[];
  departments: Department[];
  positions: Position[];
  loading: boolean;
  loadError: string | null;
  onDetail: (row: AdminEmployee) => void;
  onEdit: (row: AdminEmployee) => void;
  onDelete: (row: AdminEmployee) => void;
}

export default function EmployeesTable({
  rows,
  departments,
  positions,
  loading,
  loadError,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useLanguage();

  const deptName = (id?: string | null) =>
    departments.find((d) => d.id === id)?.name ?? "-";
  const posName = (id?: string | null) =>
    positions.find((p) => p.id === id)?.name ?? "-";
  const shortId = (id: string) =>
    id.length > 8 ? `${id.slice(0, 8)}…` : id;

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">{t("common.loading")}</div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">{loadError}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
            <th className="px-6 py-3 font-semibold">{t("adminCrud.name")}</th>
            <th className="px-6 py-3 font-semibold">{t("adminCrud.employeeId")}</th>
            <th className="px-6 py-3 font-semibold">{t("adminCrud.position")}</th>
            <th className="px-6 py-3 font-semibold">{t("adminCrud.department")}</th>
            <th className="px-6 py-3 font-semibold">{t("adminCrud.email")}</th>
            <th className="px-6 py-3 font-semibold text-right">{t("adminMaster.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                {t("common.emptyData")}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar name={row.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {row.name}
                      </p>
                      <div className="mt-0.5">
                        <EmployeeStatusBadge status={row.status} />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md font-mono">
                    <FiHash size={13} />
                    {shortId(row.id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  <span className="inline-flex items-center gap-2">
                    <FiBriefcase size={14} className="text-[#1E3A5F] dark:text-blue-300 shrink-0" />
                    {posName(row.position_id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  <span className="inline-flex items-center gap-2">
                    <FiHome size={14} className="text-[#1E3A5F] dark:text-blue-300 shrink-0" />
                    {deptName(row.department_id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-2">
                    <FiMail size={14} className="text-gray-400 shrink-0" />
                    {row.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onDetail(row)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                      aria-label={t("adminCrud.detail")}
                      title={t("adminCrud.detail")}
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(row)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                      aria-label={t("adminMaster.edit")}
                      title={t("adminMaster.edit")}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      aria-label={t("adminMaster.delete")}
                      title={t("adminMaster.delete")}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
