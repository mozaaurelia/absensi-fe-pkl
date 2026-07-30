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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#1E3A5F]"
          >
            {visible ? "Sembunyikan" : "Lihat"}
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