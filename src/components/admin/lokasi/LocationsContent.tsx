"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  getOfficeLocations,
  getEmployees,
  deleteOfficeLocation,
  updateOfficeLocation,
  getAttendanceReport,
  type OfficeLocation,
} from "@/lib/services/admin";
import { ApiError } from "@/lib/api";
import { FiPlus } from "react-icons/fi";
import LocationStatsCards from "./LocationStatsCards";
import LocationSearchBar from "./LocationSearchBar";
import LocationCard from "./LocationCard";
import LocationModal from "./LocationModal";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; row: OfficeLocation }
  | null;

export default function LocationsContent() {
  const { t } = useLanguage();

  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [checkInToday, setCheckInToday] = useState(0);
  const [checkOutToday, setCheckOutToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const [locs, emps, report] = await Promise.all([
        getOfficeLocations(),
        getEmployees(),
        getAttendanceReport({ start_date: today, end_date: today }),
      ]);
      setLocations(Array.isArray(locs) ? locs : []);
      setEmployeeCount(Array.isArray(emps) ? emps.length : 0);
      const rows = Array.isArray(report) ? report : [];
      setCheckInToday(rows.filter((r) => r.clock_in_time).length);
      setCheckOutToday(rows.filter((r) => r.clock_out_time).length);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("adminMaster.failed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(
      (l) =>
        String(l.name ?? "").toLowerCase().includes(q) ||
        String(l.address ?? "").toLowerCase().includes(q)
    );
  }, [locations, search]);

  const toggleStatus = async (loc: OfficeLocation) => {
    try {
      await updateOfficeLocation(loc.id, { is_active: !(loc.is_active !== false) });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("adminMaster.failed"));
    }
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setSaving(true);
    setError(null);
    try {
      await deleteOfficeLocation(confirmId);
      setConfirmId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("adminMaster.deleteFailed"));
    } finally {
      setSaving(false);
    }
  };

  const activeLocations = locations.filter((l) => l.is_active !== false).length;

  return (
    <div>
      <LocationStatsCards
        totalLocations={locations.length}
        activeLocations={activeLocations}
        totalEmployees={employeeCount}
        checkInToday={checkInToday}
        checkOutToday={checkOutToday}
        loading={loading}
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <LocationSearchBar
          value={search}
          onChange={setSearch}
          placeholder={t("locationModal.searchLocations")}
        />
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#16304f] transition-colors"
        >
          <FiPlus size={15} />
          {t("adminMaster.add")}
        </button>
      </div>

      {error && (
        <div className="px-5 py-3 mb-4 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-sm text-gray-400">{t("common.loading")}</div>
      ) : loadError ? (
        <div className="p-10 text-center text-sm text-gray-400">{loadError}</div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {t("adminMaster.empty")}
          </p>
          {search && (
            <p className="text-xs text-gray-400 mt-1">
              {t("locationModal.countLocations").replace("{count}", String(locations.length))}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              onEdit={(row) => setModal({ mode: "edit", row })}
              onDelete={(id) => {
                setConfirmId(id);
                setError(null);
              }}
              onToggleStatus={toggleStatus}
            />
          ))}
        </div>
      )}

      {modal && (
        <LocationModal
          mode={modal.mode}
          initial={modal.mode === "edit" ? modal.row : null}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
              {t("adminMaster.deleteConfirm")}
            </h3>
            {error && <p className="text-xs text-red-500 mb-4 text-center">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                disabled={saving}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="flex-1 bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {saving ? t("common.saving") : t("adminMaster.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
