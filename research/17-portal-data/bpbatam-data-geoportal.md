# Riset dua portal BP Batam: Satu Data (data.bpbatam.go.id) dan Satu Peta (geoportal.bpbatam.go.id)

Diambil 8–9 November 2026 (WIB) untuk Batam City Hall. Semua angka di bawah berasal dari respons server yang benar-benar diterima pada tanggal itu. Kalau sesuatu belum diverifikasi, saya tulis begitu.

## 0. Ringkasan

- **data.bpbatam.go.id** berjalan di **CKAN 2.11** ("Portal Satu Data BP Batam", dikelola PDSI BP Batam). Isinya **118 dataset** dari **24 organisasi** (4 di antaranya kosong) dan **8 grup**. Format yang berlabel: **CSV (46 dataset)** dan **XLS (2)**. Sisanya, 70 dataset, punya resource tanpa label format, tetapi tetap tersimpan di DataStore dan bisa diunduh. Data terbaru yang terlihat bertanggal **April 2026** (penumpang feri, kunjungan kapal penumpang, kapasitas IPA). Metadata paling baru diperbarui **23 Juli 2026**. **Tidak ada satu dataset pun yang punya lisensi**: setiap halaman menulis "No License Provided", dan facet lisensi katalog kosong.
- Unduhan resmi lewat `https://data.bpbatam.go.id/datastore/dump/{resource_id}`. Jalur ini **di luar `/api/`**, jadi boleh menurut robots.txt. Parameter `format=json`, `limit`, dan `sort` sudah diuji dan berfungsi. Ini cara paling hemat untuk mengambil kolom dan baris terbaru.
- **geoportal.bpbatam.go.id** ("Satu Peta Batam") adalah aplikasi Next.js dengan peta **ArcGIS Maps SDK for JavaScript**. Daftar layernya diambil dari API JSON di origin yang sama (`/api/peta-interaktif`, `/api/metadata`, dan lainnya). Datanya dilayani **ArcGIS Server 10.51** di `https://web-gis.bpbatam.go.id/arcgis/rest/services`. Ada **21 layer berlabel "Data Terbuka"** di menu Peta Tematik. Semuanya MapServer dengan kapabilitas `Map,Query,Data`, mendukung `f=geojson`, `maxRecordCount` 1000–5000, dan CORS mengizinkan origin mana pun. Artinya semua layer ini bisa diekspor ke GeoJSON lalu dijadikan PMTiles. Katalog metadata juga mencatat **7 layer "Data Terbatas"** dan **5 layer "Data Tertutup"**. Yang ini tidak saya sentuh.
- Banyak layer fasilitas di geoportal **isinya sangat sedikit**: Arena Olahraga 2 fitur, Destinasi Pariwisata 5, Laboratorium 1, Kelola Limbah 2. Layer yang paling berguna untuk peta kota: Kawasan Industri (29 poligon), Sub-Wilayah Pengembangan (11), Wilayah Kerja BP Batam (18), Waduk (7), WTP (7), KEK (4), Menara Telepon (130), Kontur (6.532 garis), Pola Ruang Perpres 87/2011 (2.141 poligon), dan batas kecamatan (`PETA_ADMINISTRASI_BATAM`).
- **Lisensi:** tidak satu pun dari dua portal ini mencantumkan lisensi atau syarat penggunaan. Geoportal hanya menulis "Copyright BP Batam 2023. All Right Reserved" di footer. Sikap aman: tampilkan sebagai layer atau tautan terpisah dengan atribusi, jangan dicerminkan sebagai unduhan ulang sebelum ada izin tertulis, dan jangan diimpor ke OSM.
- **Koreksi atas `research/11-geoportal.md`:** (1) `robots.txt` di `web-gis.bpbatam.go.id`, baik `/robots.txt` maupun `/arcgis/robots.txt`, sekarang **404**. Jadi tidak benar bahwa servernya "menolak crawler". (2) Layanan `WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP` (layer kelurahan 27) **sudah tidak tersedia**: servernya membalas error 500 "Could not find a service". (3) `PROYGISPUSREN21_EKSTERNAL/PETA_ADMINISTRASI_BATAM` **masih hidup**.

## 1. Cara pengambilan dan etika

| Host | Permintaan | Catatan |
|---|---|---|
| data.bpbatam.go.id | 57 | Jeda ≥ 10,5 detik antarpermintaan (Crawl-Delay 10). **Tidak ada satu pun panggilan ke `/api/`**, `/dataset/rate/`, `/revision/`, atau `/dataset/*/history`. Dump DataStore selalu dengan `limit=3`. Satu HEAD ke berkas unggahan. |
| geoportal.bpbatam.go.id | 41 (+2 gagal TLS sebelum HTTP) | Tidak ada robots.txt (404). 22 di antaranya chunk JS untuk menemukan URL layanan. Jeda 10,5 detik. |
| web-gis.bpbatam.go.id (ArcGIS) | 61 | Tidak ada robots.txt (404). Hitungan fitur, satu baris contoh atribut tanpa geometri, GeoJSON maksimal 2 fitur, dan satu ekspor PNG 256×256. Jeda 10,5 detik. Folder `data_terbatas`, `data_tertutup`, dan `DATACAKRA` tidak saya buka. `POI` dan `Penduduk_Perkelurahan` membalas "Token Required", lalu saya berhenti di situ. |
| katalogspasial.bpbatam.go.id (CSW) | 4 | robots.txt 404. GetCapabilities dan GetRecordById timeout setelah 60 detik (2×). Root dialihkan ke `/sikambing/#/`. |
| tanahair.indonesia.go.id | 2 | robots.txt 404. `package_search` membalas 502. |

Selama riset tidak ada login, captcha, atau path tebakan. Semua folder ArcGIS yang saya buka tercantum di listing publik `rest/services?f=json` atau dirujuk oleh API geoportal. User-Agent yang dipakai adalah string Chrome umum. Berkas mentah tersimpan di folder `raw\` di sebelah laporan ini.

---

## 2. data.bpbatam.go.id (CKAN)

### 2.1 Platform

- CKAN **2.11**. Halaman katalog menautkan dokumentasi `docs.ckan.org/en/2.11/api/`. Ekstensi yang terlihat: DataStore (`/datastore/dump`), activity, dan htmx.
- Judul situs "Portal Satu Data BP Batam". Beranda bertuliskan "BP BATAM OPEN DATA". Footer: "Pusat Data dan Sistem Informasi BP Batam, 2025".
- Di depannya ada WAF F5 BIG-IP (cookie `TS0123d4c1`). Itu alasan tambahan untuk tetap pelan.
- Halaman Tentang (`/about`) hanya berisi tujuan portal (transparansi dan pemanfaatan data), alamat surel layanan data (`maildata@bpbatam.go.id`), dan rujukan ke layanan B-care. **Tidak ada syarat penggunaan.**

### 2.2 Angka katalog

- **118 dataset**, 20 per halaman, 6 halaman (`/dataset/?page=1..6`).
- **24 organisasi** (`/organization/`, 2 halaman):

| Organisasi (slug) | Dataset |
|---|---|
| Direktorat Pengelolaan Pertanahan (`direktorat-pengelolaan-pertanahan`) | 13 |
| Badan Usaha Fasilitas & Lingkungan (`bufl`) | 11 |
| Biro Humas, Promosi & Protokol (`biro-hubungan-masyarakat-promosi-dan-protokol`) | 11 |
| Pusat Harmonisasi Kebijakan & Manajemen Kinerja | 10 |
| Biro Umum | 9 |
| Badan Usaha Rumah Sakit | 8 |
| Direktorat Pengelolaan Kepelabuhanan (slug `badan-usaha-pelabuhan`) | 7 |
| Direktorat Pengamanan Aset | 7 |
| Pusat Data dan Sistem Informasi (`pdsi`) | 7 |
| Direktorat Pengembangan KPBPBB dan KEK (`pusat-pengembangan-kpbpbb-kek`) | 5 |
| Pusat Perencanaan Program Strategis | 5 |
| Biro SDM | 4 |
| Direktorat Peningkatan Kinerja & Manajemen Risiko | 4 |
| Badan Usaha Bandar Udara (`bubu`) | 3 |
| Badan Usaha Sistem Pengelolaan Air Minum | 3 |
| Direktorat Pelayanan Lalu Lintas Barang & Penanaman Modal | 3 |
| Direktorat PTSP | 3 |
| Kantor Perwakilan BP Batam | 3 |
| Biro Hukum, Biro Keuangan | 1 dan 1 |
| Dit. Evaluasi & Pengendalian, Dit. Infrastruktur Kawasan, Dit. Restrukturisasi, Satuan Pemeriksaan Intern | 0 |

- **8 grup**, jarang dipakai (hanya 31 keanggotaan): FASILITAS 13, TRANSPORTASI 5, PERIZINAN 4, KESEHATAN (`rsbp`) 3, EKONOMI 2, HUKUM 2, IT 1, SOSIAL 1.
- **Tag** juga jarang. Yang paling banyak "Data Prioritas Tahun 2025" (5 dataset), ditambah Batam, investasi, KEK, Nilai, dan Statistik (masing-masing 1).
- **Format** (facet): CSV 46, XLS 2. Ada **70 dataset yang resource-nya tanpa label format** (tampil sebagai "data"). Dump DataStore untuk 5 di antaranya sudah diuji dan berfungsi: `kapasitasair-dp`, `teknis-waduk`, `wilayahpengembangan-batam`, `kapal-penumpang`, dan `rute-penerbangan`. Satu lagi (`pemakaianair-dp`) juga punya tautan dump, tetapi belum diuji.
- **Kemutakhiran:** "Last Updated" tertinggi yang terlihat adalah 23 Juli 2026 (`kapal-penumpang`), 22 Juli 2026 (`daftar-tower`), dan 15 Juli 2026 (`rute-penerbangan`). Baris data terbaru: April 2026 (`penupang-kapal`, `kapal-penumpang`, `kapasitasair-dp`), Maret 2026 (`kunjungan-kapal`), Januari 2026 (`arus-lalu-lintas-udara…`, `wisata-galang`). Catatan: "Last Updated" di portal ini tampaknya diisi manual sesuai periode data. Contohnya `daftar-kawasan-industri` tertulis "31 Desember 2017" padahal dibuat 2022. Jadi jangan menganggapnya tanggal sistem.
- **Metadata tambahan** (extras) di banyak dataset: "Frekuensi Penerbitan", "Kode Referensi SDSN/SDS", "ID DPP", "Penyajian: PDSI BP Batam", "Sumber: <unit>", dan untuk sebagian "Data Prioritas berdasarkan Keputusan … (RPJMN 2025-2029)". Kolom maintainer/author tidak saya salin.

### 2.3 Endpoint yang terbukti bekerja

```text
# Katalog (HTML, boleh): 20 dataset per halaman
GET https://data.bpbatam.go.id/dataset/?page=1          → 200, "118 dataset found"
GET https://data.bpbatam.go.id/organization/?q=&sort=&page=2
GET https://data.bpbatam.go.id/group/
GET https://data.bpbatam.go.id/dataset/{slug}           → judul, deskripsi, lisensi, resource, extras

# Unduhan resource (tautan "Unduh" resmi di halaman dataset)
GET https://data.bpbatam.go.id/datastore/dump/{resource_id}
#   tanpa parameter = CSV (perilaku standar CKAN; dalam riset ini tidak diunduh penuh)
#   diuji: ?format=json&limit=3&sort=_id%20desc  → 200, application/octet-stream,
#          Content-Disposition attachment; berisi "fields" (nama dan tipe kolom) dan "records"
curl -A "Mozilla/5.0 ..." \
  "https://data.bpbatam.go.id/datastore/dump/c52db990-baa3-44d6-a6c2-0dd460ec0c7d?format=json&limit=3&sort=_id%20desc"

# Berkas unggahan non-DataStore (contoh: "Metadata Statistik" di bm-barang)
HEAD https://data.bpbatam.go.id/dataset/f72cd060-eff1-452e-9708-6f8049ee80a5/resource/73398070-868d-4a49-b6df-f2a481b2e2f8/download/ms_86267
#   → 200, application/octet-stream, 1.652.984 byte, Last-Modified 23 Apr 2026
```

Yang **tidak boleh**: semua path di bawah `/api/` (termasuk `/api/3/action/*` yang ditautkan dari halaman katalog), `/dataset/rate/`, `/revision/`, dan `/dataset/*/history`.

### 2.4 Dataset unggulan untuk situs kota

"Tahun" berarti periode baris terbaru yang terlihat di sampel `sort=_id desc`, atau "Last Updated" kalau dump tidak saya sampel. Lisensi semua dataset: **No License Provided**.

| Judul | Topik | Format | Tahun | Halaman | Unduhan | Catatan |
|---|---|---|---|---|---|---|
| Rekapitulasi Kunjungan Penumpang Kapal | Feri/pelabuhan | CSV | s.d. Apr 2026, bulanan | https://data.bpbatam.go.id/dataset/penupang-kapal | https://data.bpbatam.go.id/datastore/dump/c52db990-baa3-44d6-a6c2-0dd460ec0c7d | Kolom: TERMINAL, JENISPENUMPANG, TGLAWAL, TGLAKHIR, PENUMPANG. Per terminal feri (Sekupang, Batam Centre, …), dipisah domestik/internasional. Kode SDSN SD00756. **Prioritas 1** untuk fitur feri. |
| Rekapitulasi Kunjungan Kapal Penumpang | Feri | tak berlabel (DataStore) | s.d. Apr 2026 | https://data.bpbatam.go.id/dataset/kapal-penumpang | https://data.bpbatam.go.id/datastore/dump/963ce2cb-e122-4317-a460-85b00d4c5ad8 | Kolom: TERMINAL, TANGGAL, JENIS_BENDERA, CALL, GT. Termasuk Harbour Bay dan Gold Coast Bengkong. ⚠️ Di sampel, nilai GT selalu sama dengan CALL. Kolom GT kemungkinan salah isi, perlu dicek. |
| Rekapitulasi Kunjungan Kapal | Pelabuhan | CSV | s.d. Mar 2026 | https://data.bpbatam.go.id/dataset/kunjungan-kapal | https://data.bpbatam.go.id/datastore/dump/7fd15b34-1782-4779-8ab2-5ab442e505f7 | Kolom: PELABUHAN, TGLAWAL, TGLAKHIR, CALLKAPAL, GTKAPAL. |
| Operasional Bongkar Muat Barang | Pelabuhan | CSV + berkas metadata | LU Apr 2026 | https://data.bpbatam.go.id/dataset/bm-barang | https://data.bpbatam.go.id/datastore/dump/db3c3876-fb2d-404f-8b34-cfa9cb97cb63 | Data prioritas 2023/2024. Isinya belum saya sampel. |
| Data Profil Dermaga | Pelabuhan | CSV | LU Okt 2023 | https://data.bpbatam.go.id/dataset/data-profil-dermaga | https://data.bpbatam.go.id/datastore/dump/c9fecb24-2adb-41cc-9bf6-5d63fea00e00 | Koordinat dalam teks DMS (LETAKLINTANGUTARA, LETAKBUJURTIMUR), ditambah kedalaman mLWS, panjang, lebar, luas, dan peruntukan. ⚠️ Format DMS tidak seragam. Satu baris (Terminal Umum Batu Ampar) bernilai 104°59′56″ BT, padahal extent layanan ArcGIS BP Batam sendiri ada di kisaran 103,9–104,2 BT. Jangan diplot tanpa verifikasi. |
| Arus Lalu Lintas Udara Bandara Hang Nadim | Bandara | XLS (DataStore) | s.d. Jan 2026, sejak 2017 | https://data.bpbatam.go.id/dataset/arus-lalu-lintas-udara-bandara-hang-nadim | https://data.bpbatam.go.id/datastore/dump/151a4fe9-0602-4642-9aec-f60c5e432d13 | Kolom: KATEGORI (Pesawat/…), SUBJENISPENERBANGAN (Domestik/Internasional), ARRIVALDEPARTURE, JUMLAH, per bulan. |
| Data Rute Penerbangan Langsung dari Batam | Bandara | tak berlabel | baris 2025 | https://data.bpbatam.go.id/dataset/rute-penerbangan | https://data.bpbatam.go.id/datastore/dump/4e5d2960-b412-4df7-b2ac-d0fec1c733e9 | Satu baris per penerbangan (≈15 ribu, `_id` tertinggi 15198): tanggal, jam, ASAL, TUJUAN (kode IATA), OPERATOR, ICAO, nomor penerbangan, tipe pesawat, kursi. Resource-nya salah nama ("Data Daftar Operator Penerbangan"). Bisa dipakai untuk daftar "terbang langsung ke mana". |
| Rekap Rencana Induk Bandara | Bandara | CSV | LU Des 2022 | https://data.bpbatam.go.id/dataset/rib | https://data.bpbatam.go.id/datastore/dump/68a715df-d7ff-49eb-bf23-c71015420f00 | Belum disampel. |
| Data Profil Kawasan Ekonomi Khusus | KEK | CSV | LU Okt 2025 | https://data.bpbatam.go.id/dataset/profil-kek | https://data.bpbatam.go.id/datastore/dump/f93e4d66-af6c-4d8e-8632-7331e0759f3d | Kolom: KAWASAN, LOKASI, LUASAREA, KEGIATAN, STATUSOPERASIONAL. Satuan luas tidak disebut. ±16 baris. |
| Data Daftar Kawasan Industri | Kawasan industri | CSV | LU "Des 2017" | https://data.bpbatam.go.id/dataset/daftar-kawasan-industri | https://data.bpbatam.go.id/datastore/dump/c720b1c3-ebbf-4059-b535-936a47d1ff29 | ±63 kawasan dengan LATTITUDE dan LONGITUDE (teks DMS), luas, infrastruktur, fasilitas, tahun beroperasi. Ini **koordinat resmi**, tetapi perlu diparse dan dicek. Bandingkan dengan layer ArcGIS `INDUSTRI_AR_50K` (29 poligon). |
| Data Buku Batam Industrial Estate | Kawasan industri | CSV | baris 2024 | https://data.bpbatam.go.id/dataset/db-batam-industrial | https://data.bpbatam.go.id/datastore/dump/aaf5246e-d634-464c-a1dd-08c02e45cd40 | Kolom: TAHUN, NAMAKAWASAN, ALAMAT, fasilitas. Tanpa koordinat. |
| Realisasi Investasi Kota Batam Berdasarkan Negara | Investasi | XLS (DataStore) | baris terakhir 2019 T4; LU Mar 2025 | https://data.bpbatam.go.id/dataset/realisasi-batam-negara | https://data.bpbatam.go.id/datastore/dump/3513c7f4-a520-4d8c-8a9d-422f1bd36e87 | Kolom: NEGARA, TRIWULAN, TAHUN, JUMLAHPROYEK, NILAIINVESTASI (satuan tidak disebut), POLYGON (kosong). Cek sebaran tahun sebelum dipakai. |
| Data Laporan Perkembangan Indikator Ekonomi Makro | Ekonomi | CSV | LU Des 2025 | https://data.bpbatam.go.id/dataset/data-indikator-ekonomi | https://data.bpbatam.go.id/datastore/dump/b8799ea8-bd83-457b-b7b1-5e6a8e1084b0 | Kolom: PERIODE, TAHUN, INDIKATOR, PERKEMBANGAN. Nilainya **teks bebas** (misal "-2,55%", "Surplus 971,75 Juta USD"), jadi perlu diparse manual. |
| Jumlah Kapasitas Produksi Instalasi Pengolahan Air Bersih | Air bersih | tak berlabel | s.d. Apr 2026, bulanan | https://data.bpbatam.go.id/dataset/kapasitasair-dp | https://data.bpbatam.go.id/datastore/dump/bb7ad395-5332-486b-97ea-bf9172d29873 | Kolom: PERIODE, NAMA_IPA (Tembesi, Piayu, Nongsa, …), RATA2_KAPASITAS_LPS. Data Prioritas RPJMN 2025–2029. Cocok dipasangkan dengan layer WTP (7 titik). |
| Jumlah Pemakaian Air Baku di Batam | Air baku | tak berlabel | LU Mei 2026, per semester | https://data.bpbatam.go.id/dataset/pemakaianair-dp | https://data.bpbatam.go.id/datastore/dump/da68a120-6055-442c-9841-1275ac5babc9 | Belum disampel. |
| Data Teknis Waduk | Air | tak berlabel | 2024 | https://data.bpbatam.go.id/dataset/teknis-waduk | https://data.bpbatam.go.id/datastore/dump/dbf9860f-c88f-4d2e-8313-44677b14929a | Kolom: NAMAWADUK, TAHUNPEMBUATAN, TAHUNOPERASI, JENISBANGUNAN, LUASPERMUKAAN. ±14 waduk. Dipasangkan dengan layer `WADUK_AR_50K`. |
| Rekap Wilayah Pengembangan Pulau Batam | Tata ruang | tak berlabel | data Mei 2022 | https://data.bpbatam.go.id/dataset/wilayahpengembangan-batam | https://data.bpbatam.go.id/datastore/dump/1bb4dd53-f554-4f07-8249-7576b0af7ee5 | Kolom: WILAYAH, LUAS (satuan tidak disebut), TANGGALPEMBAHARUANDATA. 11 baris, sesuai layer `SUBWILAYAHPENGEMBANGAN_AR_50K` (11 poligon). |
| Rekapitulasi Hunian Rusun (+ Koordinat Rusun BP Batam) | Perumahan | CSV ×2 | LU Agu 2025 | https://data.bpbatam.go.id/dataset/rusun | hunian: https://data.bpbatam.go.id/datastore/dump/30816e0f-002e-43c7-8635-881740bdb0fc · koordinat: https://data.bpbatam.go.id/datastore/dump/68dbeaa9-81f2-4cf9-9a29-792ac276e086 | Resource koordinat berisi NAMA_RUSUN, LAT, dan LONGI dalam desimal (±4 rusun). Koordinat resmi, bisa langsung jadi titik. |
| Rekapitulasi Kunjungan Wisata Galang | Pariwisata | CSV | s.d. Jan 2026 | https://data.bpbatam.go.id/dataset/wisata-galang | https://data.bpbatam.go.id/datastore/dump/5881d65d-a0e9-4bda-82e6-24fa4e0c599e | Kolom: NAMAUNIT (tiket, mobil, motor), JUMLAHLAYANAN, bulanan. |
| Kunjungan Taman Rusa | Pariwisata | CSV | LU Sep 2025 | https://data.bpbatam.go.id/dataset/taman-rusa | https://data.bpbatam.go.id/datastore/dump/acfbf212-cfc9-4f1c-879d-60a2ebecd225 | Dihitung per kendaraan masuk. Belum disampel. |
| Rekap Kejadian Bencana Alam | Kebencanaan | CSV | LU Des 2025 | https://data.bpbatam.go.id/dataset/kejadian | https://data.bpbatam.go.id/datastore/dump/02822319-a325-463b-a0a7-1fd776888115 | Hanya kejadian yang ditangani Dit. Pengamanan Aset. Belum disampel. |
| Data Daftar Tower | Telekomunikasi | CSV | LU Jul 2026 | https://data.bpbatam.go.id/dataset/daftar-tower | https://data.bpbatam.go.id/datastore/dump/08542b7e-c071-4968-a3a1-b2f0ce25e49d | Kolom: NAMAPROVIDER, LOKASI (teks), TGLMULAI, TGLAKHIR. **Tanpa koordinat.** Ada baris dengan TGLAKHIR lebih awal dari TGLMULAI. Titiknya ada di layer ArcGIS `MENARATELEPON_PT_50K` (130). |
| Data Buku Batam Report / Cost of Doing Business / Marine & Shipyard / Forthcoming Project | Investasi/promosi | CSV | 2021–2023 | `/dataset/databuku-batam-report`, `/dataset/db-costofdoing-business`, `/dataset/db-marineshipyard`, `/dataset/db-forthcomingproject` | dump `526a6983-…`, `13005007-…`, `f48d513f-…`, `0bc307f1-…` | Belum disampel. Isinya data dari buku promosi BP Batam. |
| Fasilitas Medis di RS BP Batam | Kesehatan | CSV | LU Okt 2023 | https://data.bpbatam.go.id/dataset/layanan-medisrsbp | https://data.bpbatam.go.id/datastore/dump/60257a9e-3045-49c7-b09c-1b392f31d75d | Hanya untuk satu RS. |

Dataset lain yang mungkin relevan tetapi belum dibuka halamannya: `bongkarmuatpetikemas-dp` (peti kemas), `nilairealisasiinvestasi-kek-dp`, `investasipma`, `pma-pmdn`, `rip-bp` (Rencana Induk Pelabuhan), `data-tarif-layanan-new` (tarif layanan BP Batam), `taj` (Stadion Tumenggung Abdul Jamal), `limbah`, `kpli-b3`, `kunjungan-rsbp`, dan `penyakit-terbanyak`. Daftar lengkap 118 dataset ada di Lampiran A.

**Celah yang tidak ada di portal ini:** statistik kependudukan wilayah, batas administrasi, jaringan jalan, listrik (PLN Batam), dan pariwisata kota secara umum. Untuk topik-topik ini, sumbernya BPS, Pemko (Satu Data Batam), atau geoportal.

---

## 3. geoportal.bpbatam.go.id ("Satu Peta Batam")

### 3.1 Arsitektur yang ditemukan

- **Front-end:** Next.js App Router (build Turbopack), Redux Toolkit Query, UI NextUI. Peta dibangun dengan **ArcGIS Maps SDK for JavaScript**: ada widget LayerList, alat ukur, dan basemap Esri. Komponen peta dimuat dinamis (`ssr:false`), jadi HTML-nya kosong data. Angka di beranda ("Total Dataset Geospasial" dan lainnya) tampil 0 di HTML dan baru diisi di sisi klien.
- **API origin yang sama.** `NEXT_PUBLIC_API_URL` kosong saat build, sehingga `Used_API = "/api"`. Daftar slice RTK yang terbaca dari chunk JS:
  - `/api/peta-interaktif?pathname=/map/interaktif&category=<KATEGORI>` dan `/api/peta-interaktif/lov/category`. Header `Authorization: Bearer <token>` hanya dikirim kalau ada cookie login (dashboard). Publik tanpa token.
  - `/api/metadata` (33 entri), `/api/basisdata` (20 entri), `/api/basisdata/lov/category`, `/api/basisdata/lov/unit`, dan `/api/basisdata/{id}/table/…`. Yang terakhir membalas 500 "column "undefined" does not exist" kalau parameternya tidak lengkap. Tidak saya tebak lebih jauh.
  - `/api/kamusdata`, `/api/publication?category=Regulasi|Peta Cetak|…`, dan `/api/file/<nama>.pdf`.
  - Semua membalas `Access-Control-Allow-Origin: *`.
- **Data peta:** ArcGIS Server **10.51** (Tomcat 8.5.6) di `https://web-gis.bpbatam.go.id/arcgis/rest/services`. Root-nya punya 34 folder dan 3 layanan (`PETA_POLA_RUANG_PERPRES_87_TAHUN_2011`, `PETA_TUTUPAN_LAHAN`, `PETA_WILAYAH_KERJA_BP_BATAM`).
- **Metadata ISO 19115:** tiap layer punya `xml_url` ke CSW `https://katalogspasial.bpbatam.go.id/csw/?request=GetRecordById&…&id=<IDENTIFIER>`. CSW ini **timeout** (2 kali percobaan, 60 detik). Root katalog dialihkan ke `/sikambing/#/`.
- **"Kategori Simpul"** mengambil layer dari Ina-Geoportal BIG (`https://tanahair.indonesia.go.id/sdi/api/3/action/organization_list…` dan `package_search?fq=organization:…`). Saat diuji membalas **502**.
- Ada fitur **"Tambah Layer dari URL"**: pengguna bisa memasukkan URL layanan sendiri.
- Thumbnail tiap layer: `…/MapServer/info/thumbnail`. Banyak atribut `gambar`/`FOTO` berisi tag `<img>` yang menunjuk ke `cloudbox.bpbatam.go.id` (tautan berbagi Nextcloud). Hak cipta fotonya tidak jelas, jadi jangan di-hotlink.

### 3.2 Endpoint yang terbukti bekerja

```text
# Daftar kategori dan layer per kategori (JSON array)
GET https://geoportal.bpbatam.go.id/api/peta-interaktif/lov/category
GET https://geoportal.bpbatam.go.id/api/peta-interaktif?pathname=%2Fmap%2Finteraktif&category=UTILITAS
#   kategori: UTILITAS, FASILITAS, KAWASAN%20EKONOMI%20KHUSUS, PEMBANGUNAN, PERENCANAAN, PERTANAHAN
#   tiap item: id, title, indentifier (sic), abstract (memuat label "Data Terbuka/Terbatas/Tertutup"),
#   publication_date, distributions[{protocol:"ESRI:ArcGIS:MapServer", url}], xml_url, thumbnail_img_url
GET https://geoportal.bpbatam.go.id/api/metadata          → 33 entri (21 Terbuka, 7 Terbatas, 5 Tertutup)

# ArcGIS REST
GET https://web-gis.bpbatam.go.id/arcgis/rest/services?f=json
GET https://web-gis.bpbatam.go.id/arcgis/rest/services/Fasilitas?f=json
GET https://web-gis.bpbatam.go.id/arcgis/rest/services/Utilitas/JALAN_LN_50K/MapServer?f=json
GET …/MapServer/0/query?where=1%3D1&returnCountOnly=true&f=json                → {"count":61}
GET …/MapServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&resultRecordCount=1&f=json
GET https://web-gis.bpbatam.go.id/arcgis/rest/services/Fasilitas/DESTINASIPARIWISATA_PT_50K/MapServer/0/query?where=1%3D1&outFields=*&resultRecordCount=2&outSR=4326&f=geojson
#   → FeatureCollection, Point, EPSG:4326 (dengan "exceededTransferLimit":true karena dibatasi 2)
GET https://web-gis.bpbatam.go.id/arcgis/rest/services/Kawasan_Ekonomi_Khusus/KEK_AR_50K/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&geometryPrecision=5&maxAllowableOffset=0.00005&f=geojson
#   → Polygon; layer ini TIDAK mendukung resultRecordCount ("Pagination is not supported")
GET https://web-gis.bpbatam.go.id/arcgis/rest/services/Utilitas/JALAN_LN_50K/MapServer/export?bbox=11560000,110000,11600000,140000&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image
#   → 200 image/png (bisa dijadikan sumber raster MapLibre)
# CORS: dengan header Origin, ArcGIS membalas Access-Control-Allow-Origin: <origin> + Allow-Credentials: true
```

### 3.3 Layer peta tematik ("Data Terbuka", 21 layer dari API geoportal)

Basis URL: `https://web-gis.bpbatam.go.id/arcgis/rest/services/`. Semua layanan: `capabilities: Map,Query,Data`, `supportedQueryFormats: JSON, AMF, geoJSON`, `exportTilesAllowed: false`, ekstensi KmlServer aktif di sebagian besar. Semua layer adalah layer 0.

Geometri ditentukan dari sufiks nama (_PT titik, _LN garis, _AR area) dan dari abstrak. Yang dicek langsung: Destinasi Pariwisata (Point), Jalan 1:50K (MultiLineString), KEK (Polygon), dan Kepemilikan Tanah (esriGeometryPolygon). CRS EPSG:32648 (UTM 48N) diverifikasi pada Jalan, Destinasi Pariwisata, KEK, dan Sub-Wilayah. Layanan lain belum dicek, tetapi bisa di-reproject dengan `outSR=4326`.

"Bisa diunduh" artinya bisa diekspor lewat `query … f=geojson`. Tidak ada tombol unduh berkas (SHP/GeoJSON) di geoportal.

| # | Nama (judul di geoportal) | Kategori | Geometri | Fitur | Layanan (path) | Bisa diunduh? | Penilaian untuk situs |
|---|---|---|---|---|---|---|---|
| 1 | Peta Utilitas Jalan 1:50.000 | Utilitas | Garis | 61 | `Utilitas/JALAN_LN_50K` (EPSG:32648, max 1000) | Ya (paging) | Rendah. OSM jauh lebih detail. Atribut kelas jalan (`utkrjl`, misal "Jalan Provinsi") bisa dipakai sebagai pembanding. |
| 2 | Jaringan Air Limbah 1:50.000 | Utilitas | Garis | 1.935 | `Utilitas/AIRLIMBAH_LN_50K` | Ya | Rendah–sedang. Layer infrastruktur, PMTiles. |
| 3 | Jaringan Kabel Listrik 1:50.000 | Utilitas | Garis | 195 | `Utilitas/KABELLISTRIK_LN_50K` | Ya | Sedang, untuk konteks listrik. Tidak ada data PLN di portal data. |
| 4 | Sebaran Agribisnis/Pemanfaatan Lahan | Fasilitas | Area | 4 | `Fasilitas/PEMANFAATAN_AR_50K` | Ya | Rendah. |
| 5 | Sebaran Arena Olahraga | Fasilitas | Titik | **2** | `Fasilitas/ARENAOLAHRAGA_PT_50K` | Ya | Rendah. Hanya 2 titik (salah satunya Stadion Temenggung Abdul Jamal). |
| 6 | Sebaran Bangunan/Niaga | Fasilitas | Titik | 14 | `Fasilitas/NIAGA_PT_50K` | Ya | Rendah–sedang (aset BP Batam). |
| 7 | Sebaran Destinasi Pariwisata | Fasilitas | Titik | **5** | `Fasilitas/DESTINASIPARIWISATA_PT_50K` | Ya (resultRecordCount didukung) | Sedang. Titik resmi untuk Taman Rusa, Camp Vietnam, dan lainnya. Atribut: namobj, alamat, fasilitas, luas_lahan. |
| 8 | Sebaran Laboratorium Uji Limbah | Fasilitas | Titik | 1 | `Fasilitas/LABORATORIUMKESEHATAN_PT_50K` | Ya | Rendah. |
| 9 | Sebaran WTP/Olah Air Minum | Fasilitas | Titik | 7 | `Fasilitas/OLAHAIRMINUM_PT_50K` | Ya | **Tinggi** dipasangkan dengan kapasitas IPA (data portal). Atribut: namobj, kategori, kapasitas, elevasi. |
| 10 | Sebaran Pengelolaan Limbah | Fasilitas | Titik | 2 | `Fasilitas/KELOLALIMBAH_PT_50K` | Ya | Rendah. |
| 11 | Sebaran Reklame | Fasilitas | Titik | 155 | `Fasilitas/REKLAME_PT_50K` | Ya | Rendah. |
| 12 | Sebaran Rusun/Perumahan | Fasilitas | Titik | 5 | `Fasilitas/PERUMAHAN_PT_50K` | Ya | Sedang. Cocokkan dengan "Koordinat Rusun" di data portal. |
| 13 | Sebaran Tower/Menara Telepon | Fasilitas | Titik | 130 | `Fasilitas/MENARATELEPON_PT_50K` | Ya | Sedang. Melengkapi dataset tower tanpa koordinat. |
| 14 | Sebaran Waduk | Fasilitas | Area | 7 | `Fasilitas/WADUK_AR_50K` | Ya | **Tinggi** untuk layer air/hujan. Atribut: volume, luas permukaan dan genangan, `damid`. |
| 15 | KEK berupa Kawasan Industri | KEK | Area | 29 | `Kawasan_Ekonomi_Khusus/INDUSTRI_AR_50K` | Ya | **Tinggi.** Atribut: namobj, alamat, pengelola (badan usaha), luas, jumlah tenant. Layanan kembar: `Geoportal/SebaranKawasanIndustri` (29). |
| 16 | Sebaran Kawasan Ekonomi Khusus | KEK | Area | 4 | `Kawasan_Ekonomi_Khusus/KEK_AR_50K` | Ya (**tanpa paging**) | Sedang. Dua fitur yang saya sampel sama-sama "KEK BAT" (persil dengan kolom PEMILIK = nama badan usaha). Perlu dicek apakah KEK lain ikut tercakup. |
| 17 | Sebaran Aset BMN berupa Jalan | Pembangunan | Area | 62 | `Pembangunan/JALAN_AR_50K` | Ya | Rendah. |
| 18 | Kontur 1:50.000 | Perencanaan | Garis | 6.532 | `Perencanaan/KONTUR_LN_50K` | Ya (paging, ~7 halaman) | Sedang. Bisa untuk relief, tetapi DEMNAS/hillshade biasanya lebih bagus. PMTiles. |
| 19 | Rencana Jalan 1:50.000 | Perencanaan | Garis | **50.731** | `Perencanaan/RENCANAJALAN_LN_50K` | Ya (≥51 halaman ×1000) | Rendah–sedang. Jumlah fitur besar sekali untuk "rencana", isinya perlu ditelaah dulu. PMTiles. |
| 20 | Kepemilikan Tanah 1:5.000 ("Sebaran Habis dan Jatuh Tempo UWT") | Pertanahan | Area | 236 | `Pertanahan/KEPEMILIKANTANAH_AR_5K` | Secara teknis ya | **Jangan dipublikasikan.** Data hak dan status lahan per persil (field `tiphak`, `ststnh`, `nomor`, `namobj`). Atributnya sengaja tidak saya baca. |
| 21 | Sub Wilayah Pengembangan 1:50.000 | Pertanahan | Area | 11 | `Pertanahan/SUBWILAYAHPENGEMBANGAN_AR_50K` | Ya | **Tinggi.** Batas wilayah pengembangan BP Batam (misal "BATU AMPAR / SEI PANAS"), dengan luas. |

**Layanan publik lain di root ArcGIS** (tidak muncul di menu Peta Tematik):

| Layanan | Geometri | Fitur | CRS | Isi | Penilaian |
|---|---|---|---|---|---|
| `PETA_WILAYAH_KERJA_BP_BATAM/MapServer/0` (SUB_WILAYAH_PENGEMBANGAN_UTM) | Area | 18 | 4326, max 2000, tanpa paging | KETERANGAN: B. Ampar/Sei Panas, Batu Ampar/Muka Kuning, P. Timur/Kabil, P. Timur/Nongsa, P. Timur/T. Piayu, Sekupang/…, B. Centre/Core, B. Centre/Kelurahan, B. Ampar/Nagoya, dan 8× "Pulau lain sekitar Batam" | **Tinggi.** Outline wilayah kerja BP Batam. maxScale 1:24.000. |
| `PETA_POLA_RUANG_PERPRES_87_TAHUN_2011/MapServer/0` | Area | 2.141 | 4326, max 5000, tanpa paging | Field: Keterangan, WILADM, FTZ, PL_PRPS, SKT, TGHK_, Ls_Ha, Perpes_87. Renderer per kode zona (L1–L6, B1–B6.5, HL/…, HP/…, Jalan, Danau, Sungai) | **Tinggi** untuk tata ruang. Ingat ini RTR Perpres 87/2011, jadi beri label tahun dengan jelas. PMTiles. |
| `PETA_TUTUPAN_LAHAN/MapServer/0` | ? | — | — | Query hitung → 400 "Unable to complete operation" | Belum bisa dinilai. Kemungkinan layer 0 bukan layer fitur. Tidak saya coba lebih jauh. |
| `PROYGISPUSREN21_EKSTERNAL/PETA_ADMINISTRASI_BATAM/MapServer` (layer 0 Toponim Ibukota, 1 Adm. Kota Batam, 2 Adm. Kecamatan, 3 Adm. Kab/Kota) | Area | layer 2: 942 bagian | 4326, max 2000 | Layer 2 mencakup **juga** Bintan, Karimun, Lingga, dan Tanjungpinang. Bagian Kota Batam memuat 12 kecamatan (Batam Kota, Batu Aji, Batu Ampar, Belakang Padang, Bengkong, Bulang, Galang, Lubuk Baja, Nongsa, Sagulung, Sekupang, Sungai Beduk) ditambah 1 entri anomali "KUALAKAMPAR" berlabel KOTA BATAM. Tiap pulau jadi fitur terpisah, sehingga perlu dissolve per `namobj`. Banyak kolom kode (kdcbps, kdcpum, …) kosong. | Sedang. Bisa jadi pembanding untuk batas kecamatan BIG/BPS (lihat `research/11-geoportal.md`). Filter `wadmkk='KOTA BATAM'` lalu QA. |
| `WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/27` (kelurahan, dirujuk di research/11) | — | — | — | **Error 500: layanan tidak ditemukan** | Tidak tersedia lagi. Batas kelurahan harus diambil dari BIG/BPS/COD-AB. |
| Folder `POI`, `Penduduk_Perkelurahan` | — | — | — | **499 Token Required** | Tertutup untuk publik. Jangan dicoba. |

**Layer non-publik di katalog metadata, jangan disentuh:**

- Terbatas: Stress Area, Wilayah DMZ, Pematangan Tanah, Konstruksi/Sosial, Pipa Air SPAM, Fiber Optic/Telkom, Sarana Telkom. Semuanya di folder `data_terbatas/…`.
- Tertutup: Booster Pump, Meter Logger, Pelanggan/Hidran Umum, Tanki/Menara Air Minum, Izin Lokasi. Semuanya di folder `data_tertutup/…`.

### 3.4 Penilaian pemakaian di MapLibre

1. **Langsung dari server BP Batam saat runtime (tidak disarankan sebagai jalur utama).**
   - *Raster:* MapLibre bisa memakai `…/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image` sebagai sumber raster. Endpoint ini terbukti membalas PNG dan CORS-nya mengizinkan.
   - *Vektor:* `query … f=geojson&outSR=4326` bisa di-fetch langsung untuk layer kecil (di bawah 1000 fitur).
   - Risikonya: server lambat dan bisa berubah (contohnya layanan kelurahan yang sudah hilang), rantai sertifikat TLS tidak lengkap (lihat bagian 4), ada WAF, dan setiap pengunjung situs jadi membebani server BP Batam.
2. **Disarankan: snapshot → GeoJSON/PMTiles.**
   - Tarik sekali per bulan atau per kuartal lewat `query f=geojson outSR=4326`.
   - Layer yang mendukung paging: `resultOffset` + `resultRecordCount=1000`.
   - Layer tanpa paging (KEK, Pola Ruang, Wilayah Kerja, dan yang lain yang membalas "Pagination is not supported"): `returnIdsOnly=true`, lalu `objectIds=` per batch ≤ maxRecordCount.
   - Alternatif yang mengurus paging otomatis: `esri2geojson` (pyesridump).
   - Setelah itu `tippecanoe` → PMTiles untuk layer besar (Rencana Jalan 50.731, Kontur 6.532, Pola Ruang 2.141, Air Limbah 1.935). Layer kecil (Waduk, WTP, KEK, Kawasan Industri, Sub-Wilayah, Wilayah Kerja, Destinasi) cukup jadi GeoJSON statis.
   - Simpan per sumber dengan `sumber`, `url_layanan`, `diakses`, dan `atribusi`. Jangan digabung ke data turunan OSM.
3. **Hanya ditampilkan atau tidak dipakai:** Kepemilikan Tanah (persil hak lahan), semua layer Terbatas/Tertutup, POI dan Penduduk_Perkelurahan (butuh token), dan foto `cloudbox` (hak cipta tidak jelas).

### 3.5 Lisensi dan syarat penggunaan

- **data.bpbatam.go.id:** setiap halaman dataset yang saya buka (27) menulis "Lisensi: No License Provided". Facet lisensi di katalog berbunyi "There are no Licenses that match this search", artinya tidak ada dataset berlisensi. Halaman Tentang tidak memuat syarat penggunaan. Kontak permohonan: `maildata@bpbatam.go.id` atau layanan B-care.
- **geoportal.bpbatam.go.id:** tidak ada halaman lisensi atau syarat. Footer: "Copyright BP Batam 2023. All Right Reserved". Abstrak tiap layer memberi **klasifikasi akses** ("Data Terbuka", "Data Terbatas", "Data Tertutup"), tetapi itu bukan lisensi. Menu Regulasi (`/api/publication?category=Regulasi`) memuat PDF UU 4/2011 tentang Informasi Geospasial, PP 45/2021, Perpres 27/2014 (JIGN), dan Perpres 39/2019 (Satu Data Indonesia). Isinya **tidak saya baca**, jadi tidak saya tafsirkan sebagai izin pakai ulang.
- **ArcGIS:** `copyrightText` kosong di semua layanan yang dibuka.
- **Konsekuensi praktis:**
  - Atribusi wajib, misalnya "Sumber: BP Batam, data.bpbatam.go.id / geoportal.bpbatam.go.id, diakses <tanggal>".
  - Menu Dataset sebaiknya **menautkan** ke halaman dan unduhan resmi, ditambah ringkasan atau grafik buatan sendiri, dan tidak mencerminkan berkas mentah sampai ada izin tertulis.
  - Layer peta ditampilkan sebagai layer terpisah dengan atribusi.
  - Jangan impor ke OSM.
  - Kirim permohonan izin ke `maildata@bpbatam.go.id` dan PPID BP Batam, lalu simpan balasannya.

---

## 4. Batasan teknis yang ditemukan

- **TLS geoportal:** Python 3.13 (OpenSSL 3) menolak dengan `UNSAFE_LEGACY_RENEGOTIATION_DISABLED` dan baru berhasil setelah `OP_LEGACY_SERVER_CONNECT` diaktifkan. Skrip build Node (juga OpenSSL 3) kemungkinan besar butuh `secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT` atau memakai curl. Ini belum diuji di Node.
- **TLS web-gis:** rantai sertifikat tidak lengkap. Python gagal dengan `CERTIFICATE_VERIFY_FAILED: unable to get local issuer certificate`, sedangkan curl (Schannel Windows) berhasil. Untuk skrip Node, kemungkinan perlu menambahkan intermediate lewat `NODE_EXTRA_CA_CERTS`. Untuk pemakaian runtime di peramban, ada risiko gagal di peramban yang tidak mengambil intermediate otomatis. Ini belum diuji, dan menjadi alasan tambahan untuk memilih snapshot.
- **Paging ArcGIS:** sebagian layer membalas "Pagination is not supported" (KEK, Pola Ruang, Wilayah Kerja). Pakai `returnIdsOnly` + `objectIds`.
- **maxRecordCount:** 1000 (sebagian besar), 2000 (Wilayah Kerja, Administrasi), 5000 (Pola Ruang).
- **CSW katalogspasial** timeout, jadi metadata ISO tidak bisa diambil.
- **Ina-Geoportal** (Kategori Simpul) membalas 502.
- **Kualitas data portal:** koordinat DMS tidak seragam dan ada nilai bujur yang mencurigakan (Dermaga), GT = CALL (Kapal Penumpang), nilai ekonomi dalam teks bebas, satuan luas dan nilai investasi tidak disebut, nama resource keliru (rute penerbangan), dan tanggal mulai/akhir tower terbalik. Semua perlu QA sebelum ditampilkan, sesuai aturan proyek untuk tidak menebak data.

## 5. Rekomendasi: unduh, scrape, atau tidak boleh

| Sumber | Cara | Boleh? | Frekuensi dan catatan |
|---|---|---|---|
| Resource data.bpbatam.go.id | Unduh via `/datastore/dump/{id}` (CSV, atau `format=json`) | **Ya.** Ini tautan "Unduh" resmi, di luar `/api/`. | Bulanan (kebanyakan "Per Bulan"). Jeda ≥ 10 detik. 118 resource ≈ 20 menit. Simpan `diakses`. |
| Metadata katalog data.bpbatam.go.id | Scrape HTML `/dataset/?page=N` dan `/dataset/{slug}` | **Ya**, karena API dilarang robots.txt | 6 + 118 halaman × 10 detik ≈ 21 menit per sinkronisasi. Ambil judul, organisasi, extras (frekuensi, sumber, kode SDSN), dan ID resource. Jangan simpan kolom maintainer/author. |
| `/api/*` di data.bpbatam.go.id | — | **Tidak** | Dilarang robots.txt. |
| Daftar layer geoportal | `GET /api/peta-interaktif?...&category=…` (6 kategori) dan `/api/metadata` | Ya, dengan hemat | API publik tanpa token yang dipakai situs itu sendiri. Tidak ada robots.txt. Cukup 7 permintaan per sinkronisasi. |
| 21 layer "Data Terbuka" + Wilayah Kerja + Pola Ruang + Administrasi (kecamatan) | `query f=geojson outSR=4326` → GeoJSON/PMTiles | Secara teknis ya; lisensi tidak dinyatakan | Snapshot bulanan/kuartalan. Tampilkan sebagai layer terpisah dengan atribusi. Minta izin sebelum menyediakan berkas unduhan ulang. |
| Kepemilikan Tanah (`KEPEMILIKANTANAH_AR_5K`) | — | **Jangan dipublikasikan** | Data hak lahan per persil. Berisiko menyangkut kepentingan pribadi. |
| `data_terbatas`, `data_tertutup`, `DATACAKRA`, `POI`, `Penduduk_Perkelurahan`, `/dashboard` | — | **Tidak** | Terbatas, tertutup, atau butuh token/login. |
| Foto `cloudbox.bpbatam.go.id` di atribut layer | — | **Jangan di-hotlink** | Hak cipta tidak jelas. |
| CSW katalogspasial, Ina-Geoportal simpul | — | Belum bisa | Timeout / 502 saat diuji. |

**Urutan kerja yang disarankan untuk Batam City Hall:**

1. **Menu Dataset, tahap 1:** kartu tautan ke ±20 dataset unggulan di §2.4, dengan kategori Transportasi (feri, pelabuhan, bandara), Air, Kawasan Industri & KEK, Investasi & Ekonomi, Pariwisata, dan Tata Ruang. Setiap kartu memuat judul, organisasi, frekuensi, "data s.d.", tautan halaman, dan tautan unduh resmi. Grafik ringkas boleh dibuat dari dump (atribusi, tanpa mirror).
2. **Fitur peta:**
   - Snapshot Waduk, WTP, Kawasan Industri, KEK, Sub-Wilayah/Wilayah Kerja, dan Destinasi Pariwisata sebagai GeoJSON kecil.
   - Pola Ruang Perpres 87/2011 dan Kontur sebagai PMTiles.
   - Gabungkan secara tematik dengan data portal: kapasitas IPA ↔ titik WTP, teknis waduk ↔ poligon waduk, wilayah pengembangan ↔ poligon sub-WP, penumpang feri ↔ titik terminal yang sudah ada di `data/feri/terminal.json`.
3. **Koordinat dari data portal** (Kawasan Industri DMS, Dermaga DMS, Koordinat Rusun) hanya dipakai setelah diparse dan diverifikasi silang dengan layer ArcGIS/OSM. Jangan diisi tebakan.
4. Kirim permohonan izin pemakaian ulang ke BP Batam, lalu catat hasilnya di dokumen sumber data proyek.

---

## Lampiran A. Daftar lengkap 118 dataset data.bpbatam.go.id

Format = label di halaman katalog. "(tak berlabel)" bukan berarti tidak ada resource. Halaman: `https://data.bpbatam.go.id/dataset/<slug>`.

| No | Slug | Judul | Format |
|---|---|---|---|
| 1 | `daya-saing` | Perbandingan Daya Saing Pengembangan KPBPB dan KEK | (tak berlabel) |
| 2 | `utilitas` | Data Masterplan Utilitas Box | (tak berlabel) |
| 3 | `drainase` | Data Masterplan Drainase | (tak berlabel) |
| 4 | `pemantauan-evaluasi` | Data Pemantauan dan Evaluasi Kualitas Kebijakan BP Batam | (tak berlabel) |
| 5 | `kapal-penumpang` | Rekapitulasi Kunjungan Kapal Penumpang | (tak berlabel) |
| 6 | `permintaan` | Data Permintaan Layanan TI melalui Bcare | (tak berlabel) |
| 7 | `layanan` | Data Layanan TI pada Bcare | (tak berlabel) |
| 8 | `daftar-tower` | Data Daftar Tower | CSV |
| 9 | `rute-penerbangan` | Data Rute Penerbangan Langsung dari Batam | (tak berlabel) |
| 10 | `op-penerbangan` | Data Daftar Operator Penerbangan | (tak berlabel) |
| 11 | `pen-pen-ptsp` | Data Monitoring dan Evaluasi Pengelolaan Pengaduan Layanan PTSP | (tak berlabel) |
| 12 | `monev-pen-pengaduan` | Data Monitoring dan Evaluasi Pengelolaan Pengaduan Masyarakat Terhadap Layanan Badan Usaha | (tak berlabel) |
| 13 | `birokrasi` | Data Kebijakan Road Map Reformasi Birokrasi | (tak berlabel) |
| 14 | `hasil-skm` | Rekap Hasil Survei Kepuasan Masyarakat | (tak berlabel) |
| 15 | `si-pel-publik` | Rekap Sistem Informasi Pelayanan Publik | (tak berlabel) |
| 16 | `unjuk-rasa` | Rekap Pengamanan Unjuk Rasa | (tak berlabel) |
| 17 | `bongkarmuatpetikemas-dp` | Kegiatan Jasa Bongkar Muat Peti Kemas di Pelabuhan BP Batam | (tak berlabel) |
| 18 | `nilairealisasiinvestasi-kek-dp` | Nilai Realisasi Investasi Kawasan Ekonomi Khusus Di KPBPB Batam | (tak berlabel) |
| 19 | `capaian-dp` | Persentase Realisasi Belanja dan Penerimaan BP Batam | (tak berlabel) |
| 20 | `pemakaianair-dp` | Jumlah Pemakaian Air Baku di Batam | (tak berlabel) |
| 21 | `kapasitasair-dp` | Jumlah Kapasitas Produksi Instalasi Pengolahan Air Bersih | (tak berlabel) |
| 22 | `bm-barang` | Operasional Bongkar Muat Barang | CSV |
| 23 | `tenant-dc` | Rekap Data Tenant Data Center BP Batam | (tak berlabel) |
| 24 | `kunjungan-kapal` | Rekapitulasi Kunjungan Kapal | CSV |
| 25 | `kunjungan-rsbp` | Rekap Kunjungan Rumah Sakit BP Batam | (tak berlabel) |
| 26 | `rakserver-dc` | Rekap Rak Data Center BP Batam | CSV |
| 27 | `data-monevbudayakerja` | Rekap Monitoring Evaluasi Budaya Kerja BP Batam | (tak berlabel) |
| 28 | `kinerjapendampingan` | Data Kinerja Pendampingan Kantor Perwakilan Jakarta | CSV |
| 29 | `rekap-chasis` | Rekap Layanan Chasis | (tak berlabel) |
| 30 | `rekap-laporan-peralihan` | Rekapitulasi Jumlah Perizinan Peralihan Hak Atas Tanah | CSV |
| 31 | `rekap-persetujuan-lelang` | Rekapitulasi Persetujuan Lelang | (tak berlabel) |
| 32 | `rekap-layanan-rekomendasi` | Rekapitulasi Layanan Rekomendasi | (tak berlabel) |
| 33 | `rekap-hak-tanggungan` | Rekapitulasi Hak Tanggungan | (tak berlabel) |
| 34 | `rekap-penerbitan-perubahan` | Rekapitulasi Penerbitan Skpt Dan Sppt Perubahan | (tak berlabel) |
| 35 | `rekap-revisi-pl` | Rekapitulasi Revisi PL | (tak berlabel) |
| 36 | `profil-kek` | Data Profil Kawasan Ekonomi Khusus | CSV |
| 37 | `penyelesaian_perizinan_bp` | Data Penyelesaian Perizinan | (tak berlabel) |
| 38 | `wisata-galang` | Rekapitulasi Kunjungan Wisata Galang | CSV |
| 39 | `guest-house-batam` | Rekapitulasi Layanan Guest House Batam | CSV |
| 40 | `penyakit-terbanyak` | Rekap Top Kasus Penyakit di Rumah Sakit BP Batam | CSV |
| 41 | `rekap-laporan-perpanjangan` | Rekapitulasi Jumlah Perizinan Perpanjangan Hak Atas Tanah | CSV |
| 42 | `rekap-pecah-pl` | Rekapitulasi Pecah PL | (tak berlabel) |
| 43 | `rekap-penerbitan-baru` | Rekapitulasi Penerbitan Skpt Dan Sppt Baru | (tak berlabel) |
| 44 | `rekap-dokumen-pengganti` | Rekapitulasi Dokumen Pengganti | (tak berlabel) |
| 45 | `rekap-pembaharuan-hat` | Rekapitulasi Pembaharuan Hak Atas Tanah | (tak berlabel) |
| 46 | `taj` | Rekapitulasi Layanan Stadion Tumenggung Abdul Jamal | CSV |
| 47 | `kpli-b3` | Layanan KPLI B3 | CSV |
| 48 | `taman-rusa` | Kunjungan Taman Rusa | CSV |
| 49 | `layanan-asrama-haji` | Layanan Asrama Haji BP Batam | CSV |
| 50 | `porsi-makan` | Data Porsi Makan Pasien di Rumah Sakit BP Batam | (tak berlabel) |
| 51 | `penupang-kapal` | Rekapitulasi Kunjungan Penumpang Kapal | CSV |
| 52 | `indikator-efisiensi-rs` | Indikator Efisiensi Rumah Sakit BP Batam | (tak berlabel) |
| 53 | `persen-waktu-penyelesaian` | Persentase Penyelesaian Waktu Perizinan Kurang Dari 12 Hari | CSV |
| 54 | `rusun` | Rekapitulasi Hunian Rusun | CSV |
| 55 | `layananunggulan` | Data Layanan Unggulan Rumah Sakit BP Batam | (tak berlabel) |
| 56 | `limbah` | Rekapitulasi Layanan Pengelolaan Limbah | CSV |
| 57 | `layanan-agribisnis` | Rekapitulasi Layanan Agribisnis | CSV |
| 58 | `izin-sikmb` | Rekapitulasi Permohonan Layanan Perizinan Lalu Lintas Barang | CSV |
| 59 | `rekap-perka-bp` | Rekap Peraturan Kepala BP Batam | (tak berlabel) |
| 60 | `rekap-sk-bp` | Rekap Surat Keputusan BP Batam | (tak berlabel) |
| 61 | `rekap-sperintah-bp` | Rekap Surat Perintah BP Batam | (tak berlabel) |
| 62 | `memo-mou` | Rekap Memorandum Of Understanding (MOU) BP Batam | (tak berlabel) |
| 63 | `rentangusia_pegawai` | Rekapitulasi Rentang Usia Pegawai | CSV |
| 64 | `pendidikan_pegawai` | Rekapitulasi Tingkat Pendidikan Pegawai | CSV |
| 65 | `status_pegawai` | Rekapitulasi Status Pegawai | CSV |
| 66 | `jeniskelamin_pegawai` | Rekapitulasi Jenis Kelamin Pegawai | CSV |
| 67 | `arus-lalu-lintas-udara-bandara-hang-nadim` | Arus Lalu Lintas Udara Bandara Hang Nadim | XLS |
| 68 | `rip-bp` | Rekap Rencana Induk Pelabuhan | (tak berlabel) |
| 69 | `lingkungan` | Rekap Data Lingkungan | (tak berlabel) |
| 70 | `siaran-pers` | Rekap Siaran Pers | (tak berlabel) |
| 71 | `permohonan_bantuan` | Rekap Permohonan Bantuan | (tak berlabel) |
| 72 | `permohonan_informasi` | Rekap Permohonan Informasi | (tak berlabel) |
| 73 | `kegiatan-bp-terdokumentasi` | Data Kegiatan BP Batam Yang Terdokumentasi | (tak berlabel) |
| 74 | `kunjungan-tamu-kgh` | Rekap Kunjungan dan Tingkat Huni Kuningan Guest House | (tak berlabel) |
| 75 | `realisasi-batam-negara` | Realisasi Investasi Kota Batam Berdasarkan Negara | XLS |
| 76 | `investasipma` | Realisasi Investasi PMA | (tak berlabel) |
| 77 | `pegawai-rsbp` | Jumlah Tenaga Medis Rumah Sakit BP Batam Berdasarkan Keahlian | CSV |
| 78 | `db-batam-industrial` | Data Buku Batam Industrial Estate | CSV |
| 79 | `kepuasan-pelanggan-dacen` | Rekap Kepuasan Pelanggan Data Centre | CSV |
| 80 | `pekerja-liar` | Rekap Penemuan Pekerja Liar Oleh Tim Direktorat Pengamanan BP Batam | CSV |
| 81 | `penertiban-bp` | Rekap Data Kegiatan Penertiban | CSV |
| 82 | `data-manprolpse` | Data Pengadaan Barang dan Jasa BP Batam | CSV |
| 83 | `monev-pengelolaanpengaduan` | Data Monitoring dan Evaluasi Pengelolaan Pengaduan Masyarakat | (tak berlabel) |
| 84 | `lakip-atau-iku` | Data Laporan Indikator Kinerja Utama BP Batam | CSV |
| 85 | `survei-kep-masyarakat` | Data Survei Kepuasan Masyarakat Terhadap Pelayanan Publik BP Batam | (tak berlabel) |
| 86 | `data-indikator-ekonomi` | Data Laporan Perkembangan Indikator Ekonomi Makro | CSV |
| 87 | `kejadian` | Rekap Kejadian Bencana Alam | CSV |
| 88 | `distribusi-personil` | Rekap Distribusi Personil Pengamanan Aset | (tak berlabel) |
| 89 | `sertifikasi` | Rekap Sertifikasi Personil Direktorat Pengamanan | CSV |
| 90 | `kegiatandamkar` | Kegiatan Mitigasi dan Rescue Pemadam Kebakaran | (tak berlabel) |
| 91 | `iklan` | Rekapitulasi Iklan Dan Advertorial | (tak berlabel) |
| 92 | `daftar-layanan-hukum-bp` | Daftar Layanan Hukum BP Batam | (tak berlabel) |
| 93 | `rutan` | Rekap Kegiatan Rumah Tangga BP Batam | (tak berlabel) |
| 94 | `rekap-bahan-pustaka` | Rekap Bahan Pustaka BP Batam | (tak berlabel) |
| 95 | `arsip-inaktif` | Rekap Arsip Kerja Inaktif | (tak berlabel) |
| 96 | `monev-konker` | Data Monitoring dan Evaluasi Kontrak Kinerja | (tak berlabel) |
| 97 | `si-pelayanan-publik` | Data System Informasi Pelayanan Publik | (tak berlabel) |
| 98 | `bios` | Data Pengawasan Eksternal Bios | (tak berlabel) |
| 99 | `road_map` | Data Kebijakan Road Map Reformasi Birokrasi | (tak berlabel) |
| 100 | `data-tarif-layanan-new` | Daftar Tarif Layanan BP Batam | (tak berlabel) |
| 101 | `daftar-aset-bpbatam` | Rekap Inventarisasi Aset BP Batam | (tak berlabel) |
| 102 | `sewaruangan` | Rekap Sewa Ruangan Rumah Sakit BP Batam | (tak berlabel) |
| 103 | `teknis-waduk` | Data Teknis Waduk | (tak berlabel) |
| 104 | `informasi-bi` | Data Informasi Business Intelegent | (tak berlabel) |
| 105 | `pma-pmdn` | Rekap Perizinan PMA PMDN | (tak berlabel) |
| 106 | `sewa-gudang` | Rekapitulasi Layanan Sewa Gudang | CSV |
| 107 | `db-forthcomingproject` | Data Buku Forth Coming Project | CSV |
| 108 | `layanan-medisrsbp` | Fasilitas Medis di Rumah Sakit BP Batam | CSV |
| 109 | `data-profil-dermaga` | Data Profil Dermaga | CSV |
| 110 | `profil-kgh` | Data Profil Kuningan Guest House | (tak berlabel) |
| 111 | `layanan-dacen` | Tarif Layanan Data Centre | CSV |
| 112 | `rib` | Rekap Rencana Induk Bandara | CSV |
| 113 | `databuku-batam-report` | Data Buku Batam Report | CSV |
| 114 | `wilayahpengembangan-batam` | Rekap Wilayah Pengembangan Pulau Batam | (tak berlabel) |
| 115 | `dat-capaian-kinerja` | Data Capaian Kinerja BP Batam | CSV |
| 116 | `db-costofdoing-business` | Data Buku Cost Of Doing Business | CSV |
| 117 | `db-marineshipyard` | Data Buku Marine & Shipyard | CSV |
| 118 | `daftar-kawasan-industri` | Data Daftar Kawasan Industri | CSV |
## Lampiran B. Berkas mentah

Respons mentah riset (HTML, JSON, chunk JS, header, log per permintaan) tersimpan di folder sementara sesi riset 8–9 Nov 2026 dan tidak ikut repo. Hasil unduhan lengkap yang disimpan ada di `dataset-arsip/bpbatam-data/` dan `dataset-arsip/bpbatam-geoportal/` (lihat `docs/DATASET.md`). Berkas mentah riset itu:

- `g_layers.json`: ringkasan 21 layer dari API geoportal
- `g_api_metadata.json`: 33 entri metadata
- `d_ds_parsed.json`: metadata 24 dataset (3 lainnya di `d_ds_*.html`)
- `d_dump_*.json`: sampel 3 baris per dataset
- `w_cnt_*.json`: jumlah fitur per layer ArcGIS
