"use client";

export default function DashboardHeader() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Selamat Datang, Admin
        </h1>
        <p className="text-xs text-gray-400 mt-1">{today}</p>
      </div>
    </div>
  );
}