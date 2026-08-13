"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import LocationsContent from "@/components/admin/lokasi/LocationsContent";

export default function AdminLocationsPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.locationsTitle" hideTitle>
      <LocationsContent />
    </AdminCrudPage>
  );
}
