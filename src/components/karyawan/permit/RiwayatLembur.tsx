"use client";

import { useEffect, useState } from "react";
import { FiClock, FiFileText } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { getMyOvertimeRequests, type OvertimeRequest } from "@/lib/services/attendance";
import { getMyProfile } from "@/lib/services/employee";
import { generateOfficialLetter } from "@/lib/exportUtils";

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-blue-50 dark:bg-blue-500/10 text-[#1E3A5F] dark:text-blue-300",
  approved: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400",
};

export default function RiwayatLembur() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOvertimeRequests()
      .then((rows) => setRequests(Array.isArray(rows) ? rows : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const downloadLetter = async (req: OvertimeRequest) => {
    let companyName = "";
    let employeeName = "";
    try {
      const profile = await getMyProfile();
      companyName = profile?.company_name ?? "";
      employeeName = profile?.name ?? "";
    } catch {
      /* ignore */
    }
    generateOfficialLetter({
      companyName,
      requestType: "overtime",
      employeeName,
      dateStart: req.overtime_date ?? "",
      reason: req.reason ?? undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
          <FiFileText size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Riwayat Lembur</h3>
          <p className="text-xs text-gray-400">Pengajuan lembur kamu beserta statusnya</p>
        </div>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-gray-400">{t("common.loading")}</p>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-300 dark:text-gray-500 flex items-center justify-center">
            <FiClock size={22} />
          </div>
          <p className="text-sm text-gray-400">{t("common.emptyData")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.slice(0, 5).map((req) => {
            const status = (req.status ?? "pending").toLowerCase();
            return (
              <div
                key={req.id}
                className="rounded-xl border border-gray-100 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatDate(req.overtime_date)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {String(req.start_time).slice(0, 5)} - {String(req.end_time).slice(0, 5)} ·{" "}
                      {Number(req.total_hours).toFixed(1)} jam
                      {req.category ? ` · ${req.category}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}
                  >
                    {status}
                  </span>
                </div>

                {status === "approved" && (
                  <button
                    onClick={() => downloadLetter(req)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 border border-[#1E3A5F] dark:border-blue-400/40 text-[#1E3A5F] dark:text-blue-300 text-xs font-semibold py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Unduh Surat Resmi
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
