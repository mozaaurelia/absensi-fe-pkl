"use client";

import { useMemo, useState } from "react";
import type { ReimburseRequest, ReimburseStatus } from "./types";
import ReimburseStatsCards from "./ReimburseStatsCards";
import ReimburseTable from "./ReimburseTable";

type StatusFilter = "all" | ReimburseStatus;

const selectClass =
  "appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all cursor-pointer";

export default function ReimburseContent() {
  const [requests, setRequests] = useState<ReimburseRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((req) => {
      const matchesStatus = statusFilter === "all" || req.status === statusFilter;
      const matchesSearch =
        req.employeeName.toLowerCase().includes(q) ||
        req.title.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [requests, search, statusFilter]);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)),
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)),
    );
  };

  return (
    <div>
      <ReimburseStatsCards requests={requests} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-gray-900 text-base">Daftar Pengajuan</h3>
        <button className="flex items-center justify-center gap-2 bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#16304f] transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
          Tambah Reimburse
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari karyawan atau judul..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
          />
        </div>

        <div className="relative lg:w-56">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className={`${selectClass} w-full`}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <ReimburseTable
        requests={filtered}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
