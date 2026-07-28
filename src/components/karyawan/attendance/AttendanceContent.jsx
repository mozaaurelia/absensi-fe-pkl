"use client";

import { useEffect, useState } from "react";

export default function AttendanceContent() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time
    ? time.toLocaleTimeString("id-ID", { hour12: false })
    : "--:--:--";

  return (
    <div className="text-center py-8">
      <p className="text-xs text-gray-400 mb-2">Waktu Server</p>
      <p className="text-5xl font-bold text-gray-900 tracking-wide tabular-nums">
        {formatted}
      </p>
      <p className="text-xs text-gray-400 mt-3">
        Shift Kerja: 09:00 - 18:00 · Kantor Pusat Jakarta
      </p>
    </div>
  );
}