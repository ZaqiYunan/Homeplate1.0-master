# Panduan Pengguna Aplikasi HomePlate

Selamat datang di HomePlate! Panduan ini akan membantu Anda memahami cara menggunakan semua fitur luar biasa yang kami tawarkan untuk mengelola bahan makanan, mendapatkan rekomendasi resep cerdas, dan melacak nutrisi Anda.

## 1. Pendahuluan

HomePlate adalah sistem informasi berbasis website yang dirancang untuk membantu Anda mengatasi tantangan sehari-hari dalam pengelolaan bahan makanan. Aplikasi ini bertujuan untuk mengurangi pemborosan makanan, mempermudah perencanaan menu sehat, dan meningkatkan kesadaran akan gizi melalui fitur-fitur berbasis kecerdasan buatan (AI).

## 2. Memulai

Untuk menggunakan HomePlate, pastikan Anda memiliki koneksi internet yang stabil dan peramban web modern (seperti Chrome, Firefox, atau Safari).

### 2.1 Registrasi dan Login

1.  **Kunjungi URL Aplikasi**: Buka [https://homeplate-zeta.vercel.app](https://homeplate-zeta.vercel.app).
2.  **Registrasi**: Jika Anda pengguna baru, klik tombol registrasi. Anda dapat mendaftar menggunakan email dan kata sandi, atau melalui akun Google Anda (OAuth).
3.  **Login**: Jika sudah punya akun, login dengan kredensial Anda.
4.  **Kredensial untuk Pengujian**: Untuk keperluan pengujian, Anda bisa menggunakan akun berikut:

| Peran | Email | Kata Sandi |
| :--- | :--- | :--- |
| `User` | `user1@homeplate.com` | `user123` |
| `Admin` | `admin@homeplate.com` | `admin123` |

### 2.2 Melengkapi Profil

Setelah login pertama kali, lengkapi profil Anda dengan memasukkan data seperti tinggi badan, berat badan, usia, dan jenis kelamin. Data ini akan digunakan untuk memberikan rekomendasi target nutrisi yang lebih personal.

## 3. Panduan Fitur Utama

### Digital Pantry (Menu `Storage`)

Fitur ini berfungsi sebagai lemari es dan pantry digital Anda.

* **Menambah Bahan Makanan**:
    1.  Buka menu `Storage` (path: `/storage`).
    2.  Klik tombol `+ Add Ingredient`.
    3.  Isi detail bahan seperti nama, jumlah, unit, lokasi penyimpanan, dan tanggal pembelian.
    4.  Biarkan aplikasi memprediksi tanggal kedaluwarsa secara otomatis menggunakan AI atau isi secara manual.
    5.  Klik `Save` untuk menyimpan.

* **Mengelola Bahan Makanan**:
    * Anda dapat mengubah (`Edit`) atau menghapus (`Delete`) bahan yang sudah ada langsung dari daftar.
    * Perhatikan indikator visual untuk bahan yang mendekati tanggal kedaluwarsa.

### Rekomendasi Resep AI (Menu `Recipes`)

Dapatkan ide masakan berdasarkan bahan yang Anda miliki atau keinginan Anda.

1.  Buka menu `Recipes` (path: `/recipes`).
2.  Pilih salah satu dari dua mode berikut:
    * **"Use My Storage"**: Aplikasi akan secara otomatis merekomendasikan resep berdasarkan bahan yang tersedia di pantry Anda.
    * **"Creative Mode"**: Masukkan ide masakan Anda secara manual (contoh: "spicy chicken curry").
3.  Anda bisa memfilter hasil berdasarkan jenis kuliner (Indonesian, Asian, Western).
4.  Klik `Generate Recipes` untuk melihat hasil dari AI.
5.  Klik `View Recipe` untuk detail lengkap atau `Add to Meal Log` untuk mencatatnya ke jurnal nutrisi Anda.

### Pencarian Spesifikasi Bahan (Menu `Ingredients`)

Pelajari lebih dalam tentang bahan makanan menggunakan pencarian cerdas.

1.  Buka menu `Ingredients` (path: `/ingredients`) dan pilih tab `AI Search`.
2.  Ketik pertanyaan Anda dalam bahasa natural (contoh: "kandungan vitamin C jeruk" atau "cara menyimpan daging").
3.  AI akan memproses dan menampilkan informasi terstruktur mengenai nutrisi, cara penyimpanan, manfaat, dan tips memasak.

### Pelacakan Nutrisi (Menu `Nutrition`)

Pantau asupan kalori dan makronutrien harian Anda.

1.  Buka menu `Nutrition` (path: `/nutrition`).
2.  Atur target nutrisi harian Anda. Jika tidak diisi, sistem akan menggunakan nilai default.
3.  Setiap kali Anda menggunakan fitur `Add to Meal Log` dari sebuah resep, data nutrisinya akan otomatis tercatat.
4.  Gunakan fitur `Update Goals` untuk melacak asupan harian berdasarkan tinggi dan berat badan, usia, serta jenis kelamin yang diintegrasikan dengan AI. 

## 4. Panduan untuk Admin

Fitur ini hanya dapat diakses oleh pengguna dengan peran `Admin`.

### 4.1 Mengakses Dashboard Admin

1.  Login menggunakan kredensial Admin.
2.  Buka menu profil di pojok kanan atas, lalu pilih `Admin Panel` untuk diarahkan ke halaman `/admin`.

### 4.2 Fungsi Admin

Di dalam dashboard, Anda dapat melakukan:
* **Monitoring Sistem**: Melihat statistik pengguna secara *real-time* dan indikator kesehatan sistem.
* **Manajemen Pengguna**: Melihat seluruh daftar pengguna dan mengubah peran mereka (`user` <-> `admin`).
* **Peralatan Sistem**:
    * Mengecek status tabel database.
    * Memicu notifikasi email secara manual untuk pengujian.

## 5. Troubleshooting / FAQ

* **Tanya: Mengapa saya tidak bisa mengakses Admin Panel?**
    * **Jawab**: Fitur ini hanya untuk pengguna dengan peran `Admin`. Akses akan ditolak jika Anda login sebagai pengguna biasa.

* **Tanya: Mengapa tidak ada rekomendasi resep yang muncul di mode "Use My Storage"?**
    * **Jawab**: Pastikan Anda sudah menambahkan bahan makanan ke dalam `Digital Pantry` Anda. Fitur ini memerlukan data bahan untuk dapat memberikan rekomendasi.

* **Tanya: Apa yang harus saya lakukan jika lupa kata sandi?**
    * **Jawab**: Aplikasi memiliki fungsionalitas untuk reset kata sandi[cite: 676]. Cari tombol "Lupa Kata Sandi" atau sejenisnya di halaman login. 
