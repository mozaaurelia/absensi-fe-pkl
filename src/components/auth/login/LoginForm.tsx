"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LoginInput from "./LoginInput";
import LoginRemember from "./LoginRemember";
import LoginButton from "./LoginButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const userData = await login(email, password);

      if (userData.role === "admin") {
        router.push("/admin");
      } else if (userData.role === "supervisor") {
        router.push("/atasan");
      } else {
        router.push("/karyawan");
      }
    } catch (err) {
      setGeneralError(err.message || t("login.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} suppressHydrationWarning noValidate>
      <LoginInput
        label={t("login.emailLabel")}
        placeholder={t("login.emailPlaceholder")}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
        }}
        error={errors.email}
      />

      <LoginInput
        label={t("login.passwordLabel")}
        placeholder="••••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
        }}
        showToggle
        visible={showPassword}
        onToggleVisible={() => setShowPassword((v) => !v)}
        error={errors.password}
      />

      <LoginRemember
        checked={remember}
        onChange={() => setRemember((v) => !v)}
      />
      {generalError && (
        <p style={{ color: "red", fontSize: 14 }}>{generalError}</p>
      )}

      <LoginButton type="submit" disabled={isLoading}>
        {isLoading ? "..." : t("login.submit")}
      </LoginButton>
    </form>
  );
}
