"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { ReimburseItem } from "@/lib/services/reimburse";

interface Props {
  requests: ReimburseItem[];
}

export default function ReimburseSummary({ requests }: Props) {
  const { t, locale } = useLanguage();

  const stats = useMemo(() => {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    let pending = 0;
    let approved = 0;
    let monthTotal = 0;
    requests.forEach((r) => {
      if (r.status === "pending") pending += 1;
      if (r.status === "approved") approved += 1;
      if (r.status !== "rejected" && String(r.expense_date).startsWith(monthPrefix)) {
        monthTotal += Number(r.amount) || 0;
      }
    });
    return { pending, approved, monthTotal, total: requests.length };
  }, [requests]);

  const fmt = (value: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const cards = [
    {
      label: t("karyawanReimburse.summaryMonthTotal"),
      value: fmt(stats.monthTotal),
      accent: "text-[#1E3A5F] dark:text-blue-300",
      bg: "bg-blue-50 dark:bg-blue-500/15",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2v20M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 3 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: t("karyawanReimburse.summaryPending"),
      value: String(stats.pending),
      accent: "text-amber-600 dark:text-amber-300",
      bg: "bg-amber-50 dark:bg-amber-500/15",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: t("karyawanReimburse.summaryApproved"),
      value: String(stats.approved),
      accent: "text-green-600 dark:text-green-300",
      bg: "bg-green-50 dark:bg-green-500/15",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: t("karyawanReimburse.summaryCount"),
      value: String(stats.total),
      accent: "text-gray-700 dark:text-gray-200",
      bg: "bg-gray-100 dark:bg-gray-700",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-start justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-400 truncate">{card.label}</p>
            <p className={`text-lg font-bold mt-1 truncate ${card.accent}`}>{card.value}</p>
          </div>
          <span className={`${card.bg} ${card.accent} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
            {card.icon}
          </span>
        </div>
      ))}
    </div>
  );
}
