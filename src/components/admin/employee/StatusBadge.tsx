type Status = "Aktif" | "Nonaktif" | "Resign";

const styles: Record<Status, string> = {
  Aktif: "bg-green-100 text-green-700",
  Nonaktif: "bg-gray-100 text-gray-500",
  Resign: "bg-red-100 text-red-600",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
}