export default function AttendanceStatus({ status = "Belum Absen" }) {
  const styles = {
    "Belum Absen": "bg-amber-100 text-amber-700",
    Hadir: "bg-green-100 text-green-700",
    Terlambat: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}