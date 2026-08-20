"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const SUPERADMIN_ALLOWED = ["/admin/companies"];

export default function Layout({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isSuperadmin = session?.user?.role === "superadmin";

  const blockedForSuperadmin = isSuperadmin && !SUPERADMIN_ALLOWED.includes(pathname);

  useEffect(() => {
    if (status === "authenticated" && blockedForSuperadmin) {
      router.replace("/admin/companies");
    }
  }, [status, blockedForSuperadmin, router]);

  if (status === "authenticated" && blockedForSuperadmin) {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 pt-8">
          <AdminHeader title={title} />
        </header>

        <main className="flex-1 p-8 pt-0">{children}</main>
      </div>
    </div>
  );
}