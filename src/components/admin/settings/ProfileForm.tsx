"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AvatarUpload from "./AvatarUpload";
import { updateMyProfile, type Profile } from "@/lib/services/profile";

interface Props {
  profile: Profile | null;
  isLoading: boolean;
  isSaving: boolean;
  onSavingChange: (saving: boolean) => void;
  onProfileUpdated: () => Promise<void> | void;
  resetSignal: number;
}

export default function ProfileForm({
  profile,
  isLoading,
  isSaving,
  onSavingChange,
  onProfileUpdated,
  resetSignal,
}: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    jabatan: "",
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const profileRef = useRef<Profile | null>(null);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setForm({
        nama: profile.name || "",
        email: profile.email || "",
        jabatan: profile.position || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const current = profileRef.current;
    if (current) {
      setForm({
        nama: current.name || "",
        email: current.email || "",
        jabatan: current.position || "",
      });
      setError(null);
      setSuccess(false);
      setAvatar(null);
    }
  }, [resetSignal]);

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.nama.trim();
    if (!name) {
      setError(t("profileForm.nameRequired"));
      return;
    }

    setError(null);
    setSuccess(false);
    onSavingChange(true);

    try {
      await updateMyProfile({
        name,
        position: form.jabatan.trim() || undefined,
        image: avatar ?? undefined,
      });
      await onProfileUpdated();
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("profileForm.saveFailed"),
      );
    } finally {
      onSavingChange(false);
    }
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
            initials={profile?.name ? profile.name.slice(0, 2).toUpperCase() : "AD"}
            onImageChange={(dataUrl) => setAvatar(dataUrl)}
            initialImage={profile?.image ?? null}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 mb-4">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs text-green-600 dark:text-green-400 mb-4">
            {t("profileForm.saveSuccess")}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("profileForm.fullName")}
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={handleChange("nama")}
              disabled={isLoading || isSaving}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("profileForm.nik")}
            </label>
            <input
              type="text"
              value={profile?.employee_id ? profile.employee_id.slice(0, 8).toUpperCase() : "-"}
              readOnly
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("profileForm.email")}
            </label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none opacity-60 cursor-not-allowed"
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
              disabled={isLoading || isSaving}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
