import type { Position } from "./types";
import { formatRupiah } from "./utils";

interface PositionCardProps {
  position: Position;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PositionCard({ position, onEdit, onDelete }: PositionCardProps) {
  return (
    <div className="card-hover group bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-blue-50 text-[#1E3A5F] flex items-center justify-center">
            <BriefcaseIcon />
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{position.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{position.description || "Tidak ada deskripsi"}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 flex items-center justify-center transition-colors"
            title="Edit"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
            title="Hapus"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 mb-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
            <circle cx="16" cy="15" r="1.5" fill="currentColor" />
          </svg>
          Limit Reimburse
        </span>
        <span className="text-sm font-bold text-gray-900">Rp {formatRupiah(position.reimbursementLimit)}</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
            <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {position.employeeCount} Karyawan
        </span>
      </div>
    </div>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v1.5h4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
