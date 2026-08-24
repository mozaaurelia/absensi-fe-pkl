"use client";

import { useCallback, useEffect, useState } from "react";
import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import { useLanguage } from "@/context/LanguageContext";
import {
  getEmployees,
  getShifts,
  getOfficeLocations,
  getWorkingDayPatterns,
  assignEmployeeSchedule,
  type AdminEmployee,
  type Shift,
  type OfficeLocation,
  type WorkingDayPattern,
} from "@/lib/services/admin";
import { getMySchedule, type EmployeeSchedule as EmployeeScheduleInfo } from "@/lib/services/schedule";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 outline-none focus:border-[#1E3A5F] transition-colors";

export default function AdminSchedulingPage() {
  const { t } = useLanguage();

  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [patterns, setPatterns] = useState<WorkingDayPattern[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [patternId, setPatternId] = useState("");
  const [startDate, setStartDate] = useState("");

  const [currentSchedule, setCurrentSchedule] = useState<EmployeeScheduleInfo | null>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMasters = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [emps, sh, loc, pat] = await Promise.all([
        getEmployees(),
        getShifts(),
        getOfficeLocations(),
        getWorkingDayPatterns(),
      ]);
      setEmployees(Array.isArray(emps) ? emps : []);
      setShifts(Array.isArray(sh) ? sh : []);
      setLocations(Array.isArray(loc) ? loc : []);
      setPatterns(Array.isArray(pat) ? pat : []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("adminMaster.failed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  const loadEmployeeSchedule = useCallback(async (employeeId: string) => {
    if (!employeeId) {
      setCurrentSchedule(null);
      return;
    }
    setLoadingEmployee(true);
    try {
      const sched = await getMySchedule(employeeId);
      setCurrentSchedule(sched);
    } catch {
      setCurrentSchedule(null);
    } finally {
      setLoadingEmployee(false);
    }
  }, []);

  useEffect(() => {
    loadEmployeeSchedule(selectedEmployee);
  }, [selectedEmployee, loadEmployeeSchedule]);

  const submit = async () => {
    if (!selectedEmployee || !shiftId || !locationId || !startDate) {
      setError(t("adminScheduling.required"));
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await assignEmployeeSchedule({
        employee_id: selectedEmployee,
        shift_id: shiftId,
        working_day_pattern_id: patternId || null,
        location_id: locationId,
        start_date: startDate,
      });
      setSuccess(t("adminScheduling.success"));
      setShiftId("");
      setLocationId("");
      setPatternId("");
      setStartDate("");
      await loadEmployeeSchedule(selectedEmployee);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("adminScheduling.failed"));
    } finally {
      setSaving(false);
    }
  };

  const endCurrent = async () => {
    if (!currentSchedule?.id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const { endEmployeeSchedule } = await import("@/lib/services/admin");
      await endEmployeeSchedule(currentSchedule.id);
      setSuccess(t("adminScheduling.ended"));
      await loadEmployeeSchedule(selectedEmployee);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("adminScheduling.failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminCrudPage titleKey="adminCrud.schedulingTitle">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
            {t("adminScheduling.assignTitle")}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
            {t("adminScheduling.assignDesc")}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 bg-green-50 dark:bg-green-500/10 text-xs text-green-600 dark:text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {loading ? (
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ) : loadError ? (
            <p className="text-sm text-gray-400">{loadError}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminScheduling.employee")} *
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {employees
                    .filter((e) => e.status === "active")
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminScheduling.shift")} *
                </label>
                <select
                  value={shiftId}
                  onChange={(e) => setShiftId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {shifts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.start_time} - {s.end_time})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminScheduling.location")} *
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminScheduling.pattern")}
                </label>
                <select
                  value={patternId}
                  onChange={(e) => setPatternId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">{t("adminMaster.placeholder")}</option>
                  {patterns.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminScheduling.startDate")} *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                onClick={submit}
                disabled={saving}
                className="w-full bg-[#1E3A5F] text-white text-sm font-semibold py-3 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
              >
                {saving ? t("common.saving") : t("adminScheduling.save")}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
            {t("adminScheduling.currentTitle")}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
            {t("adminScheduling.currentDesc")}
          </p>

          {!selectedEmployee ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">
              {t("adminScheduling.selectFirst")}
            </p>
          ) : loadingEmployee ? (
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ) : !currentSchedule ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {t("adminScheduling.noSchedule")}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t("adminScheduling.noScheduleDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {currentSchedule.shift_name || "-"}
                  </p>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                    {t("adminScheduling.active")}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    {t("adminScheduling.hours")}: {currentSchedule.start_time} - {currentSchedule.end_time}
                  </p>
                  <p>
                    {t("adminScheduling.location")}: {currentSchedule.location_name || "-"}
                  </p>
                  <p>
                    {t("adminScheduling.startDate")}: {currentSchedule.start_date}
                  </p>
                </div>
              </div>

              <button
                onClick={endCurrent}
                disabled={saving}
                className="w-full border border-red-200 dark:border-red-500/30 text-red-500 text-sm font-semibold py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-60"
              >
                {saving ? t("common.saving") : t("adminScheduling.endSchedule")}
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminCrudPage>
  );
}
