import type { Position } from "./types";
import PositionCard from "./PositionCard";

interface PositionGridProps {
  positions: Position[];
  onEdit: (position: Position) => void;
  onDelete: (id: string) => void;
}

export default function PositionGrid({ positions, onEdit, onDelete }: PositionGridProps) {
  if (positions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center animate-fade-slide-up">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-sm text-gray-400">Tidak ada jabatan yang cocok dengan pencarian.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {positions.map((position, i) => (
        <div key={position.id} style={{ animationDelay: `${i * 70}ms` }}>
          <PositionCard
            position={position}
            onEdit={() => onEdit(position)}
            onDelete={() => onDelete(position.id)}
          />
        </div>
      ))}
    </div>
  );
}
