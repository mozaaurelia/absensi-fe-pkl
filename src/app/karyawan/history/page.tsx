import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import HistoryHeader from "@/components/karyawan/history/HistoryHeader";
import HistoryContent from "@/components/karyawan/history/HistoryContent";

export default function HistoryPage() {
  return (
    <KaryawanLayout>
      <HistoryHeader />
      <HistoryContent />
    </KaryawanLayout>
  );
}
