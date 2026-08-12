import type { Employee, ShiftTemplate, Assignments } from "./types";
import { DAYS, getShiftDuration, SHIFT_COLOR_MAP } from "./types";
import ScheduleCell from "./ScheduleCell";
import WeekNavigator from "./WeekNavigator";

interface WeeklyScheduleGridProps {
  employees: Employee[];
  shifts: ShiftTemplate[];
  assignments: Assignments;
  weekLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onCopyWeek: () => void;
  onAssign: (employeeId: string, dayIndex: number, shiftId: string | null) => void;
}

export default function WeeklyScheduleGrid({
  employees,
  shifts,
  assignments,
  weekLabel,
  onPrevWeek,
  onNextWeek,
  onCopyWeek,
  onAssign,
}: WeeklyScheduleGridProps) {
  const shiftMap = new Map(shifts.map((s) => [s.id, s]));

  const emptyDays = DAYS.map((_, dayIdx) =>
    employees.every((emp) => !assignments[emp.id]?.[dayIdx])
  );

  const getTotalHours = (employeeId: string) => {
    const days = assignments[employeeId] ?? [];
    return days.reduce((total, shiftId) => {
      if (!shiftId) return total;
      const shift = shiftMap.get(shiftId);
      return total + (shift ? getShiftDuration(shift) : 0);
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6 animate-fade-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Penugasan Mingguan</h3>
          <p className="text-xs text-gray-400 mt-0.5">Atur shift tiap karyawan per hari.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 mr-2">
            {shifts.map((s) => (
              <span key={s.id} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2.5 h-2.5 rounded-full ${SHIFT_COLOR_MAP[s.color].dot}`} />
                {s.name}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              Libur
            </span>
          </div>

          <div className="flex items-center gap-3">
            <WeekNavigator
              weekLabel={weekLabel}
              onPrev={onPrevWeek}
              onNext={onNextWeek}
            />
            <button
              onClick={onCopyWeek}
              className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#1E3A5F] hover:bg-blue-50 hover:border-blue-200 transition-colors whitespace-nowrap"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" />
              </svg>
              Salin ke Minggu Depan
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 font-medium sticky left-0 bg-gray-50">Karyawan</th>
              {DAYS.map((day, i) => (
                <th key={day} className="py-3 px-3 font-medium text-center">
                  <div className="flex flex-col items-center gap-1">
                    {day}
                    {emptyDays[i] && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" title="Belum ada jadwal" />
                    )}
                  </div>
                </th>
              ))}
              <th className="py-3 px-4 font-medium text-right">Total Jam</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const totalHours = getTotalHours(emp.id);
              const overLimit = totalHours > 44;

              return (
                <tr key={emp.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                  <td className="py-3 px-4 sticky left-0 bg-white">
                    <p className="text-sm font-semibold text-gray-800">{emp.name}</p>
                    <p className="text-[11px] text-gray-400">{emp.department}</p>
                  </td>
                  {DAYS.map((_, dayIdx) => {
                    const shiftId = assignments[emp.id]?.[dayIdx] ?? null;
                    const shift = shiftId ? shiftMap.get(shiftId) ?? null : null;
                    return (
                      <td key={dayIdx} className="py-2 px-2">
                        <ScheduleCell
                          shift={shift}
                          shifts={shifts}
                          onChange={(newShiftId) => onAssign(emp.id, dayIdx, newShiftId)}
                        />
                      </td>
                    );
                  })}
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        overLimit ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
                      }`}
                      title={overLimit ? "Melebihi batas wajar 44 jam/minggu" : undefined}
                    >
                      {totalHours}j
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {emptyDays.some(Boolean) && (
        <div className="flex items-center gap-2 bg-blue-50 text-[#1E3A5F] text-xs font-semibold px-4 py-3 border-t border-blue-100">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 17h.01M10.3 4.5L2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a1.5 1.5 0 0 0-2.6 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Ada hari tanpa satu pun karyawan terjadwal — periksa kembali penugasan shift.
        </div>
      )}
    </div>
  );
}
