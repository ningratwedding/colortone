# TokoKita: Platform Digital untuk UMKM Indonesia

Selamat datang di TokoKita! Aplikasi ini adalah platform serbaguna yang dirancang untuk Usaha Mikro, Kecil, dan Menengah (UMKM) untuk membangun etalase digital mereka. Anggap ini sebagai gabungan antara halaman "link-in-bio" yang canggih dengan marketplace yang kuat untuk semua jenis produk.

## 🚀 Ringkasan Proyek

Tujuan utama TokoKita adalah menyediakan satu tempat bagi pelaku UMKM untuk:
- **Membangun Identitas Digital**: Membuat halaman profil publik yang indah dan dapat disesuaikan, yang menyatukan semua tautan sosial media, portofolio, dan informasi kontak bisnis.
- **Menjual Semua Jenis Produk**: Menjual produk digital (seperti kursus online, e-book, template) dan produk fisik (makanan, kerajinan, fashion) langsung kepada audiens mereka.
- **Memberdayakan Pelanggan**: Memanfaatkan program afiliasi (reseller) bawaan yang memungkinkan pelanggan setia mendapatkan komisi dengan mempromosikan produk.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan tumpukan teknologi modern dan terukur:

- **Framework**: [Next.js](https://nextjs.org/) (dengan App Router)
- **Library UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Komponen UI**: [ShadCN/UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
- **Validasi Skema**: [Zod](https://zod.dev/)
- **Manajemen Form**: [React Hook Form](https://react-hook-form.com/)

## ✨ Fitur Utama

### 1. Sistem Pengguna dengan Berbagai Peran
Aplikasi ini mendukung beberapa peran pengguna, masing-masing dengan dasbor dan kemampuannya sendiri:
- **Pembeli**: Pelanggan yang membeli produk.
- **Penjual (Seller)**: Pelaku UMKM yang dapat mengunggah dan menjual produk mereka sendiri.
- **Reseller (Affiliator)**: Pengguna yang dapat mempromosikan produk penjual lain dan mendapatkan komisi.
- **Admin**: Pengguna dengan akses penuh untuk mengelola platform.

### 2. Halaman Profil Publik (`[slug]`)
Setiap penjual mendapatkan halaman profil publik yang dapat disesuaikan sepenuhnya (`tokokita.id/nama-toko-anda`), yang berfungsi sebagai pusat digital mereka. Fitur kustomisasi meliputi:
- Latar belakang header (warna solid, gambar, atau video).
- Latar belakang halaman (warna solid atau gambar).
- Kustomisasi font dan warna untuk nama toko dan bio.
- Pengaturan tampilan untuk kartu produk dan tautan sosial.

### 3. Manajemen Produk
Penjual memiliki dasbor khusus untuk mengelola produk mereka:
- **Dukungan Produk Digital & Fisik**: Jual file yang dapat diunduh atau barang fisik dengan manajemen stok.
- **Galeri & Perbandingan**: Unggah beberapa gambar galeri dan gambar "sebelum-sesudah" untuk produk.
- **Kategorisasi**: Atur produk berdasarkan kategori.

### 4. Sistem Reseller (Afiliasi)
- **Dasbor Reseller**: Mitra reseller dapat melacak total penjualan, komisi, dan riwayat rujukan.
- **Pemilihan Produk Unggulan**: Reseller dapat memilih produk mana yang akan ditampilkan di halaman profil mereka.
- **Kategori Kustom**: Reseller dapat membuat kategori mereka sendiri untuk mengelompokkan produk yang mereka promosikan.
- **Tautan Rujukan**: Tautan afiliasi dibuat secara otomatis dengan menambahkan `?ref=USER_ID` ke URL produk.

### 5. Alur Checkout & Pesanan
- **Proses Checkout**: Alur checkout yang mulus untuk produk digital dan fisik.
- **Riwayat Pembelian**: Pengguna dapat melihat dan mengunduh kembali produk digital yang telah mereka beli.
- **Manajemen Pesanan**: Penjual dan Admin dapat melihat dan mengelola pesanan yang masuk.

### 6. Dasbor Admin
Dasbor terpusat untuk admin guna mengelola seluruh platform, termasuk:
- Manajemen pengguna, produk, pesanan, dan kategori.
- Pengaturan kampanye promosi.
- Analitik platform untuk melacak pendapatan dan penjualan.

## 📂 Struktur Proyek

Berikut adalah gambaran umum dari direktori dan file penting:

- **`src/app`**: Direktori utama untuk routing aplikasi menggunakan Next.js App Router.
  - **`/(public)`**: Rute yang dapat diakses publik (halaman utama, detail produk, dll.).
  - **`/(auth)`**: Rute untuk otentikasi (login, signup).
  - **`/admin`**: Rute dan tata letak untuk Dasbor Admin.
  - **`/seller`**: Rute dan tata letak untuk Dasbor Penjual.
  - **`/account`**: Rute dan tata letak untuk dasbor pengguna umum (pengaturan, pembelian).
  - **`/[slug]`**: Halaman profil publik dinamis untuk setiap pengguna.

- **`src/components`**: Berisi semua komponen React yang dapat digunakan kembali.
  - **`/ui`**: Komponen dasar dari ShadCN/UI.

- **`src/firebase`**: Konfigurasi dan hooks untuk integrasi Firebase.
  - **`config.ts`**: Konfigurasi koneksi Firebase (diambil dari variabel lingkungan).
  - **`provider.tsx`**: Provider konteks React untuk menyediakan instance Firebase ke seluruh aplikasi.
  - **`auth/` & `firestore/`**: Hooks kustom (`useUser`, `useDoc`, `useCollection`) untuk berinteraksi dengan layanan Firebase.

- **`src/lib`**: Berisi kode pustaka, konfigurasi, dan definisi tipe data.
  - **`config.ts`**: Konfigurasi situs umum (nama aplikasi, URL, dll.).
  - **`data.ts`**: Definisi tipe TypeScript untuk model data utama (seperti `UserProfile`, `Product`).

- **`docs/backend.json`**: File "blueprint" yang mendefinisikan skema data untuk entitas seperti `UserProfile` dan `Product`, serta struktur koleksi Firestore. Ini berfungsi sebagai sumber kebenaran untuk struktur data.

- **`firestore.rules`**: Aturan keamanan untuk database Firestore, yang mendefinisikan siapa yang dapat membaca atau menulis data di path tertentu.
