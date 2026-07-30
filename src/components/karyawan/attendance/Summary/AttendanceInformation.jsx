export default function AttendanceInformation() {
  const info = [
    { label: "Lokasi", value: "Kantor Pusat" },
    { label: "Verifikasi", value: "GPS Valid" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-6">
      {info.map((item) => (
        <div key={item.label} className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">{item.label}</p>
          <p className="text-sm font-semibold text-gray-800">{item.value}</p>
        </div>
      ))}
    </div>
  );
}