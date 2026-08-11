"use client";

import { useCallback, useEffect, useState } from "react";
import AgendaCard from "./AgendaCard";
import { useLanguage } from "@/context/LanguageContext";
import { getUpcomingAgendas, type PersonalAgenda } from "@/lib/services/agenda";

function statusKeyOf(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00").toDateString();
  const today = new Date().toDateString();
  if (date === today) return "berjalan";
  return new Date(dateStr + "T00:00:00").getTime() < new Date().setHours(0, 0, 0, 0)
    ? "selesai"
    : "upcoming";
}

export default function AgendaList() {
  const { t, locale } = useLanguage();
  const [agendas, setAgendas] = useState<PersonalAgenda[]>([]);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-full shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("agendaList.title")}</h3>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
          {agendas.length} {t("agendaList.dataLabel")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        {t("agendaList.desc")}
      </p>

      <div className="flex flex-col gap-3">
        {agendas.length === 0 && (
          <p className="text-sm text-blue-100/70 text-center py-6">
            {t("agendaList.empty")}
          </p>
        )}
        {agendas.map((agenda) => {
          const ts = new Date(agenda.agenda_date + "T00:00:00");
          const tanggal = ts.toLocaleDateString(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return (
            <AgendaCard
              key={agenda.id}
              judul={agenda.title}
              tanggal={tanggal}
              jam={agenda.start_time ? agenda.start_time.slice(0, 5) : "--:--"}
              kategori={agenda.description || t("agendaList.unclassified")}
              statusKey={statusKeyOf(agenda.agenda_date)}
            />
          );
        })}
      </div>
    </div>
  );
}
