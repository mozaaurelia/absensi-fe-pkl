"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FiAlertTriangle, FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiPlusCircle, FiSend, FiTag, FiType } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import { createPersonalAgenda } from "@/lib/services/agenda";
import { getHolidays } from "@/lib/services/admin";
import DatePicker from "../common/DatePicker";
import { getStaticHolidayMap } from "@/lib/holidays";

interface Props {
  onCreated?: () => void;
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return [...blanks, ...days];
}

function toDateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function isBeforeToday(y: number, m: number, d: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(y, m, d);
  return target < today;
}

export default function ScheduleForm({ onCreated }: Props) {
  const { t, months, daysShort } = useLanguage();
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [kategori, setKategori] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [holidayMap, setHolidayMap] = useState<Record<string, string>>({});
  const [calOpen, setCalOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const staticMap = getStaticHolidayMap(new Date().getFullYear());
    const merged: Record<string, string> = {};
    Object.entries(staticMap).forEach(([k, v]) => { merged[k] = v.name; });
    getHolidays()
      .then((list) => {
        list.forEach((h) => { merged[h.date] = h.name; });
        setHolidayMap(merged);
      })
      .catch(() => {
        setHolidayMap(merged);
      });
  }, []);

  useEffect(() => {
    if (!calOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [calOpen]);

  const calDays = useMemo(() => getCalendarDays(calYear, calMonth), [calYear, calMonth]);

  const selectedHolidayName = tanggal ? holidayMap[tanggal] ?? null : null;

  const handleDateSelect = useCallback((y: number, m: number, d: number) => {
    const key = toDateKey(y, m, d);
    if (holidayMap[key]) return;
    if (isBeforeToday(y, m, d)) return;
    setTanggal(key);
    setCalOpen(false);
  }, [holidayMap]);

  const goToPrevMonth = useCallback(() => {
    setCalMonth((prev) => {
      if (prev === 0) { setCalYear((y) => y - 1); return 11; }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCalMonth((prev) => {
      if (prev === 11) { setCalYear((y) => y + 1); return 0; }
      return prev + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
  }, [today]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tanggal || !judul.trim()) {
      setInfo(t("scheduleForm.required"));
      setSuccess(false);
      return;
    }

    if (holidayMap[tanggal]) {
      setInfo(t("scheduleForm.holidayBlocked"));
      setSuccess(false);
      return;
    }

    setSubmitting(true);
    setInfo(null);
    try {
      await createPersonalAgenda({
        agenda_date: tanggal,
        title: judul.trim(),
        description: kategori || undefined,
        start_time: jam || undefined,
        end_time: undefined,
      });
      setSuccess(true);
      setInfo(t("scheduleForm.success"));
      setJudul("");
      setTanggal("");
      setJam("");
      setKategori("");
      onCreated?.();
    } catch (err) {
      setSuccess(false);
      setInfo(err instanceof ApiError ? err.message : t("scheduleForm.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 h-full shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FiPlusCircle size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900">{t("scheduleForm.title")}</h3>
            <p className="text-xs text-gray-400">{t("scheduleForm.desc")}</p>
          </div>
        </div>
        <span className="bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shrink-0">
          {t("scheduleHeader.badge")}
        </span>
      </div>

      {info && (
        <p
          className={`text-xs rounded-lg px-4 py-3 mb-4 ${
            success
              ? "text-green-700 bg-green-50"
              : "text-amber-700 bg-amber-50"
          }`}
        >
          {info}
        </p>
      )}

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          <FiType size={14} className="text-rose-500" />
          {t("scheduleForm.titleLabel")}
        </label>
        <input
          type="text"
          placeholder={t("scheduleForm.titlePlaceholder")}
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="relative" ref={calRef}>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
            <FiCalendar size={14} className="text-rose-500" />
            {t("scheduleForm.dateLabel")}
          </label>
          <DatePicker
            value={tanggal}
            onChange={setTanggal}
            placeholder={t("scheduleForm.dateLabel")}
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
            <FiClock size={14} className="text-rose-500" />
            {t("scheduleForm.timeLabel")}
          </label>
          <input
            type="time"
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          <FiTag size={14} className="text-rose-500" />
          {t("scheduleForm.categoryLabel")}
        </label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
        >
          <option value="">{t("scheduleForm.categoryPlaceholder")}</option>
          <option value="rapat">{t("scheduleForm.meeting")}</option>
          <option value="tugas">{t("scheduleForm.task")}</option>
          <option value="personal">{t("scheduleForm.personal")}</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <FiSend size={14} />
        {submitting ? t("scheduleForm.saving") : t("scheduleForm.submit")}
      </button>
    </form>
  );
}
