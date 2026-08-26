"use client";

import { useEffect, useState } from "react";
import useTypewriter from "@/hooks/useTypewriter";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/common/LanguageToggle";
import Notification from "@/components/karyawan/notification/Notification";

export default function AtasanHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const [now, setNow] = useState<Date | null>(null);
  const { locale, t } = useLanguage();

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const fullGreeting = now
    ? (() => {
        const hour = now.getHours();
        const greetings = t("dashboardHeader.greetings");
        const greeting = hour < 11 ? greetings[0] : hour < 14 ? greetings[1] : hour < 18 ? greetings[2] : greetings[3];
        return `${greeting}, ${user?.name?.split(" ")[0] || t("dashboardHeader.user")}!`;
      })()
    : "";
  const typedGreeting = useTypewriter(fullGreeting, 80);

  if (!now) return null;

  const time = now.toLocaleTimeString(locale, { hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-linear-to-r from-[#1E3A5F] to-[#2a4f7a] rounded-2xl px-4 md:px-8 py-4 md:py-6 text-white shadow-lg mb-5 md:mb-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
            {typedGreeting}
            {typedGreeting.length < fullGreeting.length && <span className="animate-pulse ml-0.5 font-light">|</span>}
          </h1>
          <p className="text-blue-200/90 text-sm truncate">{date}</p>
          <p className="text-blue-200/70 text-xs mt-2 truncate">{t("atasan.subtitle")}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-semibold tabular-nums tracking-wider">{time}</span>
            <span className="text-blue-200/60 text-xs">{t("dashboardHeader.timezone")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <LanguageToggle />
          <Notification />
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 text-white font-bold text-sm flex items-center justify-center overflow-hidden ring-2 ring-white/30">
            {user?.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user?.name ? user.name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2) : "SP"}
          </div>
        </div>
      </div>
    </div>
  );
}
