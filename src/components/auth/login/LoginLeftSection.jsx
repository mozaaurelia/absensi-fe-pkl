export default function LoginLeftSection() {
  const stats = [
    { value: "150+", label: "Karyawan" },
    { value: "94%", label: "Kehadiran" },
    { value: "24/7", label: "Monitoring" },
  ];

  return (
    <div className="hidden lg:flex w-1/2 bg-[#1E3A5F] flex-col justify-center px-16 py-12">
      <div className="max-w-md">
        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-8">
          <span className="text-white font-bold text-lg">EA</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">E-Absensi</h1>
        <p className="text-blue-200/80 mb-10">Sistem Absensi Elektronik</p>

        <h2 className="text-2xl font-bold text-white leading-snug mb-4">
          Presensi digital untuk karyawan, supervisor, dan HR dalam satu
          platform.
        </h2>
        <p className="text-blue-200/70 text-sm leading-relaxed mb-10">
          Kelola clock-in/out, persetujuan izin, jadwal tim, rekap presensi,
          dan laporan payroll secara aman dan terstruktur.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 rounded-xl px-4 py-3"
            >
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-blue-200/70 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}