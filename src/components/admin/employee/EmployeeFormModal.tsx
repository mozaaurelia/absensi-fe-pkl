"use client";

import { useEffect, useState } from "react";
import type { Employee } from "./employee.types";

interface EmployeeFormModalProps {
  initialData: Employee | null;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

const emptyForm: Omit<Employee, "id"> = {
  name: "",
  nik: "",
  department: "Operasional",
  position: "",
  joinDate: "",
  status: "Aktif",
  contractEnd: "",
};

export default function EmployeeFormModal({
  initialData,
  onClose,
  onSave,
}: EmployeeFormModalProps) {
  const [form, setForm] = useState<Omit<Employee, "id">>(emptyForm);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: initialData?.id ?? crypto.randomUUID(), ...form });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">
            {initialData ? "Edit Karyawan" : "Tambah Karyawan Baru"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-50 flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nama Lengkap</label>
            <input required value={form.name} onChange={set("name")} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">NIK</label>
            <input required value={form.nik} onChange={set("nik")} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Jabatan</label>
            <input required value={form.position} onChange={set("position")} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Departemen</label>
            <select value={form.department} onChange={set("department")} className="input-field">
              <option value="Operasional">Operasional</option>
              <option value="IT">IT</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
            <select value={form.status} onChange={set("status")} className="input-field">
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
              <option value="Resign">Resign</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tanggal Bergabung</label>
            <input type="date" value={form.joinDate} onChange={set("joinDate")} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Akhir Kontrak <span className="text-gray-300">(opsional)</span>
            </label>
            <input type="date" value={form.contractEnd} onChange={set("contractEnd")} className="input-field" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-orange-500 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            {initialData ? "Simpan Perubahan" : "Tambah Karyawan"}
          </button>
        </div>
      </form>
    </div>
  );
}