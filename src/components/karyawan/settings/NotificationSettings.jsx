"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotificationSettings() {
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState({
    emailAbsen: true,
    waCuti: false,
    deviceLogin: true,
  });

  const toggle = (key) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const items = [
    {
      key: "emailAbsen",
      title: t("notificationSettings.email.title"),
      desc: t("notificationSettings.email.desc"),
    },
    {
      key: "waCuti",
      title: t("notificationSettings.whatsapp.title"),
      desc: t("notificationSettings.whatsapp.desc"),
    },
    {
      key: "deviceLogin",
      title: t("notificationSettings.device.title"),
      desc: t("notificationSettings.device.desc"),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full">
      <h3 className="font-bold text-gray-900 mb-1">{t("notificationSettings.title")}</h3>
      <p className="text-xs text-gray-400 mb-6">
        {t("notificationSettings.desc")}
      </p>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <label
            key={item.key}
            className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-4 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={prefs[item.key]}
              onChange={() => toggle(item.key)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#1E3A5F]"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
