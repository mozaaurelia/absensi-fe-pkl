import type { ReactNode } from "react";
import AtasanSidebar from "@/components/atasan/AtasanSidebar";
import { AtasanMobileHeader } from "@/components/atasan/AtasanMobileNav";

export default function AtasanLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-950">
      <AtasanSidebar />
      <AtasanMobileHeader />
      <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}