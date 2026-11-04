# Batam City Hall: Audit Data Geoportal HANG JEBAT, BP Batam, dan Ina-Geoportal BIG
> task_id: wf-38dc66ef-7548-840c-a519-a759202f4d2b

# Batam City Hall: Audit Data Geoportal HANG JEBAT, BP Batam, dan Ina-Geoportal (BIG)

Langsung ke intinya: harta karun sebenarnya bukan di halaman-halaman geoportal yang dirender JavaScript, tapi di **server ArcGIS REST di belakangnya**. BP Batam (`web-gis.bpbatam.go.id`) dan BIG (`geoservices.big.go.id`) sama-sama membuka layer batas kecamatan/kelurahan yang bisa di-query langsung ke GeoJSON. HANG JEBAT tidak punya API publik yang terdokumentasi. Masalahnya ada di lisensi: tidak satu pun dari tiga portal ini mencantumkan lisensi terbuka yang eksplisit. Jadi sikap yang aman: **tampilkan sebagai layer terpisah dengan atribusi, jangan dicampur ke data OSM, dan jangan diimpor ke OpenStreetMap.**

## TL;DR

- **Bisa langsung dipakai (dengan atribusi, sebagai layer terpisah):** batas kelurahan/kecamatan Kota Batam dari BIG (`BATASWILAYAH/Administrasi_AR_KelDesa_10K`, `BATAS_DESAKEL_AR`) dan dari BP Batam (`WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/27`, `PETA_ADMINISTRASI_BATAM/MapServer/2`). Semuanya mendukung `f=geojson`. Pembanding yang lisensinya paling jelas: COD-AB Indonesia (BPS/OCHA, CC BY 3.0 IGO) di HDX.
- **Hanya untuk referensi atau cek koordinat:** POI BP Batam (bank dan lainnya), jaringan jalan 1:50K, daftar 799 perumahan HANG JEBAT, layer rawan bencana/rusunawa/RTH HANG JEBAT, dan statistik Kampung Tua di Satu Data Batam. Pakai untuk mengisi atau memvalidasi koordinat yang masih kosong lewat survei atau OSM, jangan disalin mentah.
- **Belum bisa atau jangan dipakai:** data halte Trans Batam resmi berformat spasial (tidak ditemukan sama sekali, tidak ada GTFS), folder `data_terbatas`/`data_tertutup` BP Batam, dan GADM (lisensinya melarang redistribusi tanpa izin). Halte harus dibangun dari OSM plus survei lapangan.

## Key Findings

| # | Temuan | Status |
|---|---|---|
| 1 | BP Batam menjalankan ArcGIS Server 10.51 di `https://web-gis.bpbatam.go.id/arcgis/rest/services` dengan lebih dari 30 folder, termasuk `PROYGISPUSREN21_EKSTERNAL`, `WEBGIS_TEMATIK`, `Fasilitas`, `POI`, `Penduduk_Perkelurahan`, `data_terbatas`, `data_tertutup` | ✅ Terverifikasi (listing direktori terindeks mesin pencari) |
| 2 | Layer kelurahan BP Batam (`.../WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/27`) punya field `kdepum`, `namobj`, `kdebps`, mendukung query `geoJSON`, MaxRecordCount 2000 | ✅ Terverifikasi |
| 3 | BIG membuka `Administrasi_AR_KelDesa_10K` (batas desa/kelurahan skala 1:10.000, edisi Oktober 2020, dipublikasikan 23 Oktober 2020), kapabilitas `Map,Query,Data`, `maxRecordCount` 4000, `exportTilesAllowed: false`, copyright "Badan Informasi Geospasial" | ✅ Terverifikasi (JSON layanan berhasil diambil) |
| 4 | Katalog CKAN Ina-Geoportal memuat `ADMINISTRASI_AR_DESAKEL` edisi 2022 (revisi 27 Desember 2022) dan edisi September 2023 dengan tag "Downloadable Data" | ✅ Terverifikasi (snippet katalog); unduhan file perlu login, ⚠️ cek langsung |
| 5 | HANG JEBAT dibuat dengan PHP biasa (`index.php?page=...`), dikembangkan Politeknik Negeri Batam bersama Disperkimtan, dan tidak punya API atau endpoint WMS/WFS yang terdokumentasi | ✅ Terverifikasi untuk struktur halaman; ❓ endpoint internal peta interaktif belum diketahui |
| 6 | Halaman statistik HANG JEBAT menampilkan 799 perumahan, 9 kecamatan, 39 kelurahan, 526 developer (catatan "Updated 1 month ago") | ✅ Terverifikasi |
| 7 | Tidak ada lisensi terbuka eksplisit di ketiga portal. Footer BP Batam hanya "Copyright BP Batam 2023. All Right Reserved". Dataset CKAN Ina-Geoportal menulis "No License Provided" | ✅ Terverifikasi untuk yang tampil; ❓ halaman `termcondition` Ina-Geoportal belum terbaca |
| 8 | BPS membuka `geoportal.bps.go.id/server/rest/services/wilkerstat/{provinsi,kabupaten,kecamatan,desa}` dan `Hosted/Wilkerstat_Publish_Tile_Full` (termasuk layer `sls`) | ✅ Terverifikasi; lisensi ❓ |
| 9 | Data halte Trans Batam resmi dalam format spasial tidak ditemukan. Yang ada hanya jumlah halte per koridor (Wikipedia, secondary) dan laporan Dishub | ✅ Terverifikasi bahwa *tidak ada* sumber terbuka yang ditemukan |

## Details

### 1. HANG JEBAT Geoportal (Disperkimtan Kota Batam)

**Platform dan akses.** Situs PHP konvensional dengan rute `index.php?page=...`. Menurut unggahan Polibatam, platform ini dibangun Politeknik Negeri Batam bersama Disperkimtan lewat Project-Based Learning mahasiswa. Ada mirror atau versi pengembangan di `https://if.polibatam.ac.id/perkimtan/`. Halaman publik bisa dibuka tanpa login. Login hanya untuk Admin/Operator (`/admin/index.php?page=login`). Ada juga aplikasi survei BNBA (By Name By Address) di `http://survey.hangjebat-geoportal.com/` untuk petugas lapangan.

**Halaman yang terverifikasi ada:**
- `https://www.hangjebat-geoportal.com/index.php?page=data-peta` (Pemetaan)
- `https://www.hangjebat-geoportal.com/peta-interaktif/` (peta interaktif satu halaman)
- `https://www.hangjebat-geoportal.com/index.php?page=data-statistik`
- `https://www.hangjebat-geoportal.com/index.php?page=data-statistik-perumahan-permukiman`
- `https://www.hangjebat-geoportal.com/index.php?page=data-statistik-perumahan-sekota-batam` (tabel HTML: nama perumahan, kecamatan, kelurahan, developer, tahun)
- `https://www.hangjebat-geoportal.com/index.php?page=data-statistik-aset-disperkimtan` (Pekerjaan Fisik)
- `index.php?page=laporan-masyarakat` dan `index.php?page=bantuan-psu` (pelaporan warga)

**Endpoint data:** ❓ tidak ada yang terdokumentasi. Peta interaktif kemungkinan memuat GeoJSON atau endpoint PHP internal lewat XHR. Ini **asumsi** dan perlu dicek lewat DevTools → Network di browser. Kalau ketemu endpoint internal, anggap itu bukan API publik. Jangan di-scrape massal tanpa izin.

| Dataset/Layer | Produsen | Tahun | Format | Akses | Relevansi Batam City Hall | Lisensi |
|---|---|---|---|---|---|---|
| Peta Perumahan Sekota Batam | Disperkimtan | data berlabel 2026, "Updated 1 month ago" | Peta web + tabel HTML (799 perumahan) | Lihat saja | Sedang: konteks permukiman, cek nama perumahan | Tidak dicantumkan |
| Peta Perumahan Subsidi | Disperkimtan | ❓ | Peta web | Lihat saja | Rendah | Tidak dicantumkan |
| Peta Serah Terima Perumahan / PSU | Disperkimtan | ❓ | Peta web | Lihat saja | Rendah | Tidak dicantumkan |
| Peta Fasos Lapangan/RTH/Dll dan Jalan Lingkungan | Disperkimtan | ❓ | Peta web | Lihat saja | **Tinggi**: taman, RTH, lapangan olahraga | Tidak dicantumkan |
| Peta Permohonan PSU | Disperkimtan | ❓ | Peta web | Lihat saja | Rendah | Tidak dicantumkan |
| Peta Aset Disperkimtan | Disperkimtan | ❓ | Peta web | Lihat saja | Sedang: taman/makam yang jadi aset dinas (asumsi) | Tidak dicantumkan |
| Peta Rawan Bencana (Identifikasi Bencana) | Disperkimtan | ❓ | Peta web | Lihat saja | **Tinggi** untuk layer hujan/banjir | Tidak dicantumkan |
| Peta Lokasi Rusunawa | Disperkimtan | ❓ | Peta web | Lihat saja | Sedang: layanan warga | Tidak dicantumkan |

**Catatan penting:** statistik HANG JEBAT hanya menyebut 9 kecamatan dan 39 kelurahan, padahal Kota Batam punya 12 kecamatan. Artinya cakupan datanya memang terbatas pada area perumahan, bukan peta dasar kota. **Kesimpulan:** HANG JEBAT berguna sebagai referensi visual untuk RTH, lapangan, dan rawan bencana. Kalau mau datanya, jalur yang benar adalah meminta resmi ke Disperkimtan (kontak di footer: `info@hangjebat.go.id`, (0778) 8014473), karena footer memang memuat tautan "Syarat & Ketentuan" yang isinya belum terbaca.

### 2. Geoportal BP Batam ("Satu Peta Batam")

**Platform dan akses.** Front-end `geoportal.bpbatam.go.id` diluncurkan BP Batam bersama BIG pada 24 Juli 2023. Beranda mengklaim 13.594 dataset geospasial, 31 basis data, dan 33 metadata (ISO 19115). Back-end-nya **ArcGIS Server/Enterprise 10.51** di `https://web-gis.bpbatam.go.id/arcgis/rest/services` (token service: `.../arcgis/sharing/rest/generateToken`). Banyak layanan bisa diakses anonim, tapi ada folder `data_terbatas` dan `data_tertutup` yang jelas tidak untuk publik. **Catatan teknis:** `robots.txt` server ini menolak crawler otomatis. Akses dari browser atau skrip pribadi tetap bisa, tapi lakukan dengan sopan (rate limit rendah, sekali tarik lalu simpan).

**Halaman basis data yang terverifikasi:**
- `https://geoportal.bpbatam.go.id/publication/basis-data/sub-wilayah-pengembangan-batam/?id=23`: Sub-Wilayah Pengembangan Batam, pemutakhiran 2023, bidang Pertanahan, produsen Direktorat Pengelolaan Pertanahan
- `https://geoportal.bpbatam.go.id/publication/basis-data/kontur-kota-batam/?id=31`: Kontur Kota Batam, 2023, produsen Pusat Perencanaan Program Strategis
- Portal open data terpisah: `https://data.bpbatam.go.id/` (isinya ❓ perlu dicek)

| Dataset/Layer (endpoint) | Produsen | Tahun | Format/CRS | Akses | Relevansi | Lisensi |
|---|---|---|---|---|---|---|
| `PROYGISPUSREN21_EKSTERNAL/PETA_ADMINISTRASI_BATAM/MapServer`: 0 Toponim Ibukota, 1 Administrasi Kota Batam, 2 Administrasi Kecamatan, 3 Administrasi Kab/Kota | BP Batam (Pusren) | ❓ (proyek 2021, dari nama folder) | MapServer, EPSG:4326, query JSON/geoJSON, max 2000 | Query anonim ✅ | **Sangat tinggi**: batas kecamatan + toponim ibukota | "All Right Reserved" (footer portal) |
| `WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/27`: Wilayah Administrasi Kelurahan/Desa (poligon; `kdepum`, `namobj`, `kdebps`) | BP Batam | ❓ | EPSG:3857, geoJSON, max 2000, minScale 1:100.000 | Query anonim ✅ | **Sangat tinggi**: batas kelurahan + kode BPS | sda |
| `.../WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/26`: Batas Wilayah Administrasi (garis: kab/kota, kecamatan, kelurahan, perairan desa, landas kontinen, perairan internasional) | BP Batam | ❓ | EPSG:3857, geoJSON | Query anonim ✅ | Tinggi: garis batas laut untuk gaya peta laut | sda |
| `.../WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/9` Batas Vegetasi, `/16` Bidang Tanah Fisik, `/3` Tiang Listrik | BP Batam | ❓ | EPSG:3857 | Query anonim ✅ | Rendah; Bidang Tanah **jangan dipakai** (data kadaster) | sda |
| `WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_POI_/MapServer` (mis. `/2` Bank; field `klspoi`, `namobj`, `codepoi`; copyright "BP BATAM") | BP Batam | ❓ | EPSG:3857, geoJSON | Query anonim ✅ | **Tinggi untuk cek koordinat**: layer lain kemungkinan berisi sekolah, kesehatan, ibadah (asumsi, cek daftar layer) | sda |
| `Direktorat_Infrastruktur_Kawasan/Utilitas/MapServer`: 0 JALAN_LN_50K, 1 KABELLISTRIK_LN_50K | BP Batam | ❓ | EPSG:32648 (UTM 48N), max 1000 | Query anonim ✅ | Rendah (OSM sudah lebih detail) | sda |
| `PROYGISPUSREN21_INTERNAL/PETA_INFRASTRUKTUR/MapServer/1`: Infrastruktur Jalan (`kategori`, `th_bangun`, `panjang_m`) | BP Batam | ❓ | geoJSON | Bisa di-query, tapi foldernya "INTERNAL" | Rendah; jangan dipublikasikan | sda |
| `Fasilitas/WADUK_AR_50K`, `Fasilitas/PEMANFAATAN_AR_50K`, `Fasilitas/MENARATELEPON_PT_50K`, `Fasilitas/KELOLALIMBAH_PT_50K` | BP Batam | ❓ | MapServer, max 1000 | Query anonim ✅ | Waduk: sedang (layer air); sisanya rendah | sda |
| Root: `PETA_POLA_RUANG_PERPRES_87_TAHUN_2011`, `PETA_TUTUPAN_LAHAN`, `PETA_WILAYAH_KERJA_BP_BATAM`; `Hosted/Basemap` (tile, layer "Wilayah Kerja") | BP Batam | Perpres 87/2011 | MapServer/tile | Lihat ✅ | Sedang: kawasan industri/pola ruang sebagai referensi visual | sda |
| Folder `Perindustrian`, `KEK`, `Kawasan_Ekonomi_Khusus`, `BIFZA`, `Penduduk_Perkelurahan`, `POI`, `SPAM` | BP Batam | ❓ | ❓ | ❓ belum dicek isinya | Kawasan industri, KEK, penduduk per kelurahan | sda |
| `data_terbatas`, `data_tertutup`, `DATACAKRA/Data_Tertutup` | BP Batam | – | – | **Perlu izin / jangan disentuh** | – | Tertutup |

**Pelabuhan, kampung tua, batimetri:** tidak ada layer berlabel jelas di direktori yang terindeks. ❓ Cek folder `Perencanaan`, `perencanaan2024`, `Pertanahan`, `Direktorat_Pengelolaan_Pertanahan` (kampung tua di Batam erat kaitannya dengan urusan lahan BP Batam, jadi ini asumsi tempat paling mungkin).

### 3. Ina-Geoportal (BIG): `tanahair.indonesia.go.id`

**Platform dan akses.** Front-end `portal-web` dirender JavaScript. Ada katalog **CKAN** di `https://tanahair.indonesia.go.id/sdi/dataset/` (cari pakai `?q=` atau tag), sedangkan layanan peta ada di **ArcGIS Server BIG**: `https://geoservices.big.go.id/rbi/rest/services` dan `https://geoservices.big.go.id/gis/rest/services`. Mengunduh RBI atau DEMNAS lewat portal **wajib login atau daftar akun**. Panduan resmi DEMNAS: "Silakan masuk atau daftar akun terlebih dahulu" (`https://tanahair.indonesia.go.id/portal-web/static/Panduan%20Unduh%20Data%20Demnas.pdf`). Sebaliknya, query REST ke `geoservices.big.go.id` bisa anonim.

| Dataset/Layer (endpoint) | Produsen | Edisi | Skala/Format | Akses | Relevansi | Lisensi |
|---|---|---|---|---|---|---|
| `BATASWILAYAH/Administrasi_AR_KelDesa_10K/MapServer/0`: Batas Wilayah Kelurahan/Desa (`WADMKC`, `WADMKD`, dll.) | BIG | Okt 2020 (publikasi 23-10-2020) | 1:10.000, EPSG:4326, geoJSON, max 4000 | Query anonim ✅ | **Sangat tinggi** | Copyright BIG; lisensi tidak dinyatakan |
| `BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/0`: Area Batas Wilayah Administrasi Desa/Kelurahan | BIG | ❓ (kemungkinan edisi lebih baru, cek `/info/iteminfo`) | geoJSON, max 1000, HasZ | Query anonim ✅ | **Sangat tinggi** | sda |
| `BATASWILAYAH/Administrasi_AR_Kecamatan_10K`, `BATAS_KECAMATAN_AR` | BIG | ❓ | 1:10.000 | Query anonim ✅ | **Sangat tinggi** (kecamatan) | sda |
| `BATASWILAYAH/Administrasi_AR_KabKota_50K` | BIG | deskripsi menyebut edisi Sept 2023 | 1:50.000 | Query anonim ✅ | Tinggi (outline kota) | sda |
| `BATASWILAYAH/Administrasi_LN_KabKota_50K` | BIG | 2022; memakai garis pantai Pusat Pemetaan Kelautan & Lingkungan Pantai 2022 | 1:50.000 garis | Query anonim ✅ | Sedang | sda |
| `BATASWILAYAH/BATAS_WILAYAH/MapServer` (mis. `/10` garis kecamatan, `/13` area kab/kota) | BIG | ❓ | geoJSON, max 1000 | Query anonim ✅ | Tinggi | sda |
| CKAN `ADMINISTRASI_AR_DESAKEL` (2022 rev. 27-12-2022; Sept 2023) | BIG | 2022/2023 | Geodatabase | Unduh, kemungkinan perlu login ⚠️ | **Sangat tinggi** (versi terbaru) | Tidak dicantumkan di halaman CKAN |
| RBI 1:25K/1:50K per wilayah (garis pantai, transportasi, toponimi, bangunan, hidrografi, batimetri) | BIG | bervariasi | SHP/GDB | Unduh setelah login ⚠️ | Tinggi: **toponimi** dan garis pantai | Terms of use di `/portal-web/termcondition` ❓ belum terbaca |
| DEMNAS / Batimetri Nasional (BATNAS) | BIG | – | GeoTIFF | Unduh setelah login ⚠️ | Tinggi untuk gaya peta laut (kontur kedalaman) | sda |

**Kebijakan berbagi data BIG (yang terverifikasi):**
- **Kebijakan Satu Peta (KSP):** Keppres 28/2023 tentang Kewenangan Akses Berbagi Data dan IG lewat JIGN, ditambah Peraturan BIG No. 3/2024 tentang mekanisme berbagi pakai. Geoportal KSP ada di `https://onemap.big.go.id/`. Kepala BIG Aris Marfai, dikutip ANTARA, menyebut kebijakan ini "telah menyelesaikan 151 peta tematik dari 23 pemerintahan berbagai di 38 provinsi" (CNBC Indonesia mengutip Menko Airlangga: "151 peta tematik dari 23 kementerian lembaga dan 38 provinsi"), dan di One Map Policy Summit Juli 2024 ia menyatakan aturan ini "memberi aturan secara teknis bagaimana masyarakat atau publik itu bisa mengakses data". Klasifikasi akses KSP di era Keppres 20/2018 ada tiga: **Mengunduh, Melihat, Tertutup**.
- **Tidak ditemukan lisensi terbuka (CC-BY dan sejenisnya)** untuk RBI atau batas desa. Dataset CKAN "Kelurahan" bahkan tertulis "No License Provided". Sebagai pembanding, syarat produk SRGI BIG (produk lain, bukan RBI) melarang data "dibagikan kepada pihak ketiga ... tanpa seijin Badan Informasi Geospasial" dan mewajibkan menyebut "Badan Informasi Geospasial". Pola ini **mungkin** berlaku juga untuk RBI, tapi masih asumsi.
- **Batas desa/kelurahan Kota Batam:** layanan nasional `Administrasi_AR_KelDesa_10K` dan `BATAS_DESAKEL_AR` mencakup seluruh Indonesia (extent 94,97–141,02 BT), jadi Batam ikut di dalamnya dan bisa difilter. Catatan BIG sendiri: masih ada "area tidak terdefinisi untuk ... Pulau/Kepulauan" dan desa hasil pemekaran yang belum masuk. Ini relevan untuk pulau-pulau kecil Batam (Belakang Padang, Bulang, Galang). Verifikasi visual tetap wajib.

### 4. Sumber alternatif resmi dan pembanding

| Sumber | Endpoint/URL | Isi relevan | Lisensi | Status |
|---|---|---|---|---|
| **BPS Wilkerstat** | `https://geoportal.bps.go.id/server/rest/services/wilkerstat/desa/MapServer/0` (juga `/kecamatan`, `/kabupaten`, `/provinsi`); `https://geoportal.bps.go.id/server/rest/services/Hosted/Wilkerstat_Publish_Tile_Full/MapServer/4` (SLS, sumber `wilkerstat_publish_2019`, field `nmkec`, `nmdesa`, `kode_sls4`) | Desa/kelurahan dan SLS (RT/RW) | ❓ tidak dinyatakan | Query geoJSON ✅, max 1000 |
| **COD-AB Indonesia (BPS via OCHA/HDX)** | `https://data.humdata.org/dataset/cod-ab-idn` | Level 0–4 (level 4 = desa/kelurahan), basis 2020 | CC BY 3.0 IGO menurut mirror GitHub klikpeta-tech/id-kecamatan-geo, yang mengutip file HDX `idn_admin_boundaries.geojson.zip`: "Licence: Creative Commons Attribution 3.0 IGO (CC BY-IGO)"; halaman HDX sendiri menyebut sumber Badan Pusat Statistik dan batas "established in: 2020" (⚠️ teks lisensi belum terlihat langsung di HDX) | Unduh langsung, tanpa login |
| **geoBoundaries IDN** | `https://data.humdata.org/dataset/geoboundaries-admin-boundaries-for-indonesia` | ADM0–ADM2 saja (ADM3/ADM4 tidak terkonfirmasi) | ODbL; wajib menyebut geoBoundaries | Hanya sampai kota, tidak cukup untuk kelurahan |
| **GADM** | `https://gadm.org/license.html` | Sampai level 3/4 | "Redistribution or commercial use is not allowed without prior permission" | ❌ Jangan dipakai di website publik |
| **Satu Data Batam (Pemko)** | `https://satudata.batam.go.id/satu/detail/statistik-jumlah-kampung-tua-4axedn`; `https://satudata.batam.go.id/data/detail/jumlahkampungtuadikotabatam20250kotabatamrafjte` | Statistik Kampung Tua: 37 kampung tua (2020–2022); data lain menyebut **24 lokasi** (Juni 2024, Dinas Pertanahan). Unduh JSON/Excel | ❓ | Tabular, **bukan spasial** |
| **Dishub Batam** | LAKIP 2021: `https://dishub.batam.go.id/wp-content/uploads/sites/3/2024/07/DISHUB_LAKIP_2021_compressed-1.pdf` | Daftar koridor dan rute teks (target 11 koridor; 8 koridor di 2020) | Dokumen publik | Tidak ada koordinat halte |

**Konflik data Kampung Tua:** angka 37 (2020–2022) dan 24 (Juni 2024) berasal dari dataset berbeda di portal yang sama, keduanya dari Dinas Pertanahan. Bisa jadi definisinya berbeda (misalnya yang sudah ditetapkan dibanding yang diusulkan). **Jangan pilih salah satu begitu saja.** Tampilkan sumbernya dan cek ke Dinas Pertanahan atau SK penetapan Kampung Tua.

### 5. Halte dan rute Trans Batam: titik paling kosong

Tidak ada dataset spasial atau GTFS resmi yang ditemukan. Yang tersedia:
- Wikipedia bahasa Indonesia (sumber sekunder) mencatat 9 koridor aktif dengan jumlah halte per koridor: K1 Sekupang–Batam Centre 56, K2 Tanjung Uncang–Batam Centre 78, K3 Sekupang–Jodoh 65, K4 Sagulung–Sekupang 69, K5 Jodoh–Batam Centre 41, K6 Tanjung Piayu–Batam Centre 58, K7 Nongsa–Batam Centre–Bandara Hang Nadim 76, K8 Punggur–Jodoh 78, K9 Punggur–Nongsa 54. Totalnya 575 kemunculan halte (banyak yang dipakai bersama antar koridor, jadi jumlah halte unik lebih kecil).
- ANTARA Kepri: Dishub Batam bersama BPTD mengidentifikasi 27 titik prioritas pembangunan halte (target rampung 2025); Batam Pos (12/11/2024) menyebut halte ini untuk "Koridor 2 (Tanjunguncang-Batam Center) dan Koridor 8 (Punggur-Jodoh)", dan pada 2025 "sebanyak 10 halte baru telah dibangun, ditambah 4 halte tambahan dari program CSR". Kadishub Salim menyebut target 11 koridor (K10 Tembesi–Barelang, K11 Nongsa–Jodoh).
- Batam Pos (8/10/2026): pengecatan lajur khusus Trans Batam dimulai Rabu (7/10) malam, "sepanjang 10 meter dari depan halte" di lima halte (Politeknik Negeri Batam, Kantor Jasa Raharja Batam Center, Simpang Kara, Perumahan Plamo, Bank Sumut Batam Center) dengan biaya "sekitar Rp70 juta"; menurut Kepala UPT Sucipto lajur penuh direncanakan "sekitar 28 kilometer", dengan rencana perluasan pada 2027.

**Kesimpulan:** halte harus dibangun sendiri. Gunakan OSM (`highway=bus_stop`, `public_transport=platform`, relasi `route=bus`) sebagai basis, lalu lengkapi dengan survei lapangan atau kontribusi warga, dan sumbangkan balik ke OSM. Ini satu-satunya jalur yang bersih secara lisensi.

### 6. Lisensi dan kompatibilitas dengan OSM (ODbL)

- **Mengimpor ke OSM:** wiki OSM tegas: "You **must** obtain proper permissions and licenses to use the data in OSM from the data owner. If the license of the data is not compatible with the OpenStreetMap ODbL, you can not use the data." Karena BIG, BP Batam, dan HANG JEBAT tidak punya lisensi kompatibel yang eksplisit, **jangan impor** data mereka ke OSM.
- **Menampilkan bersama basemap OSM/Protomaps:** menumpuk layer terpisah di atas basemap OSM secara umum diperlakukan sebagai *Produced Work* (karya hasil), bukan *Derivative Database*, selama datanya tidak digabung ke dalam satu basis data. Konsekuensinya: simpan batas BIG/BP Batam di file terpisah (`admin_bigbatam.pmtiles`), jangan di-merge ke tabel POI turunan OSM, dan cantumkan atribusi masing-masing.
- **Atribusi yang disarankan:** "© OpenStreetMap contributors (ODbL)", "Batas wilayah: Badan Informasi Geospasial", "Data: BP Batam", dan untuk COD-AB: "Boundaries: Badan Pusat Statistik (BPS), via OCHA/HDX, CC BY 3.0 IGO".
- **Posisi risiko:** untuk website warga non-komersial, menampilkan batas administrasi BIG dengan atribusi itu wajar dan umum dilakukan, tapi **tidak ada jaminan tertulis**. Kalau ingin aman 100%, pakai COD-AB (lisensi jelas) sebagai data utama, lalu BIG/BP Batam sebagai pembanding. Atau kirim email permohonan ke BIG (`info@big.go.id`) dan PPID BP Batam.

## Daftar Endpoint Teknis

Semua endpoint ArcGIS di bawah mendukung `?f=pjson` (metadata) dan `/query?...&f=geojson`.

**BP Batam** (✅ terverifikasi ada; ⚠️ robots.txt menolak crawler, jadi pakai skrip yang sopan):
```
https://web-gis.bpbatam.go.id/arcgis/rest/services?f=pjson
https://web-gis.bpbatam.go.id/arcgis/rest/services/PROYGISPUSREN21_EKSTERNAL/PETA_ADMINISTRASI_BATAM/MapServer        (layer 0–3)
https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/27         (kelurahan)
https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/26         (garis batas)
https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_POI_/MapServer               (POI)
https://web-gis.bpbatam.go.id/arcgis/rest/services/Direktorat_Infrastruktur_Kawasan/Utilitas/MapServer
https://web-gis.bpbatam.go.id/arcgis/rest/services/Fasilitas/WADUK_AR_50K/MapServer/0
https://web-gis.bpbatam.go.id/arcgis/sharing/rest/generateToken                                                       (token, bukan untuk kita)
```

**BIG** (✅):
```
https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH?f=pjson
https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_KelDesa_10K/MapServer/0
https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/0
https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_Kecamatan_10K/MapServer
https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer
https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_KabKota_50K/MapServer
https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_LN_KabKota_50K/MapServer/info/iteminfo
https://tanahair.indonesia.go.id/sdi/dataset/administrasi_ar_desakel                                                  (CKAN)
```

**BPS** (✅):
```
https://geoportal.bps.go.id/server/rest/services/wilkerstat/desa/MapServer/0
https://geoportal.bps.go.id/server/rest/services/wilkerstat/kecamatan/MapServer
https://geoportal.bps.go.id/server/rest/services/Hosted/Wilkerstat_Publish_Tile_Full/MapServer/4                      (SLS)
```

**Contoh query GeoJSON untuk Batam** (❓ belum dieksekusi; bbox Batam ≈ 103.5,0.25,104.5,1.21 diambil dari full extent layanan administrasi BP Batam):

```bash
# 1) Kelurahan BP Batam, output langsung WGS84
curl -G "https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/27/query" \
  --data-urlencode "where=1=1" --data-urlencode "outFields=*" \
  --data-urlencode "outSR=4326" --data-urlencode "f=geojson" -o bpbatam_kelurahan.geojson

# 2) Kecamatan BP Batam
curl -G "https://web-gis.bpbatam.go.id/arcgis/rest/services/PROYGISPUSREN21_EKSTERNAL/PETA_ADMINISTRASI_BATAM/MapServer/2/query" \
  --data-urlencode "where=1=1" --data-urlencode "outFields=*" \
  --data-urlencode "outSR=4326" --data-urlencode "f=geojson" -o bpbatam_kecamatan.geojson

# 3) Desa/kelurahan BIG, difilter bbox Batam, dengan paging
curl -G "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_KelDesa_10K/MapServer/0/query" \
  --data-urlencode "where=1=1" \
  --data-urlencode "geometry=103.5,0.25,104.5,1.21" --data-urlencode "geometryType=esriGeometryEnvelope" \
  --data-urlencode "inSR=4326" --data-urlencode "spatialRel=esriSpatialRelIntersects" \
  --data-urlencode "outFields=*" --data-urlencode "outSR=4326" \
  --data-urlencode "resultOffset=0" --data-urlencode "resultRecordCount=1000" \
  --data-urlencode "f=geojson" -o big_desakel_batam_p0.geojson
# Bbox akan ikut menangkap desa Bintan/Karimun di tepi. Filter setelahnya, misal WADMKK='Kota Batam' (cek nama field di /0?f=pjson).

# 4) BPS desa (pembanding)
curl -G "https://geoportal.bps.go.id/server/rest/services/wilkerstat/desa/MapServer/0/query" \
  --data-urlencode "where=1=1" --data-urlencode "geometry=103.5,0.25,104.5,1.21" \
  --data-urlencode "geometryType=esriGeometryEnvelope" --data-urlencode "inSR=4326" \
  --data-urlencode "outFields=*" --data-urlencode "outSR=4326" --data-urlencode "f=geojson" -o bps_desa_batam.geojson
```

Cara alternatif yang otomatis menangani paging: `pip install esridump` lalu `esri2geojson "<URL layer>" out.geojson`.

## Recommendations: langkah pengambilan data (berurutan)

1. **Batas kelurahan dan kecamatan dulu (prioritas 1).** Tarik COD-AB Indonesia dari HDX (lisensi paling jelas), BIG `Administrasi_AR_KelDesa_10K` atau `BATAS_DESAKEL_AR`, dan BP Batam `MapServer/27`. Bandingkan ketiganya di QGIS: jumlah kelurahan, nama, kode `kdebps`/kode Kemendagri, dan cakupan pulau. Pilih satu sebagai *canonical* (saran: COD-AB atau BIG). Simpan yang lain hanya sebagai QA.
2. **Normalisasi.** `ogr2ogr -f GeoJSON -t_srs EPSG:4326 -lco RFC7946=YES -lco COORDINATE_PRECISION=6 out.geojson in.geojson`. Sederhanakan geometri dengan `mapshaper in.geojson -simplify 15% keep-shapes -o out.geojson`. Rapikan atribut menjadi `kode_kel`, `nama_kel`, `kode_kec`, `nama_kec`, `sumber`, `edisi`.
3. **Isi koordinat yang kosong dengan join spasial ke OSM, bukan dengan menyalin POI pemerintah.** Ambil POI dari OSM (Overpass/Protomaps) untuk `amenity=school|hospital|clinic|place_of_worship|townhall`, `landuse=cemetery`, `leisure=park|pitch`, `amenity=ferry_terminal`, `highway=bus_stop`. POI BP Batam (`WEBGIS_TEMATIK_MOBILE_POI_`) dan HANG JEBAT cukup jadi **daftar periksa**: kalau ada di sana tapi belum ada di OSM, verifikasi (survei atau citra) lalu petakan sendiri di OSM.
4. **Halte Trans Batam.** Buat skema `halte.geojson` (id, nama, koridor[], sumber, tanggal_verifikasi). Ambil `highway=bus_stop` dari OSM, cocokkan dengan daftar koridor dari Dishub/Wikipedia, lalu isi kekurangannya lewat survei warga dan upload ke OSM. Rute: buat relasi `route=bus` di OSM per koridor.
5. **Kampung Tua.** Tidak ada data spasial terbuka. Gunakan daftar nama dari Satu Data Batam, cari titiknya lewat `place=village|hamlet` di OSM dan toponimi RBI (lihat saja), lalu tandai `status_verifikasi`. Ajukan permintaan data ke Dinas Pertanahan atau BP Batam (folder `Pertanahan`).
6. **Hujan, banjir, dan rawan bencana.** HANG JEBAT Peta Rawan Bencana cukup jadi referensi visual. Untuk layer yang bisa dipublikasikan, pakai data BNPB/InaRISK (`inarisk1.bnpb.go.id:6443/arcgis/rest/services`). Lisensinya ❓, jadi perlakukan juga sebagai layer terpisah dengan atribusi.
7. **Gaya peta laut.** Garis pantai dari OSM/Protomaps sudah cukup. Untuk kontur kedalaman, unduh BATNAS dari Ina-Geoportal (login), lalu `gdal_contour -i 5` dan simpan sebagai layer terpisah dengan atribusi BIG. Garis batas perairan desa bisa diambil dari BP Batam `MapServer/26` (`kelas`=16) sebagai hiasan referensi.
8. **Konversi ke PMTiles.** `tippecanoe -o admin_batam.pmtiles -zg --drop-densest-as-needed -l kelurahan kelurahan.geojson -l kecamatan kecamatan.geojson` (tippecanoe ≥ 2.17 bisa langsung output `.pmtiles`). Pisahkan file per sumber dan lisensi: `osm_*.pmtiles`, `admin_big.pmtiles`, `halte_warga.pmtiles`. Di MapLibre, tambahkan `attribution` per source.
9. **Dokumentasi lisensi di repo.** Buat `DATA_SOURCES.md` berisi URL endpoint, tanggal tarik, edisi, lisensi atau "tidak dinyatakan", dan teks atribusi. Kirim email permohonan izin ke BIG, BP Batam (PPID), dan Disperkimtan, lalu simpan balasannya.

**Yang hanya untuk referensi atau cek koordinat (jangan disalin ke dataset publik):** POI BP Batam, jalan 1:50K BP Batam, `PETA_INFRASTRUKTUR` (folder INTERNAL), Bidang Tanah Fisik, Pola Ruang Perpres 87/2011, semua layer HANG JEBAT, toponimi RBI, dan statistik perumahan HANG JEBAT.

## Caveats

- **Terverifikasi** = endpoint atau halaman terlihat langsung (lewat fetch atau indeks mesin pencari). **Perlu dicek** = ada indikasi tapi isi atau lisensinya belum terbaca (halaman `termcondition` Ina-Geoportal, isi folder `POI`/`Perindustrian`/`KEK` BP Batam, endpoint XHR HANG JEBAT, edisi `BATAS_DESAKEL_AR`). **Asumsi** = POI BP Batam berisi sekolah/kesehatan/ibadah, lokasi data kampung tua di folder Pertanahan, dan perlakuan "Produced Work" ODbL untuk layer terpisah (ini interpretasi umum, bukan nasihat hukum).
- Query contoh di atas belum dijalankan dari lingkungan ini. Server BP Batam menolak akses otomatis (robots.txt), dan halaman Ina-Geoportal memblokir bot. Endpoint ArcGIS juga bisa berubah atau ditutup kapan saja, jadi simpan salinan lokal beserta tanggal tariknya.
- Data batas BIG edisi 2020 mengakui ada pulau atau kepulauan yang belum terdefinisi dan desa pemekaran yang belum masuk. Batam adalah kota kepulauan, jadi QA visual wajib, terutama untuk Belakang Padang, Bulang, dan Galang.
- Angka 13.594 dataset BP Batam adalah klaim beranda portal, bukan jumlah layer publik. Mayoritas kemungkinan tidak bisa diakses anonim.
- Statistik HANG JEBAT (9 kecamatan) tidak mencakup seluruh 12 kecamatan Batam.
- Jumlah halte Trans Batam per koridor berasal dari Wikipedia (sekunder) dan sudah bisa berubah. Dari rencana 27 halte, Batam Pos melaporkan 10 halte baru ditambah 4 halte CSR sudah dibangun pada 2025; lajur khusus baru dicat di lima halte, dan perluasan 2027 menuju sekitar 28 kilometer masih berupa target.

## Daftar sumber
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/27
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_KelDesa_10K/MapServer?f=pjson
- indonesia — https://tanahair.indonesia.go.id/sdi/dataset/administrasi_ar_desakel
- indonesia — https://tanahair.indonesia.go.id/sdi/en/dataset/?tags=Geodatabase+batas+wilayah+administrasi+desa/kelurahan&organization=badan-informasi-geospasial
- linkedin — https://www.linkedin.com/in/ike-srawati-salamun-0669b7280/
- hangjebat-geoportal — https://www.hangjebat-geoportal.com/index.php?page=data-statistik-perumahan-sekota-batam
- bpbatam — https://geoportal.bpbatam.go.id/
- indonesia — https://tanahair.indonesia.go.id/sdi/dataset/kelurahan
- bps — https://geoportal.bps.go.id/server/rest/services/wilkerstat
- bps — https://geoportal.bps.go.id/server/rest/services/Hosted/Wilkerstat_Publish_Tile_Full/MapServer
- Wikipedia — https://id.wikipedia.org/wiki/Trans_Batam
- polibatam — https://if.polibatam.ac.id/perkimtan/
- hangjebat-geoportal — https://hangjebat-geoportal.com/
- Wikipedia — https://en.wikipedia.org/wiki/Batu_Ampar,_Batam
- bpbatam — https://geoportal.bpbatam.go.id/news/bersama-big,-bp-batam-launching-geoportal-spasial/
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/sharing/rest/portals/info
- bpbatam — https://geoportal.bpbatam.go.id/publication/basis-data/sub-wilayah-pengembangan-batam/?id=23
- bpbatam — https://geoportal.bpbatam.go.id/publication/basis-data/kontur-kota-batam/?id=31
- bpbatam — https://data.bpbatam.go.id/
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/PROYGISPUSREN21_EKSTERNAL/PETA_ADMINISTRASI_BATAM/MapServer
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/26
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/9
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/3
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_BASEMAP/MapServer/16
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/WEBGIS_TEMATIK/WEBGIS_TEMATIK_MOBILE_POI_/MapServer/2
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/Direktorat_Infrastruktur_Kawasan/Utilitas/MapServer
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/PROYGISPUSREN21_INTERNAL/PETA_INFRASTRUKTUR/MapServer/1
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/Fasilitas/KELOLALIMBAH_PT_50K/MapServer/0
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/Fasilitas/PEMANFAATAN_AR_50K/MapServer/0/generateRenderer
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/Fasilitas/MENARATELEPON_PT_50K/MapServer/0
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/Fasilitas/WADUK_AR_50K/MapServer/0
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/Hosted/Basemap/MapServer
- bpbatam — https://web-gis.bpbatam.go.id/arcgis/rest/services/DATACAKRA
- spasialkan — https://spasialkan.com/2018/06/25/kumpulan-link-gis-server-indonesia-simpul-jaringan-geospasial-nasional/
- dateno — https://dateno.io/registry/catalog/temp00003741/
- lintasbumi — https://lintasbumi.com/2018/08/12/cara-mengunduh-peta-rupa-bumi-indonesia-rbi-dari-ina-geoportal/
- spasialkan — https://spasialkan.com/2018/03/15/cara-download-peta-rbi-rupabumi-indonesia-digital-shp-gdb-gratis/
- indonesia — https://tanahair.indonesia.go.id/portal-web/static/Panduan%20Unduh%20Data%20Demnas.pdf
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_KelDesa_10K/MapServer/layers
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/layers
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_KabKota_50K/MapServer
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_LN_KabKota_50K/MapServer/info/iteminfo
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_WILAYAH/MapServer/10
- big — https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_WILAYAH/MapServer/13
- indonesia-geospasial — https://www.indonesia-geospasial.com/2020/01/download-peta-rbi-per-wilayah-se.html
- geodose — https://www.geodose.com/2016/07/peta-rupa-bumi-indonesia-sekarang-dapat.html
- big — https://onemap.big.go.id/
- big — https://onemap.big.go.id/Buku_Pedoman_Geoportal%20KSP_v2.pdf
- big — https://srgi.big.go.id/register2/step_1
- bps — https://geoportal.bps.go.id/server/rest/services/wilkerstat/desa/MapServer
- bps — https://geoportal.bps.go.id/server/rest/services/Hosted/Wilkerstat_Publish_Tile_Full/MapServer/4
- google — https://translate.google.com/translate?u=https%3A%2F%2Fdata.humdata.org%2Fdataset%2Fcod-ab-idn&hl=id&sl=en&tl=id&client=srp
- github — https://github.com/klikpeta-tech/id-kecamatan-geo
- humdata — https://data.humdata.org/dataset/geoboundaries-admin-boundaries-for-indonesia
- gadm — https://gadm.org/license.html
- batam — https://satudata.batam.go.id/satu/detail/statistik-jumlah-kampung-tua-4axedn
- batam — https://satudata.batam.go.id/data/detail/jumlahkampungtuadikotabatam20250kotabatamrafjte
- batam — https://dishub.batam.go.id/wp-content/uploads/sites/3/2024/07/DISHUB_LAKIP_2021_compressed-1.pdf
- antaranews — https://www.antaranews.com/berita/4201971/dishub-sembilan-dari-11-koridor-trans-batam-telah-beroperasi
- openstreetmap — https://wiki.openstreetmap.org/wiki/Import/Guidelines
- github — https://hotosm.github.io/pdc-documentation/pages/03-josm/01-pengenalan-osm/01_pengenalan_osm/
- dateno — https://dateno.io/registry/catalog/temp00003743/
