"use client";

import { useMemo, useState, useEffect } from "react";
import type { ReimburseRequest, ReimburseStatus } from "./types";
import ReimburseStatsCards from "./ReimburseStatsCards";
import ReimburseTable from "./ReimburseTable";
import {
  getAllReimburseRequests,
  createReimburseRequest,
  approveReimburseRequest,
  rejectReimburseRequest,
} from "@/lib/services/reimburse";

type StatusFilter = "all" | ReimburseStatus;

const CATEGORY_LABELS: Record<string, string> = {
  transport: "Transportasi",
  meal: "Makan",
  health: "Kesehatan",
  education: "Pendidikan",
  other: "Lainnya",
};

const selectClass =
  "appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all cursor-pointer";

export default function ReimburseContent() {
  const [requests, setRequests] = useState<ReimburseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<ReimburseRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getAllReimburseRequests()
      .then((rows) => {
        setRequests(
          rows.map((r) => ({
            id: r.id,
            employeeName: r.employee_name ?? "—",
            department: r.department_name ?? "—",
            title: r.title,
            type: CATEGORY_LABELS[r.category] ?? r.category,
            date: r.expense_date,
            amount: Number(r.amount ?? 0),
            status: (r.status as ReimburseStatus) ?? "pending",
          })),
        );
        setError(null);
      })
      .catch(() => setError("Gagal memuat data reimburse."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

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

  const handleApprove = async (id: string) => {
    try {
      await approveReimburseRequest(id, "");
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)),
      );
    } catch {
      // keep state unchanged
    }
  };

  const handleReject = async (note: string) => {
    if (!rejectTarget) return;
    const id = rejectTarget.id;
    try {
      await rejectReimburseRequest(id, note);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)),
      );
    } catch {
      // keep state unchanged
    } finally {
      setRejectTarget(null);
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
      <ReimburseStatsCards requests={requests} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-gray-900 text-base">Daftar Pengajuan</h3>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#16304f] transition-colors"
        >
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
        onReject={(id) => {
          const target = requests.find((r) => r.id === id) ?? null;
          setRejectTarget(target);
        }}
      />

      {showCreate && (
        <CreateReimburseModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
          setSubmitting={setSubmitting}
        />
      )}

      {rejectTarget && (
        <RejectModal
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
          submitting={submitting}
        />
      )}
    </div>
  );
}

function CreateReimburseModal({
  onClose,
  onCreated,
  setSubmitting,
}: {
  onClose: () => void;
  onCreated: () => void;
  setSubmitting: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("transport");
  const [expenseDate, setExpenseDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    const value = Number(amount);
    if (!title.trim() || !expenseDate || !Number.isFinite(value) || value <= 0) {
      setErr("Lengkapi judul, tanggal, dan jumlah yang valid.");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      await createReimburseRequest({
        title: title.trim(),
        category,
        expense_date: expenseDate,
        amount: value,
        description: description.trim() || undefined,
      });
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan reimburse.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-gray-900 text-lg mb-1">Tambah Reimburse</h3>
        <p className="text-sm text-gray-400 mb-4">Ajukan pengajuan reimburse baru</p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Judul</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Ganti ban motor"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
              <select
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="transport">Transportasi</option>
                <option value="meal">Makan</option>
                <option value="health">Kesehatan</option>
                <option value="education">Pendidikan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal</label>
              <input
                type="date"
                className={inputClass}
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 250000"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Deskripsi</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opsional"
            />
          </div>
        </div>

        {err && <p className="mt-3 text-xs font-medium text-red-500">{err}</p>}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={submit}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A5F] rounded-xl hover:bg-[#16304f] transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectModal({
  onClose,
  onConfirm,
  submitting,
}: {
  onClose: () => void;
  onConfirm: (note: string) => void;
  submitting: boolean;
}) {
  const [note, setNote] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const confirm = () => {
    if (!note.trim()) {
      setErr("Alasan penolakan wajib diisi.");
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-gray-900 text-lg mb-1">Tolak Reimburse</h3>
        <p className="text-sm text-gray-400 mb-4">Alasan penolakan akan dikirim ke karyawan.</p>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tulis alasan penolakan..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white focus:ring-2 focus:ring-[#1E3A5F]/10 transition-all resize-none"
        />
        {err && <p className="mt-2 text-xs font-medium text-red-500">{err}</p>}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={confirm}
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}