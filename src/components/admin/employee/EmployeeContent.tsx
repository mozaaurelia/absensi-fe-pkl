"use client";

import { useMemo, useState } from "react";
import type { Employee } from "./employee.types";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeStats from "./EmployeeStats";
import EmployeeFilter from "./EmployeeFilter";
import EmployeeTable from "./EmployeeTable";
import EmployeeFormModal from "./EmployeeFormModal";

const initialEmployees: Employee[] = [
  { id: "1", name: "Andi Pratama", nik: "EMP-00124", department: "Operasional", position: "Staff Operasional", joinDate: "2023-03-01", status: "Aktif", contractEnd: "2026-08-20" },
  { id: "2", name: "Sinta Rahma", nik: "EMP-00089", department: "Keuangan", position: "Staff Keuangan", joinDate: "2022-01-15", status: "Aktif" },
  { id: "3", name: "Budi Santoso", nik: "EMP-00102", department: "IT", position: "Frontend Developer", joinDate: "2023-07-10", status: "Aktif" },
  { id: "4", name: "Maya Lestari", nik: "EMP-00075", department: "Operasional", position: "Supervisor Operasional", joinDate: "2021-11-05", status: "Aktif" },
  { id: "5", name: "Rizky Ramadhan", nik: "EMP-00133", department: "Marketing", position: "Staff Marketing", joinDate: "2024-02-20", status: "Nonaktif" },
];

function isContractEndingSoon(contractEnd?: string): boolean {
  if (!contractEnd) return false;
  const diffDays =
    (new Date(contractEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}

export default function EmployeeContent() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.nik.toLowerCase().includes(search.toLowerCase());
      const matchDept = department === "Semua" || emp.department === department;
      const matchStatus = status === "Semua" || emp.status === status;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, department, status]);

  const stats = useMemo(
    () => ({
      total: employees.length,
      aktif: employees.filter((e) => e.status === "Aktif").length,
      nonaktif: employees.filter((e) => e.status !== "Aktif").length,
      contractEndingSoon: employees.filter((e) => isContractEndingSoon(e.contractEnd)).length,
    }),
    [employees]
  );

  const handleAddClick = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus karyawan ini?")) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSave = (employee: Employee) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === employee.id);
      return exists
        ? prev.map((e) => (e.id === employee.id ? employee : e))
        : [...prev, employee];
    });
    setModalOpen(false);
  };

  return (
    <div>
      <EmployeeHeader onAddClick={handleAddClick} />
      <EmployeeStats {...stats} />
      <EmployeeFilter
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        status={status}
        onStatusChange={setStatus}
      />
      <EmployeeTable employees={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      {modalOpen && (
        <EmployeeFormModal
          initialData={editingEmployee}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}