"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import AvatarUpload from "./AvatarUpload";

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    nama: user?.nama || "Admin Koperasi",
    nik: user?.nik || "ADM-001",
    email: user?.email || "admin@eabsensi.com",
    jabatan: user?.jabatan || "HRD Manager",
  });
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setForm({
        nama: user.nama || "",
        nik: user.nik || "",
        email: user.email || "",
        jabatan: user.jabatan || "",
      });
      setAvatar(user.avatar || null);
    }
  }

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<AuthUser> = { ...form };
    if (avatar) payload.avatar = avatar;
    updateProfile(payload);
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-full">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t("profileForm.title")}</h3>
        <p className="text-xs text-gray-400 mb-6">
          {t("profileForm.desc")}
        </p>

        <div className="flex justify-end mb-6">
          <AvatarUpload initials={user?.initials || "AD"} onImageChange={setAvatar} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("profileForm.fullName")}
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={handleChange("nama")}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("profileForm.nik")}
            </label>
            <input
              type="text"
              value={form.nik}
              onChange={handleChange("nik")}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("profileForm.email")}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("profileForm.position")}
            </label>
            <input
              type="text"
              value={form.jabatan}
              onChange={handleChange("jabatan")}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
