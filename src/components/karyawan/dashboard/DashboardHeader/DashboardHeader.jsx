"use client";

import { useEffect, useState } from "react";
import useTypewriter from "@/hooks/useTypewriter";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle/LanguageToggle";
import Notification from "@/components/karyawan/notification/Notification";

export default function DashboardHeader({ user }) {
  const [now, setNow] = useState(null);
  const { lang, locale, t } = useLanguage();

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const fullGreeting = now
    ? (() => {
        const hour = now.getHours();
        const gs = t("dashboardHeader.greetings");
        const g =
          hour < 11 ? gs[0] : hour < 14 ? gs[1] : hour < 18 ? gs[2] : gs[3];
        const name = user?.nama?.split(" ")[0] || t("dashboardHeader.user");
        return `${g}, ${name}! 👋`;
      })()
    : "";

  const typedGreeting = useTypewriter(fullGreeting, 80);

  if (!now) return null;

  const timeStr = now.toLocaleTimeString(locale, { hour12: false });
  const dateStr = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a] rounded-2xl px-8 py-6 text-white shadow-lg mb-8">
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
            <span className="text-blue-200/60 text-xs ml-1">{t("dashboardHeader.timezone")}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Notification />
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
