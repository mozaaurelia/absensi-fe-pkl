"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import MasterDataCRUD from "@/components/admin/master/MasterDataCRUD";
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  type Position,
} from "@/lib/services/admin";

export default function AdminPositionsPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.positionsTitle">
      <MasterDataCRUD<Position>
        titleKey="adminCrud.positions"
        subtitleKey="adminCrud.positionsDesc"
        columns={[{ key: "name", label: "adminCrud.name" }]}
        fields={[
          {
            name: "name",
            label: "adminCrud.name",
            type: "text",
            required: true,
            placeholder: "adminCrud.placeholder",
          },
        ]}
        fetchRows={getPositions}
        onCreate={(v) => createPosition({ name: v.name })}
        onUpdate={(id, v) => updatePosition(id, { name: v.name })}
        onDelete={(id) => deletePosition(id)}
      />
    </AdminCrudPage>
  );
}