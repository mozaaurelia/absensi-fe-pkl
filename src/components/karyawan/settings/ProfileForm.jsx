"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AvatarUpload from "./AvatarUpload";

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    email: "",
    jabatan: "",
  });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        nama: user.nama || "",
        nik: user.nik || "",
        email: user.email || "",
        jabatan: user.jabatan || "",
      });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (avatar) payload.avatar = avatar;
    updateProfile(payload);
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full">
        <h3 className="font-bold text-gray-900 mb-1">Profil Pengguna</h3>
        <p className="text-xs text-gray-400 mb-6">
          Informasi dasar karyawan yang digunakan dalam sistem absensi.
        </p>

        <div className="flex justify-end mb-6">
          <AvatarUpload initials={user?.initials || "AP"} onImageChange={setAvatar} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={handleChange("nama")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Nomor Induk Karyawan
            </label>
            <input
              type="text"
              value={form.nik}
              onChange={handleChange("nik")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Jabatan
            </label>
            <input
              type="text"
              value={form.jabatan}
              onChange={handleChange("jabatan")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A5F] focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
