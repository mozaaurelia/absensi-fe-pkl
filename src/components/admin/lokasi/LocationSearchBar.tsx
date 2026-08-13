"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function LocationSearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 flex-1 min-w-[220px] focus-within:border-[#1E3A5F] transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-gray-400">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Clear"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
