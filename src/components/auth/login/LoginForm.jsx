"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginInput from "./LoginInput";
import LoginRemember from "./LoginRemember";
import LoginButton from "./LoginButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email / NIK wajib diisi";
    } else if (!email.includes("@")) {
      errs.email = "Masukkan email yang valid (contoh: nama@perusahaan.com)";
    }
    if (!password.trim()) {
      errs.password = "Kata sandi wajib diisi";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login(email, "karyawan");
    router.push("/karyawan/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} suppressHydrationWarning noValidate>
      <LoginInput
        label="Email / Nomor Induk Karyawan"
        placeholder="contoh: andi.pratama@company.co.id"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
        }}
        error={errors.email}
      />

      <LoginInput
        label="Kata Sandi"
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

      <LoginButton type="submit">Masuk ke Dashboard</LoginButton>
    </form>
  );
}
