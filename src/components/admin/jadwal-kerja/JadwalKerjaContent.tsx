"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ShiftTemplate, Employee, Assignments, ScheduleTab } from "./types";
import { getWeekDays, DAYS } from "./types";
import JadwalKerjaHeader from "./JadwalKerjaHeader";
import DailyAttendanceStats from "./DailyAttendanceStats";
import WeeklyScheduleGrid from "./WeeklyScheduleGrid";
import EventModal, { type ScheduleEvent } from "./EventModal";
import MassAssignModal from "./MassAssignModal";
import {
  getEmployees,
  getShifts,
  getOfficeLocations,
  getWorkingDayPatterns,
  getDepartments,
  assignEmployeeSchedule,
  endEmployeeSchedule,
  type OfficeLocation,
  type WorkingDayPattern,
} from "@/lib/services/admin";
import { getMySchedule } from "@/lib/services/schedule";

const SHIFT_COLORS = ["blue", "indigo", "teal", "purple"] as const;
type ShiftColor = (typeof SHIFT_COLORS)[number];

export default function JadwalKerjaContent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<ShiftTemplate[]>([]);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [patterns, setPatterns] = useState<WorkingDayPattern[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [schedByEmp, setSchedByEmp] = useState<
    Record<string, { id: string; patternId: string | null; locationId: string | null }>
  >({});

  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ScheduleTab>("all");
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [massModalOpen, setMassModalOpen] = useState(false);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const days = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [emps, sh, pats, locs, depts] = await Promise.all([
        getEmployees(),
        getShifts(),
        getWorkingDayPatterns(),
        getOfficeLocations(),
        getDepartments(),
      ]);
      const deptMap = new Map((Array.isArray(depts) ? depts : []).map((d) => [d.id, d.name]));
      const eList: Employee[] = (Array.isArray(emps) ? emps : [])
        .filter((e) => e.status === "active")
        .map((e) => ({
          id: e.id,
          name: e.name,
          department: e.department_id ? deptMap.get(e.department_id) ?? "-" : "-",
        }));
      const sList: ShiftTemplate[] = (Array.isArray(sh) ? sh : []).map((s, i) => ({
        id: s.id,
        name: s.name,
        startTime: s.start_time,
        endTime: s.end_time,
        color: SHIFT_COLORS[i % SHIFT_COLORS.length] as ShiftColor,
      }));
      const patList = Array.isArray(pats) ? pats : [];
      const locList = Array.isArray(locs) ? locs : [];

      setEmployees(eList);
      setShifts(sList);
      setPatterns(patList);
      setLocations(locList);

      const newAssignments: Assignments = {};
      const newSched: Record<string, { id: string; patternId: string | null; locationId: string | null }> = {};
      for (const e of eList) {
        let sched = null;
        try {
          sched = await getMySchedule(e.id);
        } catch {
          sched = null;
        }
        const arr: (string | null)[] = Array(DAYS.length).fill(null);
        if (sched) {
          newSched[e.id] = {
            id: sched.id,
            patternId: sched.working_day_pattern_id ?? null,
            locationId: sched.location_id,
          };
          const activeDays = sched.working_day_pattern_id
            ? patList.find((p) => p.id === sched.working_day_pattern_id)?.active_days
            : undefined;
          const daysActive = activeDays ?? [1, 2, 3, 4, 5, 6, 7];
          days.forEach((d, i) => {
            const iso = (new Date(`${d.fullDate}T00:00:00`).getDay() + 6) % 7 + 1;
            if (daysActive.includes(iso)) arr[i] = sched!.shift_id;
          });
        }
        newAssignments[e.id] = arr;
      }
      setAssignments(newAssignments);
      setSchedByEmp(newSched);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleAssign = async (employeeId: string, dayIndex: number, shiftId: string | null) => {
    if (saving) return;
    setSaving(true);
    setLoadError(null);
    try {
      const date = days[dayIndex].fullDate;
      if (shiftId) {
        const cur = schedByEmp[employeeId];
        const patternId = cur?.patternId ?? patterns[0]?.id ?? null;
        const locationId = cur?.locationId ?? locations[0]?.id;
        if (!locationId) {
          setLoadError("Belum ada lokasi kantor, buat dulu di menu Lokasi.");
          return;
        }
        await assignEmployeeSchedule({
          employee_id: employeeId,
          shift_id: shiftId,
          working_day_pattern_id: patternId,
          location_id: locationId,
          start_date: date,
        });
      } else {
        const cur = schedByEmp[employeeId];
        if (cur) {
          const prev = new Date(`${date}T00:00:00`);
          prev.setDate(prev.getDate() - 1);
          const y = prev.getFullYear();
          const m = String(prev.getMonth() + 1).padStart(2, "0");
          const d = String(prev.getDate()).padStart(2, "0");
          await endEmployeeSchedule(cur.id, `${y}-${m}-${d}`);
        }
      }
      await loadAll();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal menyimpan jadwal");
    } finally {
      setSaving(false);
    }
  };

  const handleMassApply = async (shiftId: string | null, dayIndexes: number[]) => {
    if (saving || dayIndexes.length === 0) return;
    setSaving(true);
    setLoadError(null);
    try {
      const startIdx = Math.min(...dayIndexes);
      const startDate = days[startIdx].fullDate;
      const patternId = patterns[0]?.id ?? null;
      const locationId = locations[0]?.id;
      if (shiftId) {
        if (!locationId) {
          setLoadError("Belum ada lokasi kantor, buat dulu di menu Lokasi.");
          return;
        }
        for (const e of employees) {
          await assignEmployeeSchedule({
            employee_id: e.id,
            shift_id: shiftId,
            working_day_pattern_id: patternId,
            location_id: locationId,
            start_date: startDate,
          });
        }
      } else {
        for (const e of employees) {
          const cur = schedByEmp[e.id];
          if (cur) await endEmployeeSchedule(cur.id, startDate);
        }
      }
      await loadAll();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal menyimpan jadwal");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvent = (event: ScheduleEvent) => {
    setEvents((prev) => [...prev, event]);
    setEventModalOpen(false);
  };

  const todayIndex = (new Date().getDay() + 6) % 7;

  const classify = (emp: Employee): ScheduleTab => {
    const shiftId = assignments[emp.id]?.[todayIndex] ?? null;
    const shift = shiftId ? shifts.find((s) => s.id === shiftId) : undefined;
    if (!shift) return "libur";
    return shift.name.toLowerCase().includes("wfh") ? "wfh" : "wfo";
  };

  const counts = useMemo(() => {
    const c: Record<ScheduleTab, number> = { all: employees.length, wfo: 0, wfh: 0, libur: 0 };
    for (const emp of employees) c[classify(emp)] += 1;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, assignments, shifts]);

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      const matchesTab = tab === "all" || classify(emp) === tab;
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, search, tab, assignments, shifts]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1E3A5F]" />
        <p className="text-sm text-gray-400 mt-3">Memuat jadwal kerja...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-10 text-center text-sm text-red-500">
        {loadError}
      </div>
    );
  }

  return (
    <div>
      <JadwalKerjaHeader
        onAddEvent={() => setEventModalOpen(true)}
        onBulkAssign={() => setMassModalOpen(true)}
      />

      <DailyAttendanceStats employees={employees} shifts={shifts} assignments={assignments} />

      {saving && (
        <div className="mb-4 px-4 py-3 bg-blue-50 text-[#1E3A5F] text-xs font-semibold rounded-lg">
          Menyimpan jadwal...
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