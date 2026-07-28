export default function WeeklyWork() {
  const days = [
    { label: "Sen", value: 65 },
    { label: "Sel", value: 55 },
    { label: "Rab", value: 90 },
    { label: "Kam", value: 25 },
    { label: "Jum", value: 70 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-1">Jam Kerja Mingguan</h3>
      <p className="text-xs text-gray-400 mb-5">Target mingguan: 40 jam kerja.</p>

      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">Progress Minggu Ini</p>
        <p className="text-xs font-bold text-[#1E3A5F]">80%</p>
      </div>
      <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-[#1E3A5F] rounded-full" style={{ width: "80%" }} />
      </div>

      <div className="flex items-end justify-between gap-3 h-32">
        {days.map((day) => (
          <div key={day.label} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full bg-gray-100 rounded-md flex items-end h-24 overflow-hidden">
              <div
                className="w-full bg-blue-300 rounded-md"
                style={{ height: `${day.value}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}