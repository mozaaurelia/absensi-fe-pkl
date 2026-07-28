export default function LoginRoleTabs({ role, setRole }) {
  const roles = [
    { id: "karyawan", label: "Karyawan" },
    { id: "supervisor", label: "Supervisor" },
    { id: "admin", label: "Admin HRM" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {roles.map((r) => {
        const active = role === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            suppressHydrationWarning
            className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              active
                ? "bg-[#1E3A5F] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}