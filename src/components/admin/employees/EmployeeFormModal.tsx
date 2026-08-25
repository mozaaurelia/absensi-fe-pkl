import type { ReactNode } from "react";
import { FiBriefcase, FiCreditCard, FiFileText, FiKey, FiUser, FiX } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import type { AdminEmployee, Department, Position } from "@/lib/services/admin";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors";

interface Props {
  mode: "create" | "edit";
  values: Record<string, string>;
  onChange: (patch: Record<string, string>) => void;
  departments: Department[];
  positions: Position[];
  supervisors: AdminEmployee[];
  error: string | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-7 h-7 rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F] dark:bg-blue-400/20 dark:text-blue-300 flex items-center justify-center">
        {icon}
      </span>
      <h4 className="text-xs font-bold uppercase tracking-wide text-[#1E3A5F] dark:text-blue-300">
        {children}
      </h4>
    </div>
  );
}

export default function EmployeeFormModal({
  mode,
  values,
  onChange,
  departments,
  positions,
  supervisors,
  error,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useLanguage();

  const isCreate = mode === "create";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-8 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              {isCreate ? t("adminEmployeeForm.title") : t("adminMaster.edit")}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {t("adminEmployeeForm.desc")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
            aria-label={t("common.close")}
          >
            <FiX size={18} />
          </button>
        </div>

        {isCreate ? (
          <div className="p-8 space-y-8">
            <section>
              <SectionTitle icon={<FiKey size={14} />}>
                {t("adminEmployeeForm.idAccess")}
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Field label={t("adminEmployeeForm.fullName")} required>
                  <input
                    type="text"
                    value={values.name ?? ""}
                    onChange={(e) => onChange({ name: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("adminEmployeeForm.employeeNumber")}>
                  <input
                    type="text"
                    value={values.employee_number ?? ""}
                    onChange={(e) => onChange({ employee_number: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("adminEmployeeForm.email")} required>
                  <input
                    type="email"
                    value={values.email ?? ""}
                    onChange={(e) => onChange({ email: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("adminEmployeeForm.whatsapp")}>
                  <input
                    type="tel"
                    value={values.whatsapp ?? ""}
                    onChange={(e) => onChange({ whatsapp: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            <section>
              <SectionTitle icon={<FiUser size={14} />}>
                {t("adminEmployeeForm.personalData")}
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Field label={t("adminEmployeeForm.birthDate")}>
                  <input
                    type="date"
                    value={values.birth_date ?? ""}
                    onChange={(e) => onChange({ birth_date: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("adminEmployeeForm.gender")}>
                  <select
                    value={values.gender ?? ""}
                    onChange={(e) => onChange({ gender: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t("adminEmployeeForm.selectManager").split(" ").slice(1).join(" ") || "-- Pilih --"}</option>
                    <option value="male">{t("adminEmployeeForm.male")}</option>
                    <option value="female">{t("adminEmployeeForm.female")}</option>
                  </select>
                </Field>
                <Field label={t("adminEmployeeForm.maritalStatus")}>
                  <select
                    value={values.marital_status ?? ""}
                    onChange={(e) => onChange({ marital_status: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t("adminEmployeeForm.selectManager").split(" ").slice(1).join(" ") || "-- Pilih --"}</option>
                    <option value="single">{t("adminEmployeeForm.single")}</option>
                    <option value="married">{t("adminEmployeeForm.married")}</option>
                    <option value="divorced">{t("adminEmployeeForm.divorced")}</option>
                  </select>
                </Field>
                <div className="md:col-span-2 xl:col-span-1" />
                <div className="md:col-span-2">
                  <Field label={t("adminEmployeeForm.address")}>
                    <input
                      type="text"
                      value={values.address ?? ""}
                      onChange={(e) => onChange({ address: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle icon={<FiBriefcase size={14} />}>
                {t("adminEmployeeForm.organization")}
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <Field label={t("adminEmployeeForm.department")}>
                  <select
                    value={values.department_id ?? ""}
                    onChange={(e) => onChange({ department_id: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t("adminEmployeeForm.selectDepartment")}</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("adminEmployeeForm.position")}>
                  <select
                    value={values.position_id ?? ""}
                    onChange={(e) => onChange({ position_id: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t("adminEmployeeForm.selectPosition")}</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("adminEmployeeForm.manager")}>
                  <select
                    value={values.supervisor_id ?? ""}
                    onChange={(e) => onChange({ supervisor_id: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t("adminEmployeeForm.selectManager")}</option>
                    {supervisors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            <section>
              <SectionTitle icon={<FiFileText size={14} />}>
                {t("adminEmployeeForm.contractData")}
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label={t("adminEmployeeForm.contractStatus")}>
                  <select
                    value={values.contract_status ?? ""}
                    onChange={(e) => onChange({ contract_status: e.target.value })}
                    className={inputClass}
                  >
                    <option value="kontrak">{t("adminEmployeeForm.contract")}</option>
                  </select>
                </Field>
                <Field label={t("adminEmployeeForm.startContract")}>
                  <input
                    type="date"
                    value={values.start_contract ?? ""}
                    onChange={(e) => onChange({ start_contract: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("adminEmployeeForm.endContract")}>
                  <input
                    type="date"
                    value={values.end_contract ?? ""}
                    onChange={(e) => onChange({ end_contract: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            <section>
              <SectionTitle icon={<FiCreditCard size={14} />}>
                {t("adminEmployeeForm.pkwtData")}
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label={t("adminEmployeeForm.pkwtNumber")}>
                  <input
                    type="text"
                    value={values.pkwt_number ?? ""}
                    onChange={(e) => onChange({ pkwt_number: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("adminEmployeeForm.pkwtDuration")}>
                  <input
                    type="text"
                    placeholder={t("adminEmployeeForm.pkwtDurationPlaceholder")}
                    value={values.pkwt_duration ?? ""}
                    onChange={(e) => onChange({ pkwt_duration: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("adminEmployeeForm.compensationDate")}>
                  <input
                    type="date"
                    value={values.compensation_date ?? ""}
                    onChange={(e) => onChange({ compensation_date: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label={t("adminCrud.name")} required>
                <input
                  type="text"
                  value={values.name ?? ""}
                  onChange={(e) => onChange({ name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={t("adminCrud.department")}>
                <select
                  value={values.department_id ?? ""}
                  onChange={(e) => onChange({ department_id: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("adminCrud.position")}>
                <select
                  value={values.position_id ?? ""}
                  onChange={(e) => onChange({ position_id: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {error && <p className="text-xs text-red-500 mt-4">{error}</p>}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1E3A5F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
          >
            {saving
              ? t("common.saving")
              : isCreate
                ? `${t("adminEmployeeForm.continueFaceScan")} →`
                : t("adminMaster.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
