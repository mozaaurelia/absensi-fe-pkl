interface Activity {
  name: string;
  action: string;
  time: string;
}

const activities: Activity[] = [
  { name: "Andi Pratama", action: "Clock-in", time: "08:56" },
  { name: "Sinta Rahma", action: "Mengajukan Cuti Tahunan", time: "08:40" },
  { name: "Budi Santoso", action: "Clock-out", time: "08:12" },
  { name: "Maya Lestari", action: "Clock-in (Terlambat)", time: "09:14" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 text-sm mb-4">Aktivitas Terkini</h3>

      <div className="flex flex-col gap-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#1E3A5F] mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{activity.name}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.time} WIB</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}