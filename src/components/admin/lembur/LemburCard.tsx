import type { OvertimeTeamRequest } from "@/lib/services/attendance";
import { generateOfficialLetter } from "@/lib/exportUtils";

interface LemburCardProps {
  request: OvertimeTeamRequest;
  onApprove: () => void;
  onReject: () => void;
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const d = new Date(value.length <= 10 ? value + "T00:00:00" : value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function toTime(value?: string): string {
  if (!value) return "--:--";
  const match = value.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : value;
}

function shortId(id?: string | null): string {
  if (!id) return "-";
  return id.length > 8 ? `${id.slice(0, 8).toUpperCase()}` : id;
}

function statusOf(request: OvertimeTeamRequest) {
  const status = request.status.toLowerCase();
  if (status === "approved") {
    return {
      label: "Disetujui",
      badge: "bg-green-50 text-green-600",
      dot: "bg-green-500",
    };
  }
  if (status === "rejected") {
    return {
      label: "Ditolak",
      badge: "bg-red-50 text-red-500",
      dot: "bg-red-500",
    };
  }
  return {
    label: "Menunggu",
    badge: "bg-blue-50 text-[#1E3A5F]",
    dot: "bg-blue-500",
  };
}

export default function LemburCard({ request, onApprove, onReject }: LemburCardProps) {
  const status = statusOf(request);
  const pending = request.status.toLowerCase() === "pending";

  return (
    <div className="card-hover bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 rounded-xl bg-blue-50 text-[#1E3A5F] flex items-center justify-center text-xs font-bold shrink-0">
            {request.employee_name
              ?.split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "?"}
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
              {request.employee_name || "-"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {request.department_name || "-"} · ID {shortId(request.employee_id)}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {request.category && (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {request.category}
          </span>
        )}
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
          {Number(request.total_hours).toFixed(1)} jam
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {formatDate(request.overtime_date)}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-2">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {toTime(request.start_time)} - {toTime(request.end_time)}
      </div>

      {request.reason && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{request.reason}</p>
      )}

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
        <div className="space-y-3">
          <div className="text-xs">
            <span
              className={`font-semibold ${
                request.status.toLowerCase() === "approved" ? "text-green-600" : "text-red-500"
              }`}
            >
              {request.status.toLowerCase() === "approved"
                ? "Lembur disetujui"
                : "Lembur ditolak"}
            </span>
            {request.rejection_note && (
              <p className="text-gray-400 mt-1 leading-relaxed line-clamp-2">
                {request.rejection_note}
              </p>
            )}
          </div>
          {request.status.toLowerCase() === "approved" && (
            <button
              onClick={() =>
                generateOfficialLetter({
                  companyName: "",
                  requestType: "overtime",
                  employeeName: request.employee_name ?? "",
                  departmentName: request.department_name ?? "",
                  dateStart: request.overtime_date ?? "",
                  reason: request.reason ?? undefined,
                })
              }
              className="w-full flex items-center justify-center gap-2 border border-[#1E3A5F] text-[#1E3A5F] text-xs font-semibold py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Unduh Surat Resmi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
