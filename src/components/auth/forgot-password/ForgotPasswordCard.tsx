"use client";

import { useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotPasswordSuccess from "./ForgotPasswordSuccess";

export default function ForgotPasswordCard() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {!sentTo ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Kata Sandi</h2>
            <p className="text-sm text-gray-500 mb-6">
              Masukkan email atau nomor induk karyawan Anda, kami akan
              mengirimkan link untuk membuat kata sandi baru.
            </p>
            <ForgotPasswordForm onSuccess={setSentTo} />
          </>
        ) : (
          <ForgotPasswordSuccess email={sentTo} onResend={() => setSentTo(sentTo)} />
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 E-Absensi - Sistem Absensi Elektronik Internal
      </p>
    </div>
  );
}