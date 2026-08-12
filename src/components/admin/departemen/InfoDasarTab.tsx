import type { Department } from "./types";
import ColorPicker from "./ColorPicker";

interface InfoDasarTabProps {
  form: Department;
  onChange: (form: Department) => void;
  nameError?: string;
}

export default function InfoDasarTab({ form, onChange, nameError }: InfoDasarTabProps) {
  const active = form.status === "active";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-lg shrink-0">
            {active ? "✅" : "⛔"}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Status Departemen</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {active ? "Departemen aktif & beroperasi" : "Departemen nonaktif"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...form, status: active ? "inactive" : "active" })}
          className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors shrink-0 ${
            active ? "bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] justify-end" : "bg-gray-300 justify-start"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white block" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Nama Departemen *
        </label>
        <input
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-all ${
            nameError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10"
          }`}
        />
        {nameError && <p className="text-xs text-red-600 mt-1.5">{nameError}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Deskripsi
        </label>
        <textarea
          rows={3}
          value={form.description || ""}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Deskripsi singkat tugas dan fungsi departemen..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Kepala Departemen
        </label>
        <input
          value={form.head || ""}
          onChange={(e) => onChange({ ...form, head: e.target.value })}
          placeholder="Nama kepala / manajer departemen"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Warna Identitas
        </label>
        <ColorPicker value={form.color} onChange={(color) => onChange({ ...form, color })} />
      </div>
    </div>
  );
}
