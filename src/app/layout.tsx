import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SessionWrapper from "@/components/common/SessionWrapper";

export const metadata: Metadata = {
  title: "E-Absensi",
  description: "Sistem Absensi Karyawan",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <SessionWrapper>{children}</SessionWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}