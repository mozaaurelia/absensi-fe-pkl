"use client";

import { useLanguage } from "@/context/LanguageContext";

const styles = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function StatusBadge({ statusKey }) {
  const { t } = useLanguage();

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
        styles[statusKey] || "bg-gray-100 text-gray-600"
      }`}
    >
      {t(`statusBadge.${statusKey}`)}
    </span>
  );
}
