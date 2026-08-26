import type { ReactNode } from "react";
import Sidebar from "@/components/karyawan/dashboard/SidebarWidget";
import { MobileHeader } from "@/components/karyawan/layout/MobileNav";

interface KaryawanLayoutProps {
  children: ReactNode;
  contentClassName?: string;
}

export default function KaryawanLayout({
  children,
  contentClassName = "flex-1 p-4 md:p-8",
}: KaryawanLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="desktop-sidebar">
        <Sidebar />
      </div>
      <MobileHeader />
      <main className={contentClassName}>{children}</main>
    </div>
  );
}
