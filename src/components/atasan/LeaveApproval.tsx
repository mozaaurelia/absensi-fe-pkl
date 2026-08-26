"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  approveLeaveRequest,
  rejectLeaveRequest,
  type LeaveRequest,
} from "@/lib/services/leave";
import { getMyProfile } from "@/lib/services/employee";
import { generateOfficialLetter } from "@/lib/exportUtils";

interface Props {
  requests: LeaveRequest[];
  onProcessed: () => Promise<void> | void;
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function attachmentName(url?: string | null): string {
  if (!url) return "lampiran";
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").filter(Boolean).pop() ?? "lampiran");
  } catch {
    return "lampiran";
  }
}

export default function LeaveApproval({ requests, onProcessed }: Props) {
  const { t } = useLanguage();
  const [action, setAction] = useState<{ id: string; mode: "approve" | "reject" } | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [profile, setProfile] = useState<{ company_name?: string; name?: string; role_name?: string } | null>(null);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const downloadLetter = async (req: LeaveRequest) => {
    generateOfficialLetter({
      companyName: profile?.company_name ?? "",
      requestType: (req.leave_type_name ?? "").toLowerCase().includes("cuti")
        ? "leave"
        : "izin",
      employeeName: req.employee_name ?? "",
      departmentName: req.department_name ?? "",
      dateStart: req.start_date ?? "",
      dateEnd: req.end_date ?? undefined,
      reason: req.reason ?? undefined,
      approvedByName: profile?.name,
      approvedByRole: profile?.role_name,
    });
  };

  const openAction = (id: string, mode: "approve" | "reject") => {
    setAction({ id, mode });
    setNote("");
    setError(null);
  };

  const closeAction = () => {
    setAction(null);
    setNote("");
    setError(null);
  };

  const confirmAction = async () => {
    if (!action) return;
    setError(null);

    if (action.mode === "reject" && !note.trim()) {
      setError(t("atasan.noteRequired"));
      return;
    }

    setProcessing(true);
    try {
      if (action.mode === "approve") {
        await approveLeaveRequest(action.id, note.trim());
      } else {
        await rejectLeaveRequest(action.id, note.trim());
      }
      closeAction();
      await onProcessed();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("atasan.actionFailed"));
    } finally {
      setProcessing(false);
    }
  };

  const pending = requests.filter(
    (r) => (r.status ?? "").toLowerCase() === "pending",
  );
  const approved = requests.filter(
    (r) => (r.status ?? "").toLowerCase() === "approved",
  );
  const visible = tab === "pending" ? pending : approved;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("atasan.teamLeave")}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t("atasan.teamLeaveDesc")}</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setTab("pending")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              tab === "pending"
                ? "bg-white dark:bg-gray-800 text-[#1E3A5F] dark:text-blue-300 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Menunggu ({pending.length})
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              tab === "approved"
                ? "bg-white dark:bg-gray-800 text-green-600 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Disetujui ({approved.length})
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-400">
          {tab === "pending" ? t("atasan.emptyRequests") : "Belum ada pengajuan yang disetujui."}
        </p>
      ) : (
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {visible.map((req) => (
            <div key={req.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {req.employee_name || "-"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {req.leave_type_name || "-"} · {formatDate(req.start_date)}
                    {req.end_date && req.end_date !== req.start_date
                      ? ` - ${formatDate(req.end_date)}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {tab === "pending" ? (
                    <>
                      <button
                        onClick={() => openAction(req.id, "approve")}
                        disabled={processing}
                        className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                      >
                        {t("atasan.approve")}
                      </button>
                      <button
                        onClick={() => openAction(req.id, "reject")}
                        disabled={processing}
                        className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                      >
                        {t("atasan.reject")}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => downloadLetter(req)}
                      className="border border-[#1E3A5F] dark:border-blue-400/40 text-[#1E3A5F] dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                    >
                      Unduh Surat
                    </button>
                  )}
                </div>
              </div>
              {req.reason && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{req.reason}</p>
              )}
              {req.attachment_url && (
                <a
                  href={req.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] dark:text-blue-300 hover:underline"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t("atasan.viewAttachment")} · {attachmentName(req.attachment_url)}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              {action.mode === "approve" ? t("atasan.confirmApprove") : t("atasan.confirmReject")}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("atasan.approvalNote")}
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("atasan.approvalNotePlaceholder")}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 mb-4">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeAction}
                disabled={processing}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmAction}
                disabled={processing}
                className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 ${
                  action.mode === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {processing ? t("common.saving") : action.mode === "approve" ? t("atasan.approve") : t("atasan.reject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
