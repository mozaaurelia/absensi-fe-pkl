"use client";

import { useState } from "react";
import Sidebar from "@/components/karyawan/dashboard/Sidebar/Sidebar";
import AttendanceHeader from "@/components/karyawan/attendance/AttendanceHeader";


export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8 space-y-6">
        <AttendanceHeader
          selectedDate={selectedDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
        />

      </main>
    </div>
  );
}
