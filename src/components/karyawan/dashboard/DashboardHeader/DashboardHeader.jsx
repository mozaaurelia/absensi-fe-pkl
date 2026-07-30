"use client";

import { useEffect, useState } from "react";
import useTypewriter from "@/hooks/useTypewriter";

const greetings = {
  id: ["Selamat Pagi", "Selamat Siang", "Selamat Sore", "Selamat Malam"],
  en: ["Good Morning", "Good Afternoon", "Good Evening", "Good Night"],
};

const userLabel = { id: "Pengguna", en: "User" };
const timezoneLabel = { id: "WIB", en: "WIB" };

export default function DashboardHeader({ user }) {
  const [now, setNow] = useState(null);
  const [lang, setLang] = useState("id");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "id") setLang(saved);
  }, []);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLang = () => {
    const next = lang === "id" ? "en" : "id";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const fullGreeting = now
    ? (() => {
        const hour = now.getHours();
        const gs = greetings[lang];
        const g =
          hour < 11 ? gs[0] : hour < 14 ? gs[1] : hour < 18 ? gs[2] : gs[3];
        const name = user?.nama?.split(" ")[0] || userLabel[lang];
        return `${g}, ${name}! 👋`;
      })()
    : "";

  const typedGreeting = useTypewriter(fullGreeting, 80);

  if (!now) return null;

  const timeStr = now.toLocaleTimeString(lang === "id" ? "id-ID" : "en-US", { hour12: false });
  const dateStr = now.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2a4f7a] rounded-2xl px-8 py-6 text-white shadow-lg mb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">
            {typedGreeting}
            {typedGreeting.length < fullGreeting.length && (
              <span className="animate-pulse ml-0.5 font-light">|</span>
            )}
          </h1>
          <p className="text-blue-200/90 text-sm">{dateStr}</p>
          <div className="flex items-center gap-2 mt-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-200/80">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            <span className="text-lg font-semibold tabular-nums tracking-wider">
              {timeStr}
            </span>
            <span className="text-blue-200/60 text-xs ml-1">{timezoneLabel[lang]}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="relative w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
            aria-label="Ganti Bahasa"
            title={lang === "id" ? "English" : "Indonesia"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15.5 15.5 0 0 1 0 18 15.5 15.5 0 0 1 0-18" />
            </svg>
            <span className="absolute -bottom-0.5 right-0.5 text-[9px] font-bold bg-white/20 rounded px-0.5 leading-tight">
              {lang === "id" ? "ID" : "EN"}
            </span>
          </button>
          <button
            className="relative w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
            aria-label="Notifikasi"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#1E3A5F]" />
          </button>
          <div className="w-11 h-11 rounded-full bg-white/20 text-white font-bold text-sm flex items-center justify-center overflow-hidden ring-2 ring-white/30">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.initials || (user?.nama ? user.nama.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "AP")
            )}
          </div>
        </div>
      </div>
    </div>
  );
}