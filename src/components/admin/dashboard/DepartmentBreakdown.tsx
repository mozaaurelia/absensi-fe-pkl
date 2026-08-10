interface DepartmentStat {
  name: string;
  rate: number;
}

const departments: DepartmentStat[] = [
  { name: "Operasional", rate: 82 },
  { name: "IT", rate: 95 },
  { name: "Keuangan", rate: 98 },
  { name: "Marketing", rate: 88 },
];

export default function DepartmentBreakdown() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 text-sm mb-1">Kehadiran per Departemen</h3>
      <p className="text-xs text-gray-400 mb-5">Persentase kehadiran bulan berjalan.</p>

      <div className="flex flex-col gap-4">
        {departments.map((dept) => (
          <div key={dept.name}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-gray-700">{dept.name}</p>
              <p className="text-xs font-bold text-gray-900">{dept.rate}%</p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  dept.rate < 85 ? "bg-[#2a4f7a]" : "bg-[#1E3A5F]"
                }`}
                style={{ width: `${dept.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}