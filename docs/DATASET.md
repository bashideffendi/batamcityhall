# Dataset Kota Batam: riset enam portal dan arsip lokal

Atas permintaan pemilik (9 November 2026): telusuri enam portal data, ambil semua yang bisa diambil, dan siapkan bahan untuk menu Dataset serta fitur situs. Laporan riset lengkap per portal ada di `research/17-portal-data/`.

## Ringkasan per portal

| Portal | Pengelola | Isi untuk Batam | Cara ambil | Batasan akses | Lisensi | Diarsipkan |
|---|---|---|---|---|---|---|
| Satu Data Kota Batam | Diskominfo Kota Batam | 684 dataset (statistik per kecamatan 2022–2026), 27.539 indikator, 231 titik SD/SMP negeri dan puskesmas, poligon 12 kecamatan | API JSON tanpa login | Tanpa robots.txt. Sempat pemeliharaan (503) 9 Nov dini hari | Tidak dinyatakan (UU KIP, "© Hak Cipta") | 675 dataset JSON (7 sudah 404), katalog, daftar indikator, titik, poligon |
| Satu Data Provinsi Kepri | Diskominfo Kepri | 150 dataset per kabupaten/kota, 107 tabel memuat baris Batam (penduduk, UMKM, wisman, kemiskinan, TPT, faskes, investasi) | `/api/3/action/package_search` dan `/api/datastore/{id}` | robots.txt melarang `/data` (termasuk unduhan XLSX); tidak disentuh | "License not specified" | 181 tabel JSON |
| Portal Satu Data BP Batam | PDSI BP Batam (CKAN 2.11) | 118 dataset: penumpang feri per terminal, kunjungan kapal, bandara dan rute penerbangan, air baku dan IPA, waduk, kawasan industri, KEK, investasi, rusun, wisata Galang | Tautan Unduh resmi `/datastore/dump/{id}` | robots.txt melarang `/api/`, Crawl-Delay 10 (dipatuhi) | "No License Provided" | 123 berkas CSV/XLSX; 1 disaring (telepon dan email perusahaan) |
| Geoportal BP Batam | BP Batam (ArcGIS Server) | 21 layer "Data Terbuka" + wilayah kerja, pola ruang Perpres 87/2011, batas kecamatan | `query f=geojson outSR=4326` | Layer Terbatas/Tertutup, POI, penduduk per kelurahan (butuh token), dan kepemilikan tanah tidak disentuh | Tidak dinyatakan ("All Rights Reserved") | 23 layer GeoJSON |
| HANG JEBAT Geoportal | Disperkimtan Kota Batam | Perumahan (728 poligon), rusunawa dan tarif, PSU, PJU, proyek APBD (jalan lingkungan, drainase, batu miring, gedung), Kebun Raya | Berkas GeoJSON statis | robots.txt mengizinkan semua | Tidak dinyatakan; Syarat & Ketentuan tidak ada | 18 layer GeoJSON tanpa data pribadi |
| DataKita (angkabatam.id) | BPS Kota Batam | Dasbor butuh login; datanya milik BPS | WebAPI BPS butuh kunci pemilik | Content-Signal: `ai-train=no`, `search=yes` | Syarat BPS: boleh dipakai ulang dengan atribusi dan tautan | Belum (butuh kunci API) |

## Menu Dataset (tayang sejak `76b7e86`, 9 Nov 2026)

Keputusan pemilik 9 Nov 2026 (pilihan a): penyedia disebut sebagai teks biasa tanpa tautan. `/dataset` memuat 938 dataset dalam 12 tema dengan pratinjau paling banyak 50 baris. Data yang diterbitkan ada di `data/dataset/` (ikut repo), disusun `node scripts/dataset/terbitkan.mjs` dari arsip lokal. Berkas mentah tidak ditawarkan untuk diunduh sampai penyedia menyatakan izin.

## Arsip lokal

Folder `dataset-arsip/` di akar proyek, **tidak ikut repo** (`.gitignore`), karena tidak ada satu pun portal yang menyatakan lisensi dan repo ini publik. Isinya 1.020 berkas, sekitar 153 MB per 9 November 2026 (Satu Data Batam 675 dataset setelah portal pulih).

- `KATALOG.csv` dan `katalog.json`: satu baris per berkas (sumber, judul, produsen, berkas, ukuran, jumlah fitur, halaman asal, tanggal akses, lisensi).
- Per sumber: `satudata-batam/`, `satudata-kepri/`, `bpbatam-data/`, `bpbatam-geoportal/`, `hangjebat/`. Tiap folder punya `_manifest.json` berisi asal-usul setiap berkas.
- `satudata-batam/peta/kecamatan.geojson` dan `titik-fasilitas.geojson`: hasil olahan. Titik diberi tanda periksa: 209 wajar, 18 koordinat ganda, 3 di luar Batam, 1 kosong.

Mengambil ulang atau melanjutkan (skrip di `scripts/dataset/`, aman diulang; berkas yang sudah ada tidak diambil lagi):

```
node scripts/dataset/satudata-batam.mjs      # jalankan lagi saat portal pulih
node scripts/dataset/satudata-kepri.mjs
node scripts/dataset/bpbatam-data.mjs        # sekitar 45 menit (Crawl-Delay 10)
node scripts/dataset/bpbatam-geoportal.mjs   # sekitar 20 menit
node scripts/dataset/hangjebat.mjs
node scripts/dataset/olah-satudata-batam.mjs # kecamatan.js dan titik ke GeoJSON
node scripts/dataset/katalog.mjs             # susun ulang KATALOG.csv
```

Aturan yang dijaga skrip: data pajak dan retribusi tidak pernah disimpan, kolom data pribadi dibuang atau berkasnya disaring, jalur yang dilarang robots.txt tidak dipanggil, jeda antarpermintaan 1,5–10,5 detik, dan nama klien tanpa identitas pribadi.

## Yang tidak diambil dan alasannya

- **HANG JEBAT, data pribadi:** berkas BNBA BKKBN (memuat NIK, nomor KK, nama kepala keluarga; satu berkas 47 MB), Digitasi Ruli dan Ruli 2026, Identifikasi Bencana, Rumah Sewa, titik bencana beralamat, dan tabel rumah terdampak bencana. Semuanya terbuka untuk publik tanpa login. Tidak diunduh, tidak diarsipkan. Delineasi kawasan ruli juga tidak diambil karena sensitif secara sosial.
- **Geoportal BP Batam:** kepemilikan tanah per persil, layer Terbatas/Tertutup, POI dan penduduk per kelurahan (butuh token).
- **Satu Data Kepri:** unduhan XLSX dan dokumentasi API, karena berada di `/data` yang dilarang robots.txt.
- **Satu Data Batam:** lapisan "Peta Area" (angka per kecamatan terbukti salah, misalnya penduduk Bulang sama dengan Batam Kota).

## Kualitas data: perlu dicek sebelum tampil

- Satu Data Batam: angka berupa teks bertitik ("352.111"), nama kecamatan tidak konsisten (Sei/Sungai Beduk), slug tidak cocok dengan judul, beberapa angka meragukan (penumpang Trans Batam semester 1 2023 = 1.103 vs 2024 = 128.131; jumlah hotel 2024 sama persis dengan 2022; KK Batu Aji laki-laki = perempuan).
- Satu Data Kepri: kode wilayah Karimun dan Bintan tertukar antar dataset; struktur kolom berbeda di tiap dataset.
- BP Batam: koordinat dermaga dan kawasan industri dalam teks DMS yang tidak seragam (satu nilai bujur di luar Batam), kolom GT = CALL pada kunjungan kapal penumpang, nilai ekonomi dalam teks bebas.
- Titik dari portal mana pun tidak boleh langsung tampil di peta. Aturan proyek: koordinat hanya dari sumber yang sudah dipastikan.

## Yang bisa dibangun dari data ini (usulan, belum dikerjakan)

1. **Feri:** grafik penumpang bulanan per terminal (BP Batam) di halaman Feri.
2. **Terbang dari Batam:** daftar kota tujuan penerbangan langsung dari Hang Nadim (data rute penerbangan BP Batam).
3. **Air Batam:** waduk dan WTP di peta, kapasitas IPA dan pemakaian air baku per bulan.
4. **Kecamatan:** penduduk menurut umur, jenis kelamin, agama, dan KK di halaman `/info/kecamatan/[slug]`.
5. **Lembar koordinat:** 231 titik SD/SMP negeri dan puskesmas sebagai titik calon untuk diperiksa pemilik, bukan langsung tampil.
6. **Tata ruang dan industri:** kawasan industri, KEK, sub-wilayah pengembangan, dan pola ruang Perpres 87/2011 (berlabel tahun) sebagai lapisan peta.
7. **Perumahan:** nama 728 perumahan untuk pencarian lokasi, rusunawa dan tarif sewa di Layanan Warga.
8. **Proyek kota:** jalan lingkungan, drainase, batu miring, dan PJU beserta tahun dan nilai kontrak.
9. **Batam dibanding Kepri:** penduduk, UMKM, wisman, kemiskinan, pengangguran.

## Menu Dataset: usulan bentuk

- `/dataset`: katalog per tema (Kependudukan, Transportasi, Air dan Lingkungan, Ekonomi dan Investasi, Pariwisata, Tata Ruang, Perumahan, Fasilitas). Tiap dataset: judul, penyedia, periode, jumlah baris atau fitur, catatan kualitas, dan tanggal diambil.
- Isi tampil sebagai tabel dan grafik ringkas buatan situs. Unduhan ulang berkas mentah baru disediakan bila penyedia mengizinkan.

## Keputusan yang menunggu pemilik

1. ~~Penyebutan penyedia.~~ Diputuskan pemilik 9 Nov 2026: pilihan (a), menu Dataset jadi pengecualian dan penyedia disebut sebagai teks tanpa tautan.
2. **Izin pakai ulang.** Belum ada lisensi. Permintaan tertulis bisa dikirim ke Satu Data Batam, Satu Data Kepri, BP Batam (`maildata@bpbatam.go.id`), dan Disperkimtan. Pengiriman email adalah keputusan dan tindakan pemilik.
3. **Temuan privasi HANG JEBAT.** Data pribadi warga terbuka untuk publik. Memberi tahu Disperkimtan secara baik-baik adalah keputusan pemilik.
4. **Kunci WebAPI BPS.** Pendaftaran di webapi.bps.go.id dilakukan pemilik; kunci disimpan di variabel lingkungan, tidak di repo.
5. ~~Satu Data Batam.~~ Sudah diunduh 9 Nov 2026 setelah portal pulih (675 dataset). Mengambil ulang menaikkan penghitung unduhan di portal itu, jadi jangan sering.
