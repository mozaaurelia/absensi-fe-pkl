"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Role() {
  const { t } = useLanguage();

  const roles = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      iconBg: "bg-blue-100 text-blue-700",
      title: t("role.employee.title"),
      desc: t("role.employee.desc"),
      tags: t("role.employee.tags"),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      iconBg: "bg-blue-100 text-blue-700",
      title: t("role.supervisor.title"),
      desc: t("role.supervisor.desc"),
      tags: t("role.supervisor.tags"),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      iconBg: "bg-blue-100 text-blue-700",
      title: t("role.admin.title"),
      desc: t("role.admin.desc"),
      tags: t("role.admin.tags"),
    },
  ];

  return (
    <section id="role" className="bg-slate-50 py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center mb-14">
        <p className="text-xs font-bold text-[#1E3A5F] tracking-wide uppercase mb-3">
          {t("role.eyebrow")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("role.title")}
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
          {t("role.desc")}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.title}
            className="role-card group bg-white rounded-2xl border border-gray-100/80 p-6 transition-all duration-300 ease-out shadow-[0_10px_30px_-15px_rgba(30,58,95,0.25)] hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(30,58,95,0.45)] hover:border-blue-100"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg] ${role.iconBg}`}
            >
              {role.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{role.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {role.desc}
            </p>
            <div className="flex flex-col gap-2">
              {role.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-50 border border-gray-100 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors duration-300 group-hover:bg-blue-50/50 group-hover:border-blue-100/60 group-hover:text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}