import type { ShiftTemplate } from "./types";
import { SHIFT_COLOR_MAP, getShiftDuration } from "./types";

interface ShiftTemplateCardProps {
  shift: ShiftTemplate;
  assignedCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ShiftTemplateCard({ shift, assignedCount, onEdit, onDelete }: ShiftTemplateCardProps) {
  const style = SHIFT_COLOR_MAP[shift.color];
  const duration = getShiftDuration(shift);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden card-hover animate-fade-slide-up">
      <span className={`absolute top-0 left-0 right-0 h-1 ${style.dot}`} />

      <div className="flex items-start justify-between mb-4">
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.bg} ${style.text}`}>
          <ClockIcon />
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-[#1E3A5F] flex items-center justify-center transition-colors"
            title="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
            title="Hapus"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 text-sm mb-1">{shift.name}</h3>
      <p className="text-xs text-gray-400 mb-3">
        {shift.startTime} - {shift.endTime} · {duration} jam
      </p>

      <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
        {assignedCount} karyawan terjadwal
      </span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
