import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import ScheduleHeader from "@/components/karyawan/schedule/ScheduleHeader";
import ScheduleContent from "@/components/karyawan/schedule/ScheduleContent";

export default function SchedulePage() {
  return (
    <KaryawanLayout>
      <ScheduleHeader />
      <ScheduleContent />
    </KaryawanLayout>
  );
}
