"use client";

import { useLanguage } from "@/context/LanguageContext";

const styles = {
  approved: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

interface Props {
  statusKey: string;
}

export default function StatusBadge({ statusKey }: Props) {
  const { t } = useLanguage();

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
        styles[statusKey as keyof typeof styles] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {t(`statusBadge.${statusKey}`)}
    </span>
  );
}
