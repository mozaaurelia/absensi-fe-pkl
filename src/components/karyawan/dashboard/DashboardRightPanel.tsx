"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiBell, FiCalendar, FiChevronLeft, FiChevronRight, FiMoreVertical, FiSend, FiSun } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { getMyProfile, type EmployeeProfile } from "@/lib/services/employee";
import type { CurrentSchedule, LeaveQuotaBalance } from "@/lib/services/dashboard";
import {
  getMyMessages,
  type ChatMessage,
} from "@/lib/services/messages";
import {
  connectMessagesSocket,
  disconnectMessagesSocket,
  getMessagesSocket,
} from "@/lib/socket";
import { getApiToken } from "@/lib/api";

interface Props {
  currentSchedule?: CurrentSchedule | null;
  leaveQuota?: number | LeaveQuotaBalance | null;
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

function initialsOf(name: string) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface MessageSendAck {
  success: boolean;
  error?: { code: string };
}

export default function DashboardRightPanel({ currentSchedule, leaveQuota }: Props) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [index, setIndex] = useState(0);
  const [activeRoom, setActiveRoom] = useState(false);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  useEffect(() => {
    let cancelled = false;
    getMyProfile()
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = await getApiToken();
      if (!token || cancelled) {
        if (!cancelled) setIsLoadingChat(false);
        return;
      }

      try {
        const history = await getMyMessages(50);
        if (!cancelled) setMessages(history);
      } catch {
        // history load failure should not block the live connection
      } finally {
        if (!cancelled) setIsLoadingChat(false);
      }

      if (cancelled) return;

      const socket = connectMessagesSocket(token);

      const onConnect = () => {
        if (!cancelled) setIsConnected(true);
      };
      const onDisconnect = () => {
        if (!cancelled) setIsConnected(false);
      };
      const onNewMessage = (message: ChatMessage) => {
        if (cancelled || !message?.id) return;
        setMessages((prev) =>
          prev.some((m) => m.id === message.id) ? prev : [...prev, message],
        );
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("message:new", onNewMessage);

      if (socket.connected) setIsConnected(true);
    })();

    return () => {
      cancelled = true;
      disconnectMessagesSocket();
    };
  }, []);

  useEffect(() => {
    if (activeRoom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeRoom]);

  useEffect(() => {
    if (activeRoom) {
      setSendError(null);
    }
  }, [activeRoom]);

  const shiftStart = toTime(currentSchedule?.start_time);
  const shiftEnd = toTime(currentSchedule?.end_time);
  const daysLeft =
    typeof leaveQuota === "number"
      ? leaveQuota
      : (leaveQuota?.remaining ?? 0);

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

  const companyName =
    profile?.company_name || t("dashboardPanel.chats.companyGroup");
  const lastMessage = messages[messages.length - 1] ?? null;

  const handleSend = () => {
    const body = input.trim();
    const socket = getMessagesSocket();
    if (!body || !socket || !socket.connected) return;

    setInput("");
    setSendError(null);
    socket.emit(
      "message:send",
      { body },
      (ack: MessageSendAck) => {
        if (!ack?.success) {
          setSendError(t("dashboardPanel.chats.sendFailed"));
        }
      },
    );
  };

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
            aria-label={t("common.previous")}
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
            aria-label={t("common.next")}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#1E3A5F] shadow-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {!activeRoom ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="bg-[#1E3A5F] text-white px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{t("dashboardPanel.chats.title")}</h3>
              <FiMoreVertical size={18} />
            </div>
            <p className="text-xs text-blue-100/80 mt-0.5">{t("dashboardPanel.chats.subtitle")}</p>
          </div>

          <div
            onClick={() => setActiveRoom(true)}
            className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-[#7B8A9E]">
              {initialsOf(profile?.company_name || "CP")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {t("dashboardPanel.chats.companyGroup")}
                </p>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {lastMessage ? toTime(lastMessage.created_at) : ""}
                </span>
              </div>
              {isLoadingChat ? (
                <p className="text-xs text-gray-400 truncate">
                  {t("dashboardPanel.chats.loadingMessages")}
                </p>
              ) : (
                <p
                  className={`text-xs truncate ${
                    lastMessage
                      ? "text-gray-500 dark:text-gray-400 font-semibold"
                      : "text-gray-400 italic"
                  }`}
                >
                  {lastMessage
                    ? `${lastMessage.employee_name}: ${lastMessage.body}`
                    : t("dashboardPanel.chats.noMessages")}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#1E3A5F] text-white px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setActiveRoom(false)}
              aria-label={t("dashboardPanel.chatRoom.back")}
              className="hover:bg-white/10 rounded-full p-1.5 transition"
            >
              <FiArrowLeft size={18} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[#7B8A9E] shrink-0">
              {initialsOf(profile?.company_name || "CP")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">
                {t("dashboardPanel.chats.companyGroup")}
              </p>
              <p className="text-[11px] text-blue-100/80 truncate">
                {profile?.company_name ?? companyName}
              </p>
            </div>
            <FiMoreVertical size={18} />
          </div>

          <div ref={scrollRef} className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 space-y-3 max-h-[340px] min-h-[220px] overflow-y-auto">
            {isLoadingChat ? (
              <p className="text-center text-xs text-gray-400 py-6">
                {t("dashboardPanel.chats.loadingMessages")}
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">
                {t("dashboardPanel.chatRoom.empty")}
              </p>
            ) : (
              messages.map((m) => {
                const mine = userId ? m.employee_id === userId : false;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        mine
                          ? "bg-[#1E3A5F] text-white rounded-br-sm"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                      }`}
                    >
                      {!mine && (
                        <p className="text-[11px] font-semibold text-[#1E3A5F] dark:text-blue-200 mb-0.5">
                          {m.employee_name}
                        </p>
                      )}
                      <p className="break-words whitespace-pre-wrap">{m.body}</p>
                      <span
                        className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                          mine ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {toTime(m.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {sendError && (
            <p className="px-4 pt-2 text-[11px] text-red-500">{sendError}</p>
          )}

          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 dark:border-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              maxLength={1000}
              placeholder={
                isConnected
                  ? t("dashboardPanel.chatRoom.typeMessage")
                  : t("dashboardPanel.chats.loadingMessages")
              }
              disabled={!isConnected}
              className="flex-1 min-w-0 rounded-full bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 transition disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={!isConnected || !input.trim()}
              className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#162f50] transition shrink-0 disabled:opacity-40 disabled:hover:bg-[#1E3A5F]"
              aria-label={t("dashboardPanel.chatRoom.typeMessage")}
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
