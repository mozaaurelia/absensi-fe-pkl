import type { ReimburseRequest } from "./types";
import { formatRupiah } from "@/components/admin/jabatan/utils";

interface ReimburseStatsCardsProps {
  requests: ReimburseRequest[];
}

export default function ReimburseStatsCards({ requests }: ReimburseStatsCardsProps) {
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;
  const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0);

  const stats = [
    {
      label: "Total Pending",
      desc: "Perlu diproses",
      value: pending,
      iconBg: "bg-amber-50 text-amber-600",
      icon: <ClockIcon />,
    },
    {
      label: "Disetujui",
      desc: "Telah disetujui",
      value: approved,
      iconBg: "bg-green-50 text-green-600",
      icon: <CheckIcon />,
    },
    {
      label: "Total Nilai (Rp)",
      desc: "Total pengajuan",
      value: `Rp ${formatRupiah(totalAmount)}`,
      iconBg: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
      icon: <MoneyIcon />,
    },
    {
      label: "Ditolak",
      desc: "Tidak disetujui",
      value: rejected,
      iconBg: "bg-red-50 text-red-500",
      icon: <XIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="card-hover bg-white rounded-2xl border border-gray-100 p-5 animate-fade-slide-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.iconBg}`}>
            {stat.icon}
          </span>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
