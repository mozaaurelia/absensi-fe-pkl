import Sidebar from "@/components/karyawan/dashboard/SidebarWidget";
import HistoryHeader from "@/components/karyawan/history/HistoryHeader";
import HistoryContent from "@/components/karyawan/history/HistoryContent";

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 p-8">
        <HistoryHeader />
        <HistoryContent />
      </main>
    </div>
  );
}
