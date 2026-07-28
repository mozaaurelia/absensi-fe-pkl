export default function Agenda() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-1">Agenda & Cuti</h3>
      <p className="text-xs text-gray-400 mb-5">
        Jadwal kerja dan informasi izin terbaru.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-green-50 rounded-lg px-4 py-3">
          <p className="text-xs text-green-700 font-semibold mb-1">Shift Aktif</p>
          <p className="text-sm font-bold text-green-800">09:00 - 18:00</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-4 py-3">
          <p className="text-xs text-[#1E3A5F] font-semibold mb-1">Sisa Cuti</p>
          <p className="text-sm font-bold text-[#1E3A5F]">12 hari</p>
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg px-4 py-3 mb-5">
        <p className="text-xs text-amber-700 font-semibold mb-1">Reminder</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Jangan lupa clock-in sebelum pukul 09:00 dan pastikan GPS aktif.
        </p>
      </div>

      <button className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#16304f] transition-colors">
        Ajukan Izin / Cuti
      </button>
    </div>
  );
}