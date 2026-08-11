import EmployeeRow from "./EmployeeRow";
import type { Employee } from "./employee.types";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 font-medium">Karyawan</th>
              <th className="py-3 px-4 font-medium">Departemen</th>
              <th className="py-3 px-4 font-medium">Jabatan</th>
              <th className="py-3 px-4 font-medium">Tanggal Bergabung</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                  Tidak ada karyawan yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onEdit={() => onEdit(employee)}
                  onDelete={() => onDelete(employee.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}