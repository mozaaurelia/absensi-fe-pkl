"use client";

import { useState } from "react";
import type { Position } from "./types";
import { useLanguage } from "@/context/LanguageContext";

interface PositionFormModalProps {
  initialData: Position | null;
  existingNames: string[];
  onClose: () => void;
  onSave: (position: Position) => void;
}

export default function PositionFormModal({
  initialData,
  existingNames,
  onClose,
  onSave,
}: PositionFormModalProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    reimbursementLimit: initialData?.reimbursementLimit ?? 0,
  });
  const [nameError, setNameError] = useState("");

  const handleSave = () => {
    const trimmed = form.name.trim();
    if (!trimmed) {
      setNameError(t("adminPositions.nameRequired"));
      return;
    }
    const isDuplicate = existingNames
      .filter((n) => n.toLowerCase() !== initialData?.name.toLowerCase())
      .some((n) => n.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      setNameError(t("adminPositions.nameExists"));
      return;
    }
    setNameError("");
    onSave({
      id: initialData?.id ?? crypto.randomUUID(),
      name: trimmed,
      description: form.description.trim(),
      reimbursementLimit: form.reimbursementLimit,
      employeeCount: initialData?.employeeCount ?? 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>✏️</span> {initialData ? t("adminPositions.editTitle") : t("adminPositions.addTitle")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {initialData ? t("adminPositions.editDesc") : t("adminPositions.addDesc")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 max-h-[50vh] overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("adminPositions.nameLabel")}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (nameError) setNameError("");
              }}
              placeholder={initialData ? t("adminPositions.namePlaceholder") : t("adminPositions.nameExamplePlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
            />
            {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t("adminPositions.descLabel")}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={t("adminPositions.descPlaceholder")}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none resize-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t("adminPositions.limitFieldLabel")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                Rp
              </span>
              <input
                type="number"
                min={0}
                step={1000}
                value={form.reimbursementLimit || ""}
                onChange={(e) => {
                  const num = Math.floor(Number(e.target.value) || 0);
                  setForm({ ...form, reimbursementLimit: Math.max(0, num) });
                }}
                onBlur={(e) => {
                  const num = Math.floor(Number(e.target.value) || 0);
                  const rounded = Math.round(num / 1000) * 1000;
                  setForm({ ...form, reimbursementLimit: Math.max(0, rounded) });
                }}
                placeholder="0"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {t("adminPositions.limitHint")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-lg py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] text-white rounded-lg py-3 text-sm font-semibold hover:brightness-110 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {initialData ? t("adminPositions.saveChanges") : t("adminPositions.addButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
