"use client";

import { useCallback, useEffect, useState } from "react";
import { FiCalendar, FiList } from "react-icons/fi";
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

interface Props {
  refreshKey?: number;
}

export default function AgendaList({ refreshKey = 0 }: Props) {
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
  }, [load, refreshKey]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <FiList size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900">{t("agendaList.title")}</h3>
            <p className="text-xs text-gray-400">{t("agendaList.desc")}</p>
          </div>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
          {agendas.length} {t("agendaList.dataLabel")}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {agendas.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center">
              <FiCalendar size={22} />
            </div>
            <p className="text-sm text-gray-400">{t("agendaList.empty")}</p>
          </div>
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
