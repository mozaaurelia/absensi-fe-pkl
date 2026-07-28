"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginRoleTabs from "./LoginRoleTabs";
import LoginInput from "./LoginInput";
import LoginRemember from "./LoginRemember";
import LoginButton from "./LoginButton";

const ROLE_REDIRECT = {
  karyawan: "/karyawan/dashboard",
  supervisor: "/atasan",
  admin: "/admin",
};

export default function LoginForm() {
  const [role, setRole] = useState("karyawan");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, role);
    router.push(ROLE_REDIRECT[role]);
  };

  return (
    <form onSubmit={handleSubmit} suppressHydrationWarning>
      <LoginRoleTabs role={role} setRole={setRole} />

      <LoginInput
        label="Email / Nomor Induk Karyawan"
        placeholder="contoh: andi.pratama@company.co.id"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <LoginInput
        label="Kata Sandi"
        placeholder="••••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showToggle
        visible={showPassword}
        onToggleVisible={() => setShowPassword((v) => !v)}
      />

      <LoginRemember
        checked={remember}
        onChange={() => setRemember((v) => !v)}
      />

      <LoginButton type="submit">Masuk ke Dashboard</LoginButton>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">atau</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <LoginButton variant="outline">
        Masuk dengan Single Sign-On Perusahaan
      </LoginButton>
    </form>
  );
}