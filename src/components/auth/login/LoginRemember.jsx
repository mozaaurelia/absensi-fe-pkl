export default function LoginRemember({ checked, onChange }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded border-gray-300 accent-[#1E3A5F]"
        />
        <span className="text-sm text-gray-600">Ingat perangkat ini</span>
      </label>

      <a
        href="#"
        className="text-sm font-semibold text-[#1E3A5F] hover:underline"
      >
        Lupa kata sandi?
      </a>
    </div>
  );
}