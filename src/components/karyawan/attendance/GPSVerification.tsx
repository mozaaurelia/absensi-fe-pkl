"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface GPSVerificationProps {
  onNext: (coords: { lat: number; lng: number }) => void;
}

type GpsStatus = "loading" | "success" | "error";

export default function GPSVerification({ onNext }: GPSVerificationProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<GpsStatus>("loading");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const requestLocation = () => {
    setStatus("loading");
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("success");
      },
      () => setStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-56 h-56 rounded-full overflow-hidden bg-gray-900 mb-6 border-4 border-white shadow-lg flex items-center justify-center">
        {status === "loading" && (
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {status === "error" && (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs px-6 text-center">
            {t("gpsVerification.locationError")}
          </div>
        )}
        {status === "success" && (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-green-400">
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </div>

      {status === "success" && (
        <>
          <h3 className="font-bold text-green-600 dark:text-green-400 text-lg mb-2">{t("gpsVerification.success")}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">{t("gpsVerification.successDesc")}</p>
          <button
            onClick={() => coords && onNext(coords)}
            className="w-full bg-linear-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-blue-900/20"
          >
            {t("gpsVerification.continue")}
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">{t("gpsVerification.title")}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">{t("gpsVerification.errorDesc")}</p>
          <button
            onClick={requestLocation}
            className="w-full bg-linear-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-blue-900/20"
          >
            {t("gpsVerification.retry")}
          </button>
        </>
      )}

      {status === "loading" && (
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">{t("gpsVerification.title")}</h3>
      )}
    </div>
  );
}