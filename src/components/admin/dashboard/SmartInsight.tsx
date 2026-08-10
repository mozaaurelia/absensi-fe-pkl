interface Insight {
  type: "warning" | "positive" | "info";
  text: string;
}

const insights: Insight[] = [
  {
    type: "warning",
    text: "3 karyawan di Divisi Operasional terlambat lebih dari 3x minggu ini.",
  },
  {
    type: "positive",
    text: "Tingkat kehadiran naik 4% dibanding minggu lalu.",
  },
  {
    type: "info",
    text: "5 pengajuan cuti menumpuk untuk periode akhir bulan — pertimbangkan review lebih awal.",
  },
];

const styles: Record<Insight["type"], { bg: string; text: string; icon: React.ReactNode }> = {
  warning: { bg: "bg-blue-50 border-blue-100", text: "text-[#1E3A5F]", icon: <WarningIcon /> },
  positive: { bg: "bg-green-50 border-green-100", text: "text-green-700", icon: <CheckIcon /> },
  info: { bg: "bg-blue-50 border-blue-100", text: "text-[#1E3A5F]", icon: <InfoIcon /> },
};

export default function SmartInsight() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A5F] flex items-center justify-center">
          <BulbIcon />
        </span>
        <h3 className="font-bold text-gray-900 text-sm">Insight Otomatis</h3>
      </div>

      <div className="flex flex-col gap-2.5">
        {insights.map((insight, i) => {
          const style = styles[insight.type];
          return (
            <div
              key={i}
              className={`flex items-start gap-2.5 border rounded-xl px-3.5 py-3 ${style.bg}`}
            >
              <span className={`shrink-0 mt-0.5 ${style.text}`}>{style.icon}</span>
              <p className={`text-xs leading-relaxed ${style.text}`}>{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 9v4M12 17h.01M10.3 4.5L2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a1.5 1.5 0 0 0-2.6 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}