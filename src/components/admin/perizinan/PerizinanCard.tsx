import type { Perizinan } from "./types";
import { STATUS_MAP, getInitials } from "./types";

interface PerizinanCardProps {
  request: Perizinan;
  onApprove: () => void;
  onReject: () => void;
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function PerizinanCard({ request, onApprove, onReject }: PerizinanCardProps) {
  const status = STATUS_MAP[request.status];
  const pending = request.status === "pending";
  const singleDay = request.startDate === request.endDate;

  return (
    <div className="card-hover bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${status.iconBg}`}
          >
            {getInitials(request.employeeName)}
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
              {request.employeeName}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{request.department}</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
          {request.type}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
          {request.duration} hari
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {formatDate(request.startDate)}
        {!singleDay && ` - ${formatDate(request.endDate)}`}
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{request.reason}</p>

      {pending ? (
        <div className="flex items-center gap-2">
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Setujui
          </button>
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-red-100 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
            </svg>
            Tolak
          </button>
        </div>
      ) : (
        <div className="text-xs">
          <span
            className={`font-semibold ${
              request.status === "approved" ? "text-green-600" : "text-red-500"
            }`}
          >
            {request.status === "approved" ? "Pengajuan disetujui" : "Pengajuan ditolak"}
          </span>
          {request.approvalNote && (
            <p className="text-gray-400 mt-1 leading-relaxed">{request.approvalNote}</p>
          )}
        </div>
      )}
    </div>
  );
}
