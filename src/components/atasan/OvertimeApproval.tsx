"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  approveOvertimeRequest,
  rejectOvertimeRequest,
  type OvertimeTeamRequest,
} from "@/lib/services/attendance";
import { getMyProfile } from "@/lib/services/employee";
import { generateOfficialLetter } from "@/lib/exportUtils";

interface Props {
  requests: OvertimeTeamRequest[];
  onProcessed: () => Promise<void> | void;
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const d = new Date(String(value).length <= 10 ? value + "T00:00:00" : value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function toTime(value?: string): string {
  if (!value) return "--:--";
  const match = value.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : value;
}

export default function OvertimeApproval({ requests, onProcessed }: Props) {
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

  const downloadLetter = async (req: OvertimeTeamRequest) => {
    generateOfficialLetter({
      companyName: profile?.company_name ?? "",
      requestType: "overtime",
      employeeName: req.employee_name ?? "",
      departmentName: req.department_name ?? "",
      dateStart: req.overtime_date ?? "",
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
        await approveOvertimeRequest(action.id);
      } else {
        await rejectOvertimeRequest(action.id, note.trim());
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
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("atasan.teamOvertime")}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t("atasan.teamOvertimeDesc")}</p>
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
          {tab === "pending" ? t("atasan.emptyOvertime") : "Belum ada lembur yang disetujui."}
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
                    {formatDate(req.overtime_date)} · {toTime(req.start_time)} - {toTime(req.end_time)}
                    {req.total_hours != null ? ` · ${req.total_hours}h` : ""}
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
            {action.mode === "reject" && (
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
            )}

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