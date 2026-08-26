import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  note?: string;
  noteColor?: string;
  icon?: ReactNode;
  iconBox?: string;
}

export default function AgendaSummaryCard({
  label,
  value,
  note,
  noteColor,
  icon,
  iconBox = "bg-cyan-50 text-cyan-600",
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBox}`}>
          {icon}
        </div>
        <p className="text-xs text-gray-400 leading-snug">{label}</p>
      </div>
      <p className="font-bold text-gray-900 text-xl mb-1">{value}</p>
      {note && (
        <p className={`text-xs font-semibold ${noteColor || "text-gray-400"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
