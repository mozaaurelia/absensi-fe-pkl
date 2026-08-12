export type PerizinanStatus = "pending" | "approved" | "rejected";

export interface Perizinan {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: PerizinanStatus;
  approvalNote?: string;
}

export const STATUS_MAP: Record<
  PerizinanStatus,
  { label: string; badge: string; dot: string; iconBg: string }
> = {
  pending: {
    label: "Menunggu",
    badge: "bg-blue-50 text-[#1E3A5F]",
    dot: "bg-blue-500",
    iconBg: "bg-blue-50 text-[#1E3A5F]",
  },
  approved: {
    label: "Disetujui",
    badge: "bg-green-50 text-green-600",
    dot: "bg-green-500",
    iconBg: "bg-green-50 text-green-600",
  },
  rejected: {
    label: "Ditolak",
    badge: "bg-red-50 text-red-500",
    dot: "bg-red-500",
    iconBg: "bg-red-50 text-red-500",
  },
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
