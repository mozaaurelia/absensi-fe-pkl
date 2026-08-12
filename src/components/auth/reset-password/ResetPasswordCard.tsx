"use client";

import { useState } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordSuccess from "./ResetPasswordSuccess";

interface ResetPasswordCardProps {
  token: string;
}

export default function ResetPasswordCard({ token }: ResetPasswordCardProps) {
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Link Tidak Valid</h2>
          <p className="text-sm text-gray-500 mb-6">
            Link reset password tidak ditemukan atau sudah kedaluwarsa.
          </p>
          
          <a href="/auth/forgot-password"
            className="block w-full bg-[#1E3A5F] text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-[#16304f] transition-colors"
          >
            Minta Link Baru
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {!done ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Kata Sandi Baru</h2>
            <p className="text-sm text-gray-500 mb-6">
              Kata sandi baru harus berbeda dari kata sandi yang pernah
              digunakan sebelumnya.
            </p>
            <ResetPasswordForm token={token} onSuccess={() => setDone(true)} />
          </>
        ) : (
          <ResetPasswordSuccess />
        )}
      </div>
    </div>
  );
}