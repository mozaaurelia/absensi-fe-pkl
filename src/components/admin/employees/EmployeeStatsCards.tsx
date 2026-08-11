"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  getEmployees,
  getDepartments,
  type AdminEmployee,
  type Department,
} from "@/lib/services/admin";

interface StatItem {
  label: string;
  desc: string;
  value: string;
  iconBg: string;
  icon: React.ReactNode;
}

export default function EmployeeStatsCards() {
  const { t } = useLanguage();

  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [emps, deps] = await Promise.all([
        getEmployees(),
        getDepartments(),
      ]);
      setEmployees(Array.isArray(emps) ? emps : []);
      setDepartments(Array.isArray(deps) ? deps : []);
    } catch {
      // biarkan nilai tetap default
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo<StatItem[]>(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "active").length;
    const inactive = total - active;

    return [
      {
        label: t("adminEmployees.total"),
        desc: t("adminEmployees.totalDesc"),
        value: loading ? "-" : String(total),
        iconBg: "bg-blue-50 text-[#1E3A5F]",
        icon: <UserGroupIcon />,
      },
      {
        label: t("adminEmployees.active"),
        desc: t("adminEmployees.activeDesc"),
        value: loading ? "-" : String(active),
        iconBg: "bg-green-50 text-green-600",
        icon: <CheckIcon />,
      },
      {
        label: t("adminEmployees.inactive"),
        desc: t("adminEmployees.inactiveDesc"),
        value: loading ? "-" : String(inactive),
        iconBg: "bg-red-50 text-red-500",
        icon: <UserXIcon />,
      },
      {
        label: t("adminEmployees.departments"),
        desc: t("adminEmployees.departmentsDesc"),
        value: loading ? "-" : String(departments.length),
        iconBg: "bg-purple-50 text-purple-600",
        icon: <BuildingIcon />,
      },
    ];
  }, [employees, departments, loading, t]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}
            >
              {stat.icon}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {stat.value}
          </p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {stat.label}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}

function UserGroupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5M16 8.5a3 3 0 1 0 0-6M18.5 14c2.2.5 3.9 2.3 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5M15 12l5 5M20 12l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M3 21h18M8 7h2M8 11h2M8 15h2M12 7h2M12 11h2M12 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
