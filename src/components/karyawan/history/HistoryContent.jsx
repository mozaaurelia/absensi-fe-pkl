import HistoryFilter from "./HistoryFilter";
import HistorySummary from "./HistorySummary";
import HistoryTable from "./HistoryTable";

export default function HistoryContent() {
  return (
    <div>
      <HistoryFilter />
      <HistorySummary />
      <HistoryTable />
    </div>
  );
}