"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getStaticHolidayMap, getHolidayName } from "@/lib/holidays";

interface Props {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const WEEKDAY_LABELS = ["SN", "SL", "RA", "KA", "JU", "SA", "MI"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function HolidayDatePicker({
  value,
  onChange,
  label,
  required,
  placeholder = "Pilih tanggal",
  className = "",
}: Props) {
  const { months } = useLanguage();
  const today = new Date();
  const holidayMap = useMemo(() => getStaticHolidayMap(today.getFullYear()), [today]);
  const todayKey = toKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const parsed = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() + 1 : today.getMonth() + 1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth() + 1);
    }
  }, [value]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  function prevMonth() {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth() + 1);
    onChange(toKey(today.getFullYear(), today.getMonth() + 1, today.getDate()));
  }

  function selectDate(day: number) {
    const key = toKey(viewYear, viewMonth, day);
    if (holidayMap[key]) return;
    if (key < todayKey) return;
    onChange(key);
    setDropdownOpen(false);
  }

  const displayText = value || placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setDropdownOpen((o) => !o)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-left outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors flex items-center justify-between gap-2"
      >
        <span className={value ? "text-gray-700" : "text-gray-400"}>{displayText}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400 shrink-0">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-2xl border border-gray-200 shadow-lg p-4 w-[300px]">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1E3A5F]">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1E3A5F] uppercase">
                {months[viewMonth - 1]} {viewYear}
              </span>
              <button
                type="button"
                onClick={goToday}
                className="text-[10px] font-bold bg-blue-100 text-[#1E3A5F] px-2 py-0.5 rounded-full hover:bg-blue-200 transition-colors"
              >
                Hari Ini
              </button>
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1E3A5F]">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((day) => (
              <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;

              const key = toKey(viewYear, viewMonth, day);
              const isSelected = key === value;
              const isToday = key === todayKey;
              const isPast = key < todayKey;
              const holiday = holidayMap[key];
              const isHoliday = !!holiday;
              const isDisabled = isHoliday || isPast;

              return (
                <div key={key} className="relative flex justify-center">
                  <button
                    type="button"
                    onClick={() => selectDate(day)}
                    onMouseEnter={() => isHoliday && setHoveredDate(key)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={isDisabled}
                    className={`relative w-9 h-9 flex items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      isDisabled
                        ? "cursor-not-allowed text-red-400"
                        : "cursor-pointer hover:bg-blue-100"
                    } ${
                      isSelected && !isHoliday
                        ? "bg-[#1E3A5F] text-white"
                        : isToday && !isSelected
                          ? "bg-blue-50 text-[#1E3A5F] font-bold"
                          : ""
                    }`}
                  >
                    {day}
                    {isHoliday && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </button>

                  {isHoliday && hoveredDate === key && (
                    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white text-gray-900 border border-gray-200 shadow-md rounded-lg text-[11px] font-semibold whitespace-nowrap pointer-events-none">
                      {holiday.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45 -mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="font-semibold">Hari Libur</span>
          </div>
        </div>
      )}
    </div>
  );
}
