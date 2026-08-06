"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LoginInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  showToggle = false,
  visible,
  onToggleVisible,
  error,
}) {
  const { t } = useLanguage();

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle ? (visible ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          suppressHydrationWarning
          className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors ${
            error
              ? "border-red-300 bg-red-50 focus:border-red-400"
              : "border-gray-200 bg-gray-50 focus:border-[#1E3A5F] focus:bg-white"
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleVisible}
            suppressHydrationWarning
            aria-label={visible ? t("login.hide") : t("login.show")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1E3A5F]"
          >
            {visible ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}