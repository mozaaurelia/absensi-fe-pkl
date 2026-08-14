"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { changeMyPassword } from "@/lib/services/profile";

export default function SecurityForm() {
  const { t } = useLanguage();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFA, setTwoFA] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(false);
    setIsSaving(true);
    try {
      await changeMyPassword({ oldPassword, newPassword });
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("securityForm.changeFailed"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-full">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t("securityForm.title")}</h3>
      <p className="text-xs text-gray-400 mb-2">
        {t("securityForm.desc")}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("securityForm.oldPassword")}
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="••••••••"
              value={oldPassword}
              disabled={isSaving}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 pr-12 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E3A5F] hover:opacity-80 transition-opacity"
              aria-label={showOldPassword ? "Hide old password" : "Show old password"}
            >
              {showOldPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("securityForm.newPassword")}
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              disabled={isSaving}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 pr-12 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E3A5F] hover:opacity-80 transition-opacity"
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            >
              {showNewPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
      {success && (
        <p className="text-xs text-green-600 dark:text-green-400 mb-4">
          {t("securityForm.changeSuccess")}
        </p>
      )}

      <button
        type="button"
        onClick={handleChangePassword}
        disabled={isSaving || !oldPassword || !newPassword}
        className="mb-6 bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#16304f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? t("securityForm.saving") : t("securityForm.changePassword")}
      </button>

      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {t("securityForm.twoFA")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t("securityForm.twoFADesc")}
          </p>
        </div>
        <button
          type="button"
          disabled
          onClick={() => setTwoFA((v) => !v)}
          className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors shrink-0 disabled:opacity-60 ${
            twoFA ? "bg-[#1E3A5F] justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white block" />
        </button>
      </div>
    </div>
  );
}
