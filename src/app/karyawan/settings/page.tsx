import KaryawanLayout from "@/components/karyawan/layout/KaryawanLayout";
import SettingsHeader from "@/components/karyawan/settings/SettingsHeader";
import SettingsContent from "@/components/karyawan/settings/SettingsContent";

export default function SettingsPage() {
  return (
    <KaryawanLayout>
      <SettingsHeader />
      <SettingsContent />
    </KaryawanLayout>
  );
}
