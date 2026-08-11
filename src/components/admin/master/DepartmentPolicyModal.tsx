"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getDepartmentPolicy, updateDepartmentPolicy } from "@/lib/services/admin";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors";

interface Props {
  departmentId: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function DepartmentPolicyModal({ departmentId, onClose, onSaved }: Props) {
  const { t } = useLanguage();

  const [allowOvertime, setAllowOvertime] = useState(true);
  const [allowWfh, setAllowWfh] = useState(true);
  const [minAttendance, setMinAttendance] = useState("80");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const policy = await getDepartmentPolicy(departmentId);
      if (policy) {
        setAllowOvertime(Boolean(policy.allow_overtime));
        setAllowWfh(Boolean(policy.allow_wfh));
        setMinAttendance(String(policy.min_attendance_percentage ?? 80));
        setEffectiveDate(policy.effective_date ?? "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("adminPolicy.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [departmentId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    const min = Number(minAttendance);
    if (Number.isNaN(min) || min < 0 || min > 100) {
      setError(t("adminPolicy.minInvalid"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateDepartmentPolicy(departmentId, {
        allow_overtime: allowOvertime,
        allow_wfh: allowWfh,
        min_attendance_percentage: min,
        effective_date: effectiveDate || new Date().toISOString().slice(0, 10),
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("adminPolicy.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("adminPolicy.title")}
        </h3>

        {loading ? (
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {t("adminPolicy.allowOvertime")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("adminPolicy.allowOvertimeDesc")}
                </p>
              </div>
              <button
                onClick={() => setAllowOvertime((v) => !v)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  allowOvertime ? "bg-[#1E3A5F]" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    allowOvertime ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {t("adminPolicy.allowWfh")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{t("adminPolicy.allowWfhDesc")}</p>
              </div>
              <button
                onClick={() => setAllowWfh((v) => !v)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  allowWfh ? "bg-[#1E3A5F]" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    allowWfh ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminPolicy.minAttendance")}
              </label>
              <input
                type="number"
                value={minAttendance}
                onChange={(e) => setMinAttendance(e.target.value)}
                min={0}
                max={100}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminPolicy.effectiveDate")}
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving || loading}
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={submit}
            disabled={saving || loading}
            className="flex-1 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("adminPolicy.save")}
          </button>
        </div>
      </div>
    </div>
  );
}