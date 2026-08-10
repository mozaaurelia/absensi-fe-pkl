interface Props {
  label: string;
  value: string;
  note?: string;
  noteColor?: string;
}

export default function AgendaSummaryCard({ label, value, note, noteColor }: Props) {
  return (
    <div className="bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a] rounded-2xl border border-white/10 p-5 shadow-lg">
      <p className="text-xs text-blue-200/80 mb-2">{label}</p>
      <p className="font-bold text-white text-lg mb-2">{value}</p>
      {note && <p className={`text-xs font-semibold ${noteColor || "text-blue-200/80"}`}>{note}</p>}
    </div>
  );
}
