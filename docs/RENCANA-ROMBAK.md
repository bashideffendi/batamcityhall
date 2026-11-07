# Rencana Rombak Batam City Hall

Daftar lengkap semua permintaan pemilik. Tanda: ✔ selesai di kode, ◐ sebagian, ☐ belum. Rombak tayang sejak `db11315` (6 November 2026). Yang sesudahnya ditulis lokal.

## A. Dari berkas pindahan

| No | Permintaan | Status |
|---|---|---|
| A1 | Pasang proyek di PC ini | ✔ |
| A2 | Deploy koreksi "loket" (`aa7026f`) | ✔ tayang |
| A3 | Skor Tahap 7 | ✔ |
| A4 | Aksesibilitas semua halaman, dua tema, dua lebar | ✔ 256 pemeriksaan, 0 temuan |
| A5 | Tulis ulang tes e2e | ✔ 900 lulus, 14 dilewati (khusus mode mati) |
| A6 | Tahap 8: galeri screenshot, skor semua halaman, `KOREKSI.md`, syarat 8.1 | ✔ 60 dari 60 halaman lolos |
| A7 | Keputusan yang menunggu di `TODO_PEMILIK.md`, termasuk `KALIMAT_REMPANG` | ☐ disampaikan di laporan akhir |
| A8 | Perbarui `CHANGELOG`, `COVERAGE`, `PARITAS`, `LANJUTKAN` | ✔ |

## B. Makanan

| No | Permintaan | Status |
|---|---|---|
| B1 | Desain ulang mengikuti riset, boleh ganti nama menu | ✔ menu baru: Hidangan, Kawasan, Panduan, Dekat Feri, Peta, Simpanan |
| B2 | Tempat galeri foto di halaman dalam | ✔ |
| B3 | Serius, elit, premium, berguna, website lebih enak | ✔ diperiksa ulang lewat audit |
| B4 | Riset: bilah bawah ponsel berisi Peta, Saring, Simpanan | ✔ Peta atau Daftar, Saring, Simpanan |
| B5 | Riset: waktu tempuh ke terminal | Tidak dibuat, tidak ada data jalan. Diganti jarak |
| B6 | Riset: dua bahasa | Dibatalkan, lihat D5 |

## C. Teks

| No | Permintaan | Status |
|---|---|---|
| C1 | Minimalis di seluruh situs, kalimat efektif, boleh panjang bila perlu | ✔ dua putaran |
| C2 | Title Case profesional: Martabak dan Prata | ✔ menu, tombol, saringan, kolom, label status |
| C3 | Jenis Jasa di Tukang memakai Title Case | ✔ |

## D. Audit dan rombak (pesan panjang Anda)

| No | Permintaan | Status |
|---|---|---|
| D0 | Audit mendalam: bug, desain, alur menjelajah. Berbobot, berisi, informatif, enak dilihat dan dibaca | ✔ `docs/AUDIT.md`, ditambah audit mesin 110 halaman: nol tautan rusak, nol galat konsol, nol luber |
| D1 | Hapus tulisan tak penting ("Panduan harian Kota Batam, disusun oleh warga"). Nomor darurat dengan tanda darurat di tempat yang gampang ditemui | ✔ baris darurat di puncak setiap halaman, slogan dihapus |
| D2 | Informasi penting tampil di beranda, dengan Selengkapnya | ✔ beranda dasbor |
| D3 | Perbaiki jarak: halaman bagian terlalu banyak ruang kosong | ✔ pembuka halaman dirapatkan, kolom kosong diisi |
| D4 | Menu dan submenu terstruktur. Peta tidak di antara Trans Batam dan Feri | ✔ |
| D5 | Tombol ID/EN yang hanya di Makanan | ✔ dihapus |
| D6 | Ruang Main: buang yang tidak bermutu, sediakan cetak kartu pos dengan beberapa desain | ✔ enam desain siap cetak A6, dua sisi |
| D7 | Rombak menu: Cuaca, CCTV sendiri, Makanan, Things to Do, Komunitas, Tukang Langganan, Berita, Transportasi, dan nasib Cerita, Informasi Warga, Ruang Main | ✔ |
| D8 | Improvement apa pun, target nilai 100, desain boleh diganti | ◐ lihat laporan akhir |
| D9 | Peta keluar sampai tepi kanan layar di Radar Hujan | ✔ peta di dalam wadah, termasuk Peta Transportasi |

## E. Jurnal dan Berita

| No | Permintaan | Status |
|---|---|---|
| E1 | Blog bernama Jurnal, terpisah dari Berita | ✔ |
| E2 | Artikel rapi: judul, nama penulis, tanggal, rata kanan-kiri | ✔ |
| E3 | Artikel berupa narasi, bukan poin-poin (contoh Nongsa) | ✔ ditulis ulang dari data terverifikasi |
| E4 | Berita sama rapinya | ✔ judul, media, tanggal |
| E5 | Dashboard admin: tulis Jurnal, tambah foto dan data makanan. Mudah, murah, cepat, andal | ◐ kode dan alur teruji di mode contoh, Supabase menunggu G2 |

## F. Things to Do, peta, koordinat

| No | Permintaan | Status |
|---|---|---|
| F1 | Agenda diperluas menjadi Things to Do: acara, konser, dan lainnya | ✔ tempat, agenda bertanggal, acara sepanjang tahun. Konser menunggu data, tidak dikarang |
| F2 | Titik berdekatan tidak digabung dan tanpa angka, di semua peta | ✔ |
| F3 | Titik kecil supaya sebaran terlihat, terpencar saat diperbesar | ✔ |
| F4 | Excel semua lokasi yang butuh koordinat, untuk diisi manual dari Google Maps | ✔ `data/koordinat_perlu_diisi.xlsx`, masuk kembali lewat `tools/impor_lembar_koordinat.py` |
| F5 | Halaman food court di Makanan | ✔ `/makan/food-court`, 16 tempat bersumber, peta muncul setelah koordinat diisi |
| F6 | Kategori Makanan diganti 32 kategori pemilik | ✔ tujuh kategori belum punya tempat, tampil Belum Ada |
| F7 | Dashboard: tambah dan ubah tempat, foto, data, tautan ke food court | ✔ kode dan alur teruji di mode contoh |
| F8 | Menu Info Loker | ✔ diisi dari dashboard, menu tampil setelah basis data tersambung |
| F9 | Tambah dan ubah food court lewat dashboard | ✔ tayang `49446af` |
| F10 | Spasi yang dempet di seluruh situs | ✔ lokal, diukur otomatis di 63 halaman |
| F11 | Warna peta gelombang terlalu pudar | ✔ lokal, kepekatan 0,65 |
| F12 | Menu Infografik ala Tirto | ✔ lokal, lima poster bawaan dan unggahan dashboard |
| F13 | Kaki situs berisi newsletter, syarat, privasi, bukan menu | ✔ lokal, newsletter dibuka setelah basis data tersambung |
| F14 | Terjemahan Inggris untuk seluruh situs | ☐ menyusul setelah semua bagian selesai |
| F15 | Logo di Direktori hilang | ✔ lokal, daftar Direktori di Layanan Warga memakai logo kategori |
| F16 | Instagram tampil sebagai logo | ✔ lokal |

## G. Yang perlu persetujuan Anda

| No | Hal | Keadaan |
|---|---|---|
| G1 | Push dan deploy ke situs tayang | Tidak saya lakukan sampai Anda meminta |
| G2 | Membuat proyek Supabase di akun Anda untuk dashboard | Kode bisa saya siapkan lebih dulu, proyeknya menunggu kata "boleh" |

## Keputusan yang saya ambil

- **Menu:** Cuaca · CCTV · Transportasi · Makanan · Berita · Jurnal · Things to Do · Komunitas · Tukang Langganan · Layanan Warga · Sejarah dan Budaya.
- **Informasi Warga** menjadi Layanan Warga. **Cerita dan Budaya** menjadi Sejarah dan Budaya. **Ruang Main** dihapus, Kartu Pos jadi halaman sendiri.
- **Semua label pendek memakai Title Case**: menu, tab, saringan, tombol, judul kolom. Kalimat tetap kapital awal. Entri kamus mengikuti kamus.
- **Isi faktual tidak berubah**: Rempang, legalitas, teks BMKG, nomor darurat, dan makna hukum.

## Urutan kerja

1. Audit seluruh situs, tulis semua temuan di `docs/AUDIT.md`.
2. Selesaikan kerangka: menu, submenu, kepala, kaki halaman, jarak.
3. Peta: tanpa gabungan angka, titik kecil, masuk ke dalam wadah.
4. Beranda menjadi dasbor.
5. Halaman bagian, Things to Do, Komunitas, Berita, Jurnal, Kartu Pos.
6. Title Case menyeluruh dan pembersihan teks putaran kedua.
7. Bereskan semua temuan audit, satu per satu.
8. Dashboard admin.
9. Excel koordinat.
10. Tes e2e, axe, skor, galeri, sebelum-sesudah, `KOREKSI.md`, dokumen.
11. Audit ulang sampai bersih, lalu laporan akhir.
