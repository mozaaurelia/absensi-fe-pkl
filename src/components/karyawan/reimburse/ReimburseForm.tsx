"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import { createReimburseRequest } from "@/lib/services/reimburse";
import DatePicker from "../common/DatePicker";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  onSubmitted?: () => Promise<void> | void;
}

export default function ReimburseForm({ onSubmitted }: Props) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "transport", label: t("karyawanReimburse.catTransport") },
    { value: "meal", label: t("karyawanReimburse.catMeal") },
    { value: "health", label: t("karyawanReimburse.catHealth") },
    { value: "education", label: t("karyawanReimburse.catEducation") },
    { value: "other", label: t("karyawanReimburse.catOther") },
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError(t("karyawanReimburse.fileTooLarge"));
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result as string);
      setAttachmentName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError(t("karyawanReimburse.titleRequired"));
      return;
    }
    if (!expenseDate) {
      setError(t("karyawanReimburse.dateRequired"));
      return;
    }
    const amountNum = Number(amount);
    if (!amount || Number.isNaN(amountNum) || amountNum <= 0) {
      setError(t("karyawanReimburse.invalidAmount"));
      return;
    }

    setSubmitting(true);
    try {
      await createReimburseRequest({
        title: title.trim(),
        category,
        expense_date: expenseDate,
        amount: amountNum,
        description: description.trim() || undefined,
        attachment: attachment ?? undefined,
      });
      setTitle("");
      setCategory("");
      setExpenseDate("");
      setAmount("");
      setDescription("");
      removeAttachment();
      setSuccess(true);
      if (onSubmitted) await onSubmitted();
    } catch (err) {
      if (err instanceof ApiError && err.code === "LIMIT_EXCEEDED") {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : t("karyawanReimburse.submitFailed"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          {t("karyawanReimburse.formTitle")}
        </h3>
        <span className="bg-blue-50 dark:bg-blue-500/15 text-[#1E3A5F] dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {t("karyawanReimburse.formBadge")}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-6">{t("karyawanReimburse.formDesc")}</p>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-lg px-4 py-3 mb-4">
          {t("karyawanReimburse.submitSuccess")}
        </p>
      )}

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("karyawanReimburse.titleLabel")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("karyawanReimburse.titlePlaceholder")}
          required
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("karyawanReimburse.categoryLabel")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t("karyawanReimburse.dateLabel")}
          </label>
          <DatePicker
            value={expenseDate}
            onChange={setExpenseDate}
            placeholder={t("karyawanReimburse.dateLabel")}
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("karyawanReimburse.amountLabel")}
        </label>
        <input
          type="number"
          min="1"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t("karyawanReimburse.amountPlaceholder")}
          required
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("karyawanReimburse.descLabel")}
        </label>
        <textarea
          rows={3}
          placeholder={t("karyawanReimburse.descPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("karyawanReimburse.fileLabel")}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        {attachment && attachmentName ? (
          <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-[#1E3A5F] dark:text-blue-300 flex items-center justify-center shrink-0">
                <FileIcon />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {attachmentName}
                </p>
                <p className="text-xs text-gray-400">{t("karyawanReimburse.fileHint")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeAttachment}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors shrink-0 ml-3"
            >
              {t("karyawanReimburse.fileRemove")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-6 flex flex-col items-center justify-center gap-2 hover:border-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-colors"
          >
            <UploadIcon />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t("karyawanReimburse.fileTitle")}
            </p>
            <p className="text-xs text-gray-400">{t("karyawanReimburse.fileHint")}</p>
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#1E3A5F] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#16304f] transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {submitting ? t("common.saving") : t("karyawanReimburse.submit")}
      </button>
    </form>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
