"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const ICONS = {
  reminder: FiClock,
  approved: FiCheckCircle,
  late: FiAlertCircle,
  device: FiShield,
};

const ICON_STYLES = {
  reminder: "bg-cyan-50 text-cyan-600",
  approved: "bg-green-50 text-green-600",
  late: "bg-amber-50 text-amber-600",
  device: "bg-blue-50 text-blue-600",
};

const INITIAL_ITEMS = [
  { id: "reminder", type: "reminder", unread: true },
  { id: "approved", type: "approved", unread: true },
  { id: "late", type: "late", unread: false },
  { id: "device", type: "device", unread: false },
];

export default function Notification({ dark = true, className = "" }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = items.filter((i) => i.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("notification.title")}
        title={t("notification.title")}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          dark
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span
            className={`absolute top-1.5 right-2 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ${
              dark ? "ring-2 ring-[#1E3A5F]" : "ring-2 ring-white"
            }`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{t("notification.title")}</h4>
              <p className="text-xs text-gray-400">{t("notification.subtitle")}</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
              >
                <FiCheck size={14} />
                {t("notification.markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {items.map((item) => {
              const Icon = ICONS[item.type];
              return (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${ICON_STYLES[item.type]}`}>
                      <Icon size={16} />
                    </div>
                    {item.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {t(`notification.items.${item.type}.title`)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t(`notification.items.${item.type}.desc`)}
                    </p>
                    <p className="text-[11px] text-gray-300 mt-1">
                      {t(`notification.items.${item.type}.time`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
