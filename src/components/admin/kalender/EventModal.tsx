"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { createCalendarEvent } from "@/lib/services/admin";
import { ApiError } from "@/lib/api";
import { FiX } from "react-icons/fi";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

export interface EventTypeOption {
  value: string;
  labelKey: string;
  color: string;
}

export const EVENT_TYPES: EventTypeOption[] = [
  { value: "meeting", labelKey: "adminKalender.meeting", color: "#22C55E" },
  { value: "training", labelKey: "adminKalender.training", color: "#3B82F6" },
  { value: "event", labelKey: "adminKalender.companyEvent", color: "#A855F7" },
  { value: "lainnya", labelKey: "adminKalender.other", color: "#F97316" },
];

export function eventTypeColor(type?: string | null): string {
  return EVENT_TYPES.find((et) => et.value === type)?.color ?? "#94A3B8";
}

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors";

interface Props {
  selectedDate: string;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

export default function EventModal({ selectedDate, onClose, onSaved }: Props) {
  const { t } = useLanguage();

  const [type, setType] = useState("meeting");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayDate = useMemo(() => {
    const d = new Date(selectedDate + "T00:00:00");
    if (Number.isNaN(d.getTime())) return selectedDate;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [selectedDate]);

  const handlePick = (loc: string, lat: number, lng: number) => {
    setLocation(loc);
    setLocationLat(lat);
    setLocationLng(lng);
  };

  const submit = async () => {
    if (!title.trim()) {
      setError(t("adminCrud.nameRequired"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createCalendarEvent({
        title: title.trim(),
        description: notes.trim() || undefined,
        event_type: type,
        event_date: selectedDate,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        location: location || undefined,
        location_lat: locationLat ?? undefined,
        location_lng: locationLng ?? undefined,
      });
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl z-10">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {t("adminKalender.addEvent")}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminKalender.dateLabel")}
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/60 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {displayDate}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminKalender.typeLabel")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      type === opt.value
                        ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#1E3A5F] hover:text-[#1E3A5F]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: type === opt.value ? "#fff" : opt.color }}
                    />
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminKalender.titleLabel")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("adminKalender.titlePlaceholder")}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminKalender.startTimeLabel")}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminKalender.endTimeLabel")}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminKalender.locationLabel")}
            </label>
            <LocationPicker value={location} onPick={handlePick} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminKalender.notesLabel")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("adminKalender.notesPlaceholder")}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {t("adminKalender.cancel")}
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex-1 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
            >
              {saving ? t("common.saving") : t("adminKalender.add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
