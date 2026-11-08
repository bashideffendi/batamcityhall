# Riset sumber data: DataKita (angkabatam.id) dan HANG JEBAT Geoportal

Tanggal riset: 8 November 2026. Tujuannya mencari dataset dan data peta Batam yang bisa dipakai untuk menu "Dataset" dan fitur peta (MapLibre + PMTiles) di Batam City Hall.

Label status yang dipakai:
- ✅ **dibuka sesi ini**: halaman atau berkas diambil langsung dan isinya diperiksa.
- 🔗 **tautan terlihat**: URL ada di HTML situs yang diperiksa, tapi halamannya sendiri tidak dibuka.
- 🔎 **indeks pencarian**: URL ditemukan lewat mesin pencari dan tidak dibuka.
- ❓ **belum terverifikasi**.

---

## 0. Cara kerja dan kepatuhan

| Host | Jumlah permintaan | Catatan |
|---|---|---|
| datakita.angkabatam.id | 9 (+1 lompatan redirect) | robots, dashboard→login, beranda, app.js, faq, systems, news, sitemap, register (hanya dibaca, tidak dikirim) |
| angkabatam.id | 2 | robots.txt, beranda (404 dari WAF SafeLine) |
| www.hangjebat-geoportal.com | 54 | robots, sitemap, katalog, 25 halaman peta, 3 halaman statistik, peta-interaktif, 18× Range ≤32 KB, 2× HEAD, 1× API |
| batamkota.bps.go.id / webapi.bps.go.id | 5 | robots (404), term-of-use, statistics-table (404), dokumentasi API dan openapi.yaml |

- Jeda minimal 3,5 detik antarpermintaan ke host yang sama. Dipakai User-Agent umum peramban, tanpa email atau nama.
- Tidak login, tidak membuat akun, tidak mengirim formulir, tidak menebak path rahasia. Semua path berasal dari tautan atau kode JS di halaman publik.
- Berkas besar tidak diunduh. GeoJSON hanya diambil dengan `Range: bytes=0-8191` (satu berkas sampai 32 KB). Berkas yang kodenya menunjukkan berisi data pribadi (NIK, No KK, nama kepala keluarga, KTP, kontak pemilik) hanya dicek dengan `HEAD` atau tidak disentuh sama sekali.
- Laporan ini tidak memuat nilai data pribadi. Nama yang muncul hanya nama perumahan dan badan usaha (pengembang).
- Repo tidak diubah.

---

## 1. DataKita (datakita.angkabatam.id)

### 1.1 robots.txt dan Content-Signal (✅)

Berkas `https://datakita.angkabatam.id/robots.txt` adalah "Cloudflare Managed content" dan isinya sama dengan `https://angkabatam.id/robots.txt`. Ada tiga bagian:

1. **Pembukaan legal.** Akses ke situs dianggap sebagai persetujuan untuk mematuhi *content signals*. Aturannya: `yes` berarti boleh mengambil untuk penggunaan itu, `no` berarti tidak boleh, dan sinyal yang tidak dicantumkan berarti operator tidak memberi izin dan tidak juga melarang lewat Content-Signal. Pembatasan dinyatakan sebagai reservasi hak menurut Pasal 4 Direktif Uni Eropa 2019/790 (pengecualian *text and data mining*).
2. **Grup `User-agent: *`:**
   ```
   Content-Signal: search=yes,ai-train=no,use=reference
   Allow: /
   ```
3. **Daftar crawler pelatihan AI yang diblokir penuh (`Disallow: /`):** Amazonbot, Applebot-Extended, Bytespider, CCBot, **ClaudeBot**, Diffbot, Google-Extended, GPTBot, omgili, **anthropic-ai**, **Claude-Web**, cohere-ai, MistralAI-Training, meta-externalagent, GoogleOther, Baiduspider, PetalBot, Awario, Google-CloudVertexBot, QualifiedBot, Cotoyogi, ICC-Crawler, atlassian-bot, FishBot, BorderxBot, NavuBot, SemrushBot-SWA, WARDBot, magpie-crawler, KimiBot, CitibotSiteCrawler. Berkas ditutup dengan `User-agent: *` / `Disallow:` (kosong, artinya semua boleh).

| Sinyal | Nilai | Definisi menurut berkas | Arti bagi kita |
|---|---|---|---|
| `search` | **yes** | Membangun indeks pencarian dan menampilkan hasil (tautan dan cuplikan pendek), **tidak termasuk** ringkasan AI | Menautkan DataKita atau mengutip judul dan cuplikan pendek di menu Dataset boleh. |
| `ai-input` | **tidak dicantumkan** | Memasukkan konten ke model AI (RAG, *grounding*, jawaban AI waktu nyata) | Netral: tidak diizinkan dan tidak dilarang. Untuk amannya, jangan memasang pipeline AI (ringkasan otomatis, chatbot) yang membaca konten DataKita di situs produksi. |
| `ai-train` | **no** | Melatih atau *fine-tune* model AI | Kita tidak melatih model, jadi tidak terdampak. Data yang kita ambil juga tidak boleh dipakai sebagai bahan pelatihan oleh pihak mana pun. |
| `use` | **reference** | "how AI systems may consume the content (immediate, reference, or full)". Arti tiap nilai tidak dijabarkan di berkas. | Tafsiran konservatif: sistem AI hanya boleh merujuk (menyebut dan menautkan), bukan menyalin utuh. |

**Kesimpulan:** menampilkan ulang data di situs kota adalah penggunaan biasa, bukan *search*, *ai-input*, atau *ai-train*. Content-Signal tidak melarangnya. Tapi DataKita sendiri tidak menyimpan data yang bisa diambil (lihat 1.3). Data aslinya ada di BPS Kota Batam, yang punya syarat penggunaan sendiri dan cukup longgar (lihat 1.5). Jadi sumber yang benar adalah BPS, bukan DataKita.

**Catatan keterbukaan:** robots.txt memblokir user-agent crawler Anthropic (ClaudeBot, anthropic-ai, Claude-Web). Riset ini adalah pengambilan sekali jalan atas permintaan pengguna, sekitar 10 halaman, dengan UA peramban umum sesuai instruksi, dan masuk grup `*` yang mengizinkan `/`. Pengambil data otomatis di situs produksi (skrip build, bukan AI) juga masuk grup `*`.

### 1.2 Pengelola dan platform (✅)

- **Pengelola: BPS Kota Batam.** Judul halaman "DataKita - BPS Kota Batam". FAQ: "DataKita adalah aplikasi super yang dikembangkan oleh BPS Kota Batam…". Footer: "© 2026 BPS Kota Batam. Hak Cipta Dilindungi." Alamat Jl. Abulyatama Batam Center, telp (0778) 5508877. Logo BPS dan SE2026 (Sensus Ekonomi 2026).
- **Platform:** Laravel (cookie `datakita_session`, `XSRF-TOKEN`, `_token` CSRF), aset Vite (`/build/assets/app-*.js`), meta `app-version` 2.1.0, di belakang Cloudflare. Domain induk `angkabatam.id` dijaga WAF SafeLine dan mengembalikan 404.
- **Fitur publik:** Berita & Update (ringkasan BRS yang menautkan ke batamkota.bps.go.id, video YouTube BPS), Sistem Terintegrasi (tautan ke MONALISA `monalisa.bpsbatam.com`, INDAH `indah.bps.go.id`, Romantik, Simbatik/EPSS), Antrian Tamu, survei SIBSTR, dan "Encik Bot" (WhatsApp).

### 1.3 Dasbor dan API (✅)

- `GET /dashboard` mengembalikan **302 → `/login`**. Dasbor hanya untuk pengguna yang sudah login. Pendaftaran terbuka (`/register`, jenis pengguna: personal, instansi, akademisi), tapi **kami tidak mendaftar atau login**, jadi isi dasbor dan API di baliknya tidak diketahui.
- **Tidak ada API JSON publik.** `app-Bn9FC_mA.js` hanya berukuran 886 byte dan isinya cuma tema, animasi AOS, dan penghitung. Tidak ada `fetch` atau XHR. Chart.js dimuat, tapi tidak ada grafik di halaman publik.
- `/sitemap.xml` tidak ada. Rute catch-all mengembalikan HTML beranda dengan status 200.
- Tautan "Kategori Data" di footer (Ekonomi, Sosial, Demografi, Lingkungan, Publikasi, Tabel Dinamis) semuanya `href="https://datakita.angkabatam.id"`. Artinya masih placeholder.
- Menurut FAQ, kategori data hanya berisi "deskripsi singkat dan tautan langsung ke situs BPS Batam (batamkota.bps.go.id)".

**Kesimpulan:** DataKita adalah portal tautan dan layanan internal BPS, bukan repositori data. Tidak ada yang perlu di-scrape dari situ.

### 1.4 Syarat penggunaan

- Di DataKita **tidak ada halaman syarat atau lisensi**. Yang ada hanya "Hak Cipta Dilindungi".
- **Sumber aslinya, BPS Kota Batam, punya `https://batamkota.bps.go.id/id/term-of-use` (✅, dibaca lewat WebFetch).** Ringkasannya:
  - Konten "diberikan kepada Anda secara gratis", berlaku di seluruh dunia dan tidak eksklusif.
  - Boleh dipakai untuk keperluan komersial maupun non-komersial, termasuk menyalin, mendistribusikan, mentransmisikan, dan mengolah untuk pihak ketiga.
  - **Wajib atribusi:** sebut BPS, judul konten, tanggal akses, penulis (bila ada), dan **tautan langsung** ke halaman asli.
  - Dilarang membuat kesan bahwa BPS mendukung atau terafiliasi.
  - Konten bisa berubah atau ditarik. BPS tidak menjamin data mutakhir dan tidak bertanggung jawab atas tafsiran pihak ketiga.
  - BPS bisa memblokir akses bila pola lalu lintasnya tidak wajar.
- Format atribusi yang bisa dipakai di situs: `Sumber: BPS Kota Batam, "<judul tabel>", diakses <tanggal>, <URL>`.

### 1.5 Jalur data yang sebenarnya: BPS Kota Batam

**Kode domain Batam: `2171`.** Dasarnya: nomor katalog publikasi "4101002.2171" (🔎) dan email kantor `bps2171@bps.go.id` (dari halaman term-of-use).

**WebAPI BPS (✅, spesifikasi dibaca: `https://webapi.bps.go.id/documentation/openapi.yaml`, OpenAPI 3.1, "BPS Statistical Data API")**
- Hanya baca (GET), respons JSON. Hampir semua endpoint butuh **`key` di path**, yang didapat lewat "official BPS API access process" (registrasi di webapi.bps.go.id). Kunci tidak boleh masuk repo; simpan di env var Vercel. **Endpoint ini tidak diuji karena kami tidak punya kunci dan tidak mendaftar.**
- Endpoint yang relevan, disalin persis dari spesifikasi:
  ```
  /v1/api/list/model/subject/domain/{domain}/key/{key}
  /v1/api/list/model/var/domain/{domain}/key/{key}
  /v1/api/list/model/data/domain/{domain}/var/{var}/th/{th}/key/{key}      ← nilai tabel dinamis
  /v1/api/list/model/statictable/domain/{domain}/key/{key}
  /v1/api/view/domain/{domain}/model/statictable/lang/{lang}/id/{id}/key/{key}   ← ada field "excel" (.xls)
  /v1/api/list/model/pressrelease/domain/{domain}/key/{key}               ← ada field "pdf"
  /v1/api/list/model/publication/domain/{domain}/key/{key}                ← ada field "pdf"
  /v1/api/list/model/indicators/domain/{domain}/key/{key}                 ← indikator strategis
  /v1/api/interoperabilitas/datasource/simdasi/id/25/wilayah/{wilayah}/tahun/{tahun}/id_tabel/{id_tabel}/key/{key}  ← "Yearbook Dataset" (tabel Dalam Angka per wilayah)
  /v1/api/list/model/year-exim-data/key/{key}, /port/, /country/, /hs-code/  ← ekspor-impor
  ```
  Contoh pemakaian dengan placeholder: `GET https://webapi.bps.go.id/v1/api/list/model/statictable/domain/2171/key/<KUNCI>`
- **Jalur manual tanpa kunci:** halaman tabel di batamkota.bps.go.id, contoh pola URL `…/en/statistics-table/2/MTM0IzI=/…html` (🔎). Rutenya Next.js dan di belakang Cloudflare. Tidak ada robots.txt (404). Path `/id/statistics-table` tanpa ID mengembalikan 404 dan tidak kami telusuri lebih jauh.

### 1.6 Tabel indikator unggulan untuk situs kota (sumber: BPS Kota Batam)

Semua baris di bawah berlisensi **BPS term-of-use** (boleh dipakai ulang dengan atribusi lengkap dan tautan).

| Judul | Topik | Format | Tahun | URL | Cara ambil | Catatan |
|---|---|---|---|---|---|---|
| IHK dan inflasi Kota Batam, Oktober 2026 (IHK 114,12; y-on-y 3,61%; m-to-m 0,40%) | Inflasi | BRS HTML + PDF | bulanan, 2026 | 🔗 `https://batamkota.bps.go.id/id/pressrelease/2026/11/02/173636/ihk-kota-batam-pada-oktober-2026-…html` | API `pressrelease` atau `data` (var IHK), atau salin manual dari BRS | Rilis tanggal 1–2 tiap bulan. Cocok untuk kartu "angka kota". |
| Perkembangan Pariwisata Kota Batam, September 2026 (162.087 kunjungan wisman) | Pariwisata | BRS HTML + PDF | bulanan, 2026 | 🔗 `…/id/pressrelease/2026/11/03/174747/perkembangan-pariwisata-kota-batam-september-2026.html` | API `pressrelease`; deret waktu lewat API `data` | Agustus 2026: 183.281; Juli 2026: 143.523 (dari ringkasan DataKita). |
| Ekspor dan Impor Kota Batam, September 2026 (ekspor US$2.021,11 juta; impor US$2.206,58 juta) | Ekonomi, perdagangan | BRS + API exim | bulanan | 🔗 `…/id/pressrelease/2026/11/03/174759/perkembangan-ekspor-dan-impor-kota-batam-bulan-september-2026.html` | API `year-exim-data`, `port`, `country`, `hs-code` | Bisa per pelabuhan. Kode pelabuhan perlu dicek. |
| Penumpang angkutan udara dan laut, Juli 2026 (udara domestik 307.623; internasional 18.802) | Transportasi | BRS | bulanan | 🔗 `…/id/pressrelease/2026/09/02/757/penumpang-angkutan-udara-dan-laut-domestik-kota-batam-juli-2026-meningkat.html` | API `pressrelease` | Cocok untuk fitur transportasi (Hang Nadim, pelabuhan feri). |
| Penduduk 15+ yang bekerja menurut lapangan usaha dan jenis kelamin | Ketenagakerjaan | tabel dinamis (HTML/xls) | ❓ | 🔎 `https://batamkota.bps.go.id/en/statistics-table/2/MTM0IzI=/08-penduduk-usia-15-tahun-keatas-yang-bekerja-menurut-lapangan-usaha-dan-jenis-kelamin.html` | API `data` (var id dari `var`) atau unduh manual | Contoh pola URL tabel dinamis. |
| PDRB Kota Batam menurut lapangan usaha 2020–2024 | Ekonomi, PDRB | publikasi PDF | 2025 | 🔎 `https://batamkota.bps.go.id/en/publication/2025/04/11/75dca836a8a3f51c5e97396d/gross-regional-domestic-product-of-batam-municipality-by-industry-2020-2024.html` | API `publication` (link PDF) dan `statictable` | Ada juga PDRB menurut pengeluaran 2019–2023 (🔎). |
| Hasil SP2020: penduduk Kota Batam 1.196.396 jiwa | Kependudukan | BRS | 2020 (rilis 2021) | 🔎 `https://batamkota.bps.go.id/en/pressrelease/2021/03/02/388/hasil-sensus-penduduk-2020--penduduk-kota-batam-2020-1-196-396-jiwa.html` | API `pressrelease` atau sensus (`interoperabilitas/datasource/sensus`) | Patokan resmi untuk sejarah kota. |
| Penduduk, rumah tangga, kepadatan per kecamatan | Kependudukan | tabel Dalam Angka (xls/PDF) | ❓ terbaru | ❓ (ada di "Kota Batam Dalam Angka" dan "Kecamatan … Dalam Angka") | API SIMDASI (`simdasi/id/25/…`) atau publikasi | **Belum terverifikasi.** Proyeksi BPS berbeda dari angka Disdukcapil (DKB per semester). Jangan dicampur. |
| IPM, kemiskinan, pendidikan, kesehatan | Sosial | tabel dinamis | ❓ | ❓ | API `indicators` dan `data` | **Belum terverifikasi.** Ambil var ID lewat `/list/model/var/domain/2171`. |
| Statistik Daerah dan Statistik Kesejahteraan Rakyat Kota Batam | Ringkasan | publikasi PDF | 2020–2023 | 🔎 `…/en/publication/2023/12/21/6c9cd4a0bb142388a98e5cd5/regional-statistics-of-batam-municipality--2022-2023.html`; `…/en/publication/2020/12/30/2a7a8c2f55988ee0535ca8ee/welfare-statistics-of-batam-municipality-2020.html` | API `publication` | Untuk arsip menu Dataset, cukup tautan. |

Sumber pemerintah daerah yang tampil di hasil pencarian (🔎, **di luar cakupan dan belum dibuka**): `https://satudata.batam.go.id/web/wp-content/uploads/2025/07/Kompilasi-Statistik-Sektoral-Tahun-2025.pdf` (Satu Data Pemko Batam) dan DKB Disdukcapil per semester, misalnya `https://disdukcapil.batam.go.id/wp-content/uploads/sites/23/2025/08/DKB-SEMESTER-1-2025-1.pdf`. Keduanya layak diriset terpisah untuk data per kelurahan.

---

## 2. HANG JEBAT Geoportal (www.hangjebat-geoportal.com)

### 2.1 robots.txt dan sitemap (✅)

```
Sitemap: https://hangjebat-geoportal.com/sitemap.xml
User-agent: *
Allow: /
```
Sitemap hanya berisi beranda (`lastmod 2025-12-24`). Tidak ada Content-Signal.

### 2.2 Pengelola dan platform (✅)

- **Pengelola: Dinas Perumahan, Kawasan Permukiman dan Pertamanan (Disperkimtan) Kota Batam.** Footer: "HANG JEBAT Geoportal - Dinas Perumahan, Kawasan Permukiman dan Pertamanan Kota Batam". Logo Pemko, tautan ke `perakimtan.batam.go.id`, alamat Jl. Kartini I No. 29, Sungai Harapan, Sekupang, (0778) 8014473, `info@hangjebat.go.id`. Menurut riset sebelumnya (`research/11-geoportal.md`), situs ini dibangun bersama Polibatam. Cakupannya **hanya Kota Batam**, bukan Kepri.
- **Platform:** PHP 7.4.33 di LiteSpeed, rute `index.php?page=…`, template Bootstrap "front-page". Peta memakai **Leaflet 1.9.4** dengan basemap **Esri World Imagery** (default) dan **tile OSM**.
- **Tidak ada layanan peta standar.** Tidak ditemukan WMS, WFS, GeoServer, atau ArcGIS REST milik sendiri. Setiap halaman peta memanggil `fetch()` ke **berkas GeoJSON statis** di `/assets/geojson/…`, lalu memfilter di sisi klien. Server mendukung `Range` (206) dan mengirim header `Access-Control-Allow-Origin: *`.
- **Tidak ada tombol unduh** (SHP, KML, GeoJSON, PDF) di halaman mana pun. Satu-satunya endpoint PHP, `api/api_geojson_unit_rumah_sekota_batam.php?kecamatan=…&kawasan=…`, mengembalikan **404**, jadi peta unit rumah rusak.
- **CRS:** semua GeoJSON yang dicek tidak mencantumkan `crs`, dan koordinatnya lon/lat desimal sekitar (103,9–104,1; 1,0–1,2). Artinya WGS84/CRS84 sesuai RFC 7946. Berkas Kebun Raya mencantumkan `urn:ogc:def:crs:OGC:1.3:CRS84` secara eksplisit. Bisa langsung masuk tippecanoe tanpa reproyeksi.
- `index.php?page=data-peta-rawan-bencana` mengembalikan 200 dengan **isi kosong**. Versi yang berfungsi ada di `peta-lokasi-rawan-bencana.php` (ditautkan dari `/peta-interaktif/`).

**Contoh permintaan yang terbukti bekerja:**
```
GET https://www.hangjebat-geoportal.com/assets/geojson/Perumahan_Sekota_Batam.geojson
Range: bytes=0-32767
→ 206 Partial Content, Content-Range: bytes 0-32767/1367923, Last-Modified: Thu, 24 Sep 2026 07:12:53 GMT
{
  "type": "FeatureCollection",
  "name": "Perumahan_Sekota_Batam_4",
  "features": [ { "type": "Feature",
     "properties": { "PERUMAHAN": "Bonavista Tahap 3", "PENGEMBANG": "PT Fanindo Cipta Propertindo",
       "FUNGSI": "PL KAWASAN", "LUAS": 29986, "Kelurahan": "Belian", "Kecamatan": "Batam Kota",
       "FOTO": null, "UPDATE_DAT": "23 September 2026" },
     "geometry": { "type": "Polygon", "coordinates": [[[104.0596579, 1.1215677], …
```
```
GET https://www.hangjebat-geoportal.com/assets/geojson/lokasi_rusun.json  (Range 0-8191)
→ 206, total 22549 byte; properti: RUSUN "TG. UNCANG 3 (FANINDO)", BLOK "BLOK A", KAMAR 98, TIPE 24, Harga_Lt1 400000 …
```

### 2.3 Syarat dan lisensi (✅)

- Tautan "Kebijakan Privasi" dan "Syarat & Ketentuan" di footer semuanya `href="javascript:void(0);"`. **Halamannya tidak ada.**
- Tidak ada pernyataan lisensi (CC-BY dan sejenisnya) di halaman mana pun. Halaman statistik hanya mencantumkan "Sumber: Basis Data Terpadu Dinas Perkimtan Kota Batam" dan "© HANG JEBAT Geoportal".
- **Kesimpulan:** status hukumnya tidak dinyatakan. Bisa diakses publik tidak sama dengan berlisensi terbuka. Untuk menampilkan ulang datanya di situs (bukan sekadar menautkan), **minta izin tertulis dulu ke Disperkimtan** (`info@hangjebat.go.id`) dan cantumkan atribusi "Disperkimtan Kota Batam (HANG JEBAT Geoportal)". Ini sejalan dengan kesimpulan `research/11-geoportal.md`.

### 2.4 ⚠️ Temuan privasi serius

Beberapa layer publik, tanpa login, memuat **data pribadi**. Nama field dibaca dari kode popup di halaman; isi berkasnya tidak kami unduh.

| Berkas / halaman | Field pribadi (dari kode) | Bukti akses |
|---|---|---|
| `assets/geojson/bnba-bkkbn/KECAMATAN_*.geojson` (6 berkas) dan `bnba-bkkbn-asn/*` (2 berkas) | `NIK`, `No_KK`, `Kepala_Kel`, `Istri`, `Usia_Istri`, alamat RT/RW, kondisi rumah | HEAD `KECAMATAN_NONGSA.geojson` → **200, 47.368.302 byte**, Last-Modified 2 Nov 2026 |
| `Digitasi_Ruli.geojson`, `Ruli.geojson` (2026) | `Nama_KK`, `KTP`, `Alamat`, `Jum_Kel` | HEAD `Digitasi_Ruli.geojson` → 200, 3.999.701 byte |
| `Identifikasi_Bencana1.geojson` | `KK`, `NIK`, `Alamat`, RT/RW, status ekonomi | 8 KB pertama memuat field tersebut (nilainya tidak disalin) |
| `SHP_Rumah_Sewa_2-0.json` | `Pemilik`, `No_Kontak`, `Alamat` | tidak disentuh |
| Tabel "Daftar Data Rumah Terdampak Bencana" di `data-statistik-perumahan-permukiman` | `Nama Kepala Keluarga` | ada di HTML publik |

**Sikap kita:** layer-layer ini **jangan dipakai, diarsipkan, atau ditautkan** (UU No. 27/2022 tentang Pelindungan Data Pribadi). Pemilik proyek bisa mempertimbangkan memberi tahu Disperkimtan secara baik-baik (*responsible disclosure*). Itu keputusan pemilik; tidak ada pesan yang kami kirim.

### 2.5 Tabel layer

Kolom "Pakai?" berisi penilaian awal. Semua penggunaan butuh izin Disperkimtan (lihat 2.3).

| Layer (halaman) | Berkas | Ukuran | Last-Modified | Geometri | Field utama | Cakupan Batam | Pakai? |
|---|---|---|---|---|---|---|---|
| Perumahan Sekota Batam (`data-peta-perumahan-batam`) | `Perumahan_Sekota_Batam.geojson` | 1,37 MB | 24 Sep 2026 | Polygon | PERUMAHAN, PENGEMBANG, FUNGSI, LUAS, Kelurahan, Kecamatan, UPDATE_DAT | 799 perumahan, 9 kecamatan, 39 kelurahan (statistik situs); Batam punya 12 kecamatan | **Peta: tinggi.** Nama perumahan adalah "alamat" warga Batam, berguna untuk pencarian, label, dan geocoding kasar. |
| Perumahan Subsidi (`…-perumahan-subsidi`) | `Perumahan_Subsidi.json` | 97 KB | 9 Des 2025 | Polygon | PERUMAHAN, PENGEMBANG, TOTAL_UNIT, UNIT_SUBSI, UNIT_KOMER, SUMBER_DAT "sikumbang.tapera.go.id - 2025" | 60 perumahan / 13.452 unit subsidi (statistik) | Sedang. Sumber primernya SiKumbang Tapera; lebih baik ambil langsung dari sana. |
| Unit Rumah (`…-unit-rumah`) | `api/api_geojson_unit_rumah_sekota_batam.php` | – | – | ? | Alamat, RT, RW, Kawasan | – | **Rusak (404).** Datanya level alamat, jadi jangan dipakai. |
| Rumah Diatas Air (`…-rumah-diatas-air`) | `Rumah_Diatas_Air.geojson` | 220 KB | 23 Feb 2026 | Polygon | NAMA (klaster kampung), JML_RMH, LOKASI, KEL, KEC | 10.405 rumah (statistik) | Arsip / peta tematik kampung pelantar. Bisa ditampilkan agregat. |
| Serah Terima PSU (Fasos) dan Fasos Lapangan & RTH (`…-serah-terima-fasos`) | `PSU_ST10.geojson` | 1,83 MB | 9 Des 2025 | (Multi)Polygon | PERUMAHAN, PENGEMBANG, FUNGSI (FASOS, PL KAWASAN, …), LUAS, NO__SERTIF, TGL_SERTIF, STATUS_PSU | 214 lokasi serah terima | **Peta: tinggi** bila FUNGSI dipilah (taman, lapangan, RTH). Perlu QA nilai FUNGSI. |
| Permohonan PSU (`…-psu`) | `PSUSTX_28.geojson` | 5,50 MB | 9 Des 2025 | Polygon | sama seperti di atas | 479 lokasi permohonan | Arsip. Besar; sederhanakan sebelum masuk PMTiles. |
| Jalan Lingkungan PSU (`…-serah-terima-jalan-lingkungan`) | `PSU_UTILITASS.geojson` | 2,07 MB | 9 Des 2025 | (Multi)LineString | RUAS_JALAN, PANJANG, ROW, JENIS (BETON), KONDISI, STATUS_PSU, WADMKC/WADMKD | jalan perumahan yang sudah diserahkan | Arsip. Jalan sudah ada di OSM. |
| PJU (`…-pju`) | `PJU-0.json` | 1,59 MB | 9 Des 2025 | Point | Lokasi, Kel, Kec, Tahun (mulai 2020), SumberDana, Jml_Unit, KONTRAKTOR, PERENCANA, PENGAWAS | titik PJU lingkungan | Arsip / transparansi. |
| PJU 2026 (`…-pju-2026`) | `data-pju-2026-v2.geojson` | 1,94 MB | 27 Okt 2026 | Point | Uraian, Kel, Kec, Thn_Psg (mulai 2018), Kondisi, Pagu_Fisik, Nil_Kontra, Kontraktor, Stat_Aset | idem | Arsip / transparansi. Statistik situs hanya menyebut "12 titik", tidak konsisten dengan ukuran berkas. |
| Jalan Lingkungan (pekerjaan) (`…-infra-jalan-lingkungan`) | `Pemb_Jalan_polyline_v2.geojson` | 70 KB | 27 Okt 2026 | (Multi)LineString | Uraian, Kel, Kec, SD_Pmbgn (APBD), Thn_Bgn (2025), Pagu_Fisik, Nil_Kontra, No_Kontrak, Kontraktor | proyek APBD | **Fitur "proyek kota": tinggi.** Lokasi, tahun, dan nilai kontrak. |
| Drainase (`…-drainase`) | `Pemb_Drainase_polyline.geojson` | 18 KB | 27 Okt 2026 | (Multi)LineString | sama (Thn_Bgn 2026) | proyek APBD | Fitur proyek kota; relevan dengan konteks banjir. |
| Batu Miring (`…-batu-miring`) | `Pemb_Batumiring_polyline.geojson` | 59 KB | 27 Okt 2026 | LineString | sama (Thn_Bgn 2024–2025) | proyek APBD/APBDP | Fitur proyek kota. |
| Gedung Serbaguna (`…-gedung-serbaguna`) | `Pemb_GedungdanPemeliharaan_point.geojson` | 40 KB | 27 Okt 2026 | Point | Uraian, Kat_Pekerj, ThnBgn (2025), PaguFisik, NilKontrak | 3 unit (statistik) | Fitur proyek kota / fasilitas warga. |
| Lokasi Rusunawa (`…-lokasi-rusunawa`) | `lokasi_rusun.json` | 23 KB | 9 Des 2025 | Point | RUSUN, BLOK, KAMAR, TIPE, Harga_Lt1–4, KIOS, Harga_Kios, IMB, LOKASI | 31 twin blok, 7 lokasi, 2.811 sarusun Pemko | **Peta + Info Praktis: tinggi.** Lokasi dan tarif sewa rusunawa. |
| Aset Disperkimtan (`…-aset-disperkimtan`) | `aset-perkimtan/BIDANG PERMUKIMAN-0.json`, `BIDANG TAMAN-0.json` | 356 KB / 779 B | 9 Des 2025 | Point | Nama_Baran, Kode_Baran, Alamat (lokasi aset), Luas, Tanggal (tahun perolehan), Harga_Pero, BASH, Penyedia | 401 aset (320 permukiman, 81 taman) | Arsip. Berkas taman cuma 1 fitur; data taman tidak lengkap. |
| Kebun Raya Batam (`…-kebunraya`) | `kebun-raya/ZONA_TANAMAN.geojson`, `ZONA_CAMPURAN.geojson`, `SIRKULASI_JALAN.geojson` | 44 KB (tanaman) | 2 Nov 2026 | MultiPolygon (CRS84 eksplisit) | Zona, Keterangan, Nm_Tanaman, Shape_Area | satu kawasan | **Peta: sedang.** Peta detail kawasan wisata. |
| Lokasi Rawan Bencana (`peta-lokasi-rawan-bencana.php`) | `Bencana2025.geojson` | 86 KB | 9 Des 2025 | Point | JENIS_BENC, KEL, KEC, KERUGIAN, PERKIRAAN (biaya), TINDAK_LAN, STATUS_LAH, KEWENANGAN, ALAMAT | kejadian (contoh: Januari 2024), **bukan zonasi bahaya** | Arsip. Untuk peta, tampilkan agregat per kelurahan tanpa ALAMAT dan FOTO. |
| Delineasi Kawasan Ruli (`…-deleneasi-kawasan-ruli`) | `Delineasi_Kawasan_Ruli.geojson` (layer `RULI_POLY22feb2026`) | 48 KB | 23 Feb 2026 | Polygon | LOKASI, KELURAHAN, KECAMATAN, KK_RUMAH | 33.366 rumah liar (statistik) | **Jangan dipakai di peta.** Sensitif secara sosial (stigma, penggusuran). Paling jauh: angka agregat dengan konteks. |
| BNBA BKKBN (±ASN), Digitasi Ruli, Ruli 2026, Identifikasi Bencana, Rumah Sewa | lihat 2.4 | – | – | Polygon/Point | **data pribadi** | – | **Jangan.** |

### 2.6 Halaman statistik (✅, scraping HTML)

- `index.php?page=data-statistik`: kartu indikator tanpa tahun ("Tidak ada estimasi untuk nilai X atau riwayat tahunan"; sumber "Basis Data Terpadu Dinas Perkimtan"). Angkanya: unit rumah 377.759; backlog 118.000; rumah atas air 10.405; ruli 33.366; rumah sewa 1.447; rusunawa Pemko 2.811 sarusun; permohonan PSU 479 lokasi; serah terima PSU 214; perumahan komersil 799; subsidi 60; rumah terdampak bencana 377; identifikasi 296; pemakaman 3 lokasi (387.727 m²); RTH taman 11 lokasi (156.216 m²); taman lingkungan 88 lokasi (26.273 m²); jalur hijau 120 lokasi (1.706.167 m²).
  → Bisa jadi **kartu fakta "Perumahan & Permukiman"**, dengan catatan "snapshot, tanpa tahun". Beberapa angka janggal (PJU 12 titik, jalan lingkungan 424 m). Jangan dipakai tanpa cek ulang ke dinas.
- `index.php?page=data-statistik-perumahan-permukiman` (header "No update data") memuat tabel HTML berikut:
  - Daftar Perumahan (No, Nama, Kecamatan, Kelurahan, Developer, Tahun)
  - Perumahan Subsidi (Nama, Developer, Kec, Kel, Sumber, unit subsidi/komersial/total)
  - Serah Terima PSU (Nama, Developer, Tanggal Akta, No Akta, Notaris, Tahun)
  - Permohonan PSU (Nama, Developer, Kec, Kel, status)
  - Rumah Terdampak Bencana: **berisi nama KK, jangan diambil**

  Bisa di-scrape sebagai CSV arsip, kecuali tabel bencana.
- `index.php?page=data-statistik-aset-disperkimtan` ("Updated 10 months ago"): 401 aset, total harga perolehan Rp273.134.346.733, tabel per aset (FID, Bidang, Nama Barang, Kode Barang, Alamat lokasi, Tahun, Harga, BASH).

### 2.7 Penilaian untuk peta situs (MapLibre/PMTiles)

**Layak untuk peta, setelah izin dan pembersihan field:**
1. **Perumahan Sekota Batam.** Poligon nama perumahan, sangat berguna untuk konteks dan pencarian lokasi. Buang `FOTO` dan simpan `PERUMAHAN`, `Kecamatan`, `Kelurahan`, `UPDATE_DAT`.
2. **Rusunawa.** Titik dengan tarif sewa untuk layer layanan warga dan Info Praktis.
3. **Fasos/RTH dari `PSU_ST10`.** Taman dan lapangan lingkungan, setelah dipilah menurut `FUNGSI`.
4. **Proyek fisik (jalan lingkungan, drainase, batu miring, gedung serbaguna, PJU 2026).** Layer "Proyek Pemko" dengan tahun, sumber dana, dan nilai kontrak, untuk fitur transparansi.
5. **Kebun Raya.** Zona kawasan.

**Cukup untuk arsip menu Dataset (tautan dan deskripsi, tanpa mirror):** Perumahan Subsidi (lebih baik dari SiKumbang), Permohonan PSU, Jalan Lingkungan PSU, PJU lama, Aset, Rumah Diatas Air, Bencana2025 (agregat), dan tabel statistik.

**Jangan dipakai:** semua layer di 2.4 dan delineasi ruli.

**Teknis:** GeoJSON sudah WGS84, jadi alurnya `ogr2ogr -select …` untuk membuang field sensitif, lalu `tippecanoe -o disperkimtan_*.pmtiles`. Simpan terpisah per sumber dan cantumkan atribusi di `source.attribution` MapLibre. Ambil sekali setelah izin keluar, simpan versinya, dan catat `Last-Modified`. Data ini diperbarui tidak teratur: ada yang berstempel Desember 2025, ada yang Oktober–November 2026.

---

## 3. Rekomendasi singkat

1. **Menu Dataset, bagian statistik:** ambil dari **BPS Kota Batam** (term-of-use mengizinkan pemakaian ulang dengan atribusi). Pemilik perlu **mendaftar sendiri** untuk mendapat kunci WebAPI BPS. Kunci disimpan di env, lalu dipakai untuk menarik `pressrelease`, `indicators`, `data` (IHK, wisman, penumpang), dan SIMDASI (tabel per kecamatan) secara terjadwal saat build. DataKita cukup ditautkan sebagai portal BPS Kota Batam.
2. **Data peta Disperkimtan:** kirim permohonan izin ke `info@hangjebat.go.id` untuk lima layer di 2.7. Sertakan rencana atribusi dan pernyataan bahwa field pribadi tidak dipakai. Pertimbangkan juga menyampaikan temuan privasi di 2.4.
3. **Perbarui `research/11-geoportal.md` bagian 1** (tugas pemilik atau sesi berikutnya; repo tidak diubah di sini). Pertanyaan "Endpoint data ❓" sekarang terjawab: GeoJSON statis di `/assets/geojson/`, WGS84, tanpa WMS/WFS. Tautan Syarat & Ketentuan terbukti `javascript:void(0)`.
4. **Belum terverifikasi dan perlu riset lanjutan:** URL tabel BPS untuk penduduk per kecamatan, IPM, kemiskinan, pendidikan, dan kesehatan (butuh kunci API atau penelusuran manual), Satu Data Pemko (`satudata.batam.go.id`), dan DKB Disdukcapil per kelurahan.
