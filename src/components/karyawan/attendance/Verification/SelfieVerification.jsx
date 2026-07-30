"use client";

import { useEffect, useRef, useState } from "react";

export default function SelfieVerification({ onNext }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setReady(true);
        }
      } catch (err) {
        setError(true);
      }
    }
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setImageData(canvas.toDataURL("image/png"));
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setCaptured(true);
  };

  const handleRetake = async () => {
    setCaptured(false);
    setImageData(null);
    setReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setReady(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-56 h-56 rounded-full overflow-hidden bg-gray-900 mb-6 border-4 border-white shadow-lg">
        {!error ? (
          captured && imageData ? (
            <img
              src={imageData}
              alt="Selfie"
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs px-6 text-center">
            Kamera tidak tersedia. Periksa izin akses kamera browser.
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {captured ? (
        <>
          <h3 className="font-bold text-green-600 text-lg mb-2">Foto Berhasil!</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
            Pastikan wajah Anda terlihat jelas. Jika kurang jelas, ambil ulang.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={handleRetake}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold text-sm py-3.5 rounded-xl hover:bg-gray-200 transition-all"
            >
              Ulangi
            </button>
            <button
              onClick={() => {
                if (imageData) {
                  const d = new Date();
                  const key = `selfie_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
                  localStorage.setItem(key, imageData);
                }
                onNext();
              }}
              className="flex-1 bg-gradient-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-blue-900/20"
            >
              Lanjutkan
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Siap Selfie?</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
            Posisikan wajah Anda di dalam lingkaran. Pastikan cahaya cukup terang.
          </p>
          <button
            onClick={handleCapture}
            disabled={!ready}
            className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M4 8a2 2 0 0 1 2-2h1l1-1.5h8L17 6h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            Ambil Foto Sekarang
          </button>
        </>
      )}
    </div>
  );
}