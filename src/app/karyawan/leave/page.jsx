import Sidebar from "@/components/karyawan/dashboard/Sidebar/Sidebar";
import LeaveHeader from "@/components/karyawan/leave/LeaveHeader";
import LeaveContent from "@/components/karyawan/leave/LeaveContent";

export default function LeavePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <LeaveHeader />
        <LeaveContent />
      </main>
    </div>
  );
}