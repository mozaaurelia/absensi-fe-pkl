"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiEdit2, FiMapPin, FiPlus, FiSend, FiTrash2 } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import Layout from "@/components/admin/layout/layout";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ApiError } from "@/lib/api";
import {
  getCompanies,
  createCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
  inviteCompanyAdmin,
  type Company,
} from "@/lib/services/admin";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors";

export default function AdminCompaniesPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { t } = useLanguage();
  const router = useRouter();

  const [rows, setRows] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editRow, setEditRow] = useState<Company | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [picName, setPicName] = useState("");
  const [picEmail, setPicEmail] = useState("");
  const [locName, setLocName] = useState("");
  const [locLat, setLocLat] = useState("");
  const [locLng, setLocLng] = useState("");
  const [locRadius, setLocRadius] = useState("150");
  const [locQuery, setLocQuery] = useState("");
  const [locResults, setLocResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [locSearching, setLocSearching] = useState(false);
  const [locSelected, setLocSelected] = useState(false);

  const [inviteTarget, setInviteTarget] = useState<Company | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSending, setInviteSending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && user?.role !== "superadmin")) {
      router.replace("/auth/login");
    }
  }, [status, user?.role, router]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getCompanies();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (status === "authenticated" && user?.role === "superadmin") {
      load();
    }
  }, [status, user?.role, load]);

  const openCreate = () => {
    setName("");
    setPicName("");
    setPicEmail("");
    setLocName("");
    setLocLat("");
    setLocLng("");
    setLocRadius("150");
    setLocQuery("");
    setLocResults([]);
    setLocSelected(false);
    setError(null);
    setEditRow(null);
    setModal("create");
  };

  const searchLocation = async () => {
    const q = locQuery.trim();
    if (q.length < 3) return;
    setLocSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=id&q=${encodeURIComponent(q)}`,
      );
      const data = await res.json();
      setLocResults(Array.isArray(data) ? data : []);
    } catch {
      setLocResults([]);
    } finally {
      setLocSearching(false);
    }
  };

  const selectLocation = (r: { display_name: string; lat: string; lon: string }) => {
    setLocName(r.display_name.split(",")[0]?.trim() ?? "");
    setLocLat(r.lat);
    setLocLng(r.lon);
    setLocSelected(true);
    setLocResults([]);
    setLocQuery(r.display_name.split(",").slice(0, 3).join(",").trim());
  };

  const openEdit = (row: Company) => {
    setName(row.name);
    setPicName(row.pic_name ?? "");
    setPicEmail(row.pic_email ?? "");
    setError(null);
    setEditRow(row);
    setModal("edit");
  };

  const openInvite = (row: Company) => {
    setInviteTarget(row);
    setInviteEmail(row.pic_email ?? "");
    setInviteMsg(null);
    setInviteError(null);
  };

  const closeModal = () => {
    setModal(null);
    setError(null);
  };

  const submit = async () => {
    if (!name.trim()) {
      setError(t("adminCrud.nameRequired"));
      return;
    }
    const lat = parseFloat(locLat);
    const lng = parseFloat(locLng);
    const radius = parseFloat(locRadius);
    if (modal === "create" && (isNaN(lat) || isNaN(lng))) {
      setError(t("adminCompanies.locationRequired"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (modal === "create") {
        await createCompany(
          name.trim(),
          picName.trim() || undefined,
          picEmail.trim() || undefined,
          {
            name: locName.trim() || name.trim(),
            latitude: lat,
            longitude: lng,
            radius_meters: !isNaN(radius) && radius > 0 ? radius : 150,
          },
        );
      } else if (modal === "edit" && editRow) {
        await updateCompany(editRow.id, name.trim(), picName.trim() || undefined, picEmail.trim() || undefined);
      }
      closeModal();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("common.saveErrorDesc"));
    } finally {
      setSaving(false);
    }
  };

  const sendInvite = async () => {
    if (!inviteTarget) return;
    const email = inviteEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError(t("adminCompanies.invalidEmail"));
      return;
    }
    setInviteSending(true);
    setInviteError(null);
    try {
      const res = await inviteCompanyAdmin(inviteTarget.id, email);
      setInviteMsg(
        res.emailSent === false
          ? t("adminCompanies.inviteQueued") + (res.message ? ` (${res.message})` : "")
          : t("adminCompanies.inviteSuccess").replace("{email}", email),
      );
      await load();
    } catch (err) {
      setInviteError(err instanceof ApiError ? err.message : t("common.saveErrorDesc"));
    } finally {
      setInviteSending(false);
    }
  };

  const toggleStatus = async (row: Company) => {
    setSaving(true);
    setError(null);
    try {
      await updateCompanyStatus(
        row.id,
        row.status === "active" ? "inactive" : "active",
      );
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("common.saveErrorDesc"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setError(null);
    try {
      await deleteCompany(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("common.deleteErrorDesc"));
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="flex min-h-screen bg-gray-50" />;
  }

  if (!user || user.role !== "superadmin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">{t("accessDenied")}</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
              {t("adminCompanies.title")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {t("adminCompanies.desc")}
            </p>
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
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">{t("adminMaster.empty")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
                  <th className="px-6 py-3 font-semibold">{t("adminCompanies.name")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminCompanies.picCol")}</th>
                  <th className="px-6 py-3 font-semibold">{t("adminCompanies.status")}</th>
                  <th className="px-6 py-3 font-semibold text-right">{t("adminMaster.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {row.name}
                    </td>
                    <td className="px-6 py-4">
                      {row.pic_email ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {row.pic_email}
                          </span>
                          <span
                            className={`w-fit text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                              row.onboarded_at
                                ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                            }`}
                          >
                            {row.onboarded_at
                              ? t("adminCompanies.onboarded")
                              : t("adminCompanies.notOnboarded")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(row)}
                        disabled={saving}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors disabled:opacity-60 ${
                          row.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {row.status === "active"
                          ? t("adminCompanies.active")
                          : t("adminCompanies.inactive")}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openInvite(row)}
                          disabled={saving}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors disabled:opacity-60"
                          aria-label={t("adminCompanies.inviteSend")}
                          title={t("adminCompanies.inviteSend")}
                        >
                          <FiSend size={15} />
                        </button>
                        <button
                          onClick={() => openEdit(row)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          aria-label={t("adminMaster.edit")}
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          disabled={saving}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-60"
                          aria-label={t("adminMaster.delete")}
                          title={t("adminMaster.delete")}
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
      </div>

      {deleteTarget && (
        <ConfirmDialog
          description={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {inviteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              {t("adminCompanies.inviteTitle")}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              {t("adminCompanies.inviteDesc")} — <span className="font-semibold">{inviteTarget.name}</span>
            </p>

            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("adminCompanies.picEmail")} *
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="pic@perusahaan.com"
              className={inputClass}
            />

            {inviteMsg && (
              <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-lg px-4 py-3 mt-4">
                {inviteMsg}
              </p>
            )}
            {inviteError && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 mt-4">
                {inviteError}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setInviteTarget(null)}
                disabled={inviteSending}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={sendInvite}
                disabled={inviteSending}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
              >
                <FiSend size={14} />
                {inviteSending ? t("common.saving") : t("adminCompanies.inviteSend")}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
              {modal === "create" ? t("adminMaster.add") : t("adminMaster.edit")}
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminCompanies.name")} *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("adminCrud.placeholder")}
                className={inputClass}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminCompanies.picName")}
              </label>
              <input
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                placeholder={t("adminCompanies.picNamePlaceholder")}
                className={inputClass}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {t("adminCompanies.picEmail")}
              </label>
              <input
                type="email"
                value={picEmail}
                onChange={(e) => setPicEmail(e.target.value)}
                placeholder="pic@perusahaan.com"
                className={inputClass}
              />
            </div>

            {modal === "create" && (
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-1.5 mb-3">
                  <FiMapPin size={13} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("adminCompanies.officeLocationOptional") ?? "Lokasi Kantor"} *
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      Cari Lokasi
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={locQuery}
                        onChange={(e) => setLocQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            searchLocation();
                          }
                        }}
                        placeholder="Ketik nama tempat / alamat..."
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={searchLocation}
                        disabled={locSearching || locQuery.trim().length < 3}
                        className="shrink-0 bg-[#1E3A5F] text-white text-xs font-semibold px-4 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
                      >
                        {locSearching ? "..." : "Cari"}
                      </button>
                    </div>
                    {locResults.length > 0 && (
                      <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-50 dark:divide-gray-700/50 max-h-44 overflow-y-auto bg-white dark:bg-gray-800">
                        {locResults.map((r, i) => (
                          <button
                            key={`${r.lat}-${r.lon}-${i}`}
                            type="button"
                            onClick={() => selectLocation(r)}
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          >
                            {r.display_name}
                          </button>
                        ))}
                      </div>
                    )}
                    {locSelected && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                        <FiMapPin size={12} />
                        {locName} ({Number(locLat).toFixed(5)}, {Number(locLng).toFixed(5)})
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      Nama Lokasi
                    </label>
                    <input
                      value={locName}
                      onChange={(e) => setLocName(e.target.value)}
                      placeholder={t("adminCompanies.name")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      Radius (meter)
                    </label>
                    <input
                      value={locRadius}
                      onChange={(e) => setLocRadius(e.target.value)}
                      placeholder="150"
                      type="number"
                      min="50"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

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
    </Layout>
  );
}