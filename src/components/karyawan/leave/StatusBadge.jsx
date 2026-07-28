export default function StatusBadge({ status }) {
  const styles = {
    Disetujui: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Ditolak: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}