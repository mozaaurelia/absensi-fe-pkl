"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import MasterDataCRUD from "@/components/admin/master/MasterDataCRUD";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type Department,
} from "@/lib/services/admin";

export default function AdminDepartmentsPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.departmentsTitle">
      <MasterDataCRUD<Department>
        titleKey="adminCrud.departments"
        subtitleKey="adminCrud.departmentsDesc"
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
        fetchRows={getDepartments}
        onCreate={(v) => createDepartment({ name: v.name })}
        onUpdate={(id, v) => updateDepartment(id, { name: v.name })}
        onDelete={(id) => deleteDepartment(id)}
      />
    </AdminCrudPage>
  );
}