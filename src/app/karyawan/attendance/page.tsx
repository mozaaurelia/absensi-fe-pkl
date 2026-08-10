"use client";

import { useState } from "react";
import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import AttendanceHeader from "@/components/karyawan/attendance/AttendanceHeader";
import AttendanceContent from "@/components/karyawan/attendance/AttendanceContent";


export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  return (
    <KaryawanLayout contentClassName="flex-1 p-8 space-y-6">
      <AttendanceHeader
        selectedDate={selectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />

      <AttendanceContent selectedDate={selectedDate} />
    </KaryawanLayout>
  );
}
