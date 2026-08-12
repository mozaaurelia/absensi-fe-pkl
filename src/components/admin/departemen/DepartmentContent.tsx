"use client";

import { useMemo, useState } from "react";
import type { Department } from "./types";
import DepartmentStatsCards from "./DepartmentStatsCards";
import DepartmentHeader from "./DepartmentHeader";
import DepartmentFilter from "./DepartmentFilter";
import DepartmentGrid from "./DepartmentGrid";
import DepartmentFormModal from "./DepartmentFormModal";

const initialDepartments: Department[] = [
  { id: "1", name: "Akuntansi", head: "Hendra Audit", color: "blue", status: "active", workDays: ["Sen", "Sel", "Rab", "Kam", "Jum"], allowOvertime: true, allowWFH: false, minAttendance: 85, employeeCount: 8, attendanceRate: 92 },
  { id: "2", name: "Layanan Nasabah", head: "Ani Lestari", color: "green", status: "active", workDays: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], allowOvertime: true, allowWFH: false, minAttendance: 90, employeeCount: 14, attendanceRate: 78 },
  { id: "3", name: "Pemasaran", head: "Dewi Marketing", color: "purple", status: "inactive", workDays: ["Sen", "Sel", "Rab", "Kam", "Jum"], allowOvertime: false, allowWFH: true, minAttendance: 75, employeeCount: 6, attendanceRate: 88 },
];

export default function DepartmentContent() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const filtered = useMemo(() => {
    return departments.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const handleAdd = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus departemen ini?")) return;
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSave = (dept: Department) => {
    setDepartments((prev) => {
      const exists = prev.some((d) => d.id === dept.id);
      return exists ? prev.map((d) => (d.id === dept.id ? dept : d)) : [...prev, dept];
    });
    setModalOpen(false);
  };

  return (
    <div>
      <DepartmentStatsCards departments={departments} />
      <DepartmentHeader count={departments.length} onAddClick={handleAdd} />
      <DepartmentFilter search={search} onSearchChange={setSearch} />
      <DepartmentGrid departments={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      {modalOpen && (
        <DepartmentFormModal
          initialData={editingDept}
          existingNames={departments.map((d) => d.name)}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
