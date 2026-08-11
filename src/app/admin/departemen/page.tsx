"use client";

import { useState } from "react";
import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import MasterDataCRUD from "@/components/admin/master/MasterDataCRUD";
import DepartmentPolicyModal from "@/components/admin/master/DepartmentPolicyModal";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type Department,
} from "@/lib/services/admin";

export default function AdminDepartmentsPage() {
  const [policyDeptId, setPolicyDeptId] = useState<string | null>(null);

  return (
    <AdminCrudPage titleKey="adminCrud.departmentsTitle">
      <MasterDataCRUD<Department>
        titleKey="adminCrud.departments"
        subtitleKey="adminCrud.departmentsDesc"
        columns={[
          { key: "name", label: "adminCrud.name" },
          {
            key: "policy",
            label: "adminCrud.policy",
            render: (row) => (
              <button
                onClick={() => setPolicyDeptId(row.id)}
                className="text-xs font-semibold text-[#1E3A5F] dark:text-blue-300 hover:underline"
              >
                {policyDeptId === row.id ? "..." : "Policy"}
              </button>
            ),
          },
        ]}
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

      {policyDeptId && (
        <DepartmentPolicyModal
          departmentId={policyDeptId}
          onClose={() => setPolicyDeptId(null)}
        />
      )}
    </AdminCrudPage>
  );
}