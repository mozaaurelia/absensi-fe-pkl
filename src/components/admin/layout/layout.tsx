"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const SUPERADMIN_ALLOWED = ["/admin/companies"];

export default function Layout({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const isSuperadmin = session?.user?.role === "superadmin";
  const [menuOpen, setMenuOpen] = useState(false);

  const blockedForSuperadmin = isSuperadmin && !SUPERADMIN_ALLOWED.includes(pathname);

  useEffect(() => {
    if (status === "authenticated" && blockedForSuperadmin) {
      router.replace("/admin/companies");
    }
  }, [status, blockedForSuperadmin, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (status === "authenticated" && blockedForSuperadmin) {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden sticky top-0 z-30 bg-gray-50 px-4 sm:px-8 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between py-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("common.menu")}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-lg text-[#1E3A5F] hover:bg-[#1E3A5F]/10 transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="text-center min-w-0">
              <p className="text-gray-900 font-bold text-sm leading-tight">E-Absensi</p>
              <p className="text-gray-400 text-[10px] leading-tight truncate">{t("adminSidebar.tagline")}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
          </div>
        </div>

        <header className="px-4 sm:px-8 pt-2 sm:pt-4 lg:pt-8">
          <AdminHeader title={title} />
        </header>

        <main className="flex-1 p-4 sm:p-8 pt-0 min-w-0">{children}</main>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-50 flex ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`relative w-full max-w-64 h-full transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setMenuOpen(false)} />
        </div>
      </div>
    </div>
  );
}