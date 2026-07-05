# FRONTEND AGENT CONTEXT - FASE 1: Foundation, Auth, & Layout Extraction

## 1. Core Objective Phase 1
Membangun pondasi proyek Next.js (App Router), mengkonfigurasi API Client (Axios), membangun halaman Autentikasi, dan merancang `DashboardLayout` utama dengan cara mengekstraknya dari halaman Dashboard Umum.

## 2. Tech Stack & Styling Rules
* **Framework:** Next.js, TypeScript, Tailwind CSS.
* **Styling Method:** AI wajib menerjemahkan *design referensi (gambar)* yang dilampirkan oleh pengguna menjadi kode Tailwind CSS sedetail mungkin (warna, *spacing*, tipografi, dan *alignment*).
* **Warna Utama:** `#155dfc` (gunakan sebagai referensi jika gambar kurang jelas).
* **Icons:** Gunakan `react-icons`.

## 3. Folder Structure
* `/app`: Routing halaman.
* `/components/layouts`: Tempat menyimpan `AuthLayout` dan `DashboardLayout`.
* `/components/ui`: Tempat menyimpan komponen kecil (Button, Input, Card).
* `/services`: Konfigurasi `api.ts` (Axios instance dengan interceptor JWT dari `NEXT_PUBLIC_API_URL`).

## 4. Execution Sequence (Urutan Pengerjaan)
AI harus mengikuti langkah ini secara berurutan sesuai instruksi pengguna:

### Langkah A: Setup & API Client
* Buat file `.env.local` dan `services/api.ts` dengan interceptor JWT yang membaca token dari `localStorage` atau `cookies`.

### Langkah B: Auth Module (Refer to 'design/auth')
* Buat `/components/layouts/AuthLayout.tsx` (Layout polos, konten di tengah).
* Buat `/app/login/page.tsx`: Implementasi form login berdasarkan gambar desain yang dilampirkan. Terintegrasi dengan `/api/login`.
* Buat `/app/register/page.tsx`: Implementasi form register berdasarkan gambar desain. Terintegrasi dengan `/api/register`.

### Langkah C: Dashboard Umum & Layout Extraction (Refer to 'design/umum')
1. **Build the Page First:** Buat halaman `/app/page.tsx` (Dashboard Umum) secara utuh berdasarkan gambar desain yang dilampirkan pengguna. Pastikan Sidebar, Header (dengan nama page dan User Popover), dan Konten Metrik Card terbangun rapi.
2. **Extract the Layout:** Setelah halaman utuh selesai dan rapi, **ekstrak** bagian Sidebar dan Header dari `/app/page.tsx` tersebut dan pindahkan ke dalam `/components/layouts/DashboardLayout.tsx`.
3. **Refactor:** Ubah `/app/page.tsx` agar menggunakan `DashboardLayout` tersebut, menyisakan hanya komponen khusus metrik dashboard di dalamnya.

## 5. Prompting Instruction for Codex
* Jangan membuat asumsi desain sendiri. Jika pengguna melampirkan gambar, tiru struktur grid, flexbox, dan *padding/margin*-nya dengan akurat menggunakan Tailwind.
* Eksekusi kode secara bertahap. Jangan melompat ke Langkah C sebelum Langkah B disetujui pengguna.
* Pastikan layout yang diekstrak cukup fleksibel untuk menerima `children` berupa konten dari halaman-halaman lain di masa depan.