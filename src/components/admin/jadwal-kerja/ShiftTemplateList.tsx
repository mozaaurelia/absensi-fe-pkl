import type { ShiftTemplate, Assignments } from "./types";
import ShiftTemplateCard from "./ShiftTemplateCard";

interface ShiftTemplateListProps {
  shifts: ShiftTemplate[];
  assignments: Assignments;
  onEdit: (shift: ShiftTemplate) => void;
  onDelete: (id: string) => void;
}

export default function ShiftTemplateList({ shifts, assignments, onEdit, onDelete }: ShiftTemplateListProps) {
  const countFor = (shiftId: string) =>
    Object.values(assignments).reduce(
      (total, days) => total + days.filter((d) => d === shiftId).length,
      0
    );

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Template Shift</h3>
      {shifts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center animate-fade-slide-up">
          <p className="text-3xl mb-2">⏰</p>
          <p className="text-sm text-gray-400">Belum ada template shift. Tambahkan shift terlebih dahulu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {shifts.map((shift, i) => (
            <div key={shift.id} style={{ animationDelay: `${i * 70}ms` }}>
              <ShiftTemplateCard
                shift={shift}
                assignedCount={countFor(shift.id)}
                onEdit={() => onEdit(shift)}
                onDelete={() => onDelete(shift.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
