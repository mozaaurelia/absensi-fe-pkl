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
    <div className="min-h-screen bg-white">
      {/* Inline critical CSS: sidebar MUST hide below 768px, independent of Tailwind */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@media (max-width:767.98px){aside[data-karyawan-sidebar]{display:none!important;width:0!important;min-width:0!important}}",
        }}
      />
      <MobileHeader />
      <div className="flex min-h-screen pt-14 md:pt-0">
        <Sidebar />
        <main className={`min-w-0 ${contentClassName}`}>{children}</main>
      </div>
    </div>
  );
}
