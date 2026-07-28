import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "E-Absensi",
  description: "Sistem Absensi Karyawan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}