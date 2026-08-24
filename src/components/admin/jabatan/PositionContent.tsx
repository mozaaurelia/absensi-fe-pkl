"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Position } from "./types";
import PositionStatsCards from "./PositionStatsCards";
import PositionHeader from "./PositionHeader";
import PositionFilter from "./PositionFilter";
import PositionGrid from "./PositionGrid";
import PositionFormModal from "./PositionFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} from "@/lib/services/admin";

export default function PositionContent() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getPositions()
      .then((rows) => {
        setPositions(
          rows.map((p) => ({
            id: p.id,
            name: p.name,
            description: "",
            reimbursementLimit: 0,
            employeeCount: Number(p.employee_count ?? 0),
          })),
        );
        setError(null);
      })
      .catch(() => setError("Gagal memuat data jabatan."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePosition(deleteTarget.id);
      setPositions((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch {
      // keep list unchanged
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSave = async (position: Position) => {
    const exists = positions.some((p) => p.id === position.id);
    try {
      if (exists) {
        const updated = await updatePosition(position.id, {
          name: position.name,
        });
        setPositions((prev) =>
          prev.map((p) =>
            p.id === updated.id ? { ...p, name: updated.name } : p
          )
        );
      } else {
        const created = await createPosition({ name: position.name });
        setPositions((prev) => [
          ...prev,
          { ...position, id: created.id, name: created.name },
        ]);
      }
    } catch {
      // keep state unchanged
    } finally {
      setModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <p className="text-sm text-gray-400">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={load}
          className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-[#1E3A5F] rounded-xl hover:opacity-90"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

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
