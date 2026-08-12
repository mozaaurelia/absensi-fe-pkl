import type { Department } from "./types";
import { WEEKDAYS } from "./types";

interface HariKerjaTabProps {
  form: Department;
  onChange: (form: Department) => void;
}

export default function HariKerjaTab({ form, onChange }: HariKerjaTabProps) {
  const toggleDay = (day: string) => {
    const active = form.workDays.includes(day);
    const nextDays = active
      ? form.workDays.filter((d) => d !== day)
      : [...form.workDays, day].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
    onChange({ ...form, workDays: nextDays });
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Hari Kerja
      </label>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {WEEKDAYS.map((day) => {
          const active = form.workDays.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                active
                  ? "bg-[#1E3A5F] text-white"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {form.workDays.length > 0 && (
        <p className="text-xs text-[#1E3A5F] font-semibold mb-6 bg-blue-50 rounded-lg px-3 py-2">
          ✓ {form.workDays.join(", ")}
        </p>
      )}

      <div className="bg-blue-50 text-[#1E3A5F] rounded-xl px-4 py-3">
        <p className="text-sm font-semibold">
          {form.workDays.length} hari kerja per minggu
        </p>
      </div>
    </div>
  );
}
