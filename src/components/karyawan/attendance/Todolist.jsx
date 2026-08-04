"use client";

import { useState, useEffect, useRef } from "react";
import { FiCheckSquare, FiPlus, FiAlertTriangle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

function getDateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function Todolist() {
  const { daysFull, months, t } = useLanguage();
  const today = new Date();
  const dateKey = getDateKey(today);
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const warnedRef = useRef(false);
  const prevPendingRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("todolist_" + dateKey);
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      const prevKey = getDateKey(new Date(Date.now() - 86400000));
      const prev = localStorage.getItem("todolist_" + prevKey);
      if (prev) {
        const prevItems = JSON.parse(prev);
        const reset = prevItems.map((item) => ({ ...item, done: false }));
        setItems(reset);
        localStorage.setItem("todolist_" + dateKey, JSON.stringify(reset));
      } else {
        const defaults = [
          { id: Date.now() + 1, text: t("todolist.defaultTask1"), done: false },
          { id: Date.now() + 2, text: t("todolist.defaultTask2"), done: false },
          { id: Date.now() + 3, text: t("todolist.defaultTask3"), done: false },
        ];
        setItems(defaults);
        localStorage.setItem("todolist_" + dateKey, JSON.stringify(defaults));
      }
    }
  }, [dateKey]);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("todolist_" + dateKey, JSON.stringify(items));
    }
  }, [items, dateKey]);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h > 16 || (h === 16 && m >= 30)) {
        setWarning(true);
        const pending = items.filter((item) => !item.done).length;
        if (pending > 0 && !warnedRef.current) {
          setShowWarningBanner(true);
          warnedRef.current = true;
        }
      } else {
        setWarning(false);
        warnedRef.current = false;
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, [items]);

  useEffect(() => {
    const pending = items.filter((item) => !item.done).length;
    if (prevPendingRef.current !== null && prevPendingRef.current > 0 && pending === 0 && items.length > 0) {
      setShowCelebration(true);
      setConfetti(
        Array.from({ length: 20 }).map((_, i) => ({
          left: `${Math.random() * 100}%`,
          delay: `${i * 0.1}s`,
          duration: `${1.5 + Math.random()}s`,
          emoji: ["🎉", "✨", "⭐", "🌟", "🎊"][i % 5],
        }))
      );
    }
    prevPendingRef.current = pending;
  }, [items]);

  const addItem = () => {
    if (!input.trim()) return;
    const newItem = { id: Date.now(), text: input.trim(), done: false };
    const updated = [...items, newItem];
    setItems(updated);
    setInput("");
  };

  const toggleItem = (id) => {
    setItems(items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const pendingCount = items.filter((item) => !item.done).length;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-[28px] border border-slate-200/80 dark:border-gray-700 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] h-full flex flex-col backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EAF1FF] dark:bg-[#1E3A5F] text-[#1E3A5F] dark:text-[#EAF1FF] flex items-center justify-center shadow-sm">
            <FiCheckSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[1.05rem] text-slate-900 dark:text-gray-100 leading-none">{t("todolist.title")}</h3>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1.5">
              {daysFull[today.getDay()]}, {today.getDate()} {months[today.getMonth()]} {today.getFullYear()}
            </p>
          </div>
        </div>

        {warning && pendingCount > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 py-1.5 rounded-full whitespace-nowrap border border-red-100 dark:border-red-500/20">
            <FiAlertTriangle size={12} />
            {pendingCount} pending
          </div>
        )}
      </div>

      {showWarningBanner && (
        <div className="mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 text-sm rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
          <FiAlertTriangle size={16} className="shrink-0" />
          <span>{t("todolist.warningBanner", { count: pendingCount })}</span>
          <button
            onClick={() => setShowWarningBanner(false)}
            className="ml-auto text-red-400 hover:text-red-600 font-bold text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder={t("todolist.addPlaceholder")}
          className="flex-1 text-sm border border-slate-200 dark:border-gray-600 rounded-2xl px-4 py-2.5 bg-slate-50 dark:bg-gray-700 text-slate-700 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/15 focus:border-[#1E3A5F]"
        />
        <button
          onClick={addItem}
          className="w-10 h-10 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center hover:brightness-110 transition-colors shadow-sm shrink-0"
          aria-label={t("todolist.addPlaceholder")}
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 px-4 py-10 text-center">
            <p className="text-sm text-slate-400 dark:text-gray-400">{t("todolist.empty")}</p>
          </div>
        )}

        {items.map((item) => {
          const isDone = item.done;
          const tone = isDone
            ? "bg-emerald-100/80 border-emerald-200/80 dark:bg-emerald-500/10 dark:border-emerald-500/30"
            : warning
              ? "bg-amber-100/80 border-amber-200/80 dark:bg-amber-500/10 dark:border-amber-500/30"
              : "bg-slate-100/80 border-slate-200/80 dark:bg-gray-700/50 dark:border-gray-600";

          return (
            <div
              key={item.id}
              className={`group flex items-center gap-3 px-3 py-3 rounded-[22px] border transition-all duration-200 ${tone}`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isDone
                    ? "bg-[#12B76A] border-[#12B76A] text-white shadow-sm"
                    : "border-slate-300 dark:border-gray-500 bg-white dark:bg-gray-700 hover:border-[#1E3A5F]"
                }`}
                aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
              >
                {isDone && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isDone ? "line-through text-slate-500 dark:text-gray-400" : "text-slate-800 dark:text-gray-100"}`}>
                  {item.text}
                </p>
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="text-slate-400 hover:text-red-500 transition-colors text-2xl leading-none font-light w-7 h-7 rounded-full flex items-center justify-center"
                aria-label="Delete task"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center max-w-sm mx-4 animate-bounce-in relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {confetti.map((c, i) => (
                <span
                  key={i}
                  className="absolute text-xl animate-float-up"
                  style={{
                    left: c.left,
                    bottom: `-10%`,
                    animationDelay: c.delay,
                    animationDuration: c.duration,
                  }}
                >
                  {c.emoji}
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="text-7xl mb-4">👍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t("todolist.allDone")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t("todolist.allDoneDesc")}</p>
              <button
                onClick={() => setShowCelebration(false)}
                className="bg-linear-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm px-8 py-3 rounded-xl hover:brightness-110 transition-all shadow-md"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}