export type DepartmentColor = "blue" | "green" | "purple" | "orange" | "red" | "teal";

export interface Department {
  id: string;
  name: string;
  description?: string;
  head?: string;
  color: DepartmentColor;
  status: "active" | "inactive";
  workDays: string[];
  allowOvertime: boolean;
  allowWFH: boolean;
  minAttendance: number;
  employeeCount: number;
  attendanceRate: number;
}

export const COLOR_MAP: Record<
  DepartmentColor,
  {
    bg: string;
    text: string;
    ring: string;
    dot: string;
    gradient: string;
    emoji: string;
  }
> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-500", dot: "bg-blue-500", gradient: "from-[#1E3A5F] to-[#2f5d94]", emoji: "🏢" },
  green: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-500", dot: "bg-green-500", gradient: "from-green-500 to-emerald-600", emoji: "📈" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-500", dot: "bg-purple-500", gradient: "from-purple-500 to-fuchsia-600", emoji: "🚀" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-500", dot: "bg-orange-500", gradient: "from-orange-500 to-amber-600", emoji: "⚙️" },
  red: { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-500", dot: "bg-red-500", gradient: "from-red-500 to-rose-600", emoji: "🔥" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", ring: "ring-teal-500", dot: "bg-teal-500", gradient: "from-teal-500 to-cyan-600", emoji: "🌐" },
};

export const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
