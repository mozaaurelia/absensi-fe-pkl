"use client";

import { useEffect, useMemo, useState } from "react";
import type { Perizinan } from "./types";
import PerizinanHeader from "./PerizinanHeader";
import PerizinanStatsCards from "./PerizinanStatsCards";
import PerizinanFilter, { type FilterStatus } from "./PerizinanFilter";
import PerizinanGrid from "./PerizinanGrid";
import ApprovalModal from "./ApprovalModal";
import PerizinanDetailModal from "./PerizinanDetailModal";
import {
  getAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "@/lib/services/leave";

export default function PerizinanContent() {
  const [requests, setRequests] = useState<Perizinan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [action, setAction] = useState<{ request: Perizinan; mode: "approve" | "reject" } | null>(null);
  const [detail, setDetail] = useState<Perizinan | null>(null);

  const load = () => {
    setLoading(true);
    getAllLeaveRequests()
      .then((rows) => {
        setRequests(
          rows.map((r) => ({
            id: r.id,
            employeeName: r.employee_name ?? "—",
            department: r.department_name ?? "—",
            type: r.leave_type_name ?? "—",
            startDate: r.start_date ?? "",
            endDate: r.end_date ?? "",
            duration: Number(r.total_days ?? r.duration_days ?? 1),
            reason: r.reason ?? "",
            status: (r.status as Perizinan["status"]) ?? "pending",
            approvalNote: r.approval_note ?? undefined,
            attachment: r.attachment_url ?? null,
            attachmentName: r.attachment_url ? "Lampiran" : null,
          })),
        );
        setError(null);
      })
      .catch(() => setError("Gagal memuat data pengajuan."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests]
  );

  const types = useMemo(
    () => Array.from(new Set(requests.map((r) => r.type))).sort(),
    [requests]
  );

  const departments = useMemo(
    () => Array.from(new Set(requests.map((r) => r.department))).sort(),
    [requests]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      const matchesStatus = filter === "all" || r.status === filter;
      const matchesType = !typeFilter || r.type === typeFilter;
      const matchesDept = !deptFilter || r.department === deptFilter;
      const matchesSearch =
        r.employeeName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      return matchesStatus && matchesType && matchesDept && matchesSearch;
    });
  }, [requests, search, filter, typeFilter, deptFilter]);

  const handleConfirm = async (note: string) => {
    if (!action) return;
    const { request, mode } = action;
    try {
      if (mode === "approve") {
        await approveLeaveRequest(request.id, note);
      } else {
        await rejectLeaveRequest(request.id, note);
      }
      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? { ...r, status: mode === "approve" ? "approved" : "rejected", approvalNote: note || undefined }
            : r
        )
      );
    } catch {
      // keep state unchanged; modal closes below
    } finally {
      setAction(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <p className="text-sm text-gray-400">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={load}
          className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-[#1E3A5F] rounded-xl hover:opacity-90"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div>
      <PerizinanHeader count={requests.length} pendingCount={counts.pending} />
      <PerizinanStatsCards requests={requests} />
      <PerizinanFilter
        search={search}
        filter={filter}
        counts={counts}
        types={types}
        departments={departments}
        typeFilter={typeFilter}
        deptFilter={deptFilter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onTypeChange={setTypeFilter}
        onDeptChange={setDeptFilter}
      />
      <PerizinanGrid
        requests={filtered}
        onDetail={(request) => setDetail(request)}
        onApprove={(request) => setAction({ request, mode: "approve" })}
        onReject={(request) => setAction({ request, mode: "reject" })}
      />

      {detail && <PerizinanDetailModal request={detail} onClose={() => setDetail(null)} />}

      {action && (
        <ApprovalModal
          request={action.request}
          mode={action.mode}
          onClose={() => setAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
