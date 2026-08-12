"use client";

import { useState } from "react";

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Lemah", color: "bg-red-400" },
    { label: "Cukup", color: "bg-orange-400" },
    { label: "Baik", color: "bg-amber-400" },
    { label: "Kuat", color: "bg-green-500" },
  ];
  const idx = Math.min(score, levels.length - 1);
  return { ...levels[idx], percent: ((idx + 1) / levels.length) * 100 };
}

export default function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      // TODO: panggil API reset-password, kirim { token, password }
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSuccess();
    } catch {
      setError("Link reset sudah kedaluwarsa. Silakan minta link baru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Kata Sandi Baru
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 8 karakter"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
        />
        {password && (
          <div className="mt-2">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">Kekuatan sandi: {strength.label}</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Konfirmasi Kata Sandi Baru
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Ulangi kata sandi baru"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
        />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
      </button>
    </form>
  );
}