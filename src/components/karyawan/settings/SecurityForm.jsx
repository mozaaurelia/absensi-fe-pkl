"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function SecurityForm() {
  const { t } = useLanguage();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFA, setTwoFA] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full">
      <h3 className="font-bold text-gray-900 mb-1">{t("securityForm.title")}</h3>
      <p className="text-xs text-gray-400 mb-6">
        {t("securityForm.desc")}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            {t("securityForm.oldPassword")}
          </label>
          <input
            type="password"
            placeholder="••••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            {t("securityForm.newPassword")}
          </label>
          <input
            type="password"
            placeholder="••••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {t("securityForm.twoFA")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t("securityForm.twoFADesc")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTwoFA((v) => !v)}
          className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors shrink-0 ${
            twoFA ? "bg-[#1E3A5F] justify-end" : "bg-gray-300 justify-start"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white block" />
        </button>
      </div>
    </div>
  );
}
