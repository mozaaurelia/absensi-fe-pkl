"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import {
  getCalendarEvents,
  getHolidays,
  deleteCalendarEvent,
  type CalendarEvent,
} from "@/lib/services/admin";
import { ApiError } from "@/lib/api";
import EventModal, { EVENT_TYPES, eventTypeColor } from "./EventModal";

const PER_PAGE = 5;

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  return [...blanks, ...days];
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayKey(): string {
  const d = new Date();
  return dateKey(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatTime(value?: string | null): string {
  if (!value) return "";
  const m = String(value).match(/(\d{2}):(\d{2})/);
  return m ? `${m[1]}.${m[2]}` : value;
}

function AgendaItem({
  ev,
  onDelete,
}: {
  ev: CalendarEvent;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();
  const color = eventTypeColor(ev.event_type);
  const d = new Date(ev.event_date + "T00:00:00");
  const day = Number.isNaN(d.getTime()) ? "-" : d.getDate();
  const month = Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("id-ID", { month: "short" });
  const isPast = String(ev.event_date) < todayKey();

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-700 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <div
        className="w-11 shrink-0 text-center rounded-lg py-1.5"
        style={{ backgroundColor: `${color}1A` }}
      >
        <p className="text-base font-bold leading-tight" style={{ color }}>
          {day}
        </p>
        <p className="text-[10px] font-semibold uppercase leading-tight text-gray-500 dark:text-gray-400">
          {month}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
            {ev.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {ev.start_time || ev.end_time
              ? `${formatTime(ev.start_time) || "--"} - ${formatTime(ev.end_time) || "--"}`
              : t("adminKalender.allDay")}
          </p>
          <span
            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
              isPast
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                : "bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-300"
            }`}
          >
            {t(isPast ? "adminKalender.past" : "adminKalender.upcoming")}
          </span>
        </div>
        {ev.location && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{ev.location}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(ev.id)}
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-opacity"
        aria-label={t("adminMaster.delete")}
        title={t("adminMaster.delete")}
      >
        <FiTrash2 size={13} />
      </button>
    </div>
  );
}

export default function AdminKalenderContent() {
  const { t, months, daysShort } = useLanguage();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [holidayMap, setHolidayMap] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [evs, holidays] = await Promise.all([getCalendarEvents(), getHolidays()]);
        if (!active) return;
        setEvents(Array.isArray(evs) ? evs : []);
        const map: Record<string, string> = {};
        (Array.isArray(holidays) ? holidays : []).forEach((h) => {
          map[String(h.date).slice(0, 10)] = h.name;
        });
        setHolidayMap(map);
      } catch (err) {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : t("adminMaster.failed"));
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [reloadToken, t]);

  const refresh = () => setReloadToken((n) => n + 1);

  const sortedEvents = useMemo(() => {
    const today = todayKey();
    const ordered = [...events].sort((a, b) =>
      `${String(a.event_date)}T${a.start_time ?? "00:00:00"}`.localeCompare(
        `${String(b.event_date)}T${b.start_time ?? "00:00:00"}`
      )
    );
    return [
      ...ordered.filter((e) => String(e.event_date) >= today),
      ...ordered.filter((e) => String(e.event_date) < today),
    ];
  }, [events]);

  const pages = useMemo(() => {
    const out: CalendarEvent[][] = [];
    for (let i = 0; i < sortedEvents.length; i += PER_PAGE) {
      out.push(sortedEvents.slice(i, i + PER_PAGE));
    }
    return out;
  }, [sortedEvents]);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(pages.length - 1, 0)));
  }, [pages.length]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      const k = String(e.event_date).slice(0, 10);
      (map[k] = map[k] || []).push(e);
    });
    return map;
  }, [events]);

  const calendarDays = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const today = todayKey();

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  const isViewingCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteCalendarEvent(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("adminMaster.deleteFailed"));
    }
  };

  const canPrev = page > 0;
  const canNext = page < pages.length - 1;

  return (
    <>
      {error && (
        <div className="w-full mb-4 px-5 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
      <div className="w-full flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              {t("adminKalender.calendarTitle")}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {t("adminKalender.calendarSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isViewingCurrentMonth && (
              <button
                onClick={goToday}
                className="px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                {t("adminKalender.today")}
              </button>
            )}
            <button
              onClick={goPrevMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              aria-label={t("adminKalender.prev")}
            >
              <FiChevronLeft size={18} />
            </button>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 min-w-0 text-center">
              {months[viewMonth]} {viewYear}
            </p>
            <button
              onClick={goNextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              aria-label={t("adminKalender.next")}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-[11px] uppercase text-gray-500 dark:text-gray-400 mb-2">
          {daysShort.map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm text-gray-700 dark:text-gray-200">
          {calendarDays.map((day, index) => {
            const key = day ? dateKey(viewYear, viewMonth, day) : "";
            const isToday = key === today;
            const isSelected = key !== "" && key === selectedDate;
            const dayEvents = day ? eventsByDate[key] ?? [] : [];
            const holidayName = day ? holidayMap[key] : undefined;
            const isHoliday = !!holidayName;
            const isWeekend = index % 7 === 0 || index % 7 === 6;
            const col = index % 7;
            const visibleEvents = dayEvents.slice(0, 2);
            const extraCount = dayEvents.length - visibleEvents.length;

            return (
              <button
                key={`${day ?? "blank"}-${index}`}
                disabled={!day}
                onClick={() => day && setSelectedDate(key)}
                title={
                  day
                    ? [
                        holidayName ? `${t("adminKalender.holiday")}: ${holidayName}` : null,
                        ...dayEvents.map((e) => e.title),
                      ]
                        .filter(Boolean)
                        .join("\n")
                    : undefined
                }
                className={`relative min-h-[52px] rounded-lg flex flex-col items-stretch px-1 pt-1.5 pb-1 transition-colors ${
                  !day
                    ? "bg-transparent cursor-default"
                    : isSelected
                      ? "bg-blue-50 dark:bg-blue-500/15 ring-2 ring-[#1E3A5F] dark:ring-blue-300"
                      : isToday
                        ? "bg-[#1E3A5F] text-white shadow-sm hover:bg-[#16304f]"
                        : "bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                }`}
              >
                {day && (
                  <>
                    <span
                      className={`font-semibold leading-none text-center ${
                        isToday
                          ? "text-white"
                          : isHoliday || (isWeekend && col === 0)
                            ? "text-red-500 dark:text-red-400"
                            : ""
                      }`}
                    >
                      {day}
                    </span>
                    <span className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                      {visibleEvents.map((e) => {
                        const c = eventTypeColor(e.event_type);
                        return (
                          <span
                            key={e.id}
                            className={`text-[9px] leading-snug font-semibold truncate rounded px-1 py-px ${
                              isToday
                                ? "bg-white/20 text-white"
                                : ""
                            }`}
                            style={
                              isToday
                                ? undefined
                                : { backgroundColor: `${c}1A`, color: c }
                            }
                          >
                            {e.title}
                          </span>
                        );
                      })}
                      {(extraCount > 0 || isHoliday) && (
                        <span
                          className={`text-[9px] font-bold leading-none truncate px-1 ${
                            isToday ? "text-white/80" : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {extraCount > 0 && `+${extraCount}`}
                          {extraCount > 0 && isHoliday ? " · " : ""}
                          {isHoliday && holidayName}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
          {EVENT_TYPES.map((et) => (
            <span key={et.value} className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: et.color }} />
              {t(et.labelKey)}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {t("adminKalender.holiday")}
          </span>
        </div>
      </div>

      <div className="relative w-full lg:w-[340px] shrink-0">
        <button
          onClick={() => canPrev && setPage((p) => p - 1)}
          disabled={!canPrev}
          className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-200 hover:text-[#1E3A5F] hover:border-[#1E3A5F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={t("adminKalender.prev")}
        >
          <FiChevronLeft size={18} />
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
              {t("adminKalender.scheduledAgenda")}
            </h3>
            <span className="text-[11px] font-semibold text-[#1E3A5F] dark:text-blue-300 bg-blue-100 dark:bg-[#1E3A5F]/30 px-2.5 py-1 rounded-full">
              {sortedEvents.length}
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-400">{t("common.loading")}</div>
          ) : pages.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {t("adminKalender.empty")}
              </p>
              <p className="text-xs text-gray-400 mt-1">{t("adminKalender.emptyHint")}</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${page * 100}%)` }}
              >
                {pages.map((group, gi) => (
                  <div key={gi} className="w-full shrink-0 space-y-3">
                    {group.map((ev) => (
                      <AgendaItem key={ev.id} ev={ev} onDelete={handleDelete} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

          <button
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-200 hover:text-[#1E3A5F] hover:border-[#1E3A5F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t("adminKalender.next")}
          >
            <FiChevronRight size={18} />
          </button>
        </div>

      {selectedDate && (
        <EventModal
          selectedDate={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSaved={refresh}
        />
      )}
      </div>
    </>
  );
}
