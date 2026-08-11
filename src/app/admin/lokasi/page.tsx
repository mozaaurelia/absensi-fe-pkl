"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import MasterDataCRUD from "@/components/admin/master/MasterDataCRUD";
import {
  getOfficeLocations,
  createOfficeLocation,
  updateOfficeLocation,
  deleteOfficeLocation,
  type OfficeLocation,
} from "@/lib/services/admin";

export default function AdminLocationsPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.locationsTitle">
      <MasterDataCRUD<OfficeLocation>
        titleKey="adminCrud.locations"
        subtitleKey="adminCrud.locationsDesc"
        columns={[
          { key: "name", label: "adminCrud.name" },
          { key: "latitude", label: "adminCrud.latitude" },
          { key: "longitude", label: "adminCrud.longitude" },
          { key: "radius_meters", label: "adminCrud.radiusMeters" },
        ]}
        fields={[
          {
            name: "name",
            label: "adminCrud.name",
            type: "text",
            required: true,
            placeholder: "adminCrud.placeholder",
          },
          {
            name: "latitude",
            label: "adminCrud.latitude",
            type: "number",
            required: true,
          },
          {
            name: "longitude",
            label: "adminCrud.longitude",
            type: "number",
            required: true,
          },
          {
            name: "radius_meters",
            label: "adminCrud.radiusMeters",
            type: "number",
            required: true,
          },
        ]}
        fetchRows={getOfficeLocations}
        onCreate={(v) =>
          createOfficeLocation({
            name: v.name,
            latitude: v.latitude,
            longitude: v.longitude,
            radius_meters: v.radius_meters,
          })
        }
        onUpdate={(id, v) =>
          updateOfficeLocation(id, {
            name: v.name,
            latitude: v.latitude,
            longitude: v.longitude,
            radius_meters: v.radius_meters,
          })
        }
        onDelete={(id) => deleteOfficeLocation(id)}
      />
    </AdminCrudPage>
  );
}