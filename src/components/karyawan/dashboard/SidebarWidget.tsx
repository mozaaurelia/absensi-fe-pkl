"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { t } = useLanguage();
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

  const menus = [
    { label: t("sidebar.dashboard"), href: "/karyawan", icon: DashboardIcon },
    { label: t("sidebar.clockInOut"), href: "/karyawan/attendance", icon: ClockIcon },
    { label: t("sidebar.history"), href: "/karyawan/history", icon: HistoryIcon },
    { label: t("sidebar.leave"), href: "/karyawan/leave", icon: LeaveIcon },
    { label: t("sidebar.schedule"), href: "/karyawan/schedule", icon: ScheduleIcon },
    { label: t("sidebar.settings"), href: "/karyawan/settings", icon: SettingsIcon },
  ];

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-[#1E3A5F] h-screen flex flex-col px-3 py-6 shrink-0 overflow-y-auto sticky top-0 transition-[width] duration-300 ease-in-out ${
        open ? "w-64" : "w-17"
      }`}
    >
      <div className={`flex items-center mb-8 ${open ? "px-2 justify-between" : "justify-center"}`}>
        <div
          className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
            open ? "opacity-100 max-w-45" : "opacity-0 max-w-0"
          }`}
        >
          <p className="text-white font-bold text-base">E-Absensi</p>
          <p className="text-blue-200/70 text-xs mt-0.5">{t("sidebar.tagline")}</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-200/80 shrink-0">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {menus.map((menu) => {
          const active = pathname === menu.href;
          const Icon = menu.icon;
          return (
            <Link
              key={menu.label}
              href={menu.href}
              className={`flex items-center py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                active
                  ? "bg-white/10 text-white"
                  : "text-blue-100/80 hover:bg-white/10"
              } ${open ? "px-3 gap-3" : "pl-3.25 gap-0"}`}
              title={!open ? menu.label : undefined}
            >
              <Icon />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                  open ? "opacity-100 max-w-40" : "opacity-0 max-w-0"
                }`}
              >
                {menu.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className={`flex items-center py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all duration-300 ease-in-out ${
            open ? "px-3 gap-3" : "pl-3.25 gap-0"
          }`}
          title={!open ? t("sidebar.logout") : undefined}
        >
          <LogoutIcon />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
              open ? "opacity-100 max-w-40" : "opacity-0 max-w-0"
            }`}
          >
            {t("sidebar.logout")}
          </span>
        </button>
      </div>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15a8 8 0 1 0 2-8.5L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
