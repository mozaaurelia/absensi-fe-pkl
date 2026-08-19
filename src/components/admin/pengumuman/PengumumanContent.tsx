"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiBell } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/services/announcement";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-[#1E3A5F] focus:bg-white dark:focus:bg-gray-700 transition-colors";

export default function PengumumanContent() {
  const { t } = useLanguage();

  const [rows, setRows] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editRow, setEditRow] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.loadErrorDesc"));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setTitle("");
    setContent("");
    setEditRow(null);
    setModal("create");
  };

  const openEdit = (row: Announcement) => {
    setTitle(row.title);
    setContent(row.content);
    setEditRow(row);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setTitle("");
    setContent("");
  };

  const submit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      if (modal === "create") {
        await createAnnouncement({ title: title.trim(), content: content.trim() });
      } else if (modal === "edit" && editRow) {
        await updateAnnouncement(editRow.id, { title: title.trim(), content: content.trim() });
      }
      closeModal();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.saveErrorDesc"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setError(null);
    try {
      await deleteAnnouncement(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.deleteErrorDesc"));
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            {t("adminAnnouncements.title")}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("adminAnnouncements.desc")}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#16304f] transition-colors"
        >
          <FiPlus size={14} />
          {t("adminAnnouncements.add")}
        </button>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-500/10 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-sm text-gray-400">{t("common.loading")}</div>
      ) : rows.length === 0 ? (
        <div className="p-12">
          <div className="flex flex-col items-center text-center">
            <span className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <FiBell size={24} className="text-gray-300 dark:text-gray-500" />
            </span>
            <p className="text-sm text-gray-400">{t("adminAnnouncements.empty")}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-400 dark:text-gray-500">
                <th className="px-6 py-3 font-semibold">{t("adminAnnouncements.titleLabel")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminAnnouncements.target")}</th>
                <th className="px-6 py-3 font-semibold">{t("adminAnnouncements.dateLabel")}</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">{t("adminMaster.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{row.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{row.content}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                    {t("adminAnnouncements.targetAll")}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(row.created_at ?? new Date()).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
                      {t("adminCompanies.active")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(row)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        aria-label={t("adminMaster.edit")}
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(row)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {modal === "create" ? t("adminAnnouncements.addTitle") : t("adminAnnouncements.editTitle")}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {modal === "create" ? t("adminAnnouncements.addDesc") : t("adminAnnouncements.editDesc")}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
              >
                &#10005;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminAnnouncements.titleLabel")} *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("adminAnnouncements.titlePlaceholder")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t("adminAnnouncements.contentLabel")}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("adminAnnouncements.contentPlaceholder")}
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>
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
                disabled={saving || !title.trim()}
                className="flex-1 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#16304f] transition-colors disabled:opacity-60"
              >
                {saving ? t("common.saving") : t("adminAnnouncements.publish")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          description={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}