interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatCard({
  label,
  value,
  delta,
  trend = "neutral",
  icon,
  iconBg,
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </span>
        {delta && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trendColor}`}>
            {trend === "up" && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {trend === "down" && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7 7 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {delta}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}