"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const MENUS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
  { label: "Karyawan", href: "/admin/karyawan", icon: EmployeeIcon },
  { label: "Departemen", href: "/admin/departemen", icon: DeptIcon },
  { label: "Perizinan", href: "/admin/perizinan", icon: LeaveIcon },
  { label: "Pengaturan", href: "/admin/settings", icon: SettingsIcon },
];

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`flex flex-col bg-white border-r border-gray-100 transition-all duration-300 shrink-0 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
            EA
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">E-Absensi</p>
              <p className="text-[10px] text-gray-400 truncate">Management System</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          {MENUS.map((menu) => {
            const active = pathname === menu.href;
            const Icon = menu.icon;
            return (
              <a
                key={menu.label}
                href={menu.href}
                title={collapsed ? menu.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon />
                {!collapsed && <span className="truncate">{menu.label}</span>}
              </a>
            );
          })}
        </nav>

        <div className="px-3 pb-4 flex flex-col gap-1 border-t border-gray-100 pt-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-transform shrink-0 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!collapsed && "Collapse Sidebar"}
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogoutIcon />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 bg-white border-b border-gray-100 px-8 py-4">
          <div className="relative flex-1 max-w-md">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Cari karyawan, laporan..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center">
                A
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  Admin Koperasi
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function EmployeeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5M16 8.5a3 3 0 1 0 0-6M18.5 14c2.2.5 3.9 2.3 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function DeptIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function LeaveIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}