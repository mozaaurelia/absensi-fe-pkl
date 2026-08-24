"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "@/lib/api";
import {
  getOnboardingInfo,
  acceptOnboarding,
  type OnboardingInfo,
} from "@/lib/services/onboarding";

interface Props {
  token: string;
}

export default function OnboardingCard({ token }: Props) {
  const [info, setInfo] = useState<OnboardingInfo | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "invalid" | "ready">("loading");
  const [invalidMessage, setInvalidMessage] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalidMessage("Link undangan tidak ditemukan.");
      setLoadState("invalid");
      return;
    }
    let active = true;
    getOnboardingInfo(token)
      .then((data) => {
        if (!active) return;
        if (data.already_onboarded) {
          setInvalidMessage("Undangan ini sudah pernah digunakan. Silakan login.");
          setLoadState("invalid");
          return;
        }
        setInfo(data);
        setLoadState("ready");
      })
      .catch((err) => {
        if (!active) return;
        setInvalidMessage(
          err instanceof ApiError ? err.message : "Link undangan tidak valid atau kedaluwarsa.",
        );
        setLoadState("invalid");
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setSubmitting(true);
    try {
      await acceptOnboarding({ token, name: name.trim(), password });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Akun Berhasil Dibuat</h2>
          <p className="text-sm text-gray-500 mb-6">
            Akun admin Anda sudah aktif. Silakan login untuk mulai mengelola perusahaan.
          </p>
          <a
            href="/auth/login"
            className="block w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#16304f] transition-colors"
          >
            Masuk Sekarang
          </a>
        </div>
      </div>
    );
  }

  if (loadState === "loading") {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="h-6 w-48 mx-auto bg-gray-100 rounded animate-pulse mb-4" />
          <div className="h-10 w-full bg-gray-50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (loadState === "invalid") {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Undangan Tidak Valid</h2>
          <p className="text-sm text-gray-500 mb-6">{invalidMessage}</p>
          <a
            href="/auth/login"
            className="block w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#16304f] transition-colors"
          >
            Ke Halaman Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <span className="inline-block bg-blue-50 text-[#1E3A5F] text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {info?.company_name}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Akun Admin</h2>
        <p className="text-sm text-gray-500 mb-6">
          Anda didaftarkan sebagai admin perusahaan dengan email{" "}
          <span className="font-semibold text-gray-700">{info?.email}</span>. Buat akun Anda di bawah ini.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password"
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Buat Akun Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
