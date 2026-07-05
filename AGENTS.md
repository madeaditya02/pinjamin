# FRONTEND AGENT CONTEXT - FASE 4: Modul CRUD Inventaris Organisasi

## 1. Core Objective Phase 4
Membangun fitur CRUD (Create, Read, Update, Delete) untuk pengelolaan barang inventaris oleh role **Organisasi**. Karena tidak ada desain spesifik, AI **wajib mendaur ulang (reuse)** komponen UI yang sudah dibuat pada fase sebelumnya (seperti Data Table, Input Form, dan Button) agar antarmuka tetap seragam.

## 2. Layout & Global Rules
* Seluruh halaman di modul ini harus dibungkus menggunakan `DashboardLayout`.
* **State Management Data:** Gunakan `useState` dan `useEffect` untuk integrasi API.
* **Loading & Error:** Implementasikan *loading state* (spinner/disable tombol) saat request API berlangsung dan tampilkan *toast/alert* untuk respons sukses atau *error*.

## 3. Page Specifications & API Integration

### A. List Inventaris (`/app/inventaris/page.tsx`)
* **Tampilan:** Data Table standar.
* **Fitur Utama:** Pencarian (Search) dan Pagination dari sisi server (kirim parameter ke API).
* **Kolom Tabel:** Foto (`gambar_inventaris`), Nama Barang, Jumlah, Kondisi, Kategori (`nama_kategori`), dan Aksi (tombol edit dan delete).
* **Tombol Aksi:** * "Tambah Barang" (di atas tabel, mengarah ke `/inventaris/tambah`).
  * "Edit" (di setiap baris, mengarah ke `/inventaris/[id]/edit`).
  * "Hapus" (menampilkan konfirmasi sebelum menembak endpoint DELETE).
* **API Endpoint:** `GET /api/organisasi/inventaris`.

### B. Form Tambah Inventaris (`/app/inventaris/tambah/page.tsx`)
* **Tampilan:** Form input terstruktur (bisa menggunakan grid 2 kolom agar rapi).
* **Input Fields:**
  1. `kategori_inventaris_id`: Select dropdown. Lakukan *fetch* ke `GET /api/kategori` saat komponen di-mount untuk mengisi opsi.
  2. `nama_inventaris`: Text input.
  3. `gambar_inventaris`: File input (hanya menerima *image*).
  4. `deskripsi_inventaris`: Textarea.
  5. `jumlah_inventaris`: Number input.
  6. `harga_inventaris`: Number input.
  7. `kondisi`: Select dropdown (Opsi statis: "Baik" dan "Rusak").
* **Data Handling (`organisasi_id`):** Ambil `organisasi_id` dari data *user* yang sedang login (melalui *state* atau *token* yang tersimpan).
* **Submit Action:** **Wajib menggunakan `FormData`** karena mengandung *file upload*. 
* **API Endpoint:** `POST /api/organisasi/inventaris`.

### C. Form Edit Inventaris (`/app/inventaris/[id]/edit/page.tsx`)
* **Tampilan & Input:** Identik dengan form pada halaman Tambah.
* **Data Initialization:** Saat halaman dimuat, lakukan *fetch* ke `GET /api/organisasi/inventaris/{id}` (jika endpoint detail tersedia) atau manipulasi *state* dari tabel sebelumnya untuk mengisi nilai bawaan (*default value*) pada form.
* **File Upload di Mode Edit:** Input `gambar_inventaris` bersifat opsional. Jika *user* tidak mengunggah gambar baru, jangan masukkan *key* gambar ke dalam `FormData` atau sesuaikan dengan aturan backend.
* **API Endpoint:** `PUT /api/organisasi/inventaris/{id}`.

## 4. Coding Conventions untuk Codex
* **FormData Implementation:** Ingat bahwa Axios membutuhkan *header* `Content-Type: multipart/form-data` saat mengirim `FormData`. Pastikan interceptor tidak me-override ini menjadi `application/json` secara paksa untuk endpoint ini.
* **Image Rendering:** Gunakan tag `<img>` atau Next.js `<Image>` (dengan konfigurasi `next.config.js` yang tepat untuk domain eksternal) untuk merender foto pada tabel list barang. Berikan *fallback image* jika URL gambar rusak atau kosong.
* **Konsistensi UI:** Gunakan *class* Tailwind yang sama persis dengan form atau tabel di halaman `/pengajuan`. Jangan menciptakan gaya visual (*styling*) baru yang melenceng dari halaman sebelumnya.