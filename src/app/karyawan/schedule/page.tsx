import Sidebar from "@/components/karyawan/dashboard/SidebarWidget";
import ScheduleHeader from "@/components/karyawan/schedule/ScheduleHeader";
import ScheduleContent from "@/components/karyawan/schedule/ScheduleContent";

export default function SchedulePage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 p-8">
        <ScheduleHeader />
        <ScheduleContent />
      </main>
    </div>
  );
}
