"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface ScheduleEvent {
  id: string;
  date: string;
  type: string;
  title: string;
  location: string;
  note: string;
}

interface EventModalProps {
  onClose: () => void;
  onSave: (event: ScheduleEvent) => void;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all";

export default function EventModal({ onClose, onSave }: EventModalProps) {
  const { t } = useLanguage();
  const eventTypes = [
    t("adminSchedule.eventMeeting"),
    t("adminSchedule.eventTraining"),
    t("adminSchedule.eventMaintenance"),
    t("adminSchedule.eventCompany"),
    t("adminSchedule.eventOther"),
  ];
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: eventTypes[0],
    title: "",
    location: "",
    note: "",
  });
  const [titleError, setTitleError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = form.title.trim();
    if (!trimmed) {
      setTitleError(t("adminSchedule.titleRequired"));
      return;
    }
    setTitleError("");
    onSave({
      id: crypto.randomUUID(),
      date: form.date,
      type: form.type,
      title: trimmed,
      location: form.location.trim(),
      note: form.note.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A5F] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              {t("adminSchedule.addEventTitle")}
            </h3>
            <p className="text-xs text-gray-400 mt-1.5">{t("adminSchedule.addEventDesc")}</p>          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("adminSchedule.dateLabel")}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("adminSchedule.typeLabel")}</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("adminSchedule.titleLabel")}</label>
            <input
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (titleError) setTitleError("");
              }}
              placeholder={t("adminSchedule.titlePlaceholder")}
              className={inputClass}
            />
            {titleError && <p className="text-xs text-red-500 mt-1">{titleError}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("adminSchedule.locationLabel")}</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder={t("adminSchedule.locationPlaceholder")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("adminSchedule.noteLabel")}</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder={t("adminSchedule.notePlaceholder")}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-lg py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E3A5F] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#16304f] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
            </svg>
            {t("adminSchedule.addEvent")}
          </button>
        </div>
      </form>
    </div>
  );
}