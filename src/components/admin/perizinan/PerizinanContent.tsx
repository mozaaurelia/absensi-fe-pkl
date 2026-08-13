"use client";

import { useMemo, useState } from "react";
import type { Perizinan } from "./types";
import PerizinanHeader from "./PerizinanHeader";
import PerizinanStatsCards from "./PerizinanStatsCards";
import PerizinanFilter, { type FilterStatus } from "./PerizinanFilter";
import PerizinanGrid from "./PerizinanGrid";
import ApprovalModal from "./ApprovalModal";
import PerizinanDetailModal from "./PerizinanDetailModal";

function sampleSurat(nama: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" font-family="Arial, sans-serif">
  <rect width="320" height="420" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="20" y="36" font-size="13" font-weight="bold" fill="#334155">SURAT IZIN</text>
  <text x="20" y="58" font-size="10" fill="#64748b">Kepada Yth. HRD</text>
  <text x="20" y="74" font-size="10" fill="#64748b">di tempat</text>
  <text x="20" y="100" font-size="10" fill="#334155">Dengan hormat,</text>
  <text x="20" y="120" font-size="10" fill="#334155">Yang bertanda tangan di bawah ini:</text>
  <text x="20" y="146" font-size="11" fill="#334155">Nama : ${nama}</text>
  <text x="20" y="162" font-size="11" fill="#334155">Divisi : Operasional</text>
  <text x="20" y="188" font-size="10" fill="#334155">Mengajukan izin tidak masuk bekerja</text>
  <text x="20" y="204" font-size="10" fill="#334155">dengan alasan yang disertakan.</text>
  <text x="20" y="220" font-size="10" fill="#334155">Demikian surat ini dibuat.</text>
  <text x="20" y="300" font-size="10" fill="#334155">Hormat saya,</text>
  <text x="20" y="360" font-size="11" fill="#334155">${nama}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

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
    attachment: sampleSurat("Andi Pratama"),
    attachmentName: "Surat_Izin_Cuti.png",
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
    attachment: sampleSurat("Sinta Rahma"),
    attachmentName: "Surat_Keterangan_Dokter.png",
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
    attachment: sampleSurat("Dewi Lestari"),
    attachmentName: "Surat_Keterangan_Dokter.png",
  },
];

export default function PerizinanContent() {
  const [requests, setRequests] = useState<Perizinan[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [action, setAction] = useState<{ request: Perizinan; mode: "approve" | "reject" } | null>(null);
  const [detail, setDetail] = useState<Perizinan | null>(null);

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
