# TESTING GUIDE — SAMS (E-Absensi) — UPDATED

> Backend: `http://localhost:4000/api/v1` | Frontend: `http://localhost:3000`
> Login utama: `/auth/login` | Login super admin: `/auth/superadmin`
>
> **Cara pakai dokumen ini**: tiap baris ada kolom **Status** — isi ✅ (lolos) / ❌ (gagal) / ⚠️ (partial/ada catatan) / ⬜ (belum dites) pas kamu testing. Total di akhir dokumen buat hitung progress %.

---

## 0. AKUN TESTING (dari `seedTesting.ts`, company "PT Testing SAMS")

| Role       | Email (ganti placeholder dengan alamat temp-mail asli sebelum testing forgot-password) | Password        |
| ---------- | -------------------------------------------------------------------------------------- | --------------- |
| Superadmin | `superadmin.testing@temp-mail.org` → **ganti ke alamat real dulu di temp-mail.org**    | `superadmin123` |
| Admin/HRD  | `admin.testing@temp-mail.org` → ganti juga                                             | `password123`   |
| Supervisor | `supervisor.testing@temp-mail.org` → ganti juga                                        | `password123`   |
| Karyawan 1 | `karyawan1.testing@temp-mail.org` → ganti juga                                         | `password123`   |
| Karyawan 2 | `karyawan2.testing@temp-mail.org` → ganti juga                                         | `password123`   |

**Sebelum mulai**, langkah wajib:

1. Generate 5 alamat baru di temp-mail.org, update konstanta `EMAIL_*` di `src/database/seedTesting.ts` baris 22-27.
2. `npm run seed:testing`.
3. Login ke tiap akun employee (bukan superadmin), daftarkan wajah via `/admin/settings` (admin daftarin buat semua) atau FaceRegisterPanel yang tersedia — **wajib** sebelum bisa clock-in/out.
4. Karyawan clock-in harus dilakukan dari lokasi nyata di sekitar **-6.3618, 106.8427** (radius 500m) — office_location "Kantor Testing" sudah di-seed di koordinat itu.

---

## ⚠️ KNOWN LIMITATIONS — BACA DULU SEBELUM TESTING (biar nggak salah diagnosa)

Beberapa hal ini **sudah diketahui belum berfungsi penuh**, bukan bug baru yang perlu dilaporkan ulang — cukup dicatat di kolom Status sebagai ⚠️/❌ known:

| Area                                                         | Status sebenarnya                                                                                                                                                                                  |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/admin/jadwal-kerja`, `/admin/departemen`, `/admin/jabatan` | Backend endpoint SUDAH ADA & siap, tapi halaman frontend-nya masih pakai **mock state lokal** (`useState`) — perubahan yang kamu buat di UI TIDAK tersimpan ke database, akan hilang saat refresh. |
| `/admin/perizinan`                                           | Halaman baru (sebelumnya 404), tapi juga masih **mock data hardcoded** — tidak connect ke backend leave module yang sebenarnya sudah lengkap.                                                      |
| Lampiran cuti/permit (`attachment`)                          | Frontend kirim file (base64) saat ajukan cuti, tapi backend **mengabaikan field ini** — lampiran tidak pernah tersimpan ke `attachment_url`, walau request cuti-nya sendiri tetap berhasil dibuat. |
| `/admin/reimburse`, `/admin/pengumuman`                      | **Belum ada sama sekali** — baik backend maupun frontend. Jangan dites, belum ada untuk ditest.                                                                                                    |
| `audit_logs` table                                           | Ada di database, tapi **tidak ada mekanisme otomatis** yang mengisi tabel ini saat user melakukan aksi (create/approve/reject, dll) — cuma data demo dari seed.                                    |
| Forgot/Reset password                                        | **Sudah diperbaiki & berfungsi** untuk SEMUA role termasuk superadmin (sebelumnya superadmin gagal, sudah di-fix).                                                                                 |
| Chat widget di `DashboardRightPanel`                         | Masih mock, bukan chat sungguhan.                                                                                                                                                                  |
| Todolist karyawan                                            | Masih pakai localStorage browser, bukan dari database — data hilang kalau ganti browser/device.                                                                                                    |

---

## 1. SUPER ADMIN (`/auth/superadmin`)

| #   | Skenario                   | Langkah                                                  | Hasil yang diharapkan                                                           | Status | Catatan                                                |
| --- | -------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| 1.1 | Login sukses               | Buka `/auth/superadmin`, isi email + password superadmin | Redirect ke `/admin/companies`, sidebar tampil menu **Companies**               | ⬜     |                                                        |
| 1.2 | Login gagal                | Email/password salah                                     | Pesan "Email atau password salah", tetap di halaman login                       | ⬜     |                                                        |
| 1.3 | Guard role                 | Login sebagai admin biasa lalu akses `/admin/companies`  | Ditolak / redirect ke `/auth/login`                                             | ⬜     |                                                        |
| 1.4 | Lihat daftar perusahaan    | Masuk `/admin/companies`                                 | Tabel semua perusahaan + status Aktif/Nonaktif                                  | ⬜     |                                                        |
| 1.5 | Tambah perusahaan          | Klik + Add, isi nama, simpan                             | Perusahaan baru muncul, status Aktif                                            | ⬜     |                                                        |
| 1.6 | Edit nama perusahaan       | Klik pensil, ubah nama, simpan                           | Nama ter-update di tabel                                                        | ⬜     |                                                        |
| 1.7 | Ubah status                | Klik badge status Aktif ↔ Nonaktif                       | Status berubah; karyawan company nonaktif nanti dites gagal login di #5         | ⬜     |                                                        |
| 1.8 | Link dari login utama      | `/auth/login` → klik "Super Admin Login"                 | Pindah ke `/auth/superadmin`                                                    | ⬜     |                                                        |
| 1.9 | Forgot password superadmin | `/auth/forgot-password`, masukkan email superadmin       | Email terkirim ke temp-mail, klik link, reset sukses, login pakai password baru | ⬜     | Baru diperbaiki — pastikan dites, ini area paling baru |

---

## 2. ADMIN (HRD) (`/auth/login` → role admin)

| #    | Skenario                | Langkah                                                                         | Hasil yang diharapkan                                                                                                  | Status | Catatan                                        |
| ---- | ----------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------- |
| 2.1  | Login sukses            | Email + password admin                                                          | Redirect ke `/admin`                                                                                                   | ⬜     |                                                |
| 2.2  | Dashboard admin         | Buka `/admin`                                                                   | Total karyawan aktif, breakdown kehadiran hari ini, pending cuti & lembur                                              | ⬜     |                                                |
| 2.3  | Kelola karyawan         | `/admin/karyawan`: tambah, edit, resign                                         | CRUD berfungsi; resign menonaktifkan                                                                                   | ⬜     |                                                |
| 2.4  | Kelola departemen       | `/admin/departemen`: tambah/edit/hapus                                          | **Cek dulu**: apakah beneran tersimpan ke DB atau cuma di state lokal (lihat Known Limitations)                        | ⬜     | Kemungkinan ⚠️ mock                            |
| 2.5  | Policy departemen       | Klik tombol Policy di baris departemen                                          | Modal muncul; simpan `allow_overtime`, `allow_wfh`, `min_attendance_percentage`, `effective_date`; refresh → tersimpan | ⬜     | Data policy sudah di-seed, harusnya kelihatan  |
| 2.6  | Kelola jabatan          | `/admin/jabatan`                                                                | Cek juga apakah tersimpan beneran atau mock                                                                            | ⬜     | Kemungkinan ⚠️ mock                            |
| 2.7  | Kelola shift            | `/admin/jadwal-kerja`                                                           | Cek juga apakah tersimpan beneran atau mock                                                                            | ⬜     | Kemungkinan ⚠️ mock                            |
| 2.8  | Pola hari kerja         | `/admin/pola-kerja`: tambah pola, centang hari aktif, edit                      | CRUD berfungsi; hari aktif tersimpan                                                                                   | ⬜     |                                                |
| 2.9  | Penjadwalan             | `/admin/penjadwalan`: pilih karyawan → shift, lokasi, pola, start date → Assign | Jadwal muncul di "Current Schedule"; End Schedule mengakhiri                                                           | ⬜     |                                                |
| 2.10 | Kelola lokasi           | `/admin/lokasi` (lat, lng, radius)                                              | CRUD berfungsi                                                                                                         | ⬜     |                                                |
| 2.11 | Kalender & libur        | `/admin/kalender`: tambah libur + acara                                         | CRUD berfungsi                                                                                                         | ⬜     |                                                |
| 2.12 | Persetujuan lembur      | `/admin/lembur`: setujui/tolak                                                  | Status berubah; muncul di riwayat karyawan                                                                             | ⬜     |                                                |
| 2.13 | Laporan                 | `/admin/laporan`: filter + lihat rekap                                          | Tabel rekap muncul                                                                                                     | ⬜     |                                                |
| 2.14 | Kuota cuti manual       | `/admin/settings` → Adjust Quota                                                | Saldo kuota karyawan berubah                                                                                           | ⬜     |                                                |
| 2.15 | Cron manual             | `/admin/settings` → Cron Jobs: Auto-Alpha / Monthly Quota / Monthly Recap       | Muncul pesan sukses                                                                                                    | ⬜     |                                                |
| 2.16 | Registrasi wajah        | `/admin/settings` → Face Registration                                           | Referensi wajah tersimpan — wajib sebelum clock-in/out                                                                 | ⬜     | Lakukan ini duluan sebelum testing section 4.1 |
| 2.17 | Sidebar & guard         | Admin tidak melihat menu Companies                                              | Menu tersembunyi                                                                                                       | ⬜     |                                                |
| 2.18 | Kelola perizinan (BARU) | `/admin/perizinan`: approve/reject dari sisi admin                              | **Cek**: apakah beneran mempengaruhi status leave_request di DB, atau cuma UI lokal                                    | ⬜     | Diketahui masih mock — expect ❌               |
| 2.19 | Forgot password admin   | `/auth/forgot-password` pakai email admin                                       | Email terkirim, reset sukses                                                                                           | ⬜     |                                                |

---

## 3. SUPERVISOR (`/auth/login` → role supervisor)

| #   | Skenario                   | Langkah                                        | Hasil yang diharapkan                                                                  | Status | Catatan                            |
| --- | -------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- | ------ | ---------------------------------- |
| 3.1 | Login sukses               | Email + password supervisor                    | Redirect ke `/atasan`                                                                  | ⬜     |                                    |
| 3.2 | Dashboard atasan           | `/atasan`                                      | Ringkasan tim: hadir/telat/alpha + pending cuti                                        | ⬜     | Data histori 21 hari sudah di-seed |
| 3.3 | Approve/reject cuti tim    | `/atasan` → daftar pending                     | Status berubah; tercatat di history. Ada 1 leave pending yang sudah di-seed buat dites | ⬜     |                                    |
| 3.4 | Approve/reject lembur tim  | `/atasan` → daftar lembur tim                  | Status berubah. Ada 1 overtime pending yang sudah di-seed                              | ⬜     |                                    |
| 3.5 | Jadwal & riwayat tim       | Lihat jadwal + riwayat anggota tim             | Data 2 karyawan (karyawan1, karyawan2) tampil                                          | ⬜     |                                    |
| 3.6 | Guard role                 | Supervisor buka `/admin`                       | Ditolak                                                                                | ⬜     |                                    |
| 3.7 | Policy departemen (read)   | Lihat policy departemen via API                | Bisa GET, tidak bisa PUT                                                               | ⬜     |                                    |
| 3.8 | Forgot password supervisor | `/auth/forgot-password` pakai email supervisor | Email terkirim, reset sukses                                                           | ⬜     |                                    |

---

## 4. KARYAWAN (EMPLOYEE) (`/auth/login` → role employee)

### 4.1 Absensi (fitur wajah + lokasi) — **INI FITUR PALING KRITIS, TES PALING TELITI**

> **Alur verifikasi**: 1) Lokasi dulu (Haversine vs `office_locations`, radius 500m) → 2) Wajah (Gemini vs `employee_face_references`).
> **Wajib**: daftarkan wajah dulu (#2.16), dan lakukan clock-in dari sekitar koordinat **-6.3618, 106.8427**.

| #     | Skenario                   | Langkah                                                            | Hasil yang diharapkan                               | Status | Catatan                                               |
| ----- | -------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- | ------ | ----------------------------------------------------- |
| 4.1.1 | Clock-in (wajah + lokasi)  | `/karyawan` → Check-in → izinkan lokasi + kamera → selfie → submit | Dalam radius + wajah match → status "Hadir"/"Telat" | ⬜     |                                                       |
| 4.1.2 | Clock-out (wajah + lokasi) | Tombol Check-out → selfie                                          | Dalam radius + wajah match → waktu pulang tercatat  | ⬜     |                                                       |
| 4.1.3 | Face tidak match           | Selfie orang lain                                                  | Ditolak `FACE_MISMATCH`                             | ⬜     |                                                       |
| 4.1.4 | Belum ada referensi wajah  | Check-in sebelum wajah didaftarkan                                 | Ditolak `FACE_REFERENCE_NOT_FOUND`                  | ⬜     |                                                       |
| 4.1.5 | Lokasi di luar radius      | Check-in dari lokasi jauh                                          | Ditolak `OUTSIDE_RADIUS`, tampilkan jarak aktual    | ⬜     | Coba matikan GPS akurat / pura-pura jauh buat tes ini |
| 4.1.6 | Tanpa selfie               | Submit tanpa foto                                                  | Ditolak `FACE_IMAGE_REQUIRED`                       | ⬜     |                                                       |
| 4.1.7 | Status wajah               | `/karyawan` menampilkan status referensi wajah                     | Terlihat terdaftar/belum                            | ⬜     |                                                       |
| 4.1.8 | Kamera ditolak             | Blokir akses kamera browser                                        | Pesan error kamera, tidak bisa lanjut               | ⬜     |                                                       |

### 4.2 Dashboard & data

| #     | Skenario               | Langkah                             | Hasil yang diharapkan                                     | Status | Catatan                                      |
| ----- | ---------------------- | ----------------------------------- | --------------------------------------------------------- | ------ | -------------------------------------------- |
| 4.2.1 | Overview               | `/karyawan`                         | Status hari ini, jam mingguan, sisa cuti, telat bulan ini | ⬜     |                                              |
| 4.2.2 | ProfileSummary         | Kolom kiri dashboard                | Email, divisi, atasan sesuai data login                   | ⬜     |                                              |
| 4.2.3 | Weekly work & kalender | Widget jadwal minggu ini + kalender | Data dari schedule nyata                                  | ⬜     |                                              |
| 4.2.4 | Agenda                 | Tambah/hapus agenda pribadi         | CRUD berfungsi                                            | ⬜     | 4 agenda sudah di-seed, termasuk 1 tanpa jam |

### 4.3 Cuti, lembur, pengaturan

| #     | Skenario                   | Langkah                                                                     | Hasil yang diharapkan                                                                              | Status | Catatan                        |
| ----- | -------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------ | ------------------------------ |
| 4.3.1 | Ajukan cuti                | Form cuti → submit (dengan lampiran)                                        | Muncul di riwayat status Pending. **Cek khusus**: lampiran TIDAK akan tersimpan (known limitation) | ⬜     | Expect ⚠️ pada bagian lampiran |
| 4.3.2 | Summary cuti               | Kartu statistik: sisa, terpakai, pending, ditolak, lembur bulan ini/pending | Angka dari backend, sudah ada data dari seed (6 leave request, 3 overtime)                         | ⬜     |                                |
| 4.3.3 | Ajukan lembur              | Form lembur (tanggal, jam, kategori, alasan)                                | Masuk list pending                                                                                 | ⬜     |                                |
| 4.3.4 | Kuota cuti (setelah #2.14) | Cek dashboard                                                               | Saldo sesuai hasil adjust                                                                          | ⬜     |                                |
| 4.3.5 | Riwayat absensi            | Halaman riwayat                                                             | Status Hadir/Telat/Alpha sesuai data 21 hari yang di-seed                                          | ⬜     |                                |
| 4.3.6 | Pengaturan profil          | `/karyawan/settings`: ubah nama, ganti password                             | Tersimpan                                                                                          | ⬜     |                                |
| 4.3.7 | Forgot password karyawan   | `/auth/forgot-password` pakai email karyawan                                | Email terkirim, reset sukses                                                                       | ⬜     |                                |

### 4.4 Notifikasi

| #     | Skenario          | Langkah                    | Hasil yang diharapkan                                           | Status | Catatan |
| ----- | ----------------- | -------------------------- | --------------------------------------------------------------- | ------ | ------- |
| 4.4.1 | Daftar notifikasi | Klik ikon lonceng          | List notifikasi dari backend (10 sudah di-seed, 7 tipe berbeda) | ⬜     |         |
| 4.4.2 | Tandai baca       | Buka satu notifikasi       | Status read ter-update; badge menurun                           | ⬜     |         |
| 4.4.3 | Read all          | Klik "tandai semua dibaca" | Semua jadi read                                                 | ⬜     |         |

---

## 5. Regresi lintas-modul (wajib cek setelah semua di atas)

| #   | Skenario                                                                              | Status | Catatan |
| --- | ------------------------------------------------------------------------------------- | ------ | ------- |
| 5.1 | Admin login tetap normal setelah perubahan NextAuth                                   | ⬜     |         |
| 5.2 | Karyawan dari perusahaan Nonaktif gagal login (dari #1.7) dengan pesan jelas          | ⬜     |         |
| 5.3 | Clock-in tanpa foto ditolak `FACE_IMAGE_REQUIRED` di clock-in DAN clock-out           | ⬜     |         |
| 5.4 | Jam kerja/history tidak berubah format setelah penambahan verif wajah                 | ⬜     |         |
| 5.5 | Responsif: layout admin & karyawan di mobile/tablet                                   | ⬜     |         |
| 5.6 | Dark mode: tidak ada kontras rusak di halaman baru (companies, superadmin, perizinan) | ⬜     |         |
| 5.7 | Bahasa EN/ID: label halaman baru (perizinan, jadwal-kerja stats) diterjemahkan        | ⬜     |         |
| 5.8 | Superadmin bisa forgot-password (regresi khusus dari bugfix terbaru)                  | ⬜     |         |

---

## TRACKER KELENGKAPAN PROYEK

Setelah selesai testing, isi ini buat tau progress riil:

| Kategori       | Total item | Lolos (✅) | Gagal/Belum (❌/⚠️) | %   |
| -------------- | ---------- | ---------- | ------------------- | --- |
| 1. Super Admin | 9          |            |                     |     |
| 2. Admin/HRD   | 19         |            |                     |     |
| 3. Supervisor  | 8          |            |                     |     |
| 4. Karyawan    | 27         |            |                     |     |
| 5. Regresi     | 8          |            |                     |     |
| **TOTAL**      | **71**     |            |                     |     |

**Catatan penting soal interpretasi %**: item yang statusnya sudah "diketahui mock/belum jadi" (lihat tabel Known Limitations di atas) sebaiknya dipisah dari hitungan "bug" — itu bukan sesuatu yang tiba-tiba rusak, tapi memang belum dikerjakan. Kalau mau progress yang lebih representatif buat laporan ke pembimbing, hitung dua angka terpisah:

- **% fitur yang SEHARUSNYA sudah jalan tapi ternyata gagal** (bug beneran, prioritas fix)
- **% fitur yang MEMANG belum dikerjakan** (known scope belum selesai, bukan bug)
