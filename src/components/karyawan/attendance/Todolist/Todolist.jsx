"use client";

import { useState, useEffect, useRef } from "react";
import { FiCheckSquare, FiPlus, FiTrash2, FiAlertTriangle } from "react-icons/fi";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const dayNamesFull = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];

function getDateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function Todolist() {
  const today = new Date();
  const dateKey = getDateKey(today);
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
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
          { id: Date.now() + 1, text: "Review laporan bulanan", done: false },
          { id: Date.now() + 2, text: "Kirim dokumen ke HRD", done: false },
          { id: Date.now() + 3, text: "Meeting dengan tim", done: false },
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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <FiCheckSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">To-do List</h3>
            <p className="text-xs text-gray-400">
              {dayNamesFull[today.getDay()]}, {today.getDate()} {monthNames[today.getMonth()]} {today.getFullYear()}
            </p>
          </div>
        </div>
        {warning && pendingCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full whitespace-nowrap">
            <FiAlertTriangle size={14} />
            {pendingCount} pending
          </div>
        )}
      </div>

      {showWarningBanner && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <FiAlertTriangle size={16} className="shrink-0" />
          <span>Ada {pendingCount} tugas yang belum selesai hari ini!</span>
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
          placeholder="Tambah tugas baru..."
          className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
        />
        <button
          onClick={addItem}
          className="w-9 h-9 rounded-lg bg-[#1E3A5F] text-white flex items-center justify-center hover:brightness-110 transition-colors shrink-0"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto max-h-64">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Belum ada tugas hari ini.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                item.done
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-[#1E3A5F]"
              }`}
            >
              {item.done && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span
              className={`text-sm flex-1 ${
                item.done ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {item.text}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-sm mx-4 animate-bounce-in relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-xl animate-float-up"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: `-10%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${1.5 + Math.random()}s`,
                  }}
                >
                  {["🎉", "✨", "⭐", "🌟", "🎊"][i % 5]}
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="text-7xl mb-4">👍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Semua Selesai! 🎉</h3>
              <p className="text-sm text-gray-500 mb-6">Semua tugas hari ini sudah beres. Kerja bagus!</p>
              <button
                onClick={() => setShowCelebration(false)}
                className="bg-gradient-to-r from-[#1E3A5F] to-[#4F46E5] text-white font-semibold text-sm px-8 py-3 rounded-xl hover:brightness-110 transition-all shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}