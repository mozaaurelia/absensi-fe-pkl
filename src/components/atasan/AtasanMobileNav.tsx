"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clearAccessToken } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const menus = [
  { key: "dashboard", labelKey: "atasan.title", href: "/atasan" },
  { key: "attendance", labelKey: "atasan.teamAttendance", href: "/atasan/attendance" },
  { key: "leave", labelKey: "atasan.teamLeave", href: "/atasan/leave" },
  { key: "overtime", labelKey: "atasan.teamOvertime", href: "/atasan/overtime" },
];

export function AtasanMobileHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="w-full md:hidden sticky top-0 z-40 bg-[#1E3A5F] pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label={t("common.menu")}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-lg text-blue-100 hover:bg-white/10 transition-colors"
          >
            <MenuIcon />
          </button>
          <div className="text-center min-w-0">
            <p className="text-white font-bold text-sm leading-tight">E-Absensi</p>
            <p className="text-blue-200/70 text-[10px] leading-tight truncate">{t("common.tagline")}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">S</span>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button
            aria-label={t("common.close")}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] bg-[#1E3A5F] h-full flex flex-col px-3 py-6 overflow-y-auto animate-drawer-in">
            <div className="flex items-center justify-between px-2 mb-8">
              <div>
                <p className="text-white font-bold text-base">E-Absensi</p>
                <p className="text-blue-200/70 text-xs mt-0.5">{t("common.tagline")}</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label={t("common.close")}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-blue-100 hover:bg-white/10 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1" aria-label={t("atasan.title")}>
              {menus.map((menu) => {
                const active = menu.key === "dashboard" ? pathname === "/atasan" : pathname.startsWith(menu.href);
                return (
                  <Link
                    key={menu.key}
                    href={menu.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active ? "bg-white/10 text-white" : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="mr-3 flex items-center"><SectionIcon type={menu.key} /></span>
                    {t(menu.labelKey)}
                  </Link>
                );
              })}
            </nav>

            <MobileFooter />
          </aside>
        </div>
      )}
    </>
  );
}

function MobileFooter() {
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-white/10">
      <button onClick={toggleTheme} className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-blue-100/80 hover:bg-white/10 hover:text-white transition-colors">
        <span className="mr-3 flex items-center">{isDark ? <SunIcon /> : <MoonIcon />}</span>
        {isDark ? t("common.lightMode") : t("common.darkMode")}
      </button>
      <button
        onClick={() => {
          clearAccessToken();
          signOut({ callbackUrl: "/auth/login" });
        }}
        className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-colors"
      >
        <span className="mr-3 flex items-center"><LogoutIcon /></span>
        {t("common.logout")}
      </button>
    </div>
  );
}

function MenuIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
}

function CloseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

function SectionIcon({ type }: { type: string }) {
  if (type === "chat") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.5-.8L4 20l1.2-3.7A7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
  if (type === "leave") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d={type === "dashboard" ? "M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z" : "M12 7v5l3 3"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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