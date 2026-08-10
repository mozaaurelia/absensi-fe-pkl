import StatusBadge from "./StatusBadge";
import type { Employee } from "./employee.types";

interface EmployeeRowProps {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

function isContractEndingSoon(contractEnd?: string): boolean {
  if (!contractEnd) return false;
  const diffDays =
    (new Date(contractEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}

export default function EmployeeRow({ employee, onEdit, onDelete }: EmployeeRowProps) {
  const endingSoon = isContractEndingSoon(employee.contractEnd);

  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center shrink-0">
            {employee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{employee.name}</p>
            <p className="text-xs text-gray-400">{employee.nik}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{employee.department}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{employee.position}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{employee.joinDate}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={employee.status} />
          {endingSoon && (
            <span className="bg-amber-50 text-amber-700 text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap">
              Kontrak berakhir {employee.contractEnd}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 flex items-center justify-center transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 flex items-center justify-center transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}