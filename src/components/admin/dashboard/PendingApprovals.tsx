"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ApprovalRow from "./ApprovalRow";
import { getTeamOvertimeRequests, approveOvertimeRequest, rejectOvertimeRequest } from "@/lib/services/attendance";
import { getTeamLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from "@/lib/services/leave";

interface Approval {
  id: string;
  name: string;
  type: string;
  detail: string;
  kind: "leave" | "overtime";
}

export default function PendingApprovals() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [leave, overtime] = await Promise.all([
        getTeamLeaveRequests(),
        getTeamOvertimeRequests(),
      ]);
      const items: Approval[] = [];

      (Array.isArray(leave) ? leave : []).forEach((r) => {
        if (r.status !== "pending") return;
        items.push({
          id: r.id,
          name: r.employee_name || "-",
          type: r.leave_type_name || "Cuti",
          detail: `${r.start_date ?? "-"} s/d ${r.end_date ?? "-"}`,
          kind: "leave",
        });
      });

      (Array.isArray(overtime) ? overtime : []).forEach((r) => {
        if (r.status !== "pending") return;
        items.push({
          id: r.id,
          name: r.employee_name || "-",
          type: "Lembur",
          detail: `${r.overtime_date ?? "-"} · ${r.total_hours ?? 0}h`,
          kind: "overtime",
        });
      });

      setApprovals(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDecision = async (id: string, kind: Approval["kind"], approved: boolean) => {
    setError(null);
    try {
      if (kind === "leave") {
        if (approved) {
          await approveLeaveRequest(id, "");
        } else {
          await rejectLeaveRequest(id, "Ditolak oleh admin");
        }
      } else {
        if (approved) {
          await approveOvertimeRequest(id);
        } else {
          await rejectOvertimeRequest(id, "Ditolak oleh admin");
        }
      }
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses pengajuan.");
    }
  };

  const pendingCount = useMemo(() => approvals.length, [approvals]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Pengajuan Menunggu Persetujuan</h3>
        <button className="text-xs font-semibold text-[#1E3A5F] dark:text-blue-300">Lihat Semua</button>
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      {isLoading ? (
        <div className="space-y-3 py-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            {pendingCount} pengajuan butuh tindakan Anda.
          </p>

          {approvals.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
              Semua pengajuan sudah ditinjau.
            </p>
          ) : (
            <div className="flex flex-col">
              {approvals.map((approval) => (
                <ApprovalRow
                  key={`${approval.kind}-${approval.id}`}
                  name={approval.name}
                  type={approval.type}
                  detail={approval.detail}
                  onApprove={() => handleDecision(approval.id, approval.kind, true)}
                  onReject={() => handleDecision(approval.id, approval.kind, false)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}