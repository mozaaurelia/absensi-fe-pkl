"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SelfieVerification from "@/components/karyawan/attendance/SelfieVerification";
import { getEmployees, registerFaceReference, type AdminEmployee } from "@/lib/services/admin";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors";

export default function FaceRegisterPanel() {
  const { t } = useLanguage();

  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadEmployees = useCallback(async () => {
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data.filter((e) => e.status === "active") : []);
    } catch {
      setEmployees([]);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleCapture = (dataUrl: string) => {
    setPreview(dataUrl);
    setCapturing(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result as string);
      setCapturing(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const submit = async () => {
    if (!employeeId || !preview) {
      setError(t("adminFace.required"));
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await registerFaceReference({ employeeId, image: preview });
      setSuccess(t("adminFace.success"));
      setPreview(null);
      setCapturing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("adminFace.failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
        {t("adminFace.title")}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
        {t("adminFace.desc")}
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 dark:bg-green-500/10 text-xs text-green-600 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("adminFace.employee")} *
          </label>
          <select
            value={employeeId}
            onChange={(e) => {
              setEmployeeId(e.target.value);
              setPreview(null);
              setCapturing(false);
            }}
            className={inputClass}
          >
            <option value="">{t("adminMaster.placeholder")}</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {capturing ? (
          <SelfieVerification onNext={handleCapture} />
        ) : preview ? (
          <div>
            <img
              src={preview}
              alt="Face preview"
              className="w-40 h-40 object-cover rounded-2xl border border-gray-200 dark:border-gray-600"
            />
            <button
              onClick={() => setPreview(null)}
              className="mt-3 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {t("adminFace.retake")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setCapturing(true)}
              className="flex items-center gap-2 bg-[#1E3A5F] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors"
            >
              {t("adminFace.capture")}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t("adminFace.uploadGallery")}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>
        )}

        {preview && (
          <button
            onClick={submit}
            disabled={saving}
            className="w-full bg-[#1E3A5F] text-white text-sm font-semibold py-3 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("adminFace.submit")}
          </button>
        )}
      </div>
    </div>
  );
}