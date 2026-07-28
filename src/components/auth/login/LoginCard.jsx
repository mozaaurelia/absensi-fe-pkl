import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Masuk Akun</h2>
          <span className="bg-blue-50 text-[#1E3A5F] text-xs font-semibold px-3 py-1 rounded-full">
            Secure Login
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Gunakan akun perusahaan untuk mengakses sistem E-Absensi.
        </p>

        <LoginForm />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            Belum punya akun?
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Ajukan registrasi akun melalui Admin HRM perusahaan.
          </p>
        </div>
        <button suppressHydrationWarning className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-[#1E3A5F] hover:bg-gray-50 whitespace-nowrap">
          Register Akun
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 E-Absensi - Sistem Absensi Elektronik Internal
      </p>
    </div>
  );
}