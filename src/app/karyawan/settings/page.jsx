import Sidebar from "@/components/karyawan/dashboard/Sidebar/Sidebar";
import SettingsHeader from "@/components/karyawan/settings/SettingsHeader";
import SettingsContent from "@/components/karyawan/settings/SettingsContent";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <SettingsHeader />
        <SettingsContent />
      </main>
    </div>
  );
}