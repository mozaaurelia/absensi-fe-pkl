interface Props {
  label: string;
  value: string;
  note?: string;
  noteColor?: string;
}

export default function AgendaSummaryCard({ label, value, note, noteColor }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <p className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">{value}</p>
      {note && <p className={`text-xs font-semibold ${noteColor || "text-gray-400"}`}>{note}</p>}
    </div>
  );
}
