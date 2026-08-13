"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  approveOvertimeRequest,
  rejectOvertimeRequest,
  type OvertimeTeamRequest,
} from "@/lib/services/attendance";
import LemburStatsCards from "./LemburStatsCards";
import LemburCard from "./LemburCard";
import LemburUpcoming from "./LemburUpcoming";
import LemburAnalytics from "./LemburAnalytics";

interface LemburContentProps {
  requests: OvertimeTeamRequest[];
  onProcessed: () => Promise<void> | void;
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

type SectionTab = "pengajuan" | "mendatang" | "analitik";

const SECTION_TABS: { id: SectionTab; label: string; icon: ReactNode }[] = [
  { id: "pengajuan", label: "Pengajuan", icon: <ClipboardIcon /> },
  { id: "mendatang", label: "Lembur Mendatang", icon: <CalendarIcon /> },
  { id: "analitik", label: "Analitik", icon: <ChartIcon /> },
];

const STATUS_TABS: { id: FilterStatus; label: string; emoji: string }[] = [
  { id: "pending", label: "Menunggu", emoji: "⏳" },
  { id: "approved", label: "Disetujui", emoji: "✓" },
  { id: "rejected", label: "Ditolak", emoji: "✗" },
  { id: "all", label: "Semua", emoji: "🗂" },
];

const selectClass =
  "appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all cursor-pointer";

export default function LemburContent({ requests, onProcessed }: LemburContentProps) {
  const [section, setSection] = useState<SectionTab>("pengajuan");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [deptFilter, setDeptFilter] = useState("");
  const [action, setAction] = useState<{ id: string; mode: "approve" | "reject" } | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((r) => r.status.toLowerCase() === "pending").length,
      approved: requests.filter((r) => r.status.toLowerCase() === "approved").length,
      rejected: requests.filter((r) => r.status.toLowerCase() === "rejected").length,
    }),
    [requests]
  );

  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const r of requests) {
      if (r.department_name) set.add(r.department_name);
    }
    return Array.from(set).sort();
  }, [requests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesStatus = filter === "all" || r.status.toLowerCase() === filter;
      const matchesDept = !deptFilter || r.department_name === deptFilter;
      const matchesSearch =
        !q ||
        (r.employee_name ?? "").toLowerCase().includes(q) ||
        (r.employee_id ?? "").toLowerCase().includes(q) ||
        (r.department_name ?? "").toLowerCase().includes(q);
      return matchesStatus && matchesDept && matchesSearch;
    });
  }, [requests, search, filter, deptFilter]);

  const activeTab = STATUS_TABS.find((t) => t.id === filter)!;

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
      setError("Alasan penolakan wajib diisi.");
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
      setError(err instanceof Error ? err.message : "Gagal memproses pengajuan.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <LemburStatsCards requests={requests} />

      <div className="flex items-stretch border-b border-gray-200">
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSection(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              section === tab.id ? "text-[#1E3A5F]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-[#1E3A5F]">{tab.icon}</span>
            {tab.label}
            <span
              className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-opacity ${
                section === tab.id ? "opacity-100" : "opacity-0"
              } bg-[#1E3A5F]`}
            />
          </button>
        ))}
      </div>

      {section === "pengajuan" && (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
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
            placeholder="Cari nama, ID, departemen..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all"
          />
        </div>

        <div className="relative">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
          </svg>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={`${selectClass} w-full lg:w-52`}
          >
            <option value="">Semua Dept</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <span>{activeTab.emoji}</span>
          {activeTab.label}
          <span className="text-xs font-semibold text-gray-400">
            {counts[activeTab.id]} pengajuan
          </span>
        </h3>
        <div className="flex items-center gap-1 bg-gray-100/80 rounded-xl p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? "bg-gradient-to-r from-[#1E3A5F] to-[#2f5d94] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.emoji} {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === tab.id ? "bg-white/20" : "bg-gray-200 text-gray-500"
                }`}
              >
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center animate-fade-slide-up">
          <p className="text-4xl mb-3">🌙</p>
          <p className="text-sm text-gray-400">
            {requests.length === 0
              ? "Belum ada pengajuan lembur."
              : "Tidak ada pengajuan yang cocok dengan pencarian."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((req, i) => (
            <div key={req.id} style={{ animationDelay: `${i * 70}ms` }}>
              <LemburCard
                request={req}
                onApprove={() => openAction(req.id, "approve")}
                onReject={() => openAction(req.id, "reject")}
              />
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {section === "mendatang" && <LemburUpcoming requests={requests} />}
      {section === "analitik" && <LemburAnalytics requests={requests} />}

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-1">
              {action.mode === "approve" ? "Konfirmasi Setujui" : "Konfirmasi Tolak"}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {action.mode === "approve"
                ? "Pengajuan lembur akan disetujui."
                : "Masukkan alasan penolakan pengajuan lembur."}
            </p>
            {action.mode === "reject" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tuliskan alasan penolakan..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors resize-none"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeAction}
                disabled={processing}
                className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={confirmAction}
                disabled={processing}
                className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 ${
                  action.mode === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {processing ? "Memproses..." : action.mode === "approve" ? "Setujui" : "Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 4h6v2H9zM9 3a2 2 0 0 0-2 2v1h10V5a2 2 0 0 0-2-2H9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
