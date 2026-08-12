import { FiAlertTriangle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ResignConfirmModal({ saving, onCancel, onConfirm }: Props) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-5">
          <span className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/15 text-red-500 flex items-center justify-center mb-3">
            <FiAlertTriangle size={22} />
          </span>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {t("adminCrud.resignConfirm")}
          </h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("adminCrud.resign")}
          </button>
        </div>
      </div>
    </div>
  );
}
