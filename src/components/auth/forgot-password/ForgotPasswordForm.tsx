"use client";

import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      onSuccess(email);
    } catch (err: any) {
      const message =
        err?.code === "EMAIL_REQUIRED"
          ? "Email wajib diisi."
          : err?.message || "Gagal mengirim link reset. Silakan coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Email / Nomor Induk Karyawan
        </label>
        <input
          type="text"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contoh: andi.pratama@company.co.id"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
        />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
      >
        {loading ? "Mengirim..." : "Kirim Link Reset Password"}
      </button>

      <a
        href="/auth/login"
        className="block text-center text-sm font-semibold text-[#1E3A5F] hover:underline mt-5"
      >
        Kembali ke Halaman Masuk
      </a>
    </form>
  );
}