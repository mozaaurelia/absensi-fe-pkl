"use client";

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import CheckInButton from "./CheckInButton";
import CheckOutButton from "./CheckOutButton";
import VerificationStepper from "./VerificationStepper";

function isWithinHours() {
  const h = new Date().getHours();
  return h >= 7 && h < 17;
}

function getTodayKey() {
  const d = new Date();
  return `lokasi_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getTodayStatus() {
  if (typeof window === "undefined") return { hasCheckedIn: false, hasCheckedOut: false };
  try {
    const raw = localStorage.getItem(getTodayKey());
    const data = raw ? JSON.parse(raw) : null;
    const mode = data?.mode;
    return {
      hasCheckedIn: mode === "in" || mode === "out",
      hasCheckedOut: mode === "out",
    };
  } catch {
    return { hasCheckedIn: false, hasCheckedOut: false };
  }
}

export default function AttendanceAction({
  hasCheckedIn: hasCheckedInProp = false,
  hasCheckedOut: hasCheckedOutProp = false,
}) {
  const [mode, setMode] = useState(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [status, setStatus] = useState(getTodayStatus);
  const { t } = useLanguage();

  useEffect(() => {
    setStatus(getTodayStatus());
  }, []);

  const hasCheckedIn = hasCheckedInProp || status.hasCheckedIn;
  const hasCheckedOut = hasCheckedOutProp || status.hasCheckedOut;

  const handleClick = (type) => {
    if (!isWithinHours()) {
      setShowTimeWarning(true);
      return;
    }
    setMode(type);
  };

  const handleClose = () => {
    setMode(null);
    setStatus(getTodayStatus());
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t("attendanceAction.title")}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-400 mb-8">
          {t("attendanceAction.desc")}
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
        <VerificationStepper mode={mode} onClose={handleClose} />
      )}

      {showTimeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
              <FiClock size={30} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t("attendanceAction.outsideTitle")}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              {t("attendanceAction.outsideDesc")}
            </p>
            <button
              onClick={() => setShowTimeWarning(false)}
              className="w-full bg-linear-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}