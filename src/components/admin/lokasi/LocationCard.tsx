"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { OfficeLocation } from "@/lib/services/admin";
import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";

interface Props {
  location: OfficeLocation;
  onEdit: (loc: OfficeLocation) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (loc: OfficeLocation) => void;
}

const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  kantor_pusat: { label: "locationModal.typeKantorPusat", className: "bg-blue-50 text-[#1E3A5F]" },
  cabang: { label: "locationModal.typeCabang", className: "bg-amber-50 text-amber-600" },
  wfh_hub: { label: "locationModal.typeWfhHub", className: "bg-green-50 text-green-600" },
  lapangan: { label: "locationModal.typeLapangan", className: "bg-purple-50 text-purple-600" },
};

export default function LocationCard({ location, onEdit, onDelete, onToggleStatus }: Props) {
  const { t } = useLanguage();
  const active = location.is_active !== false;
  const type = TYPE_BADGES[location.type ?? "kantor_pusat"] ?? TYPE_BADGES.kantor_pusat;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A5F] flex items-center justify-center shrink-0">
            <FiMapPin size={16} />
          </span>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{location.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {location.address ? location.address : "—"}
            </p>
          </div>
        </div>
        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${type.className}`}>
          {t(type.label)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 py-2.5">
          <p className="text-[10px] text-gray-400 font-medium">Latitude</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-0.5">
            {Number(location.latitude).toFixed(7)}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 py-2.5">
          <p className="text-[10px] text-gray-400 font-medium">Longitude</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-0.5">
            {Number(location.longitude).toFixed(7)}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 py-2.5">
          <p className="text-[10px] text-gray-400 font-medium">{t("adminCrud.radiusMeters")}</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-0.5">
            {String(location.radius_meters)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-gray-700">
        <button
          onClick={() => onToggleStatus(location)}
          className="flex items-center gap-2 group"
        >
          <span
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              active ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${
                active ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
          <span className={`text-xs font-semibold ${active ? "text-green-600" : "text-gray-400"}`}>
            {active ? t("locationModal.active") : t("locationModal.inactive")}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(location)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
            aria-label={t("adminMaster.edit")}
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(location.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            aria-label={t("adminMaster.delete")}
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
