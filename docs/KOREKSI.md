# Koreksi Tampilan

Hasil Tahap 8 pedoman (bagian 8.1): skor bagian 7.2 untuk setiap halaman, sebelum dan sesudah rombak. Skor 0 sampai 2 lolos.

**Sebelum:** `docs/tampilan/skor/07-tahap7.json`, situs yang tayang di `aa7026f`.
**Sesudah:** `docs/tampilan/skor/08-rombak.json`, build produksi lokal 5 November 2026.

**Ringkasan:** 60 halaman diberi skor. Skor tertinggi 1, 1 halaman di atas nol, semua lolos.

## Galeri

Gambar di `docs/tampilan/sebelum-sesudah/rombak/`:

- `sebelum-desktop.png`, `sebelum-ponsel.png`: situs sebelum rombak.
- `sesudah-desktop.png`, `sesudah-ponsel.png`: delapan bagian utama.
- `sesudah-baru.png`: halaman baru dan halaman yang dibangun ulang.
- `sesudah-gelap.png`: tema gelap.

## Skor per Halaman

| Halaman | Sebelum | Sesudah | Perubahan Utama |
|---|---|---|---|
| `/` | 1 | 1 | Dasbor dengan Selengkapnya per bagian, ruang kosong dirapatkan, baris Hari Ini bisa diklik. Catatan skor: kolom cari di bawah layar pertama. |
| `/cuaca` | 0 | 0 | Pintu bagian dirapatkan, keadaan saat ini di atas. |
| `/cuaca/hujan` | 0 | 0 | Tinggi peta ponsel mengikuti kepala situs baru, judul panel terlihat di layar pertama. |
| `/cuaca/gelombang` | 0 | 0 | Tinggi peta ponsel mengikuti kepala situs baru, judul panel terlihat di layar pertama. |
| `/cctv` | 0 | 0 | Pindah dari `/cuaca/cctv`, menjadi menu utama. |
| `/cuaca/peringatan` | 0 | 0 | Submenu baru, Title Case. Isi BMKG tidak berubah. |
| `/cuaca/gempa` | 0 | 0 | Sepuluh gempa terbaru lebih dulu. Isi BMKG tidak berubah. |
| `/makan` | 0 | 0 | Desain ulang, ilustrasi, dan 32 kategori pemilik. |
| `/makan/peta` | 0 | 0 | Ponsel: peta di atas daftar, tanpa gabungan titik dan angka. Pilihan urutan setinggi 44 px. |
| `/makan/hidangan` | 0 | 0 | Pindah dari `/makan/kategori`. 32 kategori dalam enam rumpun, yang kosong tampil Belum Ada. |
| `/makan/hidangan/sop-ikan` | baru | 0 | Alamat baru mengikuti nama kategori. |
| `/makan/panduan` | 0 | 0 | Pindah dari `/makan/jalur`. |
| `/makan/panduan/halal-nagoya` | 0 | 0 | Pindah dari `/makan/jalur/halal-nagoya`. |
| `/makan/panduan/sarapan` | baru | 0 | Alamat baru, mengikuti format panduan. |
| `/makan/food-court` | baru | 0 | Baru. 16 tempat bersumber, tertaut ke tempat makan di dalamnya. |
| `/makan/kawasan` | baru | 0 | Masuk submenu Makanan. |
| `/makan/kawasan/bengkong` | baru | 0 | Mengikuti daftar Makanan baru. |
| `/makan/dekat-feri` | baru | 0 | Mengikuti daftar Makanan baru. |
| `/makan/tempat/golden-prawn-933` | 0 | 0 | Tombol utama sebelum galeri, baris Food Court bila ada. |
| `/makan/simpanan` | 0 | 0 | Pindah dari `/makan/tersimpan`. |
| `/makan/cara-memilih` | 1 | 0 | Pindah dari `/makan/tentang`. |
| `/cari` | baru | 0 | Baru. Halaman dan seluruh direktori, termasuk sinonim seperti igd, polisi, sertifikat. |
| `/loker` | baru | 0 | Baru. Diisi dari dashboard, menu tampil setelah basis data tersambung. |
| `/jurnal/nongsa-dan-mandat-1829` | baru | 0 | Baru. Tulisan naratif dengan penulis dan tanggal. |
| `/tukang` | 0 | 0 | Saringan tidak tampil selama daftar kosong, jarak judul dibetulkan. |
| `/tukang/rekomendasi` | 0 | 0 | Tautan tampil setelah basis data tersambung. |
| `/jalan` | 0 | 0 | Pintu bagian dirapatkan, Feri Terakhir Hari Ini tetap di halaman ini. |
| `/jalan/trans-batam` | 0 | 0 | Title Case, ruang dirapatkan. |
| `/jalan/trans-batam/k1` | 0 | 0 | Title Case, ruang dirapatkan. |
| `/jalan/peta` | 0 | 0 | Peta tidak keluar wadah, tanpa gabungan titik dan angka. |
| `/jalan/feri` | 0 | 0 | Rute yang masih bisa dikejar lebih dulu, jadwal per rute dilipat. |
| `/jalan/feri/panduan` | 0 | 0 | Paragraf rata kanan-kiri, Title Case. |
| `/jalan/pompong` | 0 | 0 | Format baris. |
| `/cerita` | 0 | 0 | Menjadi Sejarah dan Budaya, dengan tulisan Jurnal pilihan. |
| `/cerita/sejarah` | 0 | 0 | Ilustrasi baru, paragraf rata kanan-kiri. |
| `/cerita/kampung-tua` | 0 | 0 | Titik kecil saat peta jauh, tanpa gabungan. Isi faktual tidak berubah. |
| `/cerita/nama-jalan` | 0 | 0 | Ilustrasi baru, titik kecil saat peta jauh. |
| `/things-to-do` | 0 | 0 | Pindah dari `/cerita/kalender`. Format baris, mulai dari bulan berjalan. |
| `/cerita/kamus` | 0 | 0 | Format baris ringkas. |
| `/cerita/budaya` | 0 | 0 | Kartu menjadi baris. |
| `/komunitas` | 0 | 0 | Pindah dari `/cerita/komunitas`, menjadi menu utama. Kartu menjadi baris. |
| `/cerita/angka` | 0 | 0 | Angka dalam tabel. |
| `/info` | 0 | 0 | Menjadi Layanan Warga, Nomor Darurat di atas. |
| `/info/direktori` | 0 | 0 | Ikon dan jumlah per kategori dibetulkan. |
| `/info/direktori/kesehatan` | 0 | 0 | Telepon tampil di baris, tempat bisa dicari lewat sinonim. |
| `/info/kecamatan/batam-kota` | 0 | 0 | Title Case, ruang dirapatkan. |
| `/info/darurat` | 0 | 0 | Nomor darurat kini juga di bilah atas setiap halaman. Isi tidak berubah. |
| `/info/urusan-tanah` | 0 | 0 | Title Case. Isi faktual tidak berubah. |
| `/info/bantuan-hukum` | 0 | 0 | Title Case. Isi faktual tidak berubah. |
| `/info/jasa-dokumen` | 0 | 0 | Title Case. Isi faktual tidak berubah. |
| `/berita` | 0 | 0 | Pindah dari `/info/berita`, menjadi menu utama, terpisah dari Jurnal. |
| `/jurnal` | baru | 0 | Baru. Terpisah dari Berita. |
| `/kartu-pos` | 0 | 0 | Pindah dari `/main/kartu-pos`. Enam desain, cetak tepat dua halaman A6. |
| `/tentang` | 0 | 0 | Title Case, teks diringkas. |
| `/kolofon` | 0 | 0 | Title Case. |
| `/koreksi` | 0 | 0 | Tautan tampil setelah basis data tersambung. |
| `/kontribusi` | 0 | 0 | Tautan tampil setelah basis data tersambung. |
| `/privasi` | 0 | 0 | Title Case. |
| `/syarat` | 0 | 0 | Title Case. |
| `/tidak-ada-halaman-ini` | 0 | 0 | Mengikuti menu baru. |

## Alamat yang Dihapus

Semua dialihkan permanen, jadi tautan lama tetap sampai.

| Alamat Lama | Tujuan |
|---|---|
| `/main` | `/kartu-pos` |
| `/main/singapura-atau-nagoya` | `/jalan/feri` |
| `/main/vibe` | `/cctv` |
| `/makan/daftar` | `/makan/peta` |

## Syarat Selesai 8.1

| Syarat | Hasil |
|---|---|
| `cek-bahasa` lulus | Lulus |
| Semua halaman mendapat skor 0 sampai 2 | 60 dari 60 halaman |
| Judul dan angka Hari Ini terlihat tanpa menggulir di desktop 1440 px | Terlihat: judul berakhir di 309 px, baris Feri Terakhir di 629 px, tinggi layar 900 px |
| Judul dan paragraf pembuka terlihat tanpa menggulir di ponsel 390 px | Judul terlihat di 60 dari 60 halaman. Paragraf pembuka Cuaca, Gelombang, dan CCTV berada di panel peta yang tertutup saat dibuka, jadi tampil setelah panel digeser |
| Tampilan cocok dengan contoh tampilan (4.1) | Mengikuti token, huruf, dan templat pedoman. Menu dan beranda berubah atas koreksi rombak pemilik (butir 1 sampai 15 di pedoman) |
| Halaman bagian 6 tidak muncul di menu, beranda, dan sitemap | Delapan halaman tetap ada dengan `noindex`, tidak ada di ketiganya. `/main/vibe` dialihkan ke `/cctv` |
| Build dan semua tes lulus | Build lulus. Unit 693 lulus. E2E di mode contoh: 900 lulus, 14 dilewati (khusus mode mati), termasuk axe di dua lebar. `tsc`, lint, dan `validate-data` lulus |
