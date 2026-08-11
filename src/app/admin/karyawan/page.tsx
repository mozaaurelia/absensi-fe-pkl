"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import EmployeesManager from "@/components/admin/master/EmployeesManager";
import EmployeeStatsCards from "@/components/admin/employees/EmployeeStatsCards";

export default function AdminEmployeesPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.employeesTitle">
      <EmployeeStatsCards />
      <EmployeesManager />
    </AdminCrudPage>
  );
}