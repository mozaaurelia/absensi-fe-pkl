import { FiBriefcase, FiHash, FiHome, FiMail, FiShield, FiX } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import type { AdminEmployee, Department, Position } from "@/lib/services/admin";
import EmployeeAvatar from "./EmployeeAvatar";
import EmployeeStatusBadge from "./EmployeeStatusBadge";

interface Props {
  employee: AdminEmployee;
  departments: Department[];
  positions: Position[];
  onClose: () => void;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
      <span className="w-9 h-9 rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F] dark:bg-blue-400/20 dark:text-blue-300 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeDetailModal({
  employee,
  departments,
  positions,
  onClose,
}: Props) {
  const { t } = useLanguage();

  const deptName = departments.find((d) => d.id === employee.department_id)?.name ?? "-";
  const posName = positions.find((p) => p.id === employee.position_id)?.name ?? "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] px-6 py-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/15 border border-white/10 flex items-center justify-center text-white">
              <FiShield size={26} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{employee.name}</h3>
              <div className="mt-1">
                <EmployeeStatusBadge status={employee.status} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label={t("common.close")}
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <DetailRow
            icon={<FiHash size={17} />}
            label={t("adminCrud.employeeId")}
            value={employee.id}
          />
          <DetailRow icon={<FiMail size={17} />} label={t("adminCrud.email")} value={employee.email} />
          <DetailRow icon={<FiShield size={17} />} label={t("adminCrud.role")} value={employee.role_name || "-"} />
          <DetailRow icon={<FiBriefcase size={17} />} label={t("adminCrud.position")} value={posName} />
          <DetailRow icon={<FiHome size={17} />} label={t("adminCrud.department")} value={deptName} />
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-[#1E3A5F] text-white text-sm font-semibold hover:bg-[#16304f] transition-colors"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
