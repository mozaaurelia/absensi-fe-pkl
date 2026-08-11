"use client";

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { getMyAttendance } from "@/lib/services/attendance";
import VerificationStepper from "@/components/karyawan/attendance/VerificationStepper";

function isToday(value?: string | null): boolean {
  if (!value) return false;
  const d = new Date(value);
  return d.toDateString() === new Date().toDateString();
}

interface Props {
  dark?: boolean;
  className?: string;
}

export default function AttendanceShortcut({
  dark = true,
  className = "",
}: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"in" | "out">("in");
  const [needClockOut, setNeedClockOut] = useState(false);

  const refresh = () => {
    getMyAttendance()
      .then((rows) => {
        const todayRows = (rows || []).filter((r) => isToday(r.clock_in_time));
        const openRow = todayRows.find((r) => !r.clock_out_time);
        setNeedClockOut(!!openRow);
      })
      .catch(() => {});
  };

  useEffect(refresh, []);

  const handleClick = () => {
    setMode(needClockOut ? "out" : "in");
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={
          needClockOut ? t("attendanceShortcut.checkOut") : t("attendanceShortcut.checkIn")
        }
        title={
          needClockOut ? t("attendanceShortcut.checkOut") : t("attendanceShortcut.checkIn")
        }
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${className} ${
          dark
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-[#1E3A5F] text-white hover:bg-[#16304f]"
        }`}
      >
        <FiClock size={16} />
        {needClockOut ? t("attendanceShortcut.checkOut") : t("attendanceShortcut.checkIn")}
      </button>

      {open && (
        <VerificationStepper
          mode={mode}
          onClose={() => {
            setOpen(false);
            refresh();
          }}
        />
      )}
    </>
  );
}