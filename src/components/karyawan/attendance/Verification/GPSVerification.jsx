"use client";

import { useState, useEffect } from "react";

export default function GPSVerification({ onNext }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
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
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
            { headers: { "User-Agent": "MozaPresensi/1.0" } }
          );
          const data = await res.json();
          setAddress(data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } catch {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
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
      localStorage.setItem(key, JSON.stringify({ ...location, address }));
    }
    onNext();
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        <div className={`rounded-xl px-4 py-3 flex items-center gap-2 ${loading ? "bg-gray-50" : "bg-green-50"}`}>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loading ? "bg-gray-100 text-gray-400" : "bg-green-100 text-green-600"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 19h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <div className="text-left">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Sinyal GPS</p>
            <p className={`text-sm font-bold ${loading ? "text-gray-400" : "text-green-700"}`}>
              {loading ? "Mendeteksi..." : "Aktif"}
            </p>
          </div>
        </div>
        <div className={`rounded-xl px-4 py-3 flex items-center gap-2 ${loading ? "bg-gray-50" : "bg-green-50"}`}>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loading ? "bg-gray-100 text-gray-400" : "bg-green-100 text-green-600"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <div className="text-left">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Geofencing</p>
            <p className={`text-sm font-bold ${loading ? "text-gray-400" : "text-green-700"}`}>
              {loading ? "..." : "Aktif"}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full h-56 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1E3A5F] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Mendapatkan lokasi Anda...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full h-56 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
          <p className="text-sm text-red-500">Gagal mendapatkan lokasi. Periksa izin GPS.</p>
        </div>
      ) : location ? (
        <div className="w-full h-56 rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm relative">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
            className="w-full h-full border-0"
            title="Lokasi Anda"
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#1E3A5F]">
              <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </div>
        </div>
      ) : null}

      {address && (
        <p className="text-xs text-gray-500 mb-4 max-w-xs leading-relaxed line-clamp-2">
          {address}
        </p>
      )}

      {!loading && !error && (
        <>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Lokasi Pas!</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
            Area Anda terdeteksi. Silakan mulai pengambilan foto biometrik.
          </p>

          <button
            onClick={handleProceed}
            className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 7l1.5-3h5L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="13.5" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            Mulai Verifikasi
          </button>
        </>
      )}
    </div>
  );
}