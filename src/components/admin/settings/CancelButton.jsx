"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CancelButton({ onClick }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-gray-200 dark:border-gray-600 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {t("cancelButton.label")}
    </button>
  );
}
