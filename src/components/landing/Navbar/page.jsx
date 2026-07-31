"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle/LanguageToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { label: t("nav.home"), href: "#beranda" },
    { label: t("nav.features"), href: "#fitur" },
    { label: t("nav.roles"), href: "#role" },
    { label: t("nav.flow"), href: "#alur" },
    { label: t("nav.contact"), href: "#kontak" },
  ];

  return (
    <nav className="bg-[#1E3A5F] relative z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white font-bold text-sm">EA</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              E-Absensi
            </p>
            <p className="text-blue-200/70 text-xs leading-tight">
              {t("nav.tagline")}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-blue-100/80 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <a
            href="/auth/login"
            className="bg-white text-[#1E3A5F] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {t("nav.signIn")}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle className="md:hidden" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-white"
            aria-label={t("nav.toggleMenu")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-blue-100/80 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/auth/login"
            className="bg-white text-[#1E3A5F] text-sm font-semibold px-5 py-2.5 rounded-lg text-center"
          >
            {t("nav.signIn")}
          </a>
        </div>
      )}
    </nav>
  );
}