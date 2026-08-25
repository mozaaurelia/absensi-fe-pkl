"use client";

import type { Perizinan } from "./types";
import { STATUS_MAP, getInitials } from "./types";
import { generateOfficialLetter } from "@/lib/exportUtils";

interface PerizinanDetailModalProps {
  request: Perizinan;
  onClose: () => void;
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function isImage(attachment?: string | null): boolean {
  if (!attachment) return false;
  return /^data:image\//.test(attachment) || /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(attachment.split("?")[0] ?? "");
}

function fallbackName(attachment: string): string {
  try {
    const path = new URL(attachment).pathname;
    const last = decodeURIComponent(path.split("/").filter(Boolean).pop() ?? "");
    return last || "lampiran";
  } catch {
    return "lampiran";
  }
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800 leading-snug">{value}</p>
    </div>
  );
}

export default function PerizinanDetailModal({ request, onClose }: PerizinanDetailModalProps) {
  const status = STATUS_MAP[request.status];
  const singleDay = request.startDate === request.endDate;
  const hasAttachment = !!request.attachment;
  const image = isImage(request.attachment);
  const attachmentLabel = request.attachmentName || fallbackName(request.attachment || "");

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-fade-slide-up">
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <span
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${status.iconBg}`}
            >
              {getInitials(request.employeeName)}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm">Detail Pengajuan Perizinan</h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {request.employeeName} · {request.department}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 flex items-center justify-center shrink-0"
              aria-label="Tutup"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Info label="Tipe Perizinan" value={request.type} />
            <Info label="Durasi" value={`${request.duration} hari`} />
            <Info label="Tanggal Mulai" value={formatDate(request.startDate)} />
            <Info label="Tanggal Selesai" value={formatDate(request.endDate)} />
          </div>

          {!singleDay && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Rentang Waktu
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDate(request.startDate)} — {formatDate(request.endDate)} ({request.duration} hari)
              </p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Alasan</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
              {request.reason}
            </p>
          </div>

          {request.approvalNote && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Catatan Persetujuan
              </p>
              <p
                className={`text-sm rounded-xl px-4 py-3 leading-relaxed ${
                  request.status === "approved"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {request.approvalNote}
              </p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              Lampiran File
            </p>
            {hasAttachment ? (
              <div className="space-y-3">
                {image ? (
                  <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={request.attachment ?? ""}
                      alt={attachmentLabel}
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="w-10 h-10 rounded-lg bg-blue-50 text-[#1E3A5F] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{attachmentLabel}</p>
                      <p className="text-xs text-gray-400">File lampiran pengajuan</p>
                    </div>
                  </div>
                )}
                <a
                  href={request.attachment ?? ""}
                  download={attachmentLabel}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-[#1E3A5F] hover:bg-blue-50 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Unduh Lampiran
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                Tidak ada lampiran.
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0 space-y-2">
          {request.status === "approved" && (
            <button
              onClick={() =>
                generateOfficialLetter({
                  companyName: "",
                  requestType: "leave",
                  employeeName: request.employeeName,
                  departmentName: request.department,
                  dateStart: request.startDate,
                  dateEnd: request.endDate,
                  reason: request.reason,
                })
              }
              className="w-full flex items-center justify-center gap-2 bg-[#1E3A5F] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#16304f] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Unduh Surat Resmi
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
