import type { Department } from "./types";

interface KebijakanTabProps {
  form: Department;
  onChange: (form: Department) => void;
}

function getSliderColor(value: number) {
  if (value >= 90) return "accent-red-500";
  if (value >= 75) return "accent-amber-500";
  return "accent-green-500";
}

function getSliderLabelStyle(value: number) {
  if (value >= 90) return "text-red-600 bg-red-50 border-red-100";
  if (value >= 75) return "text-amber-600 bg-amber-50 border-amber-100";
  return "text-green-600 bg-green-50 border-green-100";
}

export default function KebijakanTab({ form, onChange }: KebijakanTabProps) {
  return (
    <div className="flex flex-col gap-3">
      <ToggleRow
        icon={<ClockIcon />}
        title="Izinkan Lembur"
        desc="Karyawan dapat mencatat jam lembur setelah jam kerja"
        checked={form.allowOvertime}
        onToggle={() => onChange({ ...form, allowOvertime: !form.allowOvertime })}
      />
      <ToggleRow
        icon={<HomeIcon />}
        title="Izinkan Work From Home"
        desc="Karyawan dapat absen dari lokasi lain"
        checked={form.allowWFH}
        onToggle={() => onChange({ ...form, allowWFH: !form.allowWFH })}
      />

      <div className={`rounded-xl border px-4 py-4 mt-1 ${getSliderLabelStyle(form.minAttendance)}`}>
        <p className="text-sm font-bold mb-3">
          Batas Minimum Kehadiran Bulanan: {form.minAttendance}%
        </p>
        <input
          type="range"
          min={50}
          max={100}
          value={form.minAttendance}
          onChange={(e) => onChange({ ...form, minAttendance: Number(e.target.value) })}
          className={`w-full ${getSliderColor(form.minAttendance)}`}
        />
        <div className="flex justify-between text-[11px] opacity-70 mt-1">
          <span>50% (longgar)</span>
          <span>75%</span>
          <span>100% (ketat)</span>
        </div>
        <p className="text-xs mt-2 opacity-80">
          Sistem akan menampilkan peringatan jika kehadiran bulan ini di bawah angka ini.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 text-[#1E3A5F] text-xs font-medium rounded-lg px-4 py-3 mt-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Kebijakan ini berlaku untuk seluruh anggota departemen.
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  desc,
  checked,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors shrink-0 ${
          checked ? "bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] justify-end" : "bg-gray-300 justify-start"
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-white block" />
      </button>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}