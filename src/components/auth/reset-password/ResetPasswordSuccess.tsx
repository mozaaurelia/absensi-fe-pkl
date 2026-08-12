export default function ResetPasswordSuccess() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="font-bold text-gray-900 text-lg mb-2">Kata Sandi Berhasil Diubah</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Silakan masuk kembali menggunakan kata sandi baru Anda.
      </p>

      
       <a href="/auth/login"
        className="block w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#16304f] transition-colors"
      >
        Masuk Sekarang
      </a>
    </div>
  );
}