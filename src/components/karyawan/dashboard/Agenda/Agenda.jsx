import { FiCalendar, FiSun, FiBell, FiSend } from "react-icons/fi";

export default function Agenda() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover opacity-0 animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <FiCalendar size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Agenda & Cuti</h3>
          <p className="text-xs text-gray-400">Jadwal kerja dan informasi izin terbaru.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100/60 rounded-xl px-4 py-4 opacity-0 animate-fade-slide-in" style={{ animationDelay: "0.2s" }}>
          <div className="w-8 h-8 rounded-lg bg-green-200 text-green-700 flex items-center justify-center mb-2">
            <FiSun size={16} />
          </div>
          <p className="text-xs text-green-700 font-semibold mb-0.5">Shift Aktif</p>
          <p className="text-sm font-bold text-green-800">09:00 - 18:00</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-xl px-4 py-4 opacity-0 animate-fade-slide-in" style={{ animationDelay: "0.25s" }}>
          <div className="w-8 h-8 rounded-lg bg-blue-200 text-blue-700 flex items-center justify-center mb-2">
            <FiCalendar size={16} />
          </div>
          <p className="text-xs text-[#1E3A5F] font-semibold mb-0.5">Sisa Cuti</p>
          <p className="text-sm font-bold text-[#1E3A5F]">12 hari</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-xl px-4 py-4 mb-5 opacity-0 animate-fade-slide-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <FiBell size={16} />
          </div>
          <div>
            <p className="text-xs text-amber-700 font-semibold mb-1">Reminder</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Jangan lupa clock-in sebelum pukul 09:00 dan pastikan GPS aktif.
            </p>
          </div>
        </div>
      </div>

      <button className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#16304f] transition-all active:scale-95 flex items-center justify-center gap-2">
        <FiSend size={15} />
        Ajukan Izin / Cuti
      </button>
    </div>
  );
}
