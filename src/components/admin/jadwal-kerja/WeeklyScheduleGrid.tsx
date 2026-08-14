import type { Employee, ShiftTemplate, Assignments, WeekDay, ScheduleTab } from "./types";
import { getShiftDuration, getInitials } from "./types";
import ScheduleCell from "./ScheduleCell";
import { useLanguage } from "@/context/LanguageContext";

interface WeeklyScheduleGridProps {
  employees: Employee[];
  shifts: ShiftTemplate[];
  assignments: Assignments;
  days: WeekDay[];
  search: string;
  tab: ScheduleTab;
  counts: Record<ScheduleTab, number>;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: ScheduleTab) => void;
  onAssign: (employeeId: string, dayIndex: number, shiftId: string | null) => void;
}

const TABS: { id: ScheduleTab; labelKey: string }[] = [
  { id: "all", labelKey: "adminSchedule.tabAll" },
  { id: "wfo", labelKey: "adminSchedule.tabWFO" },
  { id: "wfh", labelKey: "adminSchedule.tabWFH" },
  { id: "libur", labelKey: "adminSchedule.tabLibur" },
];

export default function WeeklyScheduleGrid({
  employees,
  shifts,
  assignments,
  days,
  search,
  tab,
  counts,
  onSearchChange,
  onTabChange,
  onAssign,
}: WeeklyScheduleGridProps) {
  const { t } = useLanguage();
  const shiftMap = new Map(shifts.map((s) => [s.id, s]));

  const emptyDays = days.map((_, dayIdx) =>
    employees.every((emp) => !assignments[emp.id]?.[dayIdx])
  );

  const getTotalHours = (employeeId: string) => {
    const employeeDays = assignments[employeeId] ?? [];
    return employeeDays.reduce((total, shiftId) => {
      if (!shiftId) return total;
      const shift = shiftMap.get(shiftId);
      return total + (shift ? getShiftDuration(shift) : 0);
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6 animate-fade-slide-up">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="relative">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("adminSchedule.searchPlaceholder")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
          />
        </div>
      </div>

      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex flex-wrap items-center gap-1">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => onTabChange(tb.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              tab === tb.id
                ? "bg-[#1E3A5F] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t(tb.labelKey)}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                tab === tb.id ? "bg-white/20" : "bg-gray-200 text-gray-500"
              }`}
            >
              {counts[tb.id]}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
              <th className="py-3 pl-5 pr-2 font-medium sticky left-0 bg-gray-50 w-16 text-center">{t("adminSchedule.idCol")}</th>
              <th className="py-3 pl-2 pr-4 font-medium sticky left-16 bg-gray-50">{t("adminSchedule.nameCol")}</th>
              {days.map((day, i) => (
                <th key={day.fullDate} className="py-3 px-2 font-medium text-center">
                  <div
                    className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 ${
                      day.isToday ? "bg-blue-50" : ""
                    }`}
                  >
                    <span className={`text-[11px] font-semibold uppercase tracking-wide ${day.isToday ? "text-[#1E3A5F]" : "text-gray-500"}`}>
                      {day.name}
                    </span>
                    <span className={`text-base font-bold leading-tight ${day.isToday ? "text-[#1E3A5F]" : "text-gray-800"}`}>
                      {day.date}
                    </span>
                    {emptyDays[i] && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-red-400"
                        title={t("adminSchedule.noSchedule")}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="py-3 px-5 font-medium text-center">{t("adminSchedule.totalHoursCol")}</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const totalHours = getTotalHours(emp.id);
              const overLimit = totalHours > 44;

              return (
                <tr
                  key={emp.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
                >
                  <td className="py-3 pl-5 pr-2 sticky left-0 bg-white w-16 text-center">
                    <span className="inline-flex text-[10px] font-bold text-[#1E3A5F] bg-blue-50 rounded px-1.5 py-0.5 whitespace-nowrap">
                      {emp.id.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 pl-2 pr-4 sticky left-16 bg-white">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-blue-50 text-[#1E3A5F] text-xs font-bold flex items-center justify-center shrink-0">
                        {getInitials(emp.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{emp.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{emp.department}</p>
                      </div>
                    </div>
                  </td>
                  {days.map((day, dayIdx) => {
                    const shiftId = assignments[emp.id]?.[dayIdx] ?? null;
                    const shift = shiftId ? shiftMap.get(shiftId) ?? null : null;
                    return (
                      <td key={day.fullDate} className={`py-2 px-1.5 ${day.isToday ? "bg-blue-50/30" : ""}`}>
                        <ScheduleCell
                          shift={shift}
                          shifts={shifts}
                          onChange={(newShiftId) => onAssign(emp.id, dayIdx, newShiftId)}
                        />
                      </td>
                    );
                  })}
                  <td className="py-3 px-5 text-center">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        overLimit ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#1E3A5F]"
                      }`}
                      title={overLimit ? t("adminSchedule.overLimitTitle") : undefined}
                    >
                      {totalHours}j
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {employees.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-gray-600">{t("adminSchedule.noResultTitle")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("adminSchedule.noResultDesc")}</p>
          </div>
        )}
      </div>

      {emptyDays.some(Boolean) && (
        <div className="flex items-center gap-2 bg-blue-50 text-[#1E3A5F] text-xs font-semibold px-5 py-3 border-t border-blue-100">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 17h.01M10.3 4.5L2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a1.5 1.5 0 0 0-2.6 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("adminSchedule.emptyDaysWarning")}
        </div>
      )}
    </div>
  );
}