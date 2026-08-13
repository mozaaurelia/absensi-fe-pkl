"use client";

import { useMemo, useState } from "react";
import type { ShiftTemplate, Employee, Assignments, ScheduleTab } from "./types";
import { getWeekDays, DAYS } from "./types";
import JadwalKerjaHeader from "./JadwalKerjaHeader";
import DailyAttendanceStats from "./DailyAttendanceStats";
import WeeklyScheduleGrid from "./WeeklyScheduleGrid";
import EventModal, { type ScheduleEvent } from "./EventModal";
import MassAssignModal from "./MassAssignModal";

const initialShifts: ShiftTemplate[] = [
  { id: "wfo", name: "WFO", startTime: "08:00", endTime: "17:00", color: "blue" },
  { id: "wfh", name: "WFH", startTime: "09:00", endTime: "17:00", color: "teal" },
];

const employees: Employee[] = [
  { id: "e1", name: "Andi Pratama", department: "Operasional" },
  { id: "e2", name: "Sinta Rahma", department: "Keuangan" },
  { id: "e3", name: "Budi Santoso", department: "IT" },
  { id: "e4", name: "Maya Lestari", department: "Operasional" },
];

const initialAssignments: Assignments = {
  e1: ["wfo", "wfo", "wfo", "wfo", "wfo", null, null],
  e2: ["wfo", "wfo", "wfo", "wfo", "wfo", null, null],
  e3: ["wfh", "wfh", "wfo", "wfh", "wfo", null, null],
  e4: [null, "wfo", "wfo", "wfo", "wfo", "wfo", null],
};

export default function JadwalKerjaContent() {
  const shifts = initialShifts;
  const [assignments, setAssignments] = useState<Assignments>(initialAssignments);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ScheduleTab>("all");
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [massModalOpen, setMassModalOpen] = useState(false);

  const days = getWeekDays(weekOffset);
  const todayIndex = (new Date().getDay() + 6) % 7; // 0=Senin, 6=Minggu

  const handleAssign = (employeeId: string, dayIndex: number, shiftId: string | null) => {
    setAssignments((prev) => {
      const empDays = [...(prev[employeeId] ?? Array(DAYS.length).fill(null))];
      empDays[dayIndex] = shiftId;
      return { ...prev, [employeeId]: empDays };
    });
  };

  const handleAddEvent = (event: ScheduleEvent) => {
    setEvents((prev) => [...prev, event]);
    setEventModalOpen(false);
  };

  const handleMassApply = (shiftId: string | null, dayIndexes: number[]) => {
    setAssignments((prev) => {
      const next = { ...prev };
      for (const emp of employees) {
        const empDays = [...(prev[emp.id] ?? Array(DAYS.length).fill(null))];
        for (const i of dayIndexes) empDays[i] = shiftId;
        next[emp.id] = empDays;
      }
      return next;
    });
    setMassModalOpen(false);
  };

  const shiftMap = useMemo(() => new Map(shifts.map((s) => [s.id, s])), [shifts]);

  const classify = (emp: Employee): ScheduleTab => {
    const shiftId = assignments[emp.id]?.[todayIndex] ?? null;
    const shift = shiftId ? shiftMap.get(shiftId) : undefined;
    if (!shift) return "libur";
    return shift.name.toLowerCase().includes("wfh") ? "wfh" : "wfo";
  };

  const counts = useMemo(() => {
    const c: Record<ScheduleTab, number> = { all: employees.length, wfo: 0, wfh: 0, libur: 0 };
    for (const emp of employees) c[classify(emp)] += 1;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, assignments, shiftMap, todayIndex]);

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      const matchesTab = tab === "all" || classify(emp) === tab;
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, search, tab, assignments, shiftMap, todayIndex]);

  return (
    <div>
      <JadwalKerjaHeader
        onAddEvent={() => setEventModalOpen(true)}
        onBulkAssign={() => setMassModalOpen(true)}
      />

      <DailyAttendanceStats employees={employees} shifts={shifts} assignments={assignments} />

      {events.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-[#1E3A5F]">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900">Agenda Minggu Ini</h3>
            <span className="text-[11px] font-semibold text-[#1E3A5F] bg-blue-50 rounded-full px-2 py-0.5">
              {events.length}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {events.map((ev) => (
              <div key={ev.id} className="min-w-[220px] flex-1 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold text-[#1E3A5F]">
                    {new Date(`${ev.date}T00:00:00`).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 rounded-full px-2 py-0.5 whitespace-nowrap">
                    {ev.type}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-1.5">{ev.title}</p>
                {ev.location && (
                  <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {ev.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <WeeklyScheduleGrid
        employees={filteredEmployees}
        shifts={shifts}
        assignments={assignments}
        days={days}
        search={search}
        tab={tab}
        counts={counts}
        onSearchChange={setSearch}
        onTabChange={setTab}
        onAssign={handleAssign}
      />

      {eventModalOpen && <EventModal onClose={() => setEventModalOpen(false)} onSave={handleAddEvent} />}

      {massModalOpen && (
        <MassAssignModal
          shifts={shifts}
          days={days}
          onClose={() => setMassModalOpen(false)}
          onApply={handleMassApply}
        />
      )}
    </div>
  );
}
