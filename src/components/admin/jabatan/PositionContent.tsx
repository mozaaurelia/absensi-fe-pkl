"use client";

import { useMemo, useState } from "react";
import type { Position } from "./types";
import PositionStatsCards from "./PositionStatsCards";
import PositionHeader from "./PositionHeader";
import PositionFilter from "./PositionFilter";
import PositionGrid from "./PositionGrid";
import PositionFormModal from "./PositionFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const initialPositions: Position[] = [
  {
    id: "1",
    name: "Intern (Magang)",
    description: "Posisi Magang / Intern",
    reimbursementLimit: 250000,
    employeeCount: 0,
  },
  {
    id: "2",
    name: "Manager",
    description: "Manajer Departemen",
    reimbursementLimit: 2500000,
    employeeCount: 0,
  },
  {
    id: "3",
    name: "Staff",
    description: "Staff Operasional",
    reimbursementLimit: 500000,
    employeeCount: 2,
  },
  {
    id: "4",
    name: "Supervisor",
    description: "Supervisor Tim",
    reimbursementLimit: 1000000,
    employeeCount: 1,
  },
];

export default function PositionContent() {
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return positions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [positions, search]);

  const handleAdd = () => {
    setEditingPosition(null);
    setModalOpen(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const target = positions.find((p) => p.id === id);
    if (target) setDeleteTarget(target);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPositions((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleSave = (position: Position) => {
    setPositions((prev) => {
      const exists = prev.some((p) => p.id === position.id);
      return exists
        ? prev.map((p) => (p.id === position.id ? position : p))
        : [...prev, position];
    });
    setModalOpen(false);
  };

  return (
    <div>
      <PositionStatsCards positions={positions} />
      <PositionHeader count={positions.length} onAddClick={handleAdd} />
      <PositionFilter search={search} onSearchChange={setSearch} />
      <PositionGrid positions={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      {modalOpen && (
        <PositionFormModal
          initialData={editingPosition}
          existingNames={positions.map((p) => p.name)}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          description={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
