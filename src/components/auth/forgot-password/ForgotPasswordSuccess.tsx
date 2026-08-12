interface ForgotPasswordSuccessProps {
  email: string;
  onResend: () => void;
}

export default function ForgotPasswordSuccess({ email, onResend }: ForgotPasswordSuccessProps) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" stroke="#1E3A5F" strokeWidth="2" />
          <path d="M4 7l8 6 8-6" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="font-bold text-gray-900 text-lg mb-2">Periksa Email Anda</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-1">
        Kami telah mengirim link reset password ke
      </p>
      <p className="text-sm font-semibold text-gray-800 mb-6">{email}</p>

      <p className="text-xs text-gray-400 mb-6">
        Tidak menerima email? Periksa folder spam, atau tunggu beberapa saat
        lalu coba kirim ulang.
      </p>

      <button
        onClick={onResend}
        className="w-full border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-lg hover:bg-gray-50 transition-colors mb-4"
      >
        Kirim Ulang Email
      </button>

      
      <a href="/auth/login"
        className="block text-center text-sm font-semibold text-[#1E3A5F] hover:underline"
      >
        Kembali ke Halaman Masuk
      </a>
    </div>
  );
}