export default function Features() {
  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      iconBg: "bg-green-100 text-green-700",
      title: "Clock In / Out",
      desc: "Presensi masuk dan pulang dengan validasi GPS dan perangkat.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 20l1.4-4.9a8 8 0 1 1 3.5 3.5L4 20z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBg: "bg-blue-100 text-blue-700",
      title: "Izin, Cuti & Lembur",
      desc: "Pengajuan terstruktur dengan status pending, disetujui, atau ditolak.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-amber-100 text-amber-700",
      title: "Approval Supervisor",
      desc: "Atasan dapat melihat pengajuan tim dan mengambil keputusan cepat.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      iconBg: "bg-indigo-100 text-indigo-700",
      title: "Rekap & Payroll",
      desc: "Data presensi siap dipakai untuk laporan bulanan dan penggajian.",
    },
  ];

  return (
    <section id="fitur" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs font-bold text-[#1E3A5F] tracking-wide uppercase mb-3">
            Fitur Utama
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Semua kebutuhan presensi internal dalam satu dashboard.
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            E-Absensi dibuat untuk mengurangi pekerjaan manual HR, mempercepat
            approval atasan, dan memberi transparansi data kepada karyawan.
          </p>
          <a
            href="#alur"
            className="inline-block bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#16304f] transition-colors"
          >
            Pelajari Fitur
          </a>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-50 rounded-2xl p-6 border border-gray-100"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}