"use client";

import { useCallback, useEffect, useState } from "react";
import { FiAlertTriangle, FiCalendar, FiSend, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import {
  createPersonalAgenda,
  deletePersonalAgenda,
  getUpcomingAgendas,
  type PersonalAgenda,
} from "@/lib/services/agenda";
import { getHolidays } from "@/lib/services/admin";
import { getStaticHolidayMap } from "@/lib/holidays";
import HolidayDatePicker from "@/components/common/HolidayDatePicker";

function formatDateLabel(iso: string, locale: string) {
  const ts = new Date(iso + "T00:00:00");
  const now = new Date();
  const sameDay = ts.toDateString() === now.toDateString();
  return ts.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function Agenda() {
  const { t, locale } = useLanguage();
  const [agendas, setAgendas] = useState<PersonalAgenda[]>([]);
  const [agendaDate, setAgendaDate] = useState("");
  const [agendaTitle, setAgendaTitle] = useState("");
  const [agendaTime, setAgendaTime] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [holidayMap, setHolidayMap] = useState<Record<string, string>>({});

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

  const holidayName = agendaDate ? holidayMap[agendaDate] ?? null : null;

  const load = useCallback(async () => {
    try {
      const rows = await getUpcomingAgendas();
      setAgendas(Array.isArray(rows) ? rows : []);
    } catch {
      setAgendas([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!agendaDate || !agendaTitle.trim()) {
      setErrorMsg(t("agenda.addRequired"));
      return;
    }
    if (holidayMap[agendaDate]) {
      setErrorMsg(t("scheduleForm.holidayBlocked"));
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await createPersonalAgenda({
        agenda_date: agendaDate,
        title: agendaTitle.trim(),
        description: undefined,
        start_time: agendaTime || undefined,
        end_time: undefined,
      });
      setAgendaDate("");
      setAgendaTitle("");
      setAgendaTime("");
      await load();
    } catch (err) {
      setErrorMsg(
        err instanceof ApiError ? err.message : t("agenda.addFailed")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deletePersonalAgenda(id);
      await load();
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <FiCalendar size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("agenda.title")}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("agenda.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="w-full sm:w-40">
          <HolidayDatePicker
            value={agendaDate}
            onChange={setAgendaDate}
          />
          {holidayName && (
            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              <FiAlertTriangle size={10} className="shrink-0" />
              {t("scheduleForm.holidayWarning", { name: holidayName })}
            </p>
          )}
        </div>
        <input
          type="time"
          value={agendaTime}
          onChange={(e) => setAgendaTime(e.target.value)}
          className="w-full sm:w-32 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors"
        />
        <input
          type="text"
          value={agendaTitle}
          onChange={(e) => setAgendaTitle(e.target.value)}
          placeholder={t("agenda.titlePlaceholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={submitting}
          className="bg-[#1E3A5F] text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <FiSend size={14} />
          {submitting ? t("agenda.adding") : t("agenda.add")}
        </button>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 mb-4">
          {errorMsg}
        </p>
      )}

      <div className="space-y-2">
        {agendas.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400">{t("agenda.empty")}</p>
          </div>
        )}
        {agendas.map((agenda) => (
          <div
            key={agenda.id}
            className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-4 py-3"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-bold leading-none">
                {formatDateLabel(agenda.agenda_date, locale).split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                {agenda.title}
              </p>
              <p className="text-[11px] text-gray-400">
                {formatDateLabel(agenda.agenda_date, locale)}
                {agenda.start_time ? ` · ${agenda.start_time.slice(0, 5)}` : ""}
              </p>
            </div>
            <button
              onClick={() => handleRemove(agenda.id)}
              aria-label={t("agenda.remove")}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}