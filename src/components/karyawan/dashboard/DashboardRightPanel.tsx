"use client";

import { useState } from "react";
import { FiArrowLeft, FiBell, FiCalendar, FiCheck, FiChevronLeft, FiChevronRight, FiMoreVertical, FiSearch, FiSend, FiSun } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import type { CurrentSchedule, LeaveQuotaBalance } from "@/lib/services/dashboard";

interface Props {
  currentSchedule?: CurrentSchedule | null;
  leaveQuota?: LeaveQuotaBalance | null;
}

function toTime(value?: string | null): string {
  if (!value) return "--:--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    const match = value.match(/(\d{1,2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : value;
  }
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function DashboardRightPanel({ currentSchedule, leaveQuota }: Props) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [activeChat, setActiveChat] = useState(null);

  const shiftStart = toTime(currentSchedule?.start_time);
  const shiftEnd = toTime(currentSchedule?.end_time);
  const daysLeft = leaveQuota?.remaining ?? 0;

  const slides = [
    {
      icon: <FiSun size={18} />,
      iconBox: "bg-green-200 text-green-700",
      label: t("dashboardPanel.notification.shiftActive"),
      labelColor: "text-green-300",
      value: `${shiftStart} - ${shiftEnd}`,
    },
    {
      icon: <FiCalendar size={18} />,
      iconBox: "bg-blue-200 text-[#1E3A5F]",
      label: t("dashboardPanel.notification.leaveRemaining"),
      labelColor: "text-blue-200",
      value: `${daysLeft} ${t("overview.daysUnit")}`,
    },
    {
      icon: <FiBell size={18} />,
      iconBox: "bg-amber-200 text-amber-700",
      label: t("dashboardPanel.notification.reminder"),
      labelColor: "text-amber-300",
      value: t("dashboardPanel.notification.reminderText"),
    },
  ];

  const slide = slides[index];
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const avatarBgs = ["bg-[#7B9E89]", "bg-[#9E7B7B]", "bg-[#7B8A9E]", "bg-[#8A7B9E]"];
  const getChat = (i) => ({
    name: t(`dashboardPanel.chats.chat${i}.name`),
    message: t(`dashboardPanel.chats.chat${i}.message`),
    time: t(`dashboardPanel.chats.chat${i}.time`),
    unread: Number(t(`dashboardPanel.chats.chat${i}.unread`)) || 0,
  });
  const initialsOf = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const roomMessages = [0, 1, 2, 3].map((i) => ({
    text: t(`dashboardPanel.chatRoom.messages.${i}.text`),
    time: t(`dashboardPanel.chatRoom.messages.${i}.time`),
    mine: Boolean(t(`dashboardPanel.chatRoom.messages.${i}.mine`)),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-[#1E3A5F] text-white rounded-3xl p-6 shadow-[0_24px_60px_rgba(30,58,95,0.18)] overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
              {t("dashboardPanel.notification.title")}
            </p>
          </div>
        </div>

        <div className="relative px-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#1E3A5F] shadow-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiChevronLeft size={18} />
          </button>

          <div
            key={index}
            className="rounded-[30px] bg-white/10 p-6 border border-white/15 min-h-[110px] flex items-center animate-fade-slide-in"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${slide.iconBox}`}>
                {slide.icon}
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${slide.labelColor}`}>{slide.label}</p>
                <p className="text-base font-bold text-white leading-snug">{slide.value}</p>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            aria-label="Next"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#1E3A5F] shadow-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {activeChat == null ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="bg-[#1E3A5F] text-white px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{t("dashboardPanel.chats.title")}</h3>
              <div className="flex items-center gap-4">
                <FiMoreVertical size={18} />
              </div>
            </div>
            <p className="text-xs text-blue-100/80 mt-0.5">{t("dashboardPanel.chats.subtitle")}</p>
          </div>

          <div className="px-4 py-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder={t("dashboardPanel.chats.searchPlaceholder")}
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 pl-8 pr-3 py-2 text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 transition"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[1, 2, 3].map((i) => {
              const chat = getChat(i);
              return (
                <div
                  key={i}
                  onClick={() => setActiveChat(i - 1)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarBgs[i % 4]}`}>
                    {initialsOf(chat.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{chat.name}</p>
                      <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate ${
                          chat.unread > 0
                            ? "text-gray-700 dark:text-gray-200 font-semibold"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {chat.unread > 0 && <FiCheck size={12} className="inline -mt-0.5 mr-0.5 text-[#1E3A5F]" />}
                        {chat.message}
                      </p>
                      {chat.unread > 0 && (
                        <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1E3A5F] text-white text-[10px] font-bold flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#1E3A5F] text-white px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setActiveChat(null)}
              aria-label={t("dashboardPanel.chatRoom.back")}
              className="hover:bg-white/10 rounded-full p-1.5 transition"
            >
              <FiArrowLeft size={18} />
            </button>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarBgs[activeChat % 4]}`}>
              {initialsOf(getChat(activeChat + 1).name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{getChat(activeChat + 1).name}</p>
              <p className="text-[11px] text-blue-200 flex items-center gap-1">
                <FiCheck size={11} /> {t("dashboardPanel.chatRoom.online")}
              </p>
            </div>
            <FiMoreVertical size={18} />
          </div>

          <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 space-y-3 max-h-[340px] overflow-y-auto">
            {roomMessages.map((m, idx) => (
              <div key={idx} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                    m.mine
                      ? "bg-[#1E3A5F] text-white rounded-br-sm"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                      m.mine ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {m.time}
                    {m.mine && <FiCheck size={11} />}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 dark:border-gray-700">
            <input
              type="text"
              placeholder={t("dashboardPanel.chatRoom.typeMessage")}
              className="flex-1 min-w-0 rounded-full bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 transition"
            />
            <button className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#162f50] transition shrink-0">
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
