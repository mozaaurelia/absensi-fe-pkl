import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import LeaveHeader from "@/components/karyawan/leave/LeaveHeader";
import LeaveContent from "@/components/karyawan/leave/LeaveContent";

export default function LeavePage() {
  return (
    <KaryawanLayout>
      <LeaveHeader />
      <LeaveContent />
    </KaryawanLayout>
  );
}
