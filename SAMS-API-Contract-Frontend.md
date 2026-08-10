# SAMS Backend — API Contract untuk Tim Frontend

*Dokumen ini adalah kontrak resmi antara Backend dan Frontend. Base URL, format response, dan field yang dijelaskan di sini adalah yang akan dipakai — kalau ada perubahan, akan diinfokan ulang.*

---

## 1. Info Dasar

| | |
|---|---|
| **Base URL (development)** | `http://localhost:4000/api/v1` |
| **Auth** | Bearer Token (JWT), taruh di header `Authorization: Bearer <token>` |
| **Content-Type** | `application/json` untuk semua request dengan body |
| **CORS** | Sudah diaktifkan, semua origin diizinkan untuk development |

---

## 2. Format Response (Konsisten di Semua Endpoint)

**Sukses:**
```json
{
  "success": true,
  "data": { }
}
```

**Gagal:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Pesan yang bisa ditampilkan ke user"
  }
}
```

Selalu cek `success` dulu sebelum baca `data`. Untuk pesan error, `error.message` sudah dalam Bahasa Indonesia dan aman ditampilkan langsung ke user.

---

## 3. Daftar Error Code

| Code | HTTP Status | Kapan Muncul |
|---|---|---|
| `NO_TOKEN` | 401 | Header Authorization tidak dikirim |
| `INVALID_TOKEN` | 401 | Token salah format / sudah expired |
| `INVALID_CREDENTIALS` | 401 | Email/password salah saat login |
| `COMPANY_INACTIVE` | 403 | Perusahaan user sudah dinonaktifkan |
| `FORBIDDEN` | 403 | Role tidak punya akses ke endpoint ini |
| `NOT_FOUND` | 404 | Data yang diminta tidak ada |
| `INSUFFICIENT_QUOTA` | 400 | Saldo kuota cuti tidak cukup |
| `REASON_REQUIRED` | 400 | Field alasan wajib diisi tapi kosong |
| `NO_SCHEDULE` | 400 | Karyawan belum punya jadwal kerja aktif |
| `OUTSIDE_RADIUS` | 400 | Lokasi GPS di luar radius kantor saat clock-in |
| `NO_CLOCK_IN` | 400 | Coba clock-out tapi belum ada clock-in aktif |
| `DEPARTMENT_IN_USE` | 400 | Coba hapus departemen yang masih ada karyawan aktif |

**Saran penanganan di Frontend:**
- `NO_TOKEN` / `INVALID_TOKEN` → redirect ke halaman login
- `FORBIDDEN` → tampilkan pesan "tidak punya akses", jangan redirect ke login (user tetap login, cuma role-nya nggak cukup)
- Lainnya → tampilkan `error.message` langsung sebagai notifikasi/toast

---

## 4. Auth Flow

### Login
```
POST /auth/login
```
Request:
```json
{ "email": "budi@test.com", "password": "password123" }
```
Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "Budi Santoso",
      "email": "budi@test.com",
      "role": "karyawan"
    }
  }
}
```
Simpan `token` di storage pilihan Frontend (localStorage/cookie/state management). Token berlaku **8 jam** — setelah itu expired, user perlu login ulang.

### Login SuperAdmin (path terpisah)
```
POST /auth/superadmin/login
```
Body & response sama seperti login biasa, bedanya query ke tabel superadmin. `user.role` untuk SuperAdmin selalu `"superadmin"`.

### Cek Siapa yang Login
```
GET /auth/me
Header: Authorization: Bearer <token>
```
Dipanggil tiap kali app dibuka/refresh, untuk validasi token masih hidup + ambil data user terbaru.

### Logout
Tidak ada proses server-side khusus (JWT stateless) — cukup hapus token dari storage Frontend.

---

## 5. Role & Akses

| Role | Bisa akses |
|---|---|
| `karyawan` | Endpoint dengan prefix `/me`, absen, ajukan izin |
| `supervisor` | Semua akses karyawan + endpoint `/team` |
| `admin` | Hampir semua endpoint di company-nya |
| `superadmin` | Hanya endpoint `/companies` |

Kalau Frontend perlu **menyembunyikan menu** berdasarkan role, ambil `role` dari response `/auth/me` atau dari payload token.

---

## 6. Field Khusus yang Perlu Diperhatikan

### Clock In / Clock Out
```
POST /attendance/clock-in
POST /attendance/clock-out
```
Body:
```json
{
  "lat": -6.5971,
  "lng": 106.8060,
  "face_image": ""
}
```
- `lat`/`lng`: ambil dari browser Geolocation API, kirim sebagai angka desimal
- `face_image`: **saat ini belum diproses** (backend masih placeholder, validasi wajah belum aktif). Frontend tetap kirim field ini (boleh string kosong atau base64 dummy) supaya struktur request sudah sesuai — begitu face-match diaktifkan di backend, Frontend tinggal isi field ini dengan base64 foto asli tanpa perlu ubah struktur request

### Format Tanggal
Semua field tanggal (`start_date`, `end_date`, `join_date`, `event_date`, dll) pakai format `YYYY-MM-DD`. Response akan mengembalikan format ISO timestamp (`2026-08-04T03:06:50.822Z`) untuk field `*_time`/`*_at`.

### `company_id` Tidak Pernah Dikirim dari Frontend
Semua data otomatis ter-scope ke company user yang login (diambil dari token). Frontend **tidak perlu dan tidak boleh** mengirim `company_id` di body request manapun — kalau dikirim pun akan diabaikan backend.

---

## 7. Daftar Lengkap Endpoint per Modul

### Auth
| Method | Endpoint | Akses |
|---|---|---|
| POST | `/auth/login` | Public |
| POST | `/auth/superadmin/login` | Public |
| GET | `/auth/me` | Authenticated |

### Employee
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/employees` | admin |
| GET | `/employees/:id` | admin |
| POST | `/employees` | admin |
| PUT | `/employees/:id` | admin |
| DELETE | `/employees/:id` | admin |
| GET | `/employees/me/profile` | authenticated |
| PUT | `/employees/me/profile` | authenticated |
| GET | `/employees/team` | supervisor |

### Attendance
| Method | Endpoint | Akses |
|---|---|---|
| POST | `/attendance/clock-in` | authenticated |
| POST | `/attendance/clock-out` | authenticated |
| GET | `/attendance/me` | authenticated |
| GET | `/attendance/team` | supervisor |
| GET | `/attendance` | admin |

### Leave
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/leave/types` | authenticated |
| POST | `/leave/requests` | authenticated |
| GET | `/leave/requests/me` | authenticated |
| PATCH | `/leave/requests/:id/approve` | supervisor, admin |
| PATCH | `/leave/requests/:id/reject` | supervisor, admin |
| GET | `/leave/quota/:employeeId` | authenticated |
| POST | `/leave/quota/:employeeId/adjust` | admin |

### Department
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/departments` | admin |
| GET | `/departments/:id` | admin |
| POST | `/departments` | admin |
| PUT | `/departments/:id` | admin |
| DELETE | `/departments/:id` | admin |
| GET | `/departments/:id/policy` | admin, supervisor |
| PUT | `/departments/:id/policy` | admin |

### Position
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/positions` | admin |
| POST | `/positions` | admin |
| PUT | `/positions/:id` | admin |
| DELETE | `/positions/:id` | admin |

### Schedule (Shift, Location, Working Day Pattern, Assignment)
| Method | Endpoint | Akses |
|---|---|---|
| GET/POST | `/shifts` | admin |
| PUT/DELETE | `/shifts/:id` | admin |
| GET/POST | `/locations` | admin |
| PUT/DELETE | `/locations/:id` | admin |
| GET/POST | `/working-day-patterns` | admin |
| PUT | `/working-day-patterns/:id` | admin |
| GET | `/schedules/employee/:employeeId` | authenticated |
| POST | `/schedules` | admin |
| PUT | `/schedules/:id/end` | admin |

### Holiday & Calendar
| Method | Endpoint | Akses |
|---|---|---|
| GET/POST | `/holidays` | authenticated (GET), admin (POST) |
| DELETE | `/holidays/:id` | admin |
| GET/POST | `/calendar-events` | authenticated (GET), admin (POST) |
| PUT/DELETE | `/calendar-events/:id` | admin |

### Notification
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/notifications/me` | authenticated |
| PATCH | `/notifications/:id/read` | authenticated |
| PATCH | `/notifications/read-all` | authenticated |

### Dashboard
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/dashboard/employee` | karyawan |
| GET | `/dashboard/supervisor` | supervisor |
| GET | `/dashboard/admin` | admin |

### Company (SuperAdmin only)
| Method | Endpoint | Akses |
|---|---|---|
| GET/POST | `/companies` | superadmin |
| GET/PUT | `/companies/:id` | superadmin |
| PATCH | `/companies/:id/status` | superadmin |

---

## 8. Belum Aktif / Masih Placeholder

Supaya Frontend tidak salah ekspektasi — hal-hal ini **belum sepenuhnya berfungsi** di backend saat ini:

- **Face match saat clock-in** — selalu return `face_match_status: "skipped"`, belum ada validasi wajah asli
- **Reset kuota cuti bulanan otomatis** — saat ini kuota masih ditambahkan manual, belum ada cron job
- **Auto-mark Alpha** — karyawan yang tidak absen belum otomatis ditandai "Alpha", belum ada cron job
- **Export Excel/PDF/CSV** — belum diimplementasikan
- **Leave analytics** (tren bulanan, distribusi jenis izin) — belum diimplementasikan

---

## 9. Testing

Postman collection (`SAMS-Postman-Collection.json`) tersedia berisi semua endpoint di atas dengan contoh request — bisa dipakai untuk referensi format request/response yang lebih detail per endpoint.
