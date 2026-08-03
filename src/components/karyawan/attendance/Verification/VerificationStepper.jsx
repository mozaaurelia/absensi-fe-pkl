"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ProgressCircle from "./ProgressCircle";
import GPSVerification from "./GPSVerification";
import SelfieVerification from "./SelfieVerification";
import AttendanceSuccess from "./AttendanceSuccess";

export default function VerificationStepper({ mode = "in", onClose }) {
  const [step, setStep] = useState(1);
  const { t } = useLanguage();

  const title = mode === "in" ? t("verificationStepper.checkIn") : t("verificationStepper.checkOut");

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
              <p className="text-xs text-gray-400">{t("verificationStepper.subtitle")}</p>
            </div>
          </div>
          <span className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l7 3v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V5l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="px-6 pt-5">
          <ProgressCircle step={step} />
        </div>

        <div className="px-6 pb-6 pt-2">
          {step === 1 && <GPSVerification mode={mode} onNext={() => setStep(2)} />}
          {step === 2 && <SelfieVerification onNext={() => setStep(3)} />}
          {step === 3 && (
            <AttendanceSuccess mode={mode} onFinish={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}