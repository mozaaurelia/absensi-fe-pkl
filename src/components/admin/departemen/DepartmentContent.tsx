"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Department } from "./types";
import DepartmentStatsCards from "./DepartmentStatsCards";
import DepartmentHeader from "./DepartmentHeader";
import DepartmentFilter from "./DepartmentFilter";
import DepartmentGrid from "./DepartmentGrid";
import DepartmentFormModal from "./DepartmentFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentPolicy,
  updateDepartmentPolicy,
} from "@/lib/services/admin";

const DEFAULT_WORK_DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum"];

export default function DepartmentContent() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const toErrorMessage = (err: unknown, fallback: string): string => {
    if (err instanceof Error && "code" in err) {
      const code = (err as { code?: string }).code;
      if (code === "DEPARTMENT_IN_USE")
        return "Departemen masih memiliki karyawan aktif. Pindahkan atau nonaktifkan karyawan terlebih dahulu.";
      if (code === "NOT_FOUND")
        return "Departemen tidak ditemukan atau sudah dihapus.";
      if (code === "NETWORK_ERROR") return err.message;
    }
    return err instanceof Error ? err.message : fallback;
  };

  const load = useCallback(() => {
    setLoading(true);
    getDepartments()
      .then(async (rows) => {
        const items: Department[] = [];
        for (const d of rows) {
          const policy = await getDepartmentPolicy(d.id).catch(() => null);
          items.push({
            id: d.id,
            name: d.name,
            head: "",
            color: "blue",
            status: (d.status as Department["status"]) || "active",
            workDays: DEFAULT_WORK_DAYS,
            allowOvertime: policy?.allow_overtime ?? false,
            allowWFH: policy?.allow_wfh ?? false,
            minAttendance: policy?.min_attendance_percentage ?? 80,
            employeeCount: Number(d.employee_count ?? 0),
            attendanceRate: 0,
          });
        }
        setDepartments(items);
        setError(null);
      })
      .catch(() => setError("Gagal memuat data departemen."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return departments.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const handleAdd = () => {
    setEditingDept(null);
    setActionError(null);
    setModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setActionError(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const target = departments.find((d) => d.id === id);
    if (target) setDeleteTarget(target);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionBusy(true);
    setActionError(null);
    try {
      await deleteDepartment(deleteTarget.id);
      setDepartments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    } catch (err) {
      setActionError(toErrorMessage(err, "Gagal menghapus departemen."));
    } finally {
      setActionBusy(false);
      setDeleteTarget(null);
    }
  };

  const handleSave = async (dept: Department) => {
    const exists = departments.some((d) => d.id === dept.id);
    setActionBusy(true);
    setActionError(null);
    try {
      if (exists) {
        const updated = await updateDepartment(dept.id, {
          name: dept.name,
          status: dept.status,
        });
        await updateDepartmentPolicy(dept.id, {
          allow_overtime: dept.allowOvertime,
          allow_wfh: dept.allowWFH,
          min_attendance_percentage: dept.minAttendance,
          effective_date: new Date().toISOString(),
        });
        setDepartments((prev) =>
          prev.map((d) =>
            d.id === updated.id ? { ...d, ...dept, name: updated.name } : d
          )
        );
      } else {
        const created = await createDepartment({
          name: dept.name,
          status: dept.status,
        });
        await updateDepartmentPolicy(created.id, {
          allow_overtime: dept.allowOvertime,
          allow_wfh: dept.allowWFH,
          min_attendance_percentage: dept.minAttendance,
          effective_date: new Date().toISOString(),
        });
        setDepartments((prev) => [
          ...prev,
          { ...dept, id: created.id, name: created.name },
        ]);
      }
      setModalOpen(false);
    } catch (err) {
      setActionError(toErrorMessage(err, "Gagal menyimpan departemen."));
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <p className="text-sm text-gray-400">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={load}
          className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-[#1E3A5F] rounded-xl hover:opacity-90"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div>
      <DepartmentStatsCards departments={departments} />
      <DepartmentHeader count={departments.length} onAddClick={handleAdd} />

      {actionError && (
        <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-xs text-red-600 dark:text-red-400 rounded-lg">
          {actionError}
        </div>
      )}

      <DepartmentFilter search={search} onSearchChange={setSearch} />
      <DepartmentGrid departments={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      {modalOpen && (
        <DepartmentFormModal
          initialData={editingDept}
          existingNames={departments.map((d) => d.name)}
          saving={actionBusy}
          saveError={actionError}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          description={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
