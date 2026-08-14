"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import { useLanguage } from "@/context/LanguageContext";
import {
  getWorkingDayPatterns,
  createWorkingDayPattern,
  updateWorkingDayPattern,
  type WorkingDayPattern,
} from "@/lib/services/admin";

const dayOptions = [
  { value: 0, labelKey: "patternDay.sun" },
  { value: 1, labelKey: "patternDay.mon" },
  { value: 2, labelKey: "patternDay.tue" },
  { value: 3, labelKey: "patternDay.wed" },
  { value: 4, labelKey: "patternDay.thu" },
  { value: 5, labelKey: "patternDay.fri" },
  { value: 6, labelKey: "patternDay.sat" },
];

export default function AdminPatternsPage() {
  const { t } = useLanguage();

  const [rows, setRows] = useState<WorkingDayPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; row: WorkingDayPattern } | null>(null);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getWorkingDayPatterns();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("adminMaster.failed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const dayLabel = useMemo(
    () => (days: number[]) =>
      (Array.isArray(days) ? days : [])
        .sort((a, b) => a - b)
        .map((d) => t(dayOptions.find((o) => o.value === d)?.labelKey ?? ""))
        .join(", ") || "-",
    [t]
  );

  const openCreate = () => {
    setName("");
    setSelected([]);
    setError(null);
    setModal({ mode: "create" });
  };

  const openEdit = (row: WorkingDayPattern) => {
    setName(row.name);
    setSelected(Array.isArray(row.active_days) ? [...row.active_days] : []);
    setError(null);
    setModal({ mode: "edit", row });
  };

  const toggleDay = (value: number) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const submit = async () => {
    if (!name.trim() || selected.length === 0) {
      setError(t("adminMaster.required"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (modal?.mode === "create") {
        await createWorkingDayPattern({ name: name.trim(), active_days: selected });
      } else if (modal?.mode === "edit") {
        await updateWorkingDayPattern(modal.row.id, { name: name.trim(), active_days: selected });
      }
      setModal(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("adminMaster.failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminCrudPage titleKey="adminCrud.patternsTitle">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
              {t("adminCrud.patterns")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{t("adminCrud.patternsDesc")}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t("adminMaster.add")}
          </button>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">{t("common.loading")}</div>
        ) : loadError ? (
          <div className="p-8 text-center text-sm text-gray-400">{loadError}</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">{t("adminMaster.empty")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
                  <th className="px-6 py-3 font-semibold">{t("adminCrud.name")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminCrud.activeDays")}</th>
                  <th className="px-6 py-3 font-semibold text-right">{t("adminMaster.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {dayLabel(row.active_days)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => openEdit(row)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          aria-label={t("adminMaster.edit")}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
                {modal.mode === "create" ? t("adminMaster.add") : t("adminMaster.edit")}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {t("adminCrud.name")} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("adminCrud.placeholder")}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {t("adminCrud.activeDays")} *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {dayOptions.map((day) => {
                      const active = selected.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          onClick={() => toggleDay(day.value)}
                          className={`rounded-lg border px-2 py-2.5 text-xs font-semibold transition-colors ${
                            active
                              ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                              : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {t(day.labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModal(null)}
                  disabled={saving}
                  className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={submit}
                  disabled={saving}
                  className="flex-1 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
                >
                  {saving ? t("common.saving") : t("adminMaster.save")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminCrudPage>
  );
}