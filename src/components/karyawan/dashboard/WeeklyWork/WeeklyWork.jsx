import { FiBarChart2, FiTarget } from "react-icons/fi";

export default function WeeklyWork() {
  const days = [
    { label: "Sen", value: 65 },
    { label: "Sel", value: 55 },
    { label: "Rab", value: 90 },
    { label: "Kam", value: 25 },
    { label: "Jum", value: 70 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <FiBarChart2 size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Jam Kerja Mingguan</h3>
          <p className="text-xs text-gray-400">Target mingguan: 40 jam kerja.</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FiTarget size={13} />
          Progress Minggu Ini
        </div>
        <p className="text-xs font-bold text-[#1E3A5F]">80%</p>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1E3A5F] to-blue-500 rounded-full transition-all duration-1000"
          style={{ width: "80%" }}
        />
      </div>

      <div className="flex items-end justify-between gap-3 h-32">
        {days.map((day, i) => (
          <div key={day.label} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full bg-gray-50 rounded-lg flex items-end h-24 overflow-hidden">
              <div
                className="w-full rounded-lg animate-bar-grow opacity-0"
                style={{
                  height: `${day.value}%`,
                  animationDelay: `${0.3 + i * 0.1}s`,
                  background: `linear-gradient(to top, #1E3A5F, ${day.value > 70 ? "#3b82f6" : day.value > 40 ? "#60a5fa" : "#93c5fd"})`,
                }}
              />
            </div>
            <span className="text-xs text-gray-400">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
