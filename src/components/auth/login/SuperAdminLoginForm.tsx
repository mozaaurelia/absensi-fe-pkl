"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { storeAccessToken } from "@/lib/api";
import LoginInput from "@/components/auth/login/LoginInput";
import LoginButton from "@/components/auth/login/LoginButton";

export default function SuperAdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useLanguage();
  const router = useRouter();

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = t("login.emailRequired");
    } else if (!email.includes("@")) {
      errs.email = t("login.emailInvalid");
    }

    if (!password.trim()) {
      errs.password = t("login.passwordRequired");
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setGeneralError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        mode: "superadmin",
        redirect: false,
      });

      if (!result || result.error) {
        setGeneralError(t("login.invalidCredentials"));
        return;
      }

      const session = await getSession();

      storeAccessToken(session?.user?.accessToken);

      if (session?.user?.role === "superadmin") {
        router.push("/admin/companies");
      }
    } catch (error) {
      console.error("Login error:", error);

      setGeneralError(t("login.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("loginSuperadmin.title")}
          </h2>
          <span className="bg-blue-50 text-[#1E3A5F] text-xs font-semibold px-3 py-1 rounded-full">
            {t("loginSuperadmin.badge")}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-6">{t("loginSuperadmin.desc")}</p>

        <form onSubmit={handleSubmit}>
          <LoginInput
            label={t("login.emailLabel")}
            placeholder={t("login.emailPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            error={errors.email}
          />

          <LoginInput
            label={t("login.passwordLabel")}
            placeholder="••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            showToggle
            visible={showPassword}
            onToggleVisible={() => setShowPassword((v) => !v)}
            error={errors.password}
          />

          {generalError && (
            <p style={{ color: "red", fontSize: 14 }}>{generalError}</p>
          )}

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? "..." : t("login.submit")}
          </LoginButton>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-[#1E3A5F] hover:underline"
          >
            {t("loginSuperadmin.back")}
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 E-Absensi - {t("login.footer")}
      </p>
    </div>
  );
}