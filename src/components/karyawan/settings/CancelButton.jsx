export default function CancelButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Batalkan
    </button>
  );
}