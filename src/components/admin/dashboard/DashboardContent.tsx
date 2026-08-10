import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StatsGrid";
import AttendanceTrendChart from "./AttendanceTrendChart";
import SmartInsight from "./SmartInsight";
import DisciplineLeaderboard from "./DisciplineLeaderboard";
import PendingApprovals from "./PendingApprovals";
import RecentActivity from "./RecentActivity";
import DepartmentBreakdown from "./DepartmentBreakdown";

export default function DashboardContent() {
  return (
    <div>
      <DashboardHeader />
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <AttendanceTrendChart />
        </div>
        <SmartInsight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <PendingApprovals />
        </div>
        <DisciplineLeaderboard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <DepartmentBreakdown />
      </div>
    </div>
  );
}