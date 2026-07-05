# FRONTEND AGENT CONTEXT - FASE 3: Modul Organisasi & Conditional Routing

## 1. Core Objective Phase 3
Membangun antarmuka khusus untuk pengguna dengan *role* **Organisasi**, mengelola *route* yang tumpang tindih dengan *role* Umum, dan memastikan setiap interaksi API dilengkapi dengan indikator *loading* serta *pagination* yang akurat.

## 2. Shared Routes & Conditional Rendering Rule
AI wajib menangani halaman yang path-nya sama tetapi kontennya berbeda berdasarkan *role* user (Umum vs Organisasi):
* **Dashboard (`/app/page.tsx`):**
  Modifikasi halaman ini agar mendeteksi *role* pengguna. 
  - Jika `role === 'umum'`, render komponen `<DashboardUmum />`.
  - Jika `role === 'organisasi'`, render komponen `<DashboardOrganisasi />`.
* **Sidebar (`DashboardLayout`):**
  Pastikan menu navigasi di *Sidebar* menyesuaikan secara dinamis. Role Organisasi memiliki tambahan menu: "Kelola Peminjaman" (`/peminjaman`) dan "Kelola Inventaris" (`/inventaris`).
* **Halaman `/pengajuan` & `/pengajuan/tambah`:**
  Halaman ini berbagi fungsi yang persis sama antara Umum dan Organisasi. Biarkan kodenya seperti yang sudah dibuat di Fase 2, pastikan saja *Sidebar* tetap aktif.

## 3. Page Specifications & API Integration (Role Organisasi)

### A. Dashboard Organisasi (Komponen `<DashboardOrganisasi />`)
* **Tampilan:** Kartu metrik (Metrik Cards).
* **Integrasi API:** `GET /api/organisasi/dashboard`.
* **Data Output:** "Permintaan Masuk", "Barang Dipinjam", dan "Total Barang".

### B. Kelola Peminjaman (`/app/peminjaman/page.tsx`)
* **Tampilan:** Data Table untuk daftar permintaan masuk.
* **Fitur Wajib:** Kotak pencarian (Search) dan **Pagination terintegrasi API**. Parameter pencarian/halaman harus dikirim ke *backend* dan data di-update.
* **Aksi:** Tombol "Review" mengarah ke `/peminjaman/[id]`. **Kondisional:** Jika status peminjaman adalah `approved`, tampilkan juga tombol "Kembalikan" yang mengarah ke `/peminjaman/[id]/return`.
* **API:** `GET /api/organisasi/pengajuan`.

### C. Detail Peminjaman (`/app/peminjaman/[id]/page.tsx`)
* **Tampilan:** Informasi detail peminjam (Nama, tanggal/waktu mulai & selesai, alasan, link berkas `surat_pengajuan`). Di bawahnya terdapat tabel *list* barang (Foto, Nama Inventaris, Jumlah Dipinjam).
* **Aksi:** Tombol "Approve" dan "Reject".
* **API Fetch:** `GET /api/organisasi/pengajuan/{id}`.
* **API Action:** `PUT /api/organisasi/pengajuan/{id}/status`. (Kirim payload status: 'approved' atau 'rejected').

### D. Form Pengembalian (`/app/peminjaman/[id]/return/page.tsx`)
* **Tampilan:** Identik dengan halaman Detail Peminjaman, namun pada tabel *list* barang terdapat **tambahan 1 kolom input angka** untuk mencatat jumlah barang yang dikembalikan.
* **Aksi:** Tombol "Kembalikan" di akhir halaman.
* **API Action:** `POST /api/organisasi/pengajuan/{id}/return`. Format *payload* sesuaikan dengan struktur data pengembalian barang.

## 4. Strict UI/UX Rules untuk Codex
* **Loading Indicators (MUTLAK):** Setiap kali komponen melakukan *fetching* data ke API (saat *mount*, pindah halaman *pagination*, atau *search*), **wajib** menampilkan *loading spinner*, *skeleton loader*, atau men-disable tombol/tabel agar *user experience* terjaga.
* **API Pagination:** Implementasikan logika *pagination* murni dari API (bukan *slice array* di sisi *client*). Kirim parameter seperti `?page=2&limit=10` ke *endpoint* jika dibutuhkan oleh backend.
* **Error Handling:** Jika *request API* gagal, tampilkan pesan *error* (misalnya dengan komponen *Toast* atau *Alert*) dan kembalikan *state loading* ke `false`.
* Jangan gunakan *state management* eksternal. Manfaatkan `useState`, `useEffect`, dan *Custom Hooks* untuk memisahkan logika pemanggilan API dari komponen UI.