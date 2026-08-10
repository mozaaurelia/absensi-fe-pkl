"use client";

import { useState } from "react";
import ApprovalRow from "./ApprovalRow";

interface Approval {
  id: string;
  name: string;
  type: string;
  detail: string;
}

const initialApprovals: Approval[] = [
  { id: "1", name: "Sinta Rahma", type: "Cuti Tahunan", detail: "3 - 4 Mei 2026" },
  { id: "2", name: "Budi Santoso", type: "Lembur", detail: "15 Juli 2026 · 2j 30m" },
  { id: "3", name: "Maya Lestari", type: "Sakit", detail: "12 Juli 2026" },
  { id: "4", name: "Rizky Ramadhan", type: "Reimburse", detail: "Rp 250.000 · Transport" },
];

export default function PendingApprovals() {
  const [approvals, setApprovals] = useState(initialApprovals);

  const handleDecision = (id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    // TODO: kirim keputusan approve/reject ke API
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900 text-sm">Pengajuan Menunggu Persetujuan</h3>
        <button className="text-xs font-semibold text-[#1E3A5F]">Lihat Semua</button>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        {approvals.length} pengajuan butuh tindakan Anda.
      </p>

      {approvals.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          Semua pengajuan sudah ditinjau.
        </p>
      ) : (
        <div className="flex flex-col">
          {approvals.map((approval) => (
            <ApprovalRow
              key={approval.id}
              name={approval.name}
              type={approval.type}
              detail={approval.detail}
              onApprove={() => handleDecision(approval.id)}
              onReject={() => handleDecision(approval.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}