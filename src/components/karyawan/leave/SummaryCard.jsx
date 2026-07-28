export default function SummaryCard({ label, value, note, noteColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <p className="font-bold text-gray-900 text-lg mb-2">{value}</p>
      <p className={`text-xs font-semibold ${noteColor}`}>{note}</p>
    </div>
  );
}