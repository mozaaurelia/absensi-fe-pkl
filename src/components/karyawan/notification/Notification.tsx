"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  FiBell,
  FiCheck,
  FiClock,
  FiCheckSquare,
  FiAlertCircle,
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const ICONS = {
  reminder: FiClock,
  late: FiAlertCircle,
  todo: FiCheckSquare,
};

const ICON_STYLES = {
  reminder: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
  late: "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  todo: "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
};

type NotificationItem = {
  id: string;
  type: "reminder" | "late" | "todo";
  count?: number;
};

function getDateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function buildTodayItems(): NotificationItem[] {
  if (typeof window === "undefined") return [];
  const now = new Date();
  const dateKey = getDateKey(now);
  const items: NotificationItem[] = [];

  let hasCheckedIn = false;
  let checkinTime: number | null = null;
  try {
    const raw = localStorage.getItem("lokasi_" + dateKey);
    const data = raw ? JSON.parse(raw) : null;
    hasCheckedIn = data?.mode === "in" || data?.mode === "out";
    const ck = localStorage.getItem("checkin_" + dateKey);
    checkinTime = ck ? parseInt(ck, 10) : null;
  } catch {
    // ignore storage errors
  }

  const hour = now.getHours();
  const minute = now.getMinutes();

  if (!hasCheckedIn && hour >= 9) {
    items.push({ id: "reminder", type: "reminder" });
  }

  if (checkinTime) {
    const ct = new Date(checkinTime);
    const isLate =
      ct.getHours() > 9 || (ct.getHours() === 9 && ct.getMinutes() > 0);
    if (isLate) {
      items.push({ id: "late", type: "late" });
    }
  }

  try {
    const raw = localStorage.getItem("todolist_" + dateKey);
    const list = raw ? JSON.parse(raw) : [];
    const pending = list.filter((i) => !i.done).length;
    if (pending > 0) {
      items.push({ id: "todo", type: "todo", count: pending });
    }
  } catch {
    // ignore storage errors
  }

  return items.slice(0, 3);
}

let cacheKey = "";
let cachedItems: NotificationItem[] = [];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): NotificationItem[] {
  const items = buildTodayItems();
  const key = JSON.stringify(items);
  if (key !== cacheKey) {
    cacheKey = key;
    cachedItems = items;
  }
  return cachedItems;
}

function getServerSnapshot(): NotificationItem[] {
  return cachedItems;
}

interface Props {
  dark?: boolean;
  className?: string;
}

export default function Notification({ dark = true, className = "" }: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const rawItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = rawItems.map((item) => ({
    ...item,
    unread: !readIds.includes(item.id),
  }));

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = items.filter((i) => i.unread).length;

  const markAllRead = () => {
    setReadIds([...new Set([...readIds, ...items.map((i) => i.id)])]);
  };

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("notification.title")}
        title={t("notification.title")}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          dark
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
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
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("notification.title")}</h4>
              <p className="text-xs text-gray-400">{t("notification.subtitle")}</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <FiCheck size={14} />
                {t("notification.markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
            {items.length === 0 && (
              <div className="px-4 py-10 text-center">
                <p className="text-xs text-gray-400">{t("notification.empty")}</p>
              </div>
            )}
            {items.map((item) => {
              const Icon = ICONS[item.type];
              return (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${ICON_STYLES[item.type]}`}>
                      <Icon size={16} />
                    </div>
                    {item.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {t(`notification.items.${item.type}.title`)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {t(`notification.items.${item.type}.desc`, item.count ? { count: item.count } : undefined)}
                    </p>
                    <p className="text-[11px] text-gray-300 dark:text-gray-500 mt-1">
                      {t("notification.today")}
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
