import type { Department } from "./types";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  departments: Department[];
}

export default function DepartmentStatsCards({ departments }: Props) {
  const { t } = useLanguage();
  const total = departments.length;
  const active = departments.filter((d) => d.status === "active").length;
  const inactive = total - active;
  const employees = departments.reduce((sum, d) => sum + d.employeeCount, 0);

  const stats = [
    {
      label: t("adminDepartments.totalLabel"),
      desc: t("adminDepartments.totalDesc"),
      value: total,
      iconBg: "bg-blue-50 text-[#1E3A5F]",
      icon: <BuildingIcon />,
    },
    {
      label: t("adminDepartments.activeLabel"),
      desc: t("adminDepartments.activeDesc"),
      value: active,
      iconBg: "bg-green-50 text-green-600",
      icon: <CheckIcon />,
    },
    {
      label: t("adminDepartments.inactiveLabel"),
      desc: t("adminDepartments.inactiveDesc"),
      value: inactive,
      iconBg: "bg-red-50 text-red-500",
      icon: <XIcon />,
    },
    {
      label: t("adminDepartments.employeesLabel"),
      desc: t("adminDepartments.employeesDesc"),
      value: employees,
      iconBg: "bg-purple-50 text-purple-600",
      icon: <UsersIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="card-hover bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <span
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.iconBg}`}
          >
            {stat.icon}
          </span>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M3 21h18M8 7h2M8 11h2M8 15h2M12 7h2M12 11h2M12 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5M16 8.5a3 3 0 1 0 0-6M18.5 14c2.2.5 3.9 2.3 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
