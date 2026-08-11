"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api";
import {
  getEmployees,
  getRoles,
  getDepartments,
  getPositions,
  createEmployee,
  updateEmployee,
  resignEmployee,
  type AdminEmployee,
  type Role,
  type Department,
  type Position,
} from "@/lib/services/admin";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors";

export default function EmployeesManager() {
  const { t } = useLanguage();

  const [rows, setRows] = useState<AdminEmployee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modal, setModal] = useState<
    { mode: "create" } | { mode: "edit"; row: AdminEmployee } | null
  >(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [emps, r, d, p] = await Promise.all([
        getEmployees(),
        getRoles(),
        getDepartments(),
        getPositions(),
      ]);
      setRows(Array.isArray(emps) ? emps : []);
      setRoles(Array.isArray(r) ? r : []);
      setDepartments(Array.isArray(d) ? d : []);
      setPositions(Array.isArray(p) ? p : []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("adminMaster.failed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const deptName = useMemo(
    () => (id?: string | null) => departments.find((d) => d.id === id)?.name ?? "-",
    [departments]
  );
  const posName = useMemo(
    () => (id?: string | null) => positions.find((p) => p.id === id)?.name ?? "-",
    [positions]
  );

  const supervisors = useMemo(
    () =>
      rows.filter(
        (e) =>
          e.status === "active" &&
          (e.role_name === "supervisor" || e.role_name === "admin")
      ),
    [rows]
  );

  const openCreate = () => {
    setValues({});
    setError(null);
    setModal({ mode: "create" });
  };

  const openEdit = (row: AdminEmployee) => {
    setValues({
      name: row.name,
      department_id: row.department_id ?? "",
      position_id: row.position_id ?? "",
    });
    setError(null);
    setModal({ mode: "edit", row });
  };

  const closeModal = () => {
    setModal(null);
    setError(null);
  };

  const submit = async () => {
    if (!modal) return;
    setError(null);

    if (modal.mode === "create") {
      if (
        !values.name?.trim() ||
        !values.email?.trim() ||
        !values.password ||
        !values.role_id
      ) {
        setError(t("adminMaster.required"));
        return;
      }
      setSaving(true);
      try {
        await createEmployee({
          name: values.name,
          email: values.email,
          password: values.password,
          role_id: values.role_id,
          department_id: values.department_id || null,
          position_id: values.position_id || null,
          supervisor_id: values.supervisor_id || null,
          join_date: values.join_date || null,
        });
        closeModal();
        await load();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : t("adminMaster.failed"));
      } finally {
        setSaving(false);
      }
    } else {
      if (!values.name?.trim()) {
        setError(t("adminMaster.required"));
        return;
      }
      setSaving(true);
      try {
        await updateEmployee(modal.row.id, {
          name: values.name,
          department_id: values.department_id || undefined,
          position_id: values.position_id || undefined,
        });
        closeModal();
        await load();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : t("adminMaster.failed"));
      } finally {
        setSaving(false);
      }
    }
  };

  const confirmResign = async () => {
    if (!confirmId) return;
    setSaving(true);
    setError(null);
    try {
      await resignEmployee(confirmId);
      setConfirmId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("adminMaster.deleteFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            {t("adminCrud.employees")}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{t("adminCrud.employeesDesc")}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors"
        >
          <FiPlus size={14} />
          {t("adminMaster.add")}
        </button>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-sm text-gray-400">{t("common.loading")}</div>
      ) : loadError ? (
        <div className="p-8 text-center text-sm text-gray-400">{loadError}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
                <th className="px-6 py-3 font-semibold">{t("adminCrud.name")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminCrud.email")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminCrud.role")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminCrud.department")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminCrud.position")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminCrud.status")}</th>
                <th className="px-6 py-3 font-semibold text-right">{t("adminMaster.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{row.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{row.role_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{deptName(row.department_id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{posName(row.position_id)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        row.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(row)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        aria-label={t("adminMaster.edit")}
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmId(row.id);
                          setError(null);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        aria-label={t("adminMaster.delete")}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
              {modal.mode === "create" ? t("adminMaster.add") : t("adminMaster.edit")}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminCrud.name")} *
                </label>
                <input
                  type="text"
                  value={values.name ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {modal.mode === "create" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {t("adminCrud.email")} *
                    </label>
                    <input
                      type="email"
                      value={values.email ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {t("adminCrud.password")} *
                    </label>
                    <input
                      type="password"
                      value={values.password ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {modal.mode === "create" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {t("adminCrud.role")} *
                  </label>
                  <select
                    value={values.role_id ?? ""}
                    onChange={(e) => setValues((p) => ({ ...p, role_id: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">{t("adminMaster.placeholder")}</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminCrud.department")}
                </label>
                <select
                  value={values.department_id ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, department_id: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminCrud.position")}
                </label>
                <select
                  value={values.position_id ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, position_id: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {modal.mode === "create" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {t("adminCrud.supervisor")}
                    </label>
                    <select
                      value={values.supervisor_id ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, supervisor_id: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">{t("adminMaster.placeholder")}</option>
                      {supervisors.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {t("adminCrud.joinDate")}
                    </label>
                    <input
                      type="date"
                      value={values.join_date ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, join_date: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </>
              )}
            </div>

            {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                disabled={saving}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
              >
                {saving ? t("common.saving") : t("adminMaster.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
              {t("adminCrud.resignConfirm")}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                disabled={saving}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmResign}
                disabled={saving}
                className="flex-1 bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {saving ? t("common.saving") : t("adminCrud.resign")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}