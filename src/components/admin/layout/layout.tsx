"use client";

import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 pt-8">
          <AdminHeader />
        </header>

        <main className="flex-1 p-8 pt-0">{children}</main>
      </div>
    </div>
  );
}
