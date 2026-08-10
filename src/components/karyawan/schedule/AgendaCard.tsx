"use client";

import { FiCalendar, FiClock } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const statusStyles = {
  selesai: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  berjalan: "bg-blue-100 text-[#1E3A5F] dark:bg-blue-500/15 dark:text-blue-300",
  upcoming: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
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
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{judul}</p>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
            statusStyles[statusKey as keyof typeof statusStyles] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {t(`agendaList.${statusKey}`)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <FiCalendar size={13} className="text-[#1E3A5F] dark:text-blue-300" />
          {tanggal}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiClock size={13} className="text-[#1E3A5F] dark:text-blue-300" />
          {jam}
        </span>
        <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
          {kategori}
        </span>
      </div>
    </div>
  );
}
