# FRONTEND AGENT CONTEXT - FASE 2: Layout Utama & Modul Role Umum

## 1. Core Objective Phase 2
Membangun `DashboardLayout` utama (Sidebar & Header) serta merampungkan seluruh antarmuka untuk pengguna dengan role **Umum** berdasarkan desain referensi di folder `design/umum`.

## 2. Global Layout Extraction Rule
* AI wajib membaca desain halaman yang dilampirkan, lalu mengekstrak elemen navigasi menjadi `DashboardLayout` (`/components/layouts/DashboardLayout.tsx`).
* **Sidebar:** Logo aplikasi di atas, navigasi list (Dashboard, Peminjaman) di tengah.
* **Header:** Judul Halaman dinamis di kiri, User Popover (Info User & Logout) di kanan.
* Layout ini akan membungkus seluruh halaman (`children`) di modul ini.

## 3. Page Specifications & API Integration (Role Umum)
Bangun tiga halaman berikut menggunakan Tailwind CSS sesuai dengan desain yang diberikan pengguna.

### A. Dashboard Umum (`/app/page.tsx`)
* **Tampilan:** Kartu metrik (Metrik Cards).
* **Integrasi API:** `GET /api/umum/dashboard`.
* **Data Output:** Tampilkan angka untuk "Total Peminjaman", "Peminjaman Pending", dan "Peminjaman Di-approved".

### B. Riwayat Pengajuan (`/app/pengajuan/page.tsx`)
* **Tampilan:** Data Table. Harus mencakup kotak pencarian (Search), pagination, dan tombol aksi utama "Ajukan Peminjaman" yang melakukan navigasi ke `/pengajuan/tambah`.
* **Kolom Tabel:** Sesuai desain (contoh: Tanggal, Rentang Waktu, Total Item, Status [Gunakan Badge berwarna]).
* **Integrasi API:** `GET /api/pengajuan/me`.

### C. Form Tambah Pengajuan (`/app/pengajuan/tambah/page.tsx`)
Halaman ini memiliki interaksi reaktif yang kompleks.
* **Form Inputs Dasar:**
  1. Input Tanggal dan Waktu (Mulai & Selesai).
  2. Input File (untuk `surat_pengajuan` dalam format PDF).
  3. Select Dropdown untuk "Pilih Organisasi" (Fetch opsi dari `GET /api/organisasi`).
* **Interaksi Dinamis:**
  * Saat entitas Organisasi dipilih dari dropdown, lakukan fetch ke `GET /api/organisasi/{organisasi_id}/inventaris/available`.
  * Tampilkan hasilnya dalam bentuk tabel list barang di bawah form.
  * **Kolom List Barang:** Foto, Nama Barang, Kondisi, dan kolom terakhir berupa **Input Angka (Quantity)**.
  * Hanya barang yang input angkanya > 0 yang masuk ke dalam *payload* peminjaman.
* **Submit Action:** * Gunakan `FormData` (karena mengandung unggahan file PDF) untuk mengirim data ke `POST /api/pengajuan`.

## 4. Coding Conventions untuk Codex
* **Data Fetching:** Gunakan Axios instance yang telah disetup di `services/api.ts`.
* **Reactivity:** Gunakan `useEffect` untuk memantau perubahan pada state `organisasi_id` agar list barang otomatis ter-update saat dropdown berubah.
* **Form Handling:** Pastikan state untuk form input (tanggal, file, list barang) terkelola dengan rapi di dalam komponen sebelum disubmit.
* **UI States:** Wajib menambahkan *loading state* (spinner/skeleton) saat *fetching* data awal dan saat tombol submit ditekan.
* Jangan menebak field database jika tidak yakin; buat form field yang logis mencerminkan UI.