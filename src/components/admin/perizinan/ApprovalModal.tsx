"use client";

import { useState } from "react";
import type { Perizinan } from "./types";
import { getInitials } from "./types";

interface ApprovalModalProps {
  request: Perizinan;
  mode: "approve" | "reject";
  onClose: () => void;
  onConfirm: (note: string) => void;
}

export default function ApprovalModal({ request, mode, onClose, onConfirm }: ApprovalModalProps) {
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const approve = mode === "approve";

  const handleConfirm = () => {
    if (!approve && !note.trim()) {
      setNoteError("Alasan penolakan wajib diisi.");
      return;
    }
    setNoteError("");
    onConfirm(note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-slide-up">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                approve ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
              }`}
            >
              {getInitials(request.employeeName)}
            </span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                {approve ? "Setujui Pengajuan" : "Tolak Pengajuan"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {request.employeeName} · {request.type} · {request.duration} hari
              </p>
            </div>
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

        <div className="px-6 py-5">
          <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 mb-4 leading-relaxed">
            {request.reason}
          </p>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {approve ? "Catatan (Opsional)" : "Alasan Penolakan"}
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (noteError) setNoteError("");
            }}
            placeholder={
              approve
                ? "Tuliskan catatan persetujuan bila perlu..."
                : "Jelaskan alasan pengajuan ditolak..."
            }
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none resize-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
          />
          {noteError && <p className="text-xs text-red-500 mt-1">{noteError}</p>}
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-lg py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 flex items-center justify-center gap-2 text-white rounded-lg py-3 text-sm font-semibold transition-all ${
              approve
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              {approve ? (
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
              )}
            </svg>
            {approve ? "Setujui" : "Tolak Pengajuan"}
          </button>
        </div>
      </div>
    </div>
  );
}
