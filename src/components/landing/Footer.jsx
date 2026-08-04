"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    { label: t("footer.home"), href: "#beranda" },
    { label: t("footer.features"), href: "#fitur" },
    { label: t("footer.roles"), href: "#role" },
    { label: t("footer.contact"), href: "#kontak" },
  ];

  return (
    <footer id="kontak" className="bg-[#0B1220]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 pb-10 border-b border-white/10">
          <div className="max-w-xs">
            <p className="text-white font-bold text-xl tracking-tight">
              E-Absensi
            </p>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
                {t("footer.navigation")}
              </p>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
                {t("footer.application")}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="/auth/login"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {t("footer.login")}
                </a>
                <a
                  href="/karyawan"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {t("footer.dashboard")}
                </a>
                <span className="text-sm text-slate-500">{t("footer.reports")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; 2026 E-Absensi. All rights reserved.</p>
          <p>Designed for HR Enterprise Workflow</p>
        </div>
      </div>
    </footer>
  );
}
