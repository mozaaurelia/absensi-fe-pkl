"use client";

import { useEffect, useState } from "react";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("exiting");

      setTimeout(() => {
        onFinish();
      }, 1400);
    }, 2700);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <>
      <div
        className={`splash-container fixed inset-0 z-[9999] flex items-center justify-center bg-[#233F73] ${
          phase === "exiting" ? "splash-exit" : ""
        }`}
      >
        {/* Background Blur Circle */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-3xl" />

        {/* Content */}
        <div
          className={`relative flex flex-col items-center ${
            phase === "exiting" ? "content-fade" : ""
          }`}
        >
          {/* Logo */}
          <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-pulse">
            <span className="text-4xl font-bold text-white tracking-widest">
              EA
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-8 text-5xl font-bold tracking-wide text-white">
            E-Absensi
          </h1>
          <p className="mt-3 text-blue-100 text-lg">
            Sistem Absensi Elektronik
          </p>

          {/* Loading */}
          <div className="mt-12 w-64 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="loading-bar h-full rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-bar {
          width: 0%;
          background: white;
          animation: loading 2.4s linear forwards;
        }

        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }

        .splash-exit {
          will-change: clip-path, transform;
          animation: circularSlideUp 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes circularSlideUp {
          0% {
            clip-path: circle(150% at 50% 50%);
            transform: translateY(0);
          }
          40% {
            clip-path: circle(80% at 50% 40%);
            transform: translateY(-5%);
          }
          100% {
            clip-path: circle(0% at 50% -10%);
            transform: translateY(-15%);
          }
        }

        .content-fade {
          will-change: transform, opacity;
          animation: fadeContent 0.6s ease-out forwards;
        }

        @keyframes fadeContent {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
        }
      `}</style>
    </>
  );
}