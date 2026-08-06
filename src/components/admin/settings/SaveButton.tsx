"use client";

import { useLanguage } from "@/context/LanguageContext";

type SaveButtonProps = {
  onClick?: () => void;
  loading?: boolean;
  form?: string;
};

export default function SaveButton({ onClick, loading = false, form }: SaveButtonProps) {
  const { t } = useLanguage();

  return (
    <button
      type="submit"
      form={form}
      onClick={onClick}
      disabled={loading}
      className="bg-orange-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-700 transition-colors disabled:opacity-60"
    >
      {loading ? t("saveButton.saving") : t("saveButton.label")}
    </button>
  );
}
