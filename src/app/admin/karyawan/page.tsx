"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import EmployeeManager from "@/components/admin/employees/EmployeeManager";
import EmployeeStatsCards from "@/components/admin/employees/EmployeeStatsCards";

export default function AdminEmployeesPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.employeesTitle">
      <EmployeeStatsCards />
      <EmployeeManager />
    </AdminCrudPage>
  );
}
