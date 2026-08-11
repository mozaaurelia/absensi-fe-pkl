export interface Employee {
  id: string;
  name: string;
  nik: string;
  department: string;
  position: string;
  joinDate: string;
  status: "Aktif" | "Nonaktif" | "Resign";
  contractEnd?: string;
}
