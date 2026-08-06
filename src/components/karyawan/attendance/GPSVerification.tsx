"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function GPSVerification({ onNext, mode }) {
  const { locale, t } = useLanguage();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${locale}`,
            { headers: { "User-Agent": "MozaPresensi/1.0" } }
          );
          const data = await res.json();
          const fallback = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setAddress(data.display_name || fallback);

          const a = data.address || {};
          const street = a.road || a.pedestrian || a.footway || a.residential || a.path || "";
          const city = a.city || a.town || a.village || a.municipality || a.county || "";
          setShortAddress([street, city].filter(Boolean).join(", ") || fallback);
        } catch {
          const fallback = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setAddress(fallback);
          setShortAddress(fallback);
        }

        setLoading(false);
      },
      () => {
        setError(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleProceed = () => {
    if (location) {
      const d = new Date();
      const key = `lokasi_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      localStorage.setItem(key, JSON.stringify({ ...location, address, shortAddress, mode }));
      if (mode === "in") {
        localStorage.setItem(
          `checkin_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
          String(d.getTime())
        );
      }
      if (mode === "out") {
        localStorage.setItem(
          `checkout_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
          String(d.getTime())
        );
      }
    }
    onNext();
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        <div className={`rounded-xl px-4 py-3 flex items-center gap-2 ${loading ? "bg-gray-50 dark:bg-gray-700/50" : "bg-green-50 dark:bg-green-500/10"}`}>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loading ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300" : "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 19h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <div className="text-left">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{t("gpsVerification.gpsSignal")}</p>
            <p className={`text-sm font-bold ${loading ? "text-gray-400" : "text-green-700 dark:text-green-300"}`}>
              {loading ? t("gpsVerification.detecting") : t("gpsVerification.active")}
            </p>
          </div>
        </div>
        <div className={`rounded-xl px-4 py-3 flex items-center gap-2 ${loading ? "bg-gray-50 dark:bg-gray-700/50" : "bg-green-50 dark:bg-green-500/10"}`}>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loading ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300" : "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <div className="text-left">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{t("gpsVerification.geofencing")}</p>
            <p className={`text-sm font-bold ${loading ? "text-gray-400" : "text-green-700 dark:text-green-300"}`}>
              {loading ? "..." : t("gpsVerification.active")}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full h-56 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 flex items-center justify-center mb-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1E3A5F] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">{t("gpsVerification.gettingLocation")}...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full h-56 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/30 flex items-center justify-center mb-6">
          <p className="text-sm text-red-500 dark:text-red-300">{t("gpsVerification.locationError")}</p>
        </div>
      ) : location ? (
        <div className="w-full h-56 rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm relative">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
            className="w-full h-full border-0"
            title={t("gpsVerification.mapTitle")}
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-100 shadow-sm flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#1E3A5F]">
              <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            {shortAddress}
          </div>
        </div>
      ) : null}

      {address && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-xs leading-relaxed line-clamp-2">
          {address}
        </p>
      )}

      {!loading && !error && (
        <>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">{t("gpsVerification.title")}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
            {t("gpsVerification.desc")}
          </p>

          <button
            onClick={handleProceed}
            className="w-full bg-linear-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 7l1.5-3h5L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="13.5" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            {t("gpsVerification.start")}
          </button>        </>
      )}
    </div>
  );
}