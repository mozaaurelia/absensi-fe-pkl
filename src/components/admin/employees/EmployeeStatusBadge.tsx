import { useLanguage } from "@/context/LanguageContext";

export default function EmployeeStatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        active
          ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-green-600" : "bg-red-500"
        }`}
      />
      {active ? t("adminCrud.active") : t("adminCrud.resigned")}
    </span>
  );
}
