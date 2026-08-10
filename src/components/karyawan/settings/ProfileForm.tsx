"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import AvatarUpload from "./AvatarUpload";

export default function ProfileForm() {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    email: "",
    jabatan: "",
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        nama: user.name || "",
        nik: "",
        email: user.email || "",
        jabatan: "",
      });
    }
  }, [user]);

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-full">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t("profileForm.title")}</h3>
        <p className="text-xs text-gray-400 mb-6">
          {t("profileForm.desc")}
        </p>

        <div className="flex justify-end mb-6">
          <AvatarUpload
            initials={user?.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
            onImageChange={(dataUrl) => setAvatar(dataUrl)}
          />
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
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
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
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
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
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
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
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
