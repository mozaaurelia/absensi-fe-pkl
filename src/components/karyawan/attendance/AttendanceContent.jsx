"use client";

import AttendanceAction from "./Action/AttendanceAction";
import AttendanceHistory from "./History/AttendanceHistory";
import Todolist from "./Todolist/Todolist";

export default function AttendanceContent({ selectedDate }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceAction />
        <Todolist />
      </div>
      <AttendanceHistory selectedDate={selectedDate} />
    </div>
  );
}
