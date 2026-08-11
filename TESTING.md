# TESTING GUIDE — E-Absensi

> Backend: `http://localhost:4000/api/v1` | Frontend: `http://localhost:3000`
> Login utama: `/auth/login` | Login super admin: `/auth/superadmin`

---

## 1. SUPER ADMIN (`/auth/superadmin`)

| # | Skenario | Langkah | Hasil yang diharapkan |
|---|----------|---------|------------------------|
| 1.1 | Login sukses | Buka `/auth/superadmin`, isi email + password superadmin | Redirect ke `/admin/companies`, sidebar tampil menu **Companies** |
| 1.2 | Login gagal | Email/password salah | Muncul pesan "Email atau password salah", tetap di halaman login |
| 1.3 | Guard role | Login sebagai admin biasa lalu akses `/admin/companies` | Ditolak / redirect ke `/auth/login` (hanya superadmin yang boleh) |
| 1.4 | Lihat daftar perusahaan | Masuk `/admin/companies` | Tabel berisi semua perusahaan + status Aktif/Nonaktif |
| 1.5 | Tambah perusahaan | Klik **+ Add**, isi nama, simpan | Perusahaan baru muncul dengan status Aktif |
| 1.6 | Edit nama perusahaan | Klik ikon pensil, ubah nama, simpan | Nama ter-update di tabel |
| 1.7 | Ubah status | Klik badge status Aktif → Nonaktif (dan sebaliknya) | Status berubah; perusahaan nonaktif → karyawannya tidak bisa login (perlu diuji di #3.0) |
| 1.8 | Link dari login utama | Buka `/auth/login`, klik "Super Admin Login" | Pindah ke `/auth/superadmin` |

**Perlu data:** akun superadmin di tabel `superadmins` (email + `password_hash` bcrypt).

---

## 2. ADMIN (HRD) (`/auth/login` → role admin)

| # | Skenario | Langkah | Hasil yang diharapkan |
|---|----------|---------|------------------------|
| 2.1 | Login sukses | Email + password admin | Redirect ke `/admin` |
| 2.2 | Dashboard admin | Buka `/admin` | Total karyawan aktif, breakdown kehadiran hari ini, pending cuti & lembur |
| 2.3 | Kelola karyawan | `/admin/karyawan`: tambah, edit, resign | CRUD berfungsi; resign menonaktifkan |
| 2.4 | Kelola departemen | `/admin/departemen`: tambah/edit/hapus | CRUD berfungsi |
| 2.5 | Policy departemen | Klik tombol **Policy** di baris departemen | Modal muncul; simpan `allow_overtime`, `allow_wfh`, `min_attendance_percentage`, `effective_date`; refresh → tersimpan |
| 2.6 | Kelola jabatan | `/admin/jabatan` | CRUD berfungsi |
| 2.7 | Kelola shift | `/admin/jadwal-kerja` | CRUD berfungsi |
| 2.8 | Pola hari kerja | `/admin/pola-kerja`: tambah pola, centang hari aktif, edit | CRUD berfungsi; hari aktif tersimpan |
| 2.9 | Penjadwalan | `/admin/penjadwalan`: pilih karyawan → shift, lokasi, pola, start date → Assign | Jadwal muncul di "Current Schedule"; End Schedule mengakhiri |
| 2.10 | Kelola lokasi | `/admin/lokasi` (lat, lng, radius) | CRUD berfungsi |
| 2.11 | Kalender & libur | `/admin/kalender`: tambah libur + acara | CRUD berfungsi |
| 2.12 | Persetujuan lembur | `/admin/lembur`: setujui/tolak | Status berubah; muncul di riwayat karyawan |
| 2.13 | Laporan | `/admin/laporan`: filter + lihat rekap | Tabel rekap muncul |
| 2.14 | Kuota cuti manual | `/admin/settings` → **Adjust Quota**: pilih karyawan, +3/-1, alasan | Saldo kuota karyawan berubah (cek di dashboard karyawan) |
| 2.15 | Cron manual | `/admin/settings` → **Cron Jobs**: run Auto-Alpha / Monthly Quota / Monthly Recap | Muncul pesan sukses |
| 2.16 | Registrasi wajah | `/admin/settings` → **Face Registration**: pilih karyawan, ambil foto, submit | Referensi wajah tersimpan (untuk fitur #3.1) |
| 2.17 | Sidebar & guard | Admin tidak melihat menu **Companies** | Benar, menu tersembunyi |

---

## 3. SUPERVISOR (`/auth/login` → role supervisor)

| # | Skenario | Langkah | Hasil yang diharapkan |
|---|----------|---------|------------------------|
| 3.1 | Login sukses | Email + password supervisor | Redirect ke `/atasan` |
| 3.2 | Dashboard atasan | `/atasan` | Ringkasan tim: hadir/telat/alpha + pending cuti |
| 3.3 | Approve/reject cuti tim | `/atasan` → daftar pending | Status berubah; tercatat di history |
| 3.4 | Approve/reject lembur tim | `/atasan` → daftar lembur tim | Status berubah |
| 3.5 | Jadwal & riwayat tim | Lihat jadwal + riwayat anggota tim | Data tampil sesuai karyawan tim |
| 3.6 | Guard role | Supervisor buka `/admin` | Ditolak (access denied) |
| 3.7 | Policy departemen (read) | Supervisor dapat melihat policy departemen via API | Bisa GET, tidak bisa PUT |

---

## 4. KARYAWAN (EMPLOYEE) (`/auth/login` → role employee)

### 4.1 Absensi (fitur wajah + lokasi)
| # | Skenario | Langkah | Hasil yang diharapkan |
|---|----------|---------|------------------------|
| 4.1.1 | Clock-in | `/karyawan` → tombol Check-in → izinkan lokasi + kamera → selfie → submit | Muncul waktu & status "Hadir" (atau "Telat" jika melebihi toleransi); verifikasi wajah = match |
| 4.1.2 | Clock-out | Tombol Check-out → selfie | Waktu pulang tercatat |
| 4.1.3 | Face tidak match | Selfie orang lain / bukan wajah terdaftar | Ditolak dengan pesan verifikasi gagal |
| 4.1.4 | Lokasi di luar radius | Check-in dari lokasi jauh dari kantor | Ditolak / diberi peringatan jarak |
| 4.1.5 | Status wajah | `/karyawan` menampilkan status referensi wajah | Terlihat terdaftar / belum |
| 4.1.6 | Kamera ditolak | Blokir akses kamera | Muncul pesan error kamera, tetap bisa lanjut? |

### 4.2 Dashboard & data
| # | Skenario | Langkah | Hasil yang diharapkan |
|---|----------|---------|------------------------|
| 4.2.1 | Overview | `/karyawan` | Status hari ini, jam mingguan, sisa cuti, telat bulan ini |
| 4.2.2 | ProfileSummary | Kolom kiri dashboard | Email, divisi, atasan sesuai data login (bukan dummy) |
| 4.2.3 | Weekly work & kalender | Widget jadwal minggu ini + kalender | Data dari schedule nyata |
| 4.2.4 | Agenda | Tambah/hapus agenda pribadi | CRUD berfungsi |

### 4.3 Cuti, lembur, pengaturan
| # | Skenario | Langkah | Hasil yang diharapkan |
|---|----------|---------|------------------------|
| 4.3.1 | Ajukan cuti | `/karyawan/...` → form cuti → submit | Muncul di riwayat status Pending |
| 4.3.2 | Summary cuti | Kartu statistik: sisa, terpakai, pending, ditolak, lembur bulan ini, lembur pending | Angka dari backend (bukan "-") |
| 4.3.3 | Ajukan lembur | Form lembur (tanggal, jam, kategori, alasan) | Masuk list `pending` |
| 4.3.4 | Kuota cuti (setelah #2.14) | Cek dashboard | Saldo sesuai hasil adjust |
| 4.3.5 | Riwayat absensi | Halaman riwayat | Status Hadir/Telat/Alpha benar |
| 4.3.6 | Pengaturan profil | `/karyawan/settings`: ubah nama, ganti password | Tersimpan |

### 4.4 Notifikasi
| # | Skenario | Langkah | Hasil yang diharapkan |
|---|----------|---------|------------------------|
| 4.4.1 | Daftar notifikasi | Klik ikon lonceng | List notifikasi dari backend |
| 4.4.2 | Tandai baca | Buka satu notifikasi | Status read ter-update; badge menurun |
| 4.4.3 | Read all | Klik "tandai semua dibaca" | Semua jadi read |

---

## 5. Regresi lintas-modul (wajib cek setelah superadmin)

- [ ] Admin login tetap normal setelah perubahan NextAuth (`mode` default = login biasa)
- [ ] Karyawan dari perusahaan **Nonaktif** gagal login (#1.7) dengan pesan jelas
- [ ] Responsif: layout admin & karyawan di layar mobile/tablet
- [ ] Dark mode: tidak ada kontras rusak di halaman baru (companies, superadmin)
- [ ] Bahasa EN/ID: semua label halaman baru diterjemahkan
