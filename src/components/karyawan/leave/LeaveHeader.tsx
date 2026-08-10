"use client";

import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";

export default function LeaveHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("leaveHeader.title")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {t("leaveHeader.desc")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
          {t("leaveHeader.history")}
        </button>
        <button className="bg-[#1E3A5F] text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-[#16304f] transition-colors whitespace-nowrap">
          {t("leaveHeader.newRequest")}
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-[#1E3A5F] dark:text-blue-300 font-bold text-sm flex items-center justify-center overflow-hidden">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "AP"
          )}
        </div>
      </div>
    </div>
  );
}
