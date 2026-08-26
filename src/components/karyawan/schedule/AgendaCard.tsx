"use client";

import { FiCalendar, FiClock } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const statusStyles = {
  selesai: "bg-green-100 text-green-700",
  berjalan: "bg-blue-100 text-[#1E3A5F]",
  upcoming: "bg-amber-100 text-amber-700",
};

interface Props {
  judul: string;
  tanggal: string;
  jam: string;
  kategori: string;
  statusKey: string;
}

export default function AgendaCard({ judul, tanggal, jam, kategori, statusKey }: Props) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-bold text-gray-900">{judul}</p>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
            statusStyles[statusKey as keyof typeof statusStyles] || "bg-gray-100 text-gray-600"
          }`}
        >
          {t(`agendaList.${statusKey}`)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <FiCalendar size={13} className="text-[#1E3A5F]" />
          {tanggal}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiClock size={13} className="text-[#1E3A5F]" />
          {jam}
        </span>
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {kategori}
        </span>
      </div>
    </div>
  );
}
