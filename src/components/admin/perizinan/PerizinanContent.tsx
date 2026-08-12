"use client";

import { useMemo, useState } from "react";
import type { Perizinan } from "./types";
import PerizinanHeader from "./PerizinanHeader";
import PerizinanStatsCards from "./PerizinanStatsCards";
import PerizinanFilter, { type FilterStatus } from "./PerizinanFilter";
import PerizinanGrid from "./PerizinanGrid";
import ApprovalModal from "./ApprovalModal";

const initialRequests: Perizinan[] = [
  {
    id: "1",
    employeeName: "Andi Pratama",
    department: "Operasional",
    type: "Cuti Tahunan",
    startDate: "2026-08-10",
    endDate: "2026-08-14",
    duration: 5,
    reason: "Cuti tahunan ke kampung halaman bersama keluarga, sudah direncanakan sejak awal tahun.",
    status: "pending",
  },
  {
    id: "2",
    employeeName: "Sinta Rahma",
    department: "Keuangan",
    type: "Izin Sakit",
    startDate: "2026-08-12",
    endDate: "2026-08-12",
    duration: 1,
    reason: "Demam tinggi dan disarankan istirahat oleh dokter.",
    status: "pending",
  },
  {
    id: "3",
    employeeName: "Budi Santoso",
    department: "IT",
    type: "Cuti Tahunan",
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    duration: 5,
    reason: "Menemani keluarga berlibur.",
    status: "approved",
    approvalNote: "Disetujui, pastikan handover tugas ke tim selesai sebelum cuti.",
  },
  {
    id: "4",
    employeeName: "Maya Lestari",
    department: "Operasional",
    type: "Izin Pribadi",
    startDate: "2026-08-13",
    endDate: "2026-08-13",
    duration: 1,
    reason: "Ada keperluan keluarga mendadak.",
    status: "approved",
    approvalNote: "Disetujui.",
  },
  {
    id: "5",
    employeeName: "Rizky Ramadhan",
    department: "Pemasaran",
    type: "Cuti Tahunan",
    startDate: "2026-08-17",
    endDate: "2026-08-21",
    duration: 5,
    reason: "Mengajukan cuti di luar tanggal merah agar jatah tidak hangus.",
    status: "rejected",
    approvalNote: "Bentrok dengan jadwal kampanye besar bulan depan.",
  },
  {
    id: "6",
    employeeName: "Dewi Lestari",
    department: "HRD",
    type: "Izin Sakit",
    startDate: "2026-08-11",
    endDate: "2026-08-12",
    duration: 2,
    reason: "Flu berat, mengikuti saran dokter untuk beristirahat.",
    status: "pending",
  },
];

export default function PerizinanContent() {
  const [requests, setRequests] = useState<Perizinan[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [action, setAction] = useState<{ request: Perizinan; mode: "approve" | "reject" } | null>(null);

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      const matchesStatus = filter === "all" || r.status === filter;
      const matchesSearch =
        r.employeeName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [requests, search, filter]);

  const handleConfirm = (note: string) => {
    if (!action) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === action.request.id
          ? { ...r, status: action.mode === "approve" ? "approved" : "rejected", approvalNote: note || undefined }
          : r
      )
    );
    setAction(null);
  };

  return (
    <div>
      <PerizinanHeader count={requests.length} pendingCount={counts.pending} />
      <PerizinanStatsCards requests={requests} />
      <PerizinanFilter
        search={search}
        filter={filter}
        counts={counts}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />
      <PerizinanGrid
        requests={filtered}
        onApprove={(request) => setAction({ request, mode: "approve" })}
        onReject={(request) => setAction({ request, mode: "reject" })}
      />

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
