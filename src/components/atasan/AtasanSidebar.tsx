"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clearAccessToken } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const menus = [
  { key: "dashboard", labelKey: "atasan.title", href: "/atasan", icon: DashboardIcon },
  { key: "attendance", labelKey: "atasan.teamAttendance", href: "/atasan/attendance", icon: AttendanceIcon },
  { key: "leave", labelKey: "atasan.teamLeave", href: "/atasan/leave", icon: LeaveIcon },
  { key: "overtime", labelKey: "atasan.teamOvertime", href: "/atasan/overtime", icon: OvertimeIcon },
];

export default function AtasanSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(true);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 250);
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`hidden md:flex md:flex-col bg-[#1E3A5F] h-screen px-3 py-6 shrink-0 overflow-y-auto sticky top-0 transition-[width] duration-300 ease-in-out ${
        open ? "w-64" : "w-17"
      }`}
    >
      <div className={`flex items-center mb-8 ${open ? "px-2 justify-between" : "justify-center"}`}>
        <div className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${open ? "opacity-100 max-w-45" : "opacity-0 max-w-0"}`}>
          <p className="text-white font-bold text-base">E-Absensi</p>
          <p className="text-blue-200/70 text-xs mt-0.5">{t("common.tagline")}</p>
        </div>
        <MenuIcon />
      </div>

      <nav className="flex flex-col gap-1 flex-1" aria-label={t("atasan.title")}>
        {menus.map((menu) => {
          const active = menu.key === "dashboard" ? pathname === "/atasan" : pathname.startsWith(menu.href);
          const Icon = menu.icon;
          return (
            <Link
              key={menu.key}
              href={menu.href}
              title={!open ? t(menu.labelKey) : undefined}
              className={`flex items-center py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                active ? "bg-white/10 text-white" : "text-blue-100/80 hover:bg-white/10 hover:text-white"
              } ${open ? "px-3 gap-3" : "pl-3.25 gap-0"}`}
            >
              <Icon />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${open ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}>
                {t(menu.labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-white/10">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? t("common.lightMode") : t("common.darkMode")}
          title={!open ? (isDark ? t("common.lightMode") : t("common.darkMode")) : undefined}
          className={`flex items-center py-2.5 rounded-lg text-sm font-medium text-blue-100/80 hover:bg-white/10 hover:text-white transition-all duration-300 ease-in-out ${open ? "px-3 gap-3" : "pl-3.25 gap-0"}`}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${open ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}>
            {isDark ? t("common.lightMode") : t("common.darkMode")}
          </span>
        </button>
        <button
          onClick={() => {
            clearAccessToken();
            signOut({ callbackUrl: "/auth/login" });
          }}
          title={!open ? t("common.logout") : undefined}
          className={`flex items-center py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all duration-300 ease-in-out ${open ? "px-3 gap-3" : "pl-3.25 gap-0"}`}
        >
          <LogoutIcon />
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${open ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}>
            {t("common.logout")}
          </span>
        </button>
      </div>
    </aside>
  );
}

function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-200/80 shrink-0"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
}

function DashboardIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" /><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" /><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" /><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" /></svg>;
}

function AttendanceIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function LeaveIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function OvertimeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function MoonIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
}

function SunIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function LogoutIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}