"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AvatarUpload({ initials = "AD", onImageChange }) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(s);
      setMode("camera");
    } catch {
      alert(t("avatarUpload.cameraError"));
    }
  }, [t]);

  useEffect(() => {
    if (mode === "camera" && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [mode, stream]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setCaptured(dataUrl);
  };

  const retakePhoto = () => {
    setCaptured(null);
  };

  const confirmPhoto = () => {
    if (captured) {
      setPreview(captured);
      setCaptured(null);
      setMode(null);
      stopStream();
      if (onImageChange) onImageChange(captured);
    }
    setShowModal(false);
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      if (onImageChange) onImageChange(dataUrl);
    };
    reader.readAsDataURL(file);
    setShowModal(false);
    e.target.value = "";
  };

  const openModal = () => {
    setMode(null);
    setCaptured(null);
    stopStream();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMode(null);
    setCaptured(null);
    stopStream();
  };

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div
          onClick={openModal}
          className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 font-bold text-xl flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-300 transition-all"
        >
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <button
          type="button"
          onClick={openModal}
          className="border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {preview ? t("avatarUpload.change") : t("avatarUpload.upload")}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {!mode && (
              <>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                  {t("avatarUpload.modalTitle")}
                </h3>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={chooseFile}
                    className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16l4-4 4 4m0 0l4-4 4 4M7 16V4m0 0L3 8m4-4l4 4" />
                    </svg>
                    {t("avatarUpload.fromFile")}
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4-4m0 0l-4-4m4 4H9a5 5 0 00-5 5v4a5 5 0 005 5h6a5 5 0 005-5v-4" />
                    </svg>
                    {t("avatarUpload.takePhoto")}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full mt-4 text-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-2"
                >
                  {t("avatarUpload.cancel")}
                </button>
              </>
            )}

            {mode === "camera" && !captured && (
              <>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
                  {t("avatarUpload.cameraTitle")}
                </h3>
                <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t("avatarUpload.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 bg-orange-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
                  >
                    {t("avatarUpload.capture")}
                  </button>
                </div>
              </>
            )}

            {mode === "camera" && captured && (
              <>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
                  {t("avatarUpload.resultTitle")}
                </h3>
                <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                  <img src={captured} alt="Hasil jepretan" className="w-full h-64 object-cover" />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t("avatarUpload.retake")}
                  </button>
                  <button
                    type="button"
                    onClick={confirmPhoto}
                    className="flex-1 bg-orange-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
                  >
                    {t("avatarUpload.use")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
