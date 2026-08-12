import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  note: string;
  noteColor: string;
  icon?: ReactNode;
}

export default function SummaryCard({ label, value, note, noteColor, icon }: Props) {
  return (
    <div className="bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a] rounded-2xl border border-white/10 p-5 shadow-lg">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-blue-200/80">{label}</p>
        {icon && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
            {icon}
          </span>
        )}
      </div>
      <p className="font-bold text-white text-lg mb-2">{value}</p>
      <p className={`text-xs font-semibold ${noteColor}`}>{note}</p>
    </div>
  );
}