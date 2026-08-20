"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { signOut } from "next-auth/react";
import { clearAccessToken } from "@/lib/api";

export default function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setCollapsed(true), 250);
  };

  const isSuperadmin = session?.user?.role === "superadmin";

  const SUPERADMIN_ALLOWED_HREFS = ["/admin/companies"];

  const menus = [
    { label: t("adminSidebar.dashboard"), href: "/admin", icon: DashboardIcon, superadminOnly: false },
    { label: t("adminSidebar.employees"), href: "/admin/karyawan", icon: EmployeeIcon, superadminOnly: false },
    { label: t("adminSidebar.departments"), href: "/admin/departemen", icon: DeptIcon, superadminOnly: false },
    { label: t("adminSidebar.positions"), href: "/admin/jabatan", icon: PositionIcon, superadminOnly: false },
    { label: t("adminSidebar.workSchedule"), href: "/admin/jadwal-kerja", icon: ScheduleIcon, superadminOnly: false },
    { label: t("adminSidebar.scheduling"), href: "/admin/penjadwalan", icon: AssignmentIcon, superadminOnly: false },
    { label: t("adminSidebar.locations"), href: "/admin/lokasi", icon: LocationIcon, superadminOnly: false },
    { label: t("adminSidebar.permits"), href: "/admin/perizinan", icon: PermitIcon, superadminOnly: false },
    { label: t("adminSidebar.calendar"), href: "/admin/kalender", icon: CalendarIcon, superadminOnly: false },
    { label: t("adminSidebar.overtime"), href: "/admin/lembur", icon: OvertimeIcon, superadminOnly: false },
    { label: t("adminSidebar.reports"), href: "/admin/laporan", icon: ReportIcon, superadminOnly: false },
    { label: t("adminSidebar.reimbursement"), href: "/admin/reimburse", icon: ReimburseIcon, superadminOnly: false },
    { label: t("adminSidebar.attendance"), href: "/admin/kehadiran", icon: AttendanceIcon, superadminOnly: false },
    { label: t("adminSidebar.announcements"), href: "/admin/pengumuman", icon: AnnouncementIcon, superadminOnly: false },
    { label: t("adminSidebar.settings"), href: "/admin/settings", icon: SettingsIcon, superadminOnly: false },
    { label: t("adminSidebar.companies"), href: "/admin/companies", icon: CompanyIcon, superadminOnly: true },
  ];

  const visibleMenus = isSuperadmin
    ? menus.filter((m) => SUPERADMIN_ALLOWED_HREFS.includes(m.href))
    : menus.filter((m) => !m.superadminOnly);

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`h-screen sticky top-0 flex flex-col px-3 py-6 bg-[#1E3A5F] shrink-0 overflow-y-auto transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-17" : "w-64"
      }`}
    >
      <div
        className={`flex items-center mb-8 ${collapsed ? "justify-center" : "px-2 justify-between"}`}
      >
        <div
          className={`min-w-0 overflow-hidden whitespace-nowraptransition-all duration-300 ease-in-out ${
            collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-45"
          }`}
        >
          <p className="font-bold text-white text-base">E-Absensi</p>
          <p className="text-blue-200/70 text-xs mt-0.5">{t("adminSidebar.tagline")}</p>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-blue-200/80 shrink-0"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {visibleMenus.map((menu) => {
          const active = pathname === menu.href;
          const Icon = menu.icon;
          return (
            <Link
              key={menu.label}
              href={menu.href}
              title={collapsed ? menu.label : undefined}
              className={`flex items-center py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                active
                  ? "bg-white/10 text-white"
                  : "text-blue-100/80 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "pl-3.25 gap-0" : "px-3 gap-3"}`}
            >
              <Icon />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                  collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-40"
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
          onClick={() => {
            clearAccessToken();
            signOut({ callbackUrl: "/auth/login" });
          }}
          title={collapsed ? t("adminSidebar.logout") : undefined}
          className={`flex items-center py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all duration-300 ease-in-out ${
            collapsed ? "pl-3.25 gap-0" : "px-3 gap-3"
          }`}
        >
          <LogoutIcon />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
              collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-40"
            }`}
          >
            {t("adminSidebar.logout")}
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

function EmployeeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5M16 8.5a3 3 0 1 0 0-6M18.5 14c2.2.5 3.9 2.3 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DeptIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PositionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M13 10h6M13 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function AssignmentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M3 15h18M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PermitIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 14h1M12 14h1M16 14h1M8 17h1M12 17h1M16 17h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OvertimeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M11 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 3.5v4M17.5 5.5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h9l5 5v15H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 17l2.5-3 2 2 3-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReimburseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

function AttendanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 3v3h6V3" stroke="currentColor" strokeWidth="2" />
      <path d="M9 13l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnnouncementIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 8a3.5 3.5 0 0 1 0 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function CompanyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 21v-4h10v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
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
