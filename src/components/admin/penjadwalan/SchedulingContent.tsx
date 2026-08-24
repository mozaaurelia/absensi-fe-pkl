"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AssignScheduleCard from "./AssignScheduleCard";
import CurrentScheduleCard from "./CurrentScheduleCard";
import DailyScheduleTable from "./DailyScheduleTable";
import {
  getEmployees,
  getShifts,
  getOfficeLocations,
  getWorkingDayPatterns,
  getDepartments,
  assignEmployeeSchedule,
  endEmployeeSchedule,
  type AdminEmployee,
  type OfficeLocation,
  type Shift,
  type WorkingDayPattern,
} from "@/lib/services/admin";
import { getMySchedule } from "@/lib/services/schedule";
import { todayISO, type EmployeeWithSchedule } from "./types";

export default function SchedulingContent() {
  const { t } = useLanguage();

  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [patterns, setPatterns] = useState<WorkingDayPattern[]>([]);

  const [rows, setRows] = useState<EmployeeWithSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [patternId, setPatternId] = useState("");
  const [startDate, setStartDate] = useState("");

  const [currentSchedule, setCurrentSchedule] =
    useState<EmployeeWithSchedule["schedule"]>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  const [loadingMasters, setLoadingMasters] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingRows, setLoadingRows] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMastersAndRows = useCallback(async () => {
    setLoadingMasters(true);
    setLoadingRows(true);
    setLoadError(null);
    try {
      const [emps, sh, loc, pat, depts] = await Promise.all([
        getEmployees(),
        getShifts(),
        getOfficeLocations(),
        getWorkingDayPatterns(),
        getDepartments().catch(() => []),
      ]);
      setEmployees(Array.isArray(emps) ? emps : []);
      setShifts(Array.isArray(sh) ? sh : []);
      setLocations(Array.isArray(loc) ? loc : []);
      setPatterns(Array.isArray(pat) ? pat : []);

      const deptMap = new Map(
        (Array.isArray(depts) ? depts : []).map((d) => [d.id, d.name])
      );
      const activeEmps = (Array.isArray(emps) ? emps : [])
        .filter((e) => e.status === "active")
        .map((e) => ({
          id: e.id,
          name: e.name,
          department: e.department_id
            ? deptMap.get(e.department_id) ?? "-"
            : "-",
        }));

      const schedules = await Promise.all(
        activeEmps.map((e) =>
          getMySchedule(e.id).catch(() => null)
        )
      );
      setRows(
        activeEmps.map((e, i) => ({ ...e, schedule: schedules[i] ?? null }))
      );
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("adminMaster.failed"));
    } finally {
      setLoadingMasters(false);
      setLoadingRows(false);
    }
  }, [t]);

  useEffect(() => {
    loadMastersAndRows();
  }, [loadMastersAndRows]);

  const loadCurrentSchedule = useCallback(async (employeeId: string) => {
    if (!employeeId) {
      setCurrentSchedule(null);
      return;
    }
    setLoadingEmployee(true);
    try {
      setCurrentSchedule(await getMySchedule(employeeId));
    } catch {
      setCurrentSchedule(null);
    } finally {
      setLoadingEmployee(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentSchedule(selectedEmployee);
  }, [selectedEmployee, loadCurrentSchedule]);

  const refreshRowsFor = useCallback(async (employeeId: string) => {
    let sched: EmployeeWithSchedule["schedule"] = null;
    try {
      sched = await getMySchedule(employeeId);
    } catch {
      sched = null;
    }
    setRows((prev) =>
      prev.map((r) => (r.id === employeeId ? { ...r, schedule: sched } : r))
    );
  }, []);

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
      await loadCurrentSchedule(selectedEmployee);
      await refreshRowsFor(selectedEmployee);
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
      await endEmployeeSchedule(currentSchedule.id);
      setSuccess(t("adminScheduling.ended"));
      await loadCurrentSchedule(selectedEmployee);
      await refreshRowsFor(selectedEmployee);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("adminScheduling.failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <DailyScheduleTable
        rows={rows}
        patterns={patterns}
        loading={loadingRows}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssignScheduleCard
          employees={employees}
          shifts={shifts}
          locations={locations}
          patterns={patterns}
          loading={loadingMasters}
          loadError={loadError}
          selectedEmployee={selectedEmployee}
          onSelectedEmployeeChange={setSelectedEmployee}
          shiftId={shiftId}
          onShiftIdChange={setShiftId}
          locationId={locationId}
          onLocationIdChange={setLocationId}
          patternId={patternId}
          onPatternIdChange={setPatternId}
          startDate={startDate}
          onStartDateChange={setStartDate}
          saving={saving}
          error={error}
          success={success}
          onSubmit={submit}
        />

        <CurrentScheduleCard
          selectedEmployee={selectedEmployee}
          loading={loadingEmployee}
          schedule={currentSchedule}
          saving={saving}
          onEndSchedule={endCurrent}
        />
      </div>
    </div>
  );
}
