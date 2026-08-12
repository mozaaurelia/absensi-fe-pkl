import { FiPlus, FiUserPlus } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  onAdd: () => void;
}

export default function EmployeeHeader({ onAdd }: Props) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A5F] via-[#24476f] to-[#2f5d94] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-14 right-24 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center text-white shrink-0">
          <FiUserPlus size={24} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg sm:text-xl">
            {t("adminCrud.employees")}
          </h3>
          <p className="text-xs text-white/70 mt-0.5">
            {t("adminCrud.employeesDesc")}
          </p>
        </div>
      </div>

      <button
        onClick={onAdd}
        className="relative flex items-center gap-2 bg-white text-[#1E3A5F] text-xs font-semibold px-5 py-3 rounded-xl shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all"
      >
        <FiPlus size={15} className="stroke-2" />
        {t("adminCrud.addEmployee")}
      </button>
    </div>
  );
}
