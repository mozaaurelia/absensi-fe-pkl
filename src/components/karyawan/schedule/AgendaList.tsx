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
    <div className="bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a] rounded-2xl border border-white/10 p-6 shadow-lg">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-white">{t("agendaList.title")}</h3>
        <span className="bg-white/15 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {data.length} {t("agendaList.dataLabel")}
        </span>
      </div>
      <p className="text-xs text-blue-200/80 mb-5">
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
