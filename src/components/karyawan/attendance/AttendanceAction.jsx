export default function AttendanceAction() {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      <button className="bg-green-600 text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-green-700 transition-colors">
        Masuk Kerja
      </button>
      <button className="bg-red-600 text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-red-700 transition-colors">
        Pulang Kerja
      </button>
    </div>
  );
}