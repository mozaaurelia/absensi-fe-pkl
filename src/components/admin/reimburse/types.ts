export type ReimburseStatus = "pending" | "approved" | "rejected";

export interface ReimburseRequest {
  id: string;
  employeeName: string;
  department: string;
  title: string;
  type: string;
  date: string;
  amount: number;
  status: ReimburseStatus;
}

export const STATUS_MAP: Record<
  ReimburseStatus,
  { label: string; badge: string; dot: string; iconBg: string }
> = {
  pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    iconBg: "bg-amber-50 text-amber-600",
  },
  approved: {
    label: "Disetujui",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    iconBg: "bg-green-50 text-green-600",
  },
  rejected: {
    label: "Ditolak",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    iconBg: "bg-red-50 text-red-500",
  },
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
