"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import AdminKalenderContent from "@/components/admin/kalender/AdminKalenderContent";

export default function AdminCalendarPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.calendarTitle">
      <AdminKalenderContent />
    </AdminCrudPage>
  );
}
