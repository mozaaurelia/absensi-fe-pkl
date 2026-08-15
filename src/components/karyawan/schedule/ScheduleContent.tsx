"use client";

import { useCallback, useState } from "react";
import AgendaSummary from "./AgendaSummary";
import ScheduleForm from "./ScheduleForm";
import AgendaList from "./AgendaList";

export default function ScheduleContent() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div>
      <AgendaSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScheduleForm onCreated={handleCreated} />
        </div>

        <div className="lg:col-span-2">
          <AgendaList refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}