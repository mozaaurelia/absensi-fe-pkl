import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import SchedulingContent from "@/components/admin/penjadwalan/SchedulingContent";

export default function AdminSchedulingPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.schedulingTitle">
      <SchedulingContent />
    </AdminCrudPage>
  );
}
