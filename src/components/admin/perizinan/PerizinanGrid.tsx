import type { Perizinan } from "./types";
import PerizinanCard from "./PerizinanCard";

interface PerizinanGridProps {
  requests: Perizinan[];
  onApprove: (request: Perizinan) => void;
  onReject: (request: Perizinan) => void;
}

export default function PerizinanGrid({ requests, onApprove, onReject }: PerizinanGridProps) {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center animate-fade-slide-up">
        <p className="text-4xl mb-3">🗂️</p>
        <p className="text-sm text-gray-400">Tidak ada pengajuan yang cocok dengan pencarian.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {requests.map((request, i) => (
        <div key={request.id} style={{ animationDelay: `${i * 70}ms` }}>
          <PerizinanCard
            request={request}
            onApprove={() => onApprove(request)}
            onReject={() => onReject(request)}
          />
        </div>
      ))}
    </div>
  );
}
