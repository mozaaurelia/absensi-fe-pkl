"use client";

import { useState } from "react";
import type { ShiftTemplate, Employee, Assignments } from "./types";
import { DAYS } from "./types";
import JadwalKerjaHeader from "./JadwalKerjaHeader";
import ScheduleStatsCards from "./ScheduleStatsCards";
import DailyAttendanceStats from "./DailyAttendanceStats";
import WeeklyScheduleGrid from "./WeeklyScheduleGrid";
import ShiftFormModal from "./ShiftFormModal";

const initialShifts: ShiftTemplate[] = [
  { id: "s1", name: "Shift Pagi", startTime: "08:00", endTime: "17:00", color: "blue" },
  { id: "s2", name: "Shift Siang", startTime: "13:00", endTime: "21:00", color: "indigo" },
  { id: "s3", name: "Shift Malam", startTime: "21:00", endTime: "06:00", color: "purple" },
  { id: "s4", name: "WFH", startTime: "09:00", endTime: "17:00", color: "teal" },
];

const employees: Employee[] = [
  { id: "e1", name: "Andi Pratama", department: "Operasional" },
  { id: "e2", name: "Sinta Rahma", department: "Keuangan" },
  { id: "e3", name: "Budi Santoso", department: "IT" },
  { id: "e4", name: "Maya Lestari", department: "Operasional" },
];

const initialAssignments: Assignments = {
  e1: ["s1", "s1", "s1", "s1", "s1", null, null],
  e2: ["s1", "s1", "s1", "s1", "s1", null, null],
  e3: ["s4", "s4", "s1", "s4", "s1", null, null],
  e4: [null, "s2", "s2", "s2", "s2", "s2", null],
};

function getWeekLabel(offset: number) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  return `${fmt(start)} - ${fmt(end)}`;
}

export default function JadwalKerjaContent() {
  const [shifts, setShifts] = useState<ShiftTemplate[]>(initialShifts);
  const [assignments, setAssignments] = useState<Assignments>(initialAssignments);
  const [weekOffset, setWeekOffset] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftTemplate | null>(null);

  const handleAssign = (employeeId: string, dayIndex: number, shiftId: string | null) => {
    setAssignments((prev) => {
      const days = [...(prev[employeeId] ?? Array(DAYS.length).fill(null))];
      days[dayIndex] = shiftId;
      return { ...prev, [employeeId]: days };
    });
  };

  const handleAddShift = () => {
    setEditingShift(null);
    setModalOpen(true);
  };

  const handleSaveShift = (shift: ShiftTemplate) => {
    setShifts((prev) => {
      const exists = prev.some((s) => s.id === shift.id);
      return exists ? prev.map((s) => (s.id === shift.id ? shift : s)) : [...prev, shift];
    });
    setModalOpen(false);
  };

  const handleCopyPreviousWeek = () => {
    if (!confirm("Salin jadwal minggu ini ke minggu depan?")) return;
    alert("Jadwal berhasil disalin ke minggu berikutnya.");
    // TODO: kirim assignments ke API buat disalin ke minggu depan
  };

  return (
    <div>
      <JadwalKerjaHeader onAddShift={handleAddShift} />
      <ScheduleStatsCards shifts={shifts} employees={employees} assignments={assignments} />
      <DailyAttendanceStats employees={employees} shifts={shifts} assignments={assignments} />

      <WeeklyScheduleGrid
        employees={employees}
        shifts={shifts}
        assignments={assignments}
        weekLabel={getWeekLabel(weekOffset)}
        onPrevWeek={() => setWeekOffset((w) => w - 1)}
        onNextWeek={() => setWeekOffset((w) => w + 1)}
        onCopyWeek={handleCopyPreviousWeek}
        onAssign={handleAssign}
      />

      {modalOpen && (
        <ShiftFormModal initialData={editingShift} onClose={() => setModalOpen(false)} onSave={handleSaveShift} />
      )}
    </div>
  );
}
