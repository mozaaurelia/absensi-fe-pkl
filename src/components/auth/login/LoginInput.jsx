export default function LoginInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  showToggle = false,
  visible,
  onToggleVisible,
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
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
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
    </div>
  );
}