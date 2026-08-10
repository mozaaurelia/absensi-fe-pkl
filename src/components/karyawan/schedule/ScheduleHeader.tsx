"use client";

import { FiPlus } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useSession } from "next-auth/react";

export default function ScheduleHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("scheduleHeader.title")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {t("scheduleHeader.desc")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex bg-blue-50 dark:bg-blue-500/15 text-[#1E3A5F] dark:text-blue-300 text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap">
          {t("scheduleHeader.badge")}
        </span>
        <button className="bg-[#1E3A5F] text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-[#16304f] transition-colors whitespace-nowrap flex items-center gap-2">
          <FiPlus size={15} />
          {t("scheduleHeader.add")}
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-[#1E3A5F] dark:text-blue-300 font-bold text-sm flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user?.initials || "AP"
          )}
        </div>
      </div>
    </div>
  );
}
