"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "date" | "time" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface ColumnConfig<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface Props<T extends { id: string }> {
  titleKey: string;
  subtitleKey: string;
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  fetchRows: () => Promise<T[]>;
  onCreate?: (values: Record<string, string>) => Promise<unknown>;
  onUpdate?: (id: string, values: Record<string, string>) => Promise<unknown>;
  onDelete?: (id: string) => Promise<unknown>;
}

type ModalState = { mode: "create" } | { mode: "edit"; row: { id: string } & Record<string, any> } | null;

export default function MasterDataCRUD<T extends { id: string }>({
  titleKey,
  subtitleKey,
  columns,
  fields,
  fetchRows,
  onCreate,
  onUpdate,
  onDelete,
}: Props<T>) {
  const { t } = useLanguage();

  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchRows();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("adminMaster.failed"));
    } finally {
      setLoading(false);
    }
  }, [fetchRows, t]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setValues({});
    setError(null);
    setModal({ mode: "create" });
  };

  const openEdit = (row: T) => {
    const init: Record<string, string> = {};
    fields.forEach((f) => {
      init[f.name] = row[f.name as keyof T] != null ? String(row[f.name as keyof T]) : "";
    });
    setValues(init);
    setError(null);
    setModal({ mode: "edit", row: row as any });
  };

  const closeModal = () => {
    setModal(null);
    setError(null);
  };

  const submit = async () => {
    const missing = fields.find((f) => f.required && !String(values[f.name] ?? "").trim());
    if (missing) {
      setError(t("adminMaster.required"));
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (modal?.mode === "create" && onCreate) {
        await onCreate(values);
      } else if (modal?.mode === "edit" && onUpdate) {
        await onUpdate(modal.row.id, values);
      }
      closeModal();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("adminMaster.failed"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmId || !onDelete) return;
    setSaving(true);
    setError(null);
    try {
      await onDelete(confirmId);
      setConfirmId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("adminMaster.deleteFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{t(titleKey)}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t(subtitleKey)}</p>
        </div>
        {(onCreate || onUpdate) && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors"
          >
            <FiPlus size={14} />
            {t("adminMaster.add")}
          </button>
        )}
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
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-3 font-semibold">
                    {t(col.label)}
                  </th>
                ))}
                {(onUpdate || onDelete) && (
                  <th className="px-6 py-3 font-semibold text-right">{t("adminMaster.actions")}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "-")}
                    </td>
                  ))}
                  {(onUpdate || onDelete) && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onUpdate && (
                          <button
                            onClick={() => openEdit(row)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                            aria-label={t("adminMaster.edit")}
                          >
                            <FiEdit2 size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              setConfirmId(row.id);
                              setError(null);
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            aria-label={t("adminMaster.delete")}
                          >
                            <FiTrash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
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
              {fields.map((field) => {
                const fieldKey = field.label;
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {t(fieldKey)}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={values[field.name] ?? ""}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
                      >
                        <option value="">{t("adminMaster.placeholder")}</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : field.type}
                        step={field.type === "number" ? "any" : undefined}
                        value={values[field.name] ?? ""}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        placeholder={field.placeholder ? t(field.placeholder) : ""}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
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

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
              {t("adminMaster.deleteConfirm")}
            </h3>
            {error && <p className="text-xs text-red-500 mb-4 text-center">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                disabled={saving}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="flex-1 bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {saving ? t("common.saving") : t("adminMaster.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}