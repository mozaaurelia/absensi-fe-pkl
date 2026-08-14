"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotPasswordSuccess from "./ForgotPasswordSuccess";

export default function ForgotPasswordCard() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    if (!sentTo || resending) return;
    setResending(true);
    setResendError("");
    try {
      await apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: sentTo }),
      });
    } catch {
      setResendError("Gagal mengirim ulang link reset. Silakan coba lagi.");
    } finally {
      setResending(false);
    }
  };

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
          <ForgotPasswordSuccess
            email={sentTo}
            resending={resending}
            resendError={resendError}
            onResend={handleResend}
          />
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 E-Absensi - Sistem Absensi Elektronik Internal
      </p>
    </div>
  );
}