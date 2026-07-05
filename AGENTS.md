# FRONTEND AGENT CONTEXT - FASE 5: Modul Admin & Global Route Authorization

## 1. Core Objective Phase 5
Membangun antarmuka untuk *role* **Admin** menggunakan pola *Modal Box* untuk CRUD data master, dan **paling krusial:** mengimplementasikan sistem proteksi rute (*Route Authorization*) secara global untuk memastikan setiap URL hanya bisa diakses oleh *role* yang berhak.

## 2. Route Authorization & Security Rules (MUTLAK)
AI wajib membuat mekanisme perlindungan halaman (misalnya menggunakan `middleware.ts`, *Higher-Order Component*, atau *layout check*) yang memblokir akses jika *role* pengguna tidak sesuai.
* **Aturan Hak Akses:**
  * Akses **Admin** Saja: `/users`, `/kategori-inventaris`.
  * Akses **Organisasi** Saja: `/inventaris/*`, `/peminjaman/*`.
  * Akses **Umum & Organisasi**: `/pengajuan/*`.
* **Tindakan Pemblokiran:**
  * Jika pengguna belum login (tidak ada token), *redirect* ke `/login`.
  * Jika pengguna sudah login namun mengakses rute di luar hak aksesnya (misal: Umum mengakses `/inventaris`), *redirect* kembali ke `/` (Dashboard) atau tampilkan halaman "403 Forbidden".

## 3. Shared Routes & Sidebar Updates
* **Dashboard (`/app/page.tsx`):**
  Perbarui halaman ini agar mendeteksi *role* `admin`. Jika `role === 'admin'`, render komponen `<DashboardAdmin />`.
* **Sidebar (`DashboardLayout`):**
  Tambahkan logika navigasi untuk Admin:
  1. Dashboard (`/`)
  2. Kelola User (`/users`)
  3. Kelola Kategori Inventaris (`/kategori-inventaris`)

## 4. Page Specifications & API Integration (Role Admin)

### A. Dashboard Admin (Komponen `<DashboardAdmin />`)
* **Tampilan:** Metrik Cards (desain identik dengan dashboard organisasi).
* **Integrasi API:** `GET /api/admin/dashboard`.
* **Data Output:** "Total User", "Total Inventaris", dan "Total Pengajuan".

### B. Kelola Kategori Inventaris (`/app/kategori-inventaris/page.tsx`)
* **Tampilan Utama:** Data Table dengan kolom `nama_kategori` dan `aksi` (Edit, Delete). Terdapat tombol "Tambah Kategori" di atas tabel.
* **API List:** `GET /api/kategori`.
* **Modal Tambah/Edit:**
  * Gunakan komponen Modal Box.
  * **Input:** Text input untuk `nama_kategori`.
  * **API Add:** `POST /api/admin/kategori`.
  * **API Edit:** `PUT /api/admin/kategori/{id}`.
* **Interaksi:** Tutup Modal dan *re-fetch* data pada tabel setelah sukses.

### C. Kelola User (`/app/users/page.tsx`)
* **Tampilan Utama:** Data Table dengan kolom `nama`, `email`, `role` (gunakan Badge warna-warni), dan `aksi` (Edit, Delete). Terdapat tombol "Tambah User" di atas tabel.
* **API List:** `GET /api/admin/users`.
* **Modal Tambah/Edit:**
  * Gunakan komponen Modal Box.
  * **Input Form:**
    1. `nama`: Text input.
    2. `email`: Email input.
    3. `role`: Select dropdown (opsi: 'umum', 'organisasi', 'admin').
    4. `password`: Password input. (Pada mode *Edit*, buat input ini opsional/kosong secara bawaan).
  * **API Add:** `POST /api/admin/users`.
  * **API Edit:** `PUT /api/admin/users/{id}`.
* **Interaksi:** Tutup Modal dan *re-fetch* tabel setelah sukses.

## 5. Modal Implementation & UI Rules untuk Codex
* **State Management Modal:** Gunakan `useState` untuk mengontrol *visibility* Modal (`isOpen`) dan melacak data yang sedang diedit (`selectedData`).
* **Komponen Modal Reusable:** Buat komponen `Modal` yang memiliki *Header* (Judul), *Body* (Form/Konten), dan *Footer* (Tombol Batal & Simpan).
* **Styling Consistency:** Gaya tabel, tombol (Primary, Danger, Secondary), dan input *wajib* disamakan persis dengan halaman CRUD di Fase 4.
* **Loading & Feedback:** Form di dalam modal wajib di-disable (atau tombol simpan menampilkan *spinner*) saat menembak API. Tampilkan notifikasi (Toast/Alert) untuk hasil *error* atau sukses.
* **Delete Action:** Sebelum mengeksekusi fungsi DELETE API, wajib menampilkan modal/dialog konfirmasi sederhana.