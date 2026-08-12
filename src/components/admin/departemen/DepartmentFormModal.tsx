"use client";

import { useState } from "react";
import type { Department } from "./types";
import InfoDasarTab from "./InfoDasarTab";
import HariKerjaTab from "./HariKerjaTab";
import KebijakanTab from "./KebijakanTab";

type Tab = "info" | "hari-kerja" | "kebijakan";

interface DepartmentFormModalProps {
  initialData: Department | null;
  existingNames: string[];
  onClose: () => void;
  onSave: (department: Department) => void;
}

const emptyForm: Omit<Department, "id" | "employeeCount" | "attendanceRate"> = {
  name: "",
  description: "",
  head: "",
  color: "blue",
  status: "active",
  workDays: ["Sen", "Sel", "Rab", "Kam", "Jum"],
  allowOvertime: false,
  allowWFH: false,
  minAttendance: 80,
};

export default function DepartmentFormModal({
  initialData,
  existingNames,
  onClose,
  onSave,
}: DepartmentFormModalProps) {
  const [tab, setTab] = useState<Tab>("info");
  const [form, setForm] = useState<Department>(
    initialData ?? { id: crypto.randomUUID(), employeeCount: 0, attendanceRate: 90, ...emptyForm }
  );
  const [nameError, setNameError] = useState("");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "info", label: "Info Dasar", icon: "📋" },
    { id: "hari-kerja", label: "Hari Kerja", icon: "📅" },
    { id: "kebijakan", label: "Kebijakan", icon: "📜" },
  ];

  const handleSave = () => {
    const trimmed = form.name.trim();
    if (!trimmed) {
      setNameError("Nama departemen wajib diisi.");
      setTab("info");
      return;
    }
    const isDuplicate = existingNames
      .filter((n) => n.toLowerCase() !== initialData?.name.toLowerCase())
      .some((n) => n.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      setNameError("Nama departemen ini sudah dipakai.");
      setTab("info");
      return;
    }
    setNameError("");
    onSave({ ...form, name: trimmed });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>✏️</span> {initialData ? "Edit Departemen" : "Tambah Departemen"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Konfigurasi departemen & kebijakan absensi</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex gap-1 bg-gray-50 mx-6 rounded-xl p-1 mb-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 max-h-[50vh] overflow-y-auto">
          {tab === "info" && <InfoDasarTab form={form} onChange={setForm} nameError={nameError} />}
          {tab === "hari-kerja" && <HariKerjaTab form={form} onChange={setForm} />}
          {tab === "kebijakan" && <KebijakanTab form={form} onChange={setForm} />}
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-lg py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] text-white rounded-lg py-3 text-sm font-semibold hover:brightness-110 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}