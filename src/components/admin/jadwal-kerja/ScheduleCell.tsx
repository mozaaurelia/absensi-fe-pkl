import type { ShiftTemplate } from "./types";
import { SHIFT_COLOR_MAP } from "./types";

interface ScheduleCellProps {
  shift: ShiftTemplate | null;
  shifts: ShiftTemplate[];
  onChange: (shiftId: string | null) => void;
}

export default function ScheduleCell({ shift, shifts, onChange }: ScheduleCellProps) {
  const style = shift ? SHIFT_COLOR_MAP[shift.color] : null;

  return (
    <select
      value={shift?.id ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={`w-full text-xs font-semibold rounded-lg px-2 py-2 outline-none border cursor-pointer transition-colors ${
        style ? `${style.bg} ${style.text} ${style.border}` : "bg-gray-50 text-gray-400 border-gray-100"
      }`}    >
      <option value="">Libur</option>
      {shifts.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}