import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
  title: "E-Absensi",
  description: "Sistem Absensi Karyawan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}