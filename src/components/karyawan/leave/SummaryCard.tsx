import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  note: string;
  noteColor: string;
  icon?: ReactNode;
  iconBox?: string;
}

export default function SummaryCard({
  label,
  value,
  note,
  noteColor,
  icon,
  iconBox = "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBox}`}>
          {icon}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-snug">{label}</p>
      </div>
      <p className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-1">{value}</p>
      <p className={`text-xs font-semibold ${noteColor}`}>{note}</p>
    </div>
  );
}