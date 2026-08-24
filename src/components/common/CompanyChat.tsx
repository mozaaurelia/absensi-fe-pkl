"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiMoreVertical, FiSend } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import {
  getMyMessages,
  getDmConversations,
  getDmMessages,
  markDmRead,
  type ChatMessage,
  type DmConversation,
  type DmMessage,
} from "@/lib/services/messages";
import {
  connectMessagesSocket,
  disconnectMessagesSocket,
  getMessagesSocket,
} from "@/lib/socket";
import { getApiToken } from "@/lib/api";

interface NormalizedMsg {
  id: string;
  mine: boolean;
  name?: string;
  body: string;
  created_at: string;
}

interface MessageSendAck {
  success: boolean;
  error?: { code: string };
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

function normalizeGroup(m: ChatMessage, userId?: string | null): NormalizedMsg {
  return {
    id: m.id,
    mine: m.employee_id === userId,
    name: m.employee_name,
    body: m.body,
    created_at: m.created_at,
  };
}

function normalizeDm(m: DmMessage, userId?: string | null): NormalizedMsg {
  return {
    id: m.id,
    mine: m.sender_id === userId,
    body: m.body,
    created_at: m.created_at,
  };
}

export default function CompanyChat() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [roomType, setRoomType] = useState<"group" | "dm" | null>(null);
  const [partner, setPartner] = useState<DmConversation | null>(null);

  const [profile, setProfile] = useState<{ company_name?: string | null } | null>(
    null,
  );

  const [groupMessages, setGroupMessages] = useState<ChatMessage[]>([]);
  const [dmMessages, setDmMessages] = useState<NormalizedMsg[]>([]);
  const [conversations, setConversations] = useState<DmConversation[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const openRef = useRef<{ type: "group" | "dm" | null; partnerId: string | null; userId: string | null }>({
    type: null,
    partnerId: null,
    userId: null,
  });

  useEffect(() => {
    openRef.current = { type: roomType, partnerId: partner?.id ?? null, userId };
  }, [roomType, partner, userId]);

  const refreshConversations = async () => {
    try {
      const list = await getDmConversations();
      setConversations(list);
    } catch {
      // keep previous list on failure
    }
  };

  useEffect(() => {
    let cancelled = false;
    import("@/lib/services/employee")
      .then(({ getMyProfile }) =>
        getMyProfile()
          .then((p) => {
            if (!cancelled) setProfile({ company_name: p.company_name });
          })
          .catch(() => {}),
      )
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
        const [history, convos] = await Promise.all([
          getMyMessages(50),
          getDmConversations(),
        ]);
        if (!cancelled) {
          setGroupMessages(history);
          setConversations(convos);
        }
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
      const onNewGroupMessage = (message: ChatMessage) => {
        if (cancelled || !message?.id) return;
        setGroupMessages((prev) =>
          prev.some((m) => m.id === message.id) ? prev : [...prev, message],
        );
      };
      const onNewDm = (message: DmMessage) => {
        if (cancelled || !message?.id || !message.sender_id) return;
        const open = openRef.current;
        const me = open.userId;
        const otherId =
          message.sender_id === me ? message.recipient_id : message.sender_id;

        setConversations((prev) =>
          prev.map((c) =>
            c.id === otherId
              ? {
                  ...c,
                  last_message_body: message.body,
                  last_message_at: message.created_at,
                  last_message_sender_id: message.sender_id,
                  unread_count:
                    open.type === "dm" && open.partnerId === otherId
                      ? 0
                      : c.unread_count +
                        (message.sender_id === me ? 0 : 1),
                }
              : c,
          ),
        );

        if (
          open.type === "dm" &&
          open.partnerId &&
          (message.sender_id === open.partnerId ||
            message.recipient_id === open.partnerId)
        ) {
          const normalized = normalizeDm(message, me);
          setDmMessages((prev) =>
            prev.some((m) => m.id === normalized.id) ? prev : [...prev, normalized],
          );
        }
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("message:new", onNewGroupMessage);
      socket.on("dm:new", onNewDm);

      if (socket.connected) setIsConnected(true);
    })();

    return () => {
      cancelled = true;
      disconnectMessagesSocket();
    };
  }, []);

  useEffect(() => {
    if (roomType !== "dm" || !partner) return;
    let cancelled = false;
    const partnerId = partner.id;

    setSendError(null);
    setDmMessages([]);
    setIsLoadingHistory(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === partnerId ? { ...c, unread_count: 0 } : c)),
    );

    (async () => {
      try {
        const [history] = await Promise.all([
          getDmMessages(partnerId),
          markDmRead(partnerId).catch(() => {}),
        ]);
        if (!cancelled) {
          setDmMessages(
            history.map((m) => normalizeDm(m, openRef.current.userId)),
          );
        }
      } catch {
        // leave room empty on failure; socket still delivers new messages
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomType, partner]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [groupMessages, dmMessages, isLoadingHistory, roomType]);

  const openGroupRoom = () => {
    setPartner(null);
    setRoomType("group");
    setSendError(null);
  };

  const openDmRoom = (c: DmConversation) => {
    setPartner(c);
    setRoomType("dm");
  };

  const backToList = () => {
    setRoomType(null);
    setPartner(null);
    setInput("");
    refreshConversations();
  };

  const handleSend = () => {
    const body = input.trim();
    const socket = getMessagesSocket();
    if (!body || !socket || !socket.connected) return;

    setInput("");
    setSendError(null);

    if (roomType === "group") {
      socket.emit("message:send", { body }, (ack: MessageSendAck) => {
        if (!ack?.success) setSendError(t("dashboardPanel.chats.sendFailed"));
      });
      return;
    }

    if (roomType === "dm" && partner) {
      const recipientId = partner.id;
      socket.emit(
        "dm:send",
        { recipientId, body },
        (ack: MessageSendAck) => {
          if (!ack?.success) setSendError(t("dashboardPanel.chats.sendFailed"));
        },
      );
    }
  };

  const companyName = profile?.company_name;
  const lastGroupMessage =
    groupMessages.length > 0 ? groupMessages[groupMessages.length - 1] : null;
  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unread_count ?? 0),
    0,
  );

  const header = (
    <div className="bg-[#1E3A5F] text-white px-5 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{t("dashboardPanel.chats.title")}</h3>
        <div className="flex items-center gap-2">
          {totalUnread > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
          <FiMoreVertical size={18} />
        </div>
      </div>
      <p className="text-xs text-blue-100/80 mt-0.5">
        {t("dashboardPanel.chats.subtitle")}
      </p>
    </div>
  );

  if (roomType === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        {header}

        <div
          onClick={openGroupRoom}
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
                {lastGroupMessage ? toTime(lastGroupMessage.created_at) : ""}
              </span>
            </div>
            {isLoadingChat ? (
              <p className="text-xs text-gray-400 truncate">
                {t("dashboardPanel.chats.loadingMessages")}
              </p>
            ) : (
              <p
                className={`text-xs truncate ${
                  lastGroupMessage
                    ? "text-gray-500 dark:text-gray-400 font-semibold"
                    : "text-gray-400 italic"
                }`}
              >
                {lastGroupMessage
                  ? `${lastGroupMessage.employee_name}: ${lastGroupMessage.body}`
                  : t("dashboardPanel.chats.noMessages")}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 pt-3 pb-1 border-t border-gray-100 dark:border-gray-700">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {t("dashboardPanel.chats.directMessages")}
          </p>
        </div>

        <div className="pb-2">
          {!isLoadingChat && conversations.length === 0 ? (
            <p className="px-5 py-4 text-xs text-gray-400 italic">
              {t("dashboardPanel.chats.noColleagues")}
            </p>
          ) : (
            conversations.map((c) => {
              const outgoing =
                c.last_message_sender_id != null &&
                c.last_message_sender_id === userId;
              return (
                <div
                  key={c.id}
                  onClick={() => openDmRoom(c)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 bg-[#4F6E8E]">
                    {initialsOf(c.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {c.name}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {c.last_message_at ? toTime(c.last_message_at) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate ${
                          c.last_message_body
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-400 italic"
                        }`}
                      >
                        {c.last_message_body
                          ? `${outgoing ? "Anda: " : ""}${c.last_message_body}`
                          : t("dashboardPanel.chats.noMessages")}
                      </p>
                      {(c.unread_count ?? 0) > 0 && (
                        <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1E3A5F] text-white text-[10px] font-bold flex items-center justify-center">
                          {c.unread_count > 99 ? "99+" : c.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  const isDm = roomType === "dm";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col">
      <div className="bg-[#1E3A5F] text-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={backToList}
          aria-label={t("dashboardPanel.chatRoom.back")}
          className="hover:bg-white/10 rounded-full p-1.5 transition"
        >
          <FiArrowLeft size={18} />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[#4F6E8E] shrink-0">
          {isDm && partner
            ? initialsOf(partner.name)
            : initialsOf(profile?.company_name || "CP")}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate">
            {isDm && partner
              ? partner.name
              : t("dashboardPanel.chats.companyGroup")}
          </p>
          <p className="text-[11px] text-blue-100/80 truncate">
            {isDm && partner
              ? partner.role_name
              : (companyName ?? t("dashboardPanel.chats.companyGroup"))}
          </p>
        </div>
        <FiMoreVertical size={18} />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 space-y-3 max-h-[340px] min-h-[220px] overflow-y-auto"
      >
        {(isDm ? isLoadingHistory : isLoadingChat) ? (
          <p className="text-center text-xs text-gray-400 py-6">
            {t("dashboardPanel.chats.loadingMessages")}
          </p>
        ) : isDm ? (
          dmMessages.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6">
              {t("dashboardPanel.chatRoom.dmEmpty")}
            </p>
          ) : (
            dmMessages.map((m) => <ChatBubble key={m.id} msg={m} />)
          )
        ) : groupMessages.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-6">
            {t("dashboardPanel.chatRoom.empty")}
          </p>
        ) : (
          groupMessages.map((m) => (
            <ChatBubble key={m.id} msg={normalizeGroup(m, userId)} />
          ))
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
  );
}

function ChatBubble({ msg }: { msg: NormalizedMsg }) {
  return (
    <div className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
          msg.mine
            ? "bg-[#1E3A5F] text-white rounded-br-sm"
            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"
        }`}
      >
        {!msg.mine && msg.name && (
          <p className="text-[11px] font-semibold text-[#1E3A5F] dark:text-blue-200 mb-0.5">
            {msg.name}
          </p>
        )}
        <p className="break-words whitespace-pre-wrap">{msg.body}</p>
        <span
          className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
            msg.mine ? "text-blue-200" : "text-gray-400"
          }`}
        >
          {toTime(msg.created_at)}
        </span>
      </div>
    </div>
  );
}
