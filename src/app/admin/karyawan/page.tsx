"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import EmployeesManager from "@/components/admin/master/EmployeesManager";

export default function AdminEmployeesPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.employeesTitle">
      <EmployeesManager />
    </AdminCrudPage>
  );
}