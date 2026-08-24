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

const themeInitScript = `(function(){try{var t=localStorage.getItem("absensi_theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
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