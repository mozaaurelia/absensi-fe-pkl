"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import {
  createOfficeLocation,
  updateOfficeLocation,
  type OfficeLocation,
} from "@/lib/services/admin";
import { ApiError } from "@/lib/api";
import { FiX } from "react-icons/fi";

const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false });

export type LocationType = "kantor_pusat" | "cabang" | "wfh_hub" | "lapangan";

const RADIUS_PRESETS = [10, 30, 500];
const DEFAULT_LAT = -6.2088;
const DEFAULT_LNG = 106.8456;

const TYPE_KEYS: { value: LocationType; labelKey: string }[] = [
  { value: "kantor_pusat", labelKey: "locationModal.typeKantorPusat" },
  { value: "cabang", labelKey: "locationModal.typeCabang" },
  { value: "wfh_hub", labelKey: "locationModal.typeWfhHub" },
  { value: "lapangan", labelKey: "locationModal.typeLapangan" },
];

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors";

interface Props {
  mode: "create" | "edit";
  initial?: OfficeLocation | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

export default function LocationModal({ mode, initial, onClose, onSaved }: Props) {
  const { t } = useLanguage();

  const [name, setName] = useState(initial ? String(initial.name ?? "") : "");
  const [address, setAddress] = useState(initial ? String(initial.address ?? "") : "");
  const [type, setType] = useState<LocationType>(
    (initial?.type as LocationType) || "kantor_pusat"
  );
  const [radius, setRadius] = useState<number>(
    initial?.radius_meters != null ? Number(initial.radius_meters) : 30
  );
  const [lat, setLat] = useState<number>(
    initial?.latitude != null ? Number(initial.latitude) : DEFAULT_LAT
  );
  const [lng, setLng] = useState<number>(
    initial?.longitude != null ? Number(initial.longitude) : DEFAULT_LNG
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [placeLoading, setPlaceLoading] = useState(true);
  const reverseDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reverseDebounce.current) clearTimeout(reverseDebounce.current);
    setPlaceLoading(true);
    reverseDebounce.current = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&lat=${lat}&lon=${lng}`
      )
        .then((r) => r.json())
        .then((data: { address?: Record<string, string> }) => {
          const a = data.address ?? {};
          const street =
            a.road || a.neighbourhood || a.pedestrian || a.suburb || a.quarter || "";
          const city =
            a.city || a.town || a.village || a.municipality || a.county || a.state || "";
          setPlaceName([street, city].filter(Boolean).join(", "));
        })
        .catch(() => setPlaceName(""))
        .finally(() => setPlaceLoading(false));
    }, 400);
    return () => {
      if (reverseDebounce.current) clearTimeout(reverseDebounce.current);
    };
  }, [lat, lng]);

  const submit = async () => {
    if (!name.trim()) {
      setError(t("adminCrud.nameRequired"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: name.trim(),
        address: address.trim() || undefined,
        type,
        radius_meters: radius,
        latitude: lat,
        longitude: lng,
      };
      if (mode === "create") {
        await createOfficeLocation(body);
      } else if (initial) {
        await updateOfficeLocation(initial.id, body);
      }
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("adminMaster.failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {mode === "create" ? t("locationModal.titleCreate") : t("locationModal.titleEdit")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("locationModal.nameLabel")} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("locationModal.namePlaceholder")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("locationModal.addressLabel")}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("locationModal.addressPlaceholder")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("locationModal.typeLabel")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_KEYS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    type === opt.value
                      ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#1E3A5F] hover:text-[#1E3A5F]"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("locationModal.radiusLabel")}: {radius}m
            </label>
            <div className="flex gap-2">
              {RADIUS_PRESETS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-5 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                    radius === r
                      ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#1E3A5F] hover:text-[#1E3A5F]"
                  }`}
                >
                  {r}m
                </button>
              ))}
            </div>
          </div>

          <LocationMap
            latitude={lat}
            longitude={lng}
            radiusMeters={radius}
            onMove={(nextLat, nextLng) => {
              setLat(nextLat);
              setLng(nextLng);
            }}
          />

          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
              {t("locationModal.coordsLabel")}
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3">
              <span className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              {placeLoading ? (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#1E3A5F] rounded-full animate-spin" />
                  Mencari alamat...
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                  {placeName || `${lat.toFixed(7)}, ${lng.toFixed(7)}`}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
            {t("locationModal.tips")}
          </p>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex-1 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
            >
              {saving
                ? t("common.saving")
                : mode === "create"
                  ? t("locationModal.add")
                  : t("locationModal.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
