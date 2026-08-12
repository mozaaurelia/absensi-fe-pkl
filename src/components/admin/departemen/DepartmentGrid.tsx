import type { Department } from "./types";
import DepartmentCard from "./DepartmentCard";

interface DepartmentGridProps {
  departments: Department[];
  onEdit: (d: Department) => void;
  onDelete: (id: string) => void;
}

export default function DepartmentGrid({ departments, onEdit, onDelete }: DepartmentGridProps) {
  if (departments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center animate-fade-slide-up">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-sm text-gray-400">Tidak ada departemen yang cocok dengan pencarian.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {departments.map((dept, i) => (
        <div key={dept.id} style={{ animationDelay: `${i * 70}ms` }}>
          <DepartmentCard
            department={dept}
            onEdit={() => onEdit(dept)}
            onDelete={() => onDelete(dept.id)}
          />
        </div>
      ))}
    </div>
  );
}
