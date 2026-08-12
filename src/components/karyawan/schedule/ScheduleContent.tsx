"use client";

import AgendaSummary from "./AgendaSummary";
import ScheduleForm from "./ScheduleForm";
import AgendaList from "./AgendaList";

export default function ScheduleContent() {
  return (
    <div>
      <AgendaSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScheduleForm />
        </div>

        <div className="lg:col-span-2">
          <AgendaList />
        </div>
      </div>
    </div>
  );
}