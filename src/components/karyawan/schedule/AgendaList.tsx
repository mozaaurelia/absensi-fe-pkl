"use client";

import AgendaCard from "./AgendaCard";
import { useLanguage } from "@/context/LanguageContext";

export default function AgendaList() {
  const { t } = useLanguage();

  const data = [
    { judul: "Rapat Evaluasi Proyek Asla", tanggal: "Senin, 3 Agustus 2026", jam: "09:00", kategori: t("scheduleForm.meeting"), statusKey: "berjalan" },
    { judul: "Deadline Laporan Bulanan", tanggal: "Rabu, 5 Agustus 2026", jam: "12:00", kategori: t("scheduleForm.task"), statusKey: "upcoming" },
    { judul: "Coaching Session", tanggal: "Jumat, 7 Agustus 2026", jam: "15:00", kategori: t("scheduleForm.personal"), statusKey: "upcoming" },
    { judul: "Review Dokumen HRD", tanggal: "Senin, 27 Juli 2026", jam: "10:00", kategori: t("scheduleForm.task"), statusKey: "selesai" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("agendaList.title")}</h3>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
          {data.length} {t("agendaList.dataLabel")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        {t("agendaList.desc")}
      </p>

      <div className="flex flex-col gap-3">
        {data.map((item, i) => (
          <AgendaCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
