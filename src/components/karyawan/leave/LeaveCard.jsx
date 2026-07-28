import StatusBadge from "./StatusBadge";

export default function LeaveCard({ tipe, status, tanggal, durasi, highlight }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "bg-purple-50/60 border-purple-100"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Tipe</p>
          <p
            className={`text-sm font-bold ${
              highlight ? "text-purple-700" : "text-gray-900"
            }`}
          >
            {tipe}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Tanggal</p>
          <p
            className={`text-sm font-semibold ${
              highlight ? "text-purple-700" : "text-gray-800"
            }`}
          >
            {tanggal}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Durasi</p>
          <p
            className={`text-sm font-semibold ${
              highlight ? "text-purple-700" : "text-gray-800"
            }`}
          >
            {durasi}
          </p>
        </div>
      </div>
    </div>
  );
}