import Sidebar from "@/components/karyawan/dashboard/Sidebar/Sidebar";
import AttendanceHeader from "@/components/karyawan/attendance/AttendanceHeader";
import AttendanceStatus from "@/components/karyawan/attendance/AttendanceStatus";
import AttendanceContent from "@/components/karyawan/attendance/AttendanceContent";
import AttendanceAction from "@/components/karyawan/attendance/AttendanceAction";
import AttendanceInformation from "@/components/karyawan/attendance/AttendanceInformation";
import AttendanceHistory from "@/components/karyawan/attendance/AttendanceHistory";

export default function AttendancePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Halo, Andi Pratama
            </h1>
            <p className="text-xs text-gray-400 mt-1">Rabu, 8 Juli 2026</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Karyawan</p>
              <p className="text-xs text-gray-400">Operasional</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1E3A5F] font-bold text-sm flex items-center justify-center">
              AP
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <AttendanceHeader />
            <AttendanceStatus status="Belum Absen" />
          </div>

          <AttendanceContent />
          <AttendanceAction />
          <AttendanceInformation />
        </div>

        <AttendanceHistory />
      </main>
    </div>
  );
}