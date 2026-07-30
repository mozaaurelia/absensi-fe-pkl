"use client";

import { useState } from "react";
import { FiClock } from "react-icons/fi";
import CheckInButton from "./CheckInButton";
import CheckOutButton from "./CheckOutButton";
import VerificationStepper from "../Verification/VerificationStepper";

function isWithinHours() {
  const h = new Date().getHours();
  return h >= 7 && h < 17;
}

export default function AttendanceAction({
  hasCheckedIn = false,
  hasCheckedOut = false,
}) {
  const [mode, setMode] = useState(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const handleClick = (type) => {
    if (!isWithinHours()) {
      setShowTimeWarning(true);
      return;
    }
    setMode(type);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-1">Aksi Presensi</h3>
        <p className="text-xs text-gray-400 mb-8">
          Klik salah satu tombol untuk memulai verifikasi kehadiran.
        </p>

        <div className="flex items-center justify-center gap-14">
          <CheckInButton
            disabled={hasCheckedIn}
            onClick={() => handleClick("in")}
          />
          <CheckOutButton
            disabled={!hasCheckedIn || hasCheckedOut}
            onClick={() => handleClick("out")}
          />
        </div>
      </div>

      {mode && (
        <VerificationStepper mode={mode} onClose={() => setMode(null)} />
      )}

      {showTimeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
              <FiClock size={30} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Di Luar Jam Kerja</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Fitur absensi hanya dapat digunakan pada pukul <strong>07:00 - 17:00</strong>. Silakan kembali pada jam kerja.
            </p>
            <button
              onClick={() => setShowTimeWarning(false)}
              className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}