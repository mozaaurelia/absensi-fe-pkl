import type { ReimburseRequest } from "./types";
import { STATUS_MAP, getInitials } from "./types";
import { formatRupiah } from "@/components/admin/jabatan/utils";

interface ReimburseTableProps {
  requests: ReimburseRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const thClass =
  "px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap";
const tdClass = "px-5 py-4 text-sm text-gray-700 whitespace-nowrap";

export default function ReimburseTable({ requests, onApprove, onReject }: ReimburseTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-slide-up">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className={thClass}>Karyawan</th>
              <th className={thClass}>Judul &amp; Tipe</th>
              <th className={thClass}>Tanggal</th>
              <th className={thClass}>Jumlah</th>
              <th className={thClass}>Status</th>
              <th className={`${thClass} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <p className="text-4xl mb-3">💸</p>
                  <p className="text-sm text-gray-400">
                    Belum ada pengajuan reimburse.
                  </p>
                </td>
              </tr>
            ) : (
              requests.map((req, i) => {
                const status = STATUS_MAP[req.status];
                const pending = req.status === "pending";
                return (
                  <tr
                    key={req.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${status.iconBg}`}
                        >
                          {getInitials(req.employeeName)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{req.employeeName}</p>
                          <p className="text-xs text-gray-400 truncate">{req.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <p className="font-semibold text-gray-900">{req.title}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {req.type}
                      </span>
                    </td>
                    <td className={tdClass}>{formatDate(req.date)}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>
                      Rp {formatRupiah(req.amount)}
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-1.5">
                        {pending && (
                          <>
                            <button
                              onClick={() => onApprove(req.id)}
                              title="Setujui"
                              className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button
                              onClick={() => onReject(req.id)}
                              title="Tolak"
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          title="Detail"
                          className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
