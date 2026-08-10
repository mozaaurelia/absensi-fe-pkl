interface LeaderEntry {
  name: string;
  department: string;
  onTimeRate: number;
}

const leaders: LeaderEntry[] = [
  { name: "Sinta Rahma", department: "Keuangan", onTimeRate: 100 },
  { name: "Budi Santoso", department: "IT", onTimeRate: 98 },
  { name: "Maya Lestari", department: "Operasional", onTimeRate: 96 },
  { name: "Andi Pratama", department: "Operasional", onTimeRate: 94 },
  { name: "Rizky Ramadhan", department: "Marketing", onTimeRate: 92 },
];

export default function DisciplineLeaderboard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900 text-sm">Leaderboard Kedisiplinan</h3>
        <span className="bg-blue-50 text-[#1E3A5F] text-[11px] font-semibold px-2.5 py-1 rounded-full">
          Bulan Ini
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {leaders.map((leader, i) => (
          <div key={leader.name} className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                i === 0
                  ? "bg-blue-100 text-[#1E3A5F]"
                  : i === 1
                  ? "bg-gray-100 text-gray-600"
                  : i === 2
                  ? "bg-blue-100 text-[#1E3A5F]"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              {i + 1}
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A5F] font-bold text-xs flex items-center justify-center shrink-0">
              {leader.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{leader.name}</p>
              <p className="text-[11px] text-gray-400">{leader.department}</p>
            </div>
            <span className="text-sm font-bold text-gray-900 shrink-0">
              {leader.onTimeRate}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}