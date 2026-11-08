# Riset portal data terbuka untuk menu "Dataset" Batam City Hall

Tanggal riset: 8 November 2026. Semua angka di bawah diambil langsung dari respons server pada tanggal itu, kecuali bila disebut lain.

Portal yang diperiksa:

1. **Satu Data Kota Batam**: https://satudata.batam.go.id/data/
2. **Satu Data Provinsi Kepulauan Riau**: https://satudata.kepriprov.go.id/

---

## 0. Ringkasan

| | Satu Data Kota Batam | Satu Data Kepri |
|---|---|---|
| Platform | Aplikasi PHP buatan sendiri (pola URL CodeIgniter, template Bootstrap "Lumia"), halaman HTML dari server, tabel diisi DataTables lewat AJAX POST | Nuxt 2 (Vue, SSR) di depan, backend Laravel yang meniru API CKAN (`/api/3/action/...`) |
| robots.txt | **Tidak ada** (404), jadi tidak ada larangan | `Disallow: /data` untuk semua user-agent (dan khusus Googlebot) |
| Isi tentang Batam | 678 dataset tabel ("Dataset"), 27.539 indikator nilai tunggal ("Data", semua tingkat wilayah), 7.562 entri tingkat Kota Batam, 12 lapisan peta area + 38 lapisan titik (231 titik), 48 dokumen PDF | 1.535 dataset provinsi. Hanya **1** yang judulnya menyebut Batam. Sekitar 87 punya rincian per kabupaten/kota (Batam salah satu barisnya). Halaman "Data Kabupaten/Kota > Batam" hanya mencerminkan katalog Batam (684 entri) dan menautkan kembali ke satudata.batam.go.id |
| Format | JSON dan XLSX per dataset, katalog DCAT JSON, titik koordinat JSON | XLSX (1.641 dari 1.655 resource), PDF 8, XLS 2. Isi tabel tersedia sebagai JSON lewat `/api/datastore/{id}` |
| Tahun terbaru | Rilis 2026 (data tahun 2025) untuk sebagian kecil. Sebagian besar data tahun 2023–2024 | Metadata diperbarui hingga Oktober 2026. Datanya umumnya tahun 2022–2025 |
| Lisensi | **Tidak dinyatakan.** Halaman "Tentang" merujuk UU 14/2008 (KIP) untuk data publik. Footer: "© Hak Cipta Satu Data Kota Batam". DCAT tidak punya kolom `license` | **Tidak dinyatakan** untuk 1.533 dari 1.535 dataset (`license_id: notspecified`). 1 dataset ODC-BY. Halaman Syarat Penggunaan hanya berisi judul dan tautan ke dokumentasi API di `/data/docs/api`, yang dilarang robots, jadi tidak saya buka |
| Cara ambil terbaik | API JSON langsung (tanpa scraping HTML) | API JSON `/api/3/action/package_search` + `/api/datastore/{resource_id}`. **Jangan** pakai URL unduhan XLSX (`/data/resource/...`) karena dilarang robots |

Kesimpulan singkat: untuk situs kota, **Satu Data Batam adalah sumber utama**. Sumber ini punya rincian per kecamatan, titik koordinat sekolah negeri dan puskesmas, serta poligon batas kecamatan. Kepri berguna untuk **perbandingan Batam dengan kabupaten/kota lain** (penduduk, UMKM, wisman per pintu masuk, kemiskinan, TPT, kualitas udara). Kedua portal **tidak menyatakan lisensi terbuka**, jadi status hukum penggunaan ulang belum pasti. Lihat bagian 4.

---

## 1. Metode dan kepatuhan

- User-Agent: string peramban Chrome umum, tanpa nama atau email.
- Jeda 3 detik sebelum setiap permintaan (skrip `sd/get.sh`), berurutan, tanpa paralel.
- Jumlah permintaan: **Batam 31**, **Kepri 21**, **api-splp.layanan.go.id 2** (lihat log `sd/requests.log`).
- Tanpa login, tanpa captcha, tanpa menebak path. Semua endpoint ditemukan dari HTML atau JS yang dimuat halaman publik.
- Kepri: tidak ada satu pun permintaan ke path yang diawali `/data`. Path yang dipakai: `/robots.txt`, `/portal-kabkota-data/batam`, `/katalogdata`, `/katalogdata/rincian`, `/pages/term-of-use`, `/tentang`, `/_nuxt/*.js`, `/api/3/action/package_search`, dan `/api/datastore/{id}`.
- Berkas data: hanya contoh kecil (JSON 0,3–9 KB, satu XLSX 7 KB). Header `Range` diabaikan oleh kedua server, tetapi semua respons yang diambil memang kecil. Ada dua respons besar berupa metadata (bukan berkas data): daftar katalog Batam 3,3 MB dan metadata Kepri 7 MB dalam dua permintaan. Berkas JS poligon kecamatan (~1 MB) juga ikut terambil penuh karena server mengabaikan `Range`. Berkas itu aset statis yang memang dimuat halaman peta.
- Tidak ada data pribadi yang disalin. Nama lokasi di berkas titik adalah nama sekolah, puskesmas, dan rumah sakit (fasilitas, bukan orang).

---

## 2. Satu Data Kota Batam (satudata.batam.go.id)

### 2.1 Platform dan cara kerja

- `https://satudata.batam.go.id/` mengalihkan (302) ke `http://satudata.batam.go.id/welcome/`. Aplikasi data berada di `/data/`.
- Halaman HTML dirender server. Tabel daftar memakai **DataTables server-side** yang memanggil endpoint POST dan menerima JSON.
- Tidak ada `robots.txt` (404, halaman galat Diskominfo).
- Pengelola: Sekretariat Forum Satu Data Kota Batam dan Diskominfo Kota Batam. Dasar hukumnya Perwako Batam No. 47/2019.

### 2.2 Endpoint yang terbukti bekerja

Semua tanpa autentikasi. Contoh di bawah dijalankan dengan `curl`.

**a. Daftar semua entri tingkat Kota Batam** (dipakai `/data/wilayah/kota-batam`)
```
POST https://satudata.batam.go.id/data/home/ajaxKotaBatam
Content-Type: application/x-www-form-urlencoded
draw=1&start=0&length=10&search[value]=&search[regex]=false
```
Respons: `{"draw":"1","recordsTotal":7562,"recordsFiltered":7562,"data":[[1,"-","<a href='.../data/detail/{slug}'>Judul</a>","<a ...>Urusan</a>","Kota Batam","2025","-"], ...]}`. Kolom berisi potongan HTML, jadi tautan dan judul harus diurai. `length=-1` mengembalikan semuanya (3,3 MB).

**b. Daftar "Dataset" (tabel multi-kolom, `is_group=1`)**: 678 entri
```
POST https://satudata.batam.go.id/data/publik/homereaddataset
```
Endpoint ini **wajib** diberi parameter kolom DataTables lengkap (`columns[i][data]`, `columns[i][name]`, `order[0][column]=2`, dst.). Tanpa itu server membalas **500**. Generator parameternya ada di `sd/dtparams.py`. Filter tambahan: `param_keyword`, `param_urusan[]`, `param_kecamatan[]`, `param_kelurahan[]`, `param_tahun[]`, `param_semester[]`, `param_produsen_data[]`.
Respons berupa objek bersih:
```json
{"id":"54012","opd":"disdukcapil","slug":"statistik-jumlah-penduduk-menurut-pekerjaan-tahun-2022-mallhi",
 "urusan_slug":"adminduk_capil","series_id":"eaMcWU2DMLyP","kecamatan":"Kota Batam",
 "pertanyaan":"Statistik Jumlah Penduduk Menurut Pekerjaan Tahun 2025","satuan":"jiwa","tahun":"2026",
 "semester":"0","is_group":"1","release_date":"2026-03-10","updated_at":"2026-04-27 10:45:24",
 "urusan_nama":"Administrasi Kependudukan dan Pencatatan Sipil","name":"Dinas Kependudukan dan Pencatatan Sipil Kota Batam"}
```

**c. Daftar "Data" (indikator nilai tunggal, `is_group=0`)**: 27.539 entri, semua tingkat wilayah
```
POST https://satudata.batam.go.id/data/publik/homereaddata   (parameter sama seperti b)
```
Objeknya sama, ditambah `value` (mis. `"value":"36"`). Contoh filter `param_kecamatan[]=Sekupang` menghasilkan 1.724 entri. Filter kelurahan (`Tiban Baru`) menghasilkan **0**, artinya data tingkat kelurahan praktis tidak ada.

**d. Isi satu dataset: JSON**
```
GET https://satudata.batam.go.id/data/json/{slug}
```
Contoh `.../data/json/statistik-jumlah-kepala-keluarga-berjenis-kelamin-laki-laki-dan-perempuan-menurut-kecamatan-di-kota-batam-tahun-2025-yrdvdr` (852 byte):
```json
{"kode_referensi":"-","judul":"Statistik Jumlah Kepala Keluarga ... Tahun 2025","produsen_data":"Dinas Kependudukan dan Pencatatan Sipil Kota Batam",
 "wilayah":"Kota Batam","satuan":"Orang","tanggal_rilis":"03 Feb 2026",
 "data":{"Kepala Keluarga (Laki-laki)":{"Belakang Padang":"5.681","Bulang":"3.429", ...},
         "Kepala Keluarga (perempuan)":{"Belakang Padang":"1.807", ...}}}
```
Untuk indikator tunggal, `data` berupa string. Contoh banjir 2025: `"data":"1"`, ditambah `sumber_data`, `tahun`, dan `bulan`.

**e. Isi satu dataset: Excel**
```
GET https://satudata.batam.go.id/data/excel/{slug}
```
Mengembalikan XLSX asli (~7 KB, `Content-Disposition: attachment; filename=2026-11-08-<judul>.xlsx`) tetapi dengan `Content-Type: text/html`. Permintaan **HEAD menghasilkan 404**, jadi gunakan GET. Setiap unduhan JSON atau Excel menambah penghitung "Jumlah di Download" di halaman detail. Sebaiknya di-cache dan tidak diambil berulang.

**f. Katalog DCAT (Project Open Data v1.1)**: 684 dataset, ~1 MB
```
GET https://satudata.batam.go.id/data/apisplp/apinasional/splp
```
Sama persis dengan yang disajikan gateway nasional SPLP:
`GET https://api-splp.layanan.go.id/SatuDataPemerintahKota_Batam/1.0` (CORS `*`, tanpa kunci API). Isi per dataset: `title`, `theme`, `issued`, `landingPage`, `identifier` (UUID), `publisher`, `contactPoint` (alamat institusi), dan `distribution[]` (URL json dan excel). **Tidak ada kolom `license` maupun `rights`.** `mediaType` selalu ditulis `text/csv`, padahal isinya JSON atau XLSX. Ini cara termudah memantau dataset baru.

**g. Peta titik dan area**
```
POST https://satudata.batam.go.id/data/home/select2-geospasial
searchTerm=
```
Mengembalikan `results[]` dengan dua grup:
- **Peta Area** (12 lapisan, `type:"area"`): nilai per kecamatan dalam `str_nilai` (array 12 baris mengikuti urutan Batam Kota, Batu Aji, Batu Ampar, Belakang Padang, Bengkong, Bulang, Galang, Lubuk Baja, Nongsa, Sagulung, Sei Beduk, Sekupang). Data tahun 2021–2022, kecuali hotel 2025.
- **Peta Koordinat** (38 lapisan, `type:"titik"`): `lokasi` (array nama) dan `point` (array `{lat,lng}`). Total **231 titik**: SD negeri 115 (11 kecamatan, **Bengkong tidak ada**), SMP negeri 64, puskesmas 28, "Fasilitas Pelayanan Kesehatan" 21 (rumah sakit, klinik, puskesmas), "Pelayanan Pendidikan" 3. Contoh: `"Puskesmas Botania" → {"lat":"1.1304969","lng":"104.064335"}`. Tidak ada alamat, tanggal, atau sumber koordinat.

**h. Poligon batas 12 kecamatan**
```
GET https://satudata.batam.go.id/data/frontend/lumia/js/kecamatan.js
```
Berkas JS (bukan GeoJSON), ~990 KB, `Last-Modified: 12 Jan 2026`. Isinya variabel `kecBatuAji`, `kecNongsa`, … `kecBulang` berupa array cincin `{lat,lng}`, ~12.284 titik. Mudah dikonversi ke GeoJSON. Sumber dan lisensinya tidak disebutkan.

**i. Dokumen**: `GET https://satudata.batam.go.id/data/buku`. Berisi 48 publikasi: Buletin Statistik Sektoral bulanan 2023–Des 2025, Buku/Kompilasi Statistik Sektoral 2019–2024, Profil Data Gender/Anak, dan profil dinas. Tombol "Unduh dokumen" mengarah ke **Google Drive** (contoh `https://drive.google.com/file/d/1XcT095U7gEuoxI8jE3ohK6GtQJw4Y6Uu/view`), bukan berkas di server. Tidak saya unduh.

### 2.3 Isi katalog

- **"Dataset" (678 tabel)**: tahun 2022: 13, 2023: 287, 2024: 170, 2025: 170, 2026: 38. Ukuran tiap berkas JSON ~0,3–10 KB.
  Topik terbanyak: Adminduk 77, Kesehatan 53, PPPA 50, Pertanian 45, Pendidikan 42, Tenaga Kerja 41, Kelautan & Perikanan 40, Sosial 35, PU & Penataan Ruang 29, Perkim 26, Perpustakaan 26, Kepemudaan & Olahraga 24, PP & KB 23, Perhubungan 19, Koperasi & UKM 18, Perindustrian 17, Keuangan 16, Kepegawaian 15, Pangan 15, Trantibum 14, Pariwisata 13, Lingkungan Hidup 10, lainnya < 10.
- **Entri tingkat Kota Batam (7.562, hanya 2.949 judul unik)**. Banyak judul berulang per periode ("… pada Bulan Juni", semester). Kolom tahun: 2020: 362, 2021: 764, 2022: 930, 2023: 1.979, 2024: 2.130, 2025: 1.261, 2026: 9. Topik terbanyak: Pangan 1.325, Kesehatan 631, Kepegawaian 514, Keuangan 509, Kepemudaan 347, Tenaga Kerja 336, Penanaman Modal 324, Adminduk 310, Pendidikan 292, Sosial 289, Pariwisata 228, Perhubungan 194, BPBD hanya 8.
- **Tingkat wilayah**: hampir semua dataset tabel memakai kecamatan sebagai baris atau kolom (132 judul "menurut kecamatan"). Data tingkat kelurahan hampir tidak ada.
- **Yang tidak ada**: daftar tempat ibadah (hanya jumlah penduduk per agama), curah hujan atau cuaca, daftar UMKM bernama, alamat fasilitas, rute atau halte Trans Batam berkoordinat, objek wisata bernama atau berkoordinat (hanya jumlah), bandara.

### 2.4 Dataset unggulan Batam untuk situs kota

Pola URL: halaman `https://satudata.batam.go.id/data/detail/{slug}`, JSON `https://satudata.batam.go.id/data/json/{slug}`, Excel `https://satudata.batam.go.id/data/excel/{slug}`. Lisensi semua entri: **tidak dinyatakan** (lihat 2.6).

| Judul | Topik | Format | Tahun data | Slug (halaman/JSON/Excel) | Catatan kualitas |
|---|---|---|---|---|---|
| Peta Koordinat: SD negeri, SMP negeri, puskesmas, faskes (38 lapisan) | Fasilitas umum | JSON (POST `home/select2-geospasial`) | tidak dinyatakan | API g di atas, hasil ekspor: `sd/b_geospasial_titik.csv` | 231 titik. 4 di luar kotak kasar Batam (SDN 001 dan 020 Galang, SDN 013 dan 015 Belakang Padang). 1 koordinat kosong (SMP Sagulung). 8 pasangan koordinat ganda. Lapisan Nongsa SMP ganda. SD Bengkong tidak ada. Harus diverifikasi sebelum tampil di peta |
| Batas 12 kecamatan (poligon) | Geografis | JS array lat/lng | file 12 Jan 2026 | `/data/frontend/lumia/js/kecamatan.js` | Sumber dan skala tidak disebut. Bandingkan dengan batas resmi sebelum dipakai |
| Statistik Jumlah Penduduk berdasarkan Umur dan Jenis Kelamin menurut Kecamatan, 2024 Sem. 1 | Kependudukan | JSON/XLSX | 2024 S1 (rilis 8 Jan 2025) | `statistikjumlahjumlahpendudukberdasarkanumurdanjeniskelaminmenurutkecamatandikotabatamtahun2024semester120250kotabatamiymjj8` | 32 komponen (16 kelompok umur × L/P) × 12 kecamatan. Dataset populasi per kecamatan paling lengkap |
| Statistik Jumlah Kepala Keluarga L/P menurut Kecamatan, 2025 | Kependudukan | JSON/XLSX | 2025 (rilis 3 Feb 2026) | `statistik-jumlah-kepala-keluarga-berjenis-kelamin-laki-laki-dan-perempuan-menurut-kecamatan-di-kota-batam-tahun-2025-yrdvdr` | Batu Aji L = P = 12.903 (kemungkinan salah ketik) |
| Statistik Jumlah Penduduk berdasarkan Agama dan JK menurut Kecamatan, 2024 Sem. 1 | Kependudukan | JSON/XLSX | 2024 S1 | `statistikjumlahpendudukberdasarkanagamadanjeniskelaminmenurutkecamatandikotabatamtahun2024semester120250kotabatamtvfhpu` | Isi belum saya unduh |
| Statistik Jumlah Hotel menurut Kecamatan, 2022–2024 | Pariwisata | JSON/XLSX | 2022–2024 | `statistikjumlahhotelmenurutkecamatan2c2022-202320250kotabatamk2t8pc` | Nilai 2024 identik dengan 2022. Lapisan peta "Jumlah Hotel per Kecamatan" (2025) berbeda angkanya (Lubuk Baja 125 vs 144). Ini jumlah unit, **bukan pajak hotel** |
| Statistik Jumlah Wisatawan Mancanegara, 2022–2024 | Pariwisata | JSON/XLSX | 2022–2024 | `statistikjumlahwisatawanmancanegara2c2022-202320250kotabatamzo7qdx` | Belum diunduh |
| Jumlah Obyek Daya Tarik Wisata (indikator) | Pariwisata | JSON/XLSX | 2025 | `jumlah-obyek-daya-tarik-wisata-2025-0-kota-batam-ihxpma` | Hanya angka total, tanpa daftar nama |
| Statistik Fasilitas Kesehatan menurut Jenis, 2021–2024 | Kesehatan | JSON/XLSX | 2021–2024 | `statistikfasilitaskesehatanmenurutjenistahun2021-2023202509kebdl` | Slug menyebut 2021–2023, judul 2021–2024 |
| Jumlah Puskesmas, Jumlah Rumah Sakit (indikator) | Kesehatan | JSON/XLSX | 2025 | `jumlah-puskesmas-2025-0-kota-batam-mivolp`, `jumlah-rumah-sakit-2025-0-kota-batam-ocmyiy` | Nilai tunggal |
| Statistik Jumlah SD / SMP / TK Negeri dan Swasta, 2025 | Pendidikan | JSON/XLSX | 2025 (rilis 14 Jan 2026) | `statistik-jumlah-sd-berdsarkan-status-negeri-dan-swasta-tahun-2025-bhmc0e`, `statistik-jumlah-smp-berdsarkan-status-negeri-dan-swasta-tahun-2025-0lkxda`, `statistik-jumlah-tk-berdsarkan-status-negeri-dan-swasta-tahun-2025-ly0dqv` | Data jumlah, tanpa daftar sekolah |
| Statistik Jumlah Guru SD menurut Kecamatan, 2025 | Pendidikan | JSON/XLSX | 2025 | `statistik-jumlah-guru-sd-menurut-kecamatan-berdsarkan-status-negeri-dan-swasta-tahun-2025-osrans` | |
| Penumpang Trans Batam per semester (e-ticketing) | Transportasi | JSON/XLSX | 2023 S1 dan 2024 S1 | `penumpangtransbatampersemesterdengane-ticketing20250kotabatamkrvljh` | 2023 S1 = 1.103 vs 2024 S1 = 128.131. Hampir pasti ada salah input atau definisi. Jangan dipakai tanpa konfirmasi |
| Jumlah Armada Bus Trans Batam (indikator) | Transportasi | JSON/XLSX | 2025, Juni | `jumlah-armada-bus-trans-batam-2025-0-kota-batam-tzpz9s` | Nilai 50 unit. Sumber: UPTD Transportasi |
| Panjang Jalan yang Dilalui Trans Batam / Jumlah Koridor | Transportasi | JSON/XLSX | 2025 | `panjang-jalan-yang-dilalui-trans-batam-2025-0-kota-batam-1xespq`, `panjang-jalan-kota-batam-untuk-melayani-masyarakat-2025-0-kota-batam-kpwbcc` | Slug koridor tidak cocok dengan judulnya |
| Statistik Jumlah Arus Penumpang (pelabuhan) | Transportasi | JSON/XLSX | ≤2023 | `statistik-jumlah-arus-penumpang-l5tqag` | Data lama |
| Perlintasan WNI/WNA di TPI Batam per semester | Imigrasi | JSON/XLSX | 2025 | `statistikjumlahperlintaswnidanwnayangmasukdankeluarwilayahriditempatpemeriksaanimigrasibatamdikotabatampersemester20250kotabatamktf8co` | |
| Jumlah Kejadian Bencana Banjir / Tanah Longsor / Puting Beliung / Cuaca Ekstrem / Kebakaran Permukiman | Bencana | JSON/XLSX | 2025 (rilis 6 Jan 2026) | `jumlah-kejadian-bencana-banjir-di-kota-batam-2025-0-kota-batam-b7y6l2`, `...-tanah-longsor-...-uvooqy`, `...-angin-puting-beliung-...-yiiqbq`, `...-cuaca-ekstrem-...-lv7tyz`, `...-kebakaran-pemukimanfasilitas-umum-dll-...-nut1sh` | Banjir 2025 = 1 kejadian, definisinya "laporan kepada BPBD". Jangan disajikan sebagai jumlah banjir sebenarnya |
| Statistik Penanganan Kebakaran dan Non-Kebakaran per Semester | Bencana | JSON/XLSX | 2023–2024 | `statistikjumlahpenanganankebakarandannonkebakarandikotabatampersemester20250kotabatambvjd4z` | |
| Statistik Jumlah Korban Bencana, 2022–2023 | Sosial | JSON/XLSX | 2022–2023 | `statistikjumlahkorbanbencana2c2022-202320250kotabatamgkaaxw` | |
| Statistik Koperasi Aktif dan Tidak Aktif menurut Kecamatan, 2024 | UMKM/Koperasi | JSON/XLSX | 2024 | `statistikjumlahkoperasiaktifdankoperasitidakaktifmenurutkecamatantahun202320250vxpuul` | Tidak ada dataset UMKM di Batam. Pakai data Kepri (bagian 3) |
| Statistik Jumlah Wirausaha | Ekonomi | JSON/XLSX | 2025 | `statistik-jumlah-wirausaha-di-kota-batam-aroghd` | |
| Statistik Pencari Kerja Terdaftar menurut Kecamatan, 2025 | Tenaga kerja | JSON/XLSX | 2025 | `statistik-jumlah-pencari-kerja-terdaftar-menurut-jenis-kecamatan-tahun-2025-tgmwop` | |
| Statistik Pengangkutan dan Pengelolaan Sampah, 2021–2024 | Lingkungan | JSON/XLSX | 2021–2024 | `statistikjumlahpengangkutandanpengelolaansampahdikotabatam2ctahun2021-202320250dzrscy` | Satuan "%" untuk tabel campuran |
| Statistik Penduduk Terlayani Air Bersih, 2021–2024 | Infrastruktur | JSON/XLSX | 2021–2024 | `statistikjumlahpendudukterlayaniairbersihdikotabatam2c2021-202320250kotabatamxnbihl` | |
| Panjang Jalan Kondisi Baik / Rusak, 2023–2025 | Infrastruktur | JSON/XLSX | 2023–2025 | `statistik-panjang-jalan-kondisi-baik-di-kota-batam-tahun-2023-2025-oeacw5`, `panjang-jalan-kondisi-rusak-di-kota-batam-tahun-2023-2025-tvc9yb` | Satuan "unit" untuk panjang jalan (keliru) |
| Persentase Luasan Permukiman Kumuh, 2021–2024 | Perumahan | JSON/XLSX | 2021–2024 | `statistikpersentaseluasanpermukimankumuhdikawasanperkotaan2ctahun2021-202320250n4ndam` | Judul persentase, satuan "Ha" |
| Jumlah Pasar Tradisional/Rakyat | Ekonomi | JSON/XLSX | 2025 | `jumlah-pasar-tradisionalrakyat-2025-0-kota-batam-ylgcrc` | Hanya jumlah |
| Buku/Kompilasi Statistik Sektoral 2019–2024, Buletin bulanan | Publikasi | PDF (Google Drive) | s.d. Des 2025 | `https://satudata.batam.go.id/data/buku` | Cocok sebagai tautan, bukan sumber data mesin |

Katalog lengkap ada di berkas pendukung (bagian 5).

### 2.5 Masalah kualitas umum (Batam)

1. Angka berupa **string dengan titik ribuan** ("352.111"), kadang `0` numerik bercampur string. Wajib diparse.
2. **Nama kecamatan tidak konsisten**: "Sei Beduk", "Sungai Beduk", "Sungai beduk". Normalisasi sebelum join.
3. **Kolom "Tahun" di daftar ≠ tahun data**. Contoh: "…Pekerjaan Tahun 2025" bertahun 2026, dan slug-nya menyebut 2022. Selalu baca `judul`/`tahun` di JSON.
4. **Slug dan judul sering tidak cocok** karena dataset disalin dari tahun sebelumnya. Jangan menebak isi dari slug.
5. **Duplikasi**: 7.562 entri tetapi hanya 2.949 judul unik. Beberapa dataset ada dua versi dengan slug berbeda untuk periode yang sama.
6. **Lapisan Peta Area berisi kesalahan nyata**: "Jumlah penduduk per Kecamatan" (2022) memberi Bulang = 189.034, sama dengan Batam Kota. "Jumlah Penduduk" memberi Batu Aji laki-laki = 0. Lapisan SD per kecamatan memuat angka guru di baris Batu Ampar. **Jangan dipakai.** Ambil dari dataset JSON-nya.
7. Satuan keliru di beberapa dataset (jalan "unit", kumuh "Ha"). Deskripsi, konsep, dan definisi sering kosong ("-").
8. Beberapa angka meragukan (Trans Batam, hotel 2024 = 2022, KK Batu Aji). Cantumkan "angka dari sumber, belum diverifikasi" atau kirim koreksi ke pengelola.

### 2.6 Lisensi, ToS, robots (Batam)

- `robots.txt`: tidak ada (404). Tidak ada larangan crawling. Tetap pakai jeda dan cache.
- Halaman `https://satudata.batam.go.id/data/tentang` menyatakan bahwa data publik di portal "dapat diakses secara terbuka sebagaimana diatur dalam Undang-undang nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik". **Tidak ada pernyataan lisensi** (CC BY, ODC, atau lainnya). Footer: "© Hak Cipta Satu Data Kota Batam".
- DCAT `/data/apisplp/apinasional/splp` tidak memuat `license`/`rights`.
- Tidak ditemukan halaman syarat penggunaan.
- Kesimpulan: **lisensi tidak dinyatakan; jangan diklaim CC BY 4.0.** Pakai dengan atribusi jelas ("Sumber: Satu Data Kota Batam, <produsen data>, diakses <tanggal>") dan tautan ke halaman detail. Idealnya minta konfirmasi tertulis ke satudata@batam.go.id.

---

## 3. Satu Data Provinsi Kepulauan Riau (satudata.kepriprov.go.id)

### 3.1 Platform dan cara kerja

- Frontend **Nuxt 2** (SSR). Data awal tertanam di `window.__NUXT__` di HTML.
- Backend meniru **API CKAN 3**. Respons membawa field CKAN (`license_id`, `resources`, `datastore_active`) plus jejak Laravel (`laravel_through_key`). `help` menunjuk ke `https://sdi.kepriprov.go.id/api/3/action/help_show?...`.
- Header `x-ratelimit-limit: 120` (per menit, tipikal Laravel).
- **Halaman `/portal-kabkota-data/batam`** tidak menyimpan data Batam sendiri. Halaman ini memanggil `https://api-splp.layanan.go.id/SatuDataPemerintahKota_Batam/1.0` (DCAT milik Batam, 684 entri), lalu menautkan setiap judul ke `satudata.batam.go.id/data/detail/...`. Jadi **duplikat katalog Batam**, bukan sumber tambahan.
- Halaman detail dataset: `/katalogdata/rincian?id={name}`. Tombol "Unduh CSV/JSON" dibangun di peramban dari `GET /api/datastore/{resource_id}`.

### 3.2 Endpoint

**Boleh (tidak di bawah `/data`) dan terbukti bekerja:**

a. Pencarian katalog (CKAN-like)
```
GET https://satudata.kepriprov.go.id/api/3/action/package_search?q=&rows=1000&start=0
```
Respons: `{"help":"...","success":true,"result":{"count":1535,"facets":[],"results":[{...paket CKAN...}]}}`. `rows=1000` dilayani (1000 baris, ~4 MB). `q=batam` hanya cocok 1 paket. Pencarian tampaknya pada judul. Halaman katalog juga memakai `fq` dan `GET /api/3/action/group_list` (tidak saya uji terpisah).

b. Isi tabel resource (pengganti unduh XLSX)
```
GET https://satudata.kepriprov.go.id/api/datastore/{resource_id}
```
Respons: array JSON baris. Contoh `51f57999-a618-4c7c-acf8-5f61d3622704` (Puskesmas Kota Batam 2022):
```json
[{"_id":3,"_full_text":"...","KODE WILAYAH":"21.71","NAMA WILAYAH":"Kota Batam","FASILITAS KESEHATAN":"Puskesmas Non Rawat Inap",
  "KEMENKES":"0.0","PEM.KAB/KOTA":"21","SWASTA":"0.0","JUMLAH":"21"}, ...]
```
Seluruh tabel dikirim sekaligus (1–5 KB per resource yang saya coba).

**Dilarang robots (`Disallow: /data`). Tidak saya akses dan jangan dipakai:**
- URL unduhan berkas: `https://satudata.kepriprov.go.id/data/resource/{id}/download/{nama}.xlsx` (semua `resources[].url` berbentuk ini).
- Dokumentasi API `https://satudata.kepriprov.go.id/data/docs/api` (ditautkan dari Syarat Penggunaan).
- Panel login `/data/panel/login`.
- Catatan: aturan `Disallow: /data` berlaku sebagai **awalan**, sehingga juga mencakup path seperti `/dataset…` atau `/datastore…` di root. Endpoint `/api/datastore/...` aman karena diawali `/api`.

### 3.3 Isi katalog

- **1.535 dataset, 1.655 resource**: XLSX 1.641, PDF 8, XLS 2, tanpa format 4. 1.627 resource punya `datastore_active: true`, 17 punya `datastore_error`. Total ukuran berkas ~42 MB (median 11,7 KB, maksimum 161 KB).
- `metadata_modified`: 2024: 270, 2025: 481, 2026: 784.
- Grup (topik): Pemerintahan Umum 279, Pendidikan dan Tenaga Kerja 208, Ekonomi dan Industri 187, Perlindungan Sosial dan Kesehatan 131, Ketertiban Umum dan Keselamatan 72, Pembangunan Daerah 50, Lingkungan dan SDA 48, Budaya dan Agama 39, Pendukung Umum 27.
- Organisasi terbanyak: Dinas Pendidikan 171, Dinas Kesehatan 149, Ketahanan Pangan/Pertanian 108, BKAD 80, Dinas Pariwisata 77, Biro Organisasi 72.
- **Relevansi untuk Batam**: hanya 1 judul menyebut Batam. ~87 dataset punya rincian per kabupaten/kota. Banyak dataset 2026 berupa indikator kinerja tingkat provinsi (satu baris total provinsi, mis. "Jumlah Kunjungan Wisatawan Mancanegara" 2023–2025 = total Kepri saja). Ini **tidak** berguna untuk situs kota.

### 3.4 Dataset unggulan Kepri yang memuat baris Kota Batam

Halaman: `https://satudata.kepriprov.go.id/katalogdata/rincian?id={name}`. API data: `https://satudata.kepriprov.go.id/api/datastore/{resource_id}`. Lisensi semua: `notspecified` ("License not specified").

| Judul | Topik | Format asli | Tahun | name (halaman) | resource_id (API) | Catatan kualitas |
|---|---|---|---|---|---|---|
| Jumlah Penduduk menurut Kab/Kota di Prov. Kepri 2019–2023 | Kependudukan | XLSX | 2019–2023 | `jumlah-penduduk-menurut-kabupatenkota-di-provinsi-kepulauan-riau-tahun-2019-2023` | `c31fbfb6-3498-4eaf-a65c-777063d15e0a` (juga `ad27619a-8423-4c41-a954-9d388c0df043`) | Batam 2023 = 1.240.792. Ada kolom sampah `"11"` |
| Jumlah UMKM berdasarkan Kab/Kota 2025 | UMKM | XLSX | 2025 (dimutakhirkan 17 Sep 2026) | `jumlah-usaha-mikro-kecil-dan-menengah-umkm-di-provinsi-kepulauan-riau-berdasarkan-kabupatenkota-tahun-2025` | `b0e5fc74-887b-4369-85c4-458e092dce23` | Batam: mikro 99.563, kecil 181, menengah 111, total 99.855 |
| Data UMKM di Prov. Kepri 2023–2024 | UMKM | XLSX | 2023–2024 | `data-umkm-di-provinsi-kepulauan-riau-tahun-2023-2024` | `e883f812-ee77-45e7-a64f-8359fbc15d9c` | Belum diperiksa isinya |
| Perkembangan Kunjungan Wisman berdasarkan Pintu Masuk 2023 | Pariwisata | XLSX | 2022–2023 | `perkembangan-kunjungan-wisatawan-mancanegara-berdasarkan-pintu-masuk-dinas-pariwisata-provinsi-kepulauan-riau-tahun-2023` | `54f7fc69-0c0a-4a55-b43c-003a2f502055` | Batam 2023 = 1.192.931 (77,92% Kepri) |
| Jumlah Fasilitas Kesehatan menurut Kepemilikan di Wilayah Kota Batam 2022 | Kesehatan | XLSX ×4 | 2022 | `jumlah-fasilitas-kesehatan-menurut-kepemilikan-di-wilayah-kota-batam-tahun-2022` | RS `fdfcdae3-03bf-440b-991a-a9aed7fcf7b4`, Puskesmas `51f57999-a618-4c7c-acf8-5f61d3622704`, sarana lain `1ff5f737-47c5-4d29-9c89-572a84200850`, farmasi `7db40dd2-2847-4509-bc64-60cf252adda3` | Satu-satunya dataset khusus Batam. Puskesmas rawat inap = 0 dan pustu = 0, meragukan |
| Persentase Penduduk Miskin per Kab/Kota 2023 | Sosial | XLSX | 2023 | `persentase-penduduk-miskin-per-kabupatenkota-tahun-2023` | `5baf5ca0-7c66-4565-a107-515cb6cae87b` | Belum diperiksa |
| Evaluasi TPT berdasarkan Kab/Kota 2019–2023 | Tenaga kerja | XLSX | 2019–2023 | `evaluasi-tingkat-pengangguran-terbuka-berdasarkan-kabupatenkota-provinsi-kepri-tahun-2019-2023` | `31d918af-4be4-4583-84b3-79637f6d5220` | Belum diperiksa |
| Indeks Kualitas Udara Kab/Kota se-Prov. Kepri | Lingkungan | XLSX | 2023 | `indeks-kualitan-udara-kabupatenkota-se-provinsi-kepri` | `92a903d2-7a30-4a9c-a563-580c89744c6a` | Batam 2023: target 86,3, capaian 84,12 ("Baik"). Satu angka per tahun, bukan pemantauan harian |
| Jumlah Pulau menurut Kab/Kota 2023 | Geografi | XLSX | 2023 | `jumlah-pulau-menurut-kabupatenkota-di-provinsi-kepulauan-riau-tahun-2023` | `709919e8-3ceb-4797-9b7e-c90e09411e43` | Belum diperiksa |
| Jumlah Rumah Sakit menurut Kab/Kota 2022 | Kesehatan | XLSX | 2022 | `jumlah-rumah-sakit-menurut-kabupaten-kota-provinsi-kepulauan-riau-tahun-2022` | `cce84f7d-1c6c-42b1-b0a7-c63b7a9a56c4` | |
| Jumlah Posyandu Aktif menurut Kab/Kota 2022 | Kesehatan | XLSX | 2022 | `jumlah-posyandu-aktif-menurut-kabupaten-kota-se-provinsi-kepulauan-riau-tahun-2022` | `91776619-ee81-4f0a-8076-a4f4daba8375` | |
| Prevalensi Stunting se-Prov. Kepri 2021–2024 | Kesehatan | XLSX | 2021–2024 | `prevalensi-stunting-se-provinsi-kepulauan-riau` | `70104d6e-cdd6-434b-85ea-8ada349305b4` | |
| % RT Akses Air Minum Layak per Kab/Kota | Infrastruktur | XLSX ×2 | belum dicek (dimutakhirkan 7 Sep 2026) | `persentase-rumah-tangga-yang-memiliki-akses-terhadap-layanan-sumber-air-minum-layak-menurut-kabupatenkota-di-provinsi-kepulauan-riau` | `168e255e-b4b1-4c80-8c52-0e541cf66379`, `1db49a8d-65b5-493e-bafa-b536db26131b` | Tahun belum dicek |
| % RT Akses Sanitasi Layak per Kab/Kota | Infrastruktur | XLSX ×2 | belum dicek (dimutakhirkan 7 Sep 2026) | `persentase-rumah-tangga-yang-memiliki-akses-terhadap-layanan-sanitasi-layak-menurut-kabupatenkota-di-provinsi-kepulauan-riau` | `3a8ba803-a45a-4d81-92ad-dc6b97f79419`, `d32cfdc7-40c9-4df6-80d1-08482976394e` | |
| Rasio Elektrifikasi Kab/Kota | Energi | XLSX ×2 | belum dicek (dimutakhirkan 14 Apr 2026) | `data-rasio-elektrifikasi-kabupatenkota-dan-provinsi-kepulauan-riau` | `2e50e97a-763c-4948-b5da-e548a858bfc5`, `afb85065-1f1b-4b15-bd71-0a7567b7f3ea` | |
| Realisasi Investasi PMA / PMDN per Kab/Kota 2024 | Investasi | XLSX | 2024 | `realisasi-investasi-pma-di-provinsi-kepulauan-riau-berdasarkan-kabupaten-kota-tahun-2024`, `realisasi-investasi-pmdn-di-provinsi-kepulauan-riau-berdasarkan-kabupaten-kota-tahun-2024` | `78c9c77b-8a3a-486f-8738-6345adffc2fd`, `a21e5f5e-ec9a-4932-bb9b-e76396ce6bbd` | |
| Angka Harapan Lama Sekolah Kab/Kota 2024–2025 | Pendidikan | XLSX | 2024–2025 | `angka-harapan-lama-sekolah-hls-kabupatenkota-provinsi-kepulauan-riau-tahun-2024-2025` | `c8a8a778-8f53-4154-808d-17b4b173fca2` | |
| IPG menurut Kab/Kota 2018–2022 | Gender | XLSX | 2018–2022 | `indeks-pembangunan-gender-ipg-provinsi-kepulauan-riau-menurut-kabupatenkota-tahun-2018-2022` | `ca2e897e-3958-4578-9238-10ab08c5e5bc` | |

### 3.5 Masalah kualitas (Kepri)

1. **Kode wilayah tidak konsisten antar dataset**: Karimun dan Bintan bertukar kode (21.01/21.02) antara dataset penduduk dan UMKM. Kota Batam konsisten **21.71**. Join pakai kode 21.71 untuk Batam, tetapi jangan percaya kode kabupaten lain tanpa cek.
2. **Struktur kolom berbeda di setiap dataset** (`KODE WILAYAH` vs `kode_wilayah_kabupatenkota`, nama tahun sebagai kolom). Ada kolom sampah bernama angka (`"9"`, `"11"`). Setiap dataset perlu pemetaan manual.
3. Format angka campur: ada `"13.207"` (ribuan) dan `"9.27"` (desimal) di kolom yang sama. Pada "Perkembangan Harga Pangan Pokok 2024", nilai `max` lebih kecil dari rata-rata di beberapa baris, dan datanya tingkat provinsi.
4. 17 resource datastore gagal diimpor (`datastore_error`).
5. Banyak paket cuma indikator kinerja OPD ("Persentase …", "Capaian Kinerja …").

### 3.6 Lisensi, ToS, robots (Kepri)

- `robots.txt` (dibaca 8 Nov 2026):
  ```
  User-agent: Googlebot
  Disallow: /data
  User-agent: *
  Disallow: /data
  ```
- Metadata lisensi: `license_id: "notspecified"`, `license_title: "License not specified"` untuk 1.533 dataset. 1 dataset ("Populasi PSKS Berbasis Kelembagaan", Dinas Sosial) ber-`odc-by`. 1 kosong.
- Halaman `/pages/term-of-use` berjudul "Term of Use (Syarat Penggunaan) Application Programming Interface (API) Portal Satu Data Provinsi Kepulauan Riau". Isinya hanya mengarah ke "Dokumentasi API" di `/data/docs/api`, yang **dilarang robots**, jadi isi syaratnya tidak bisa saya baca. Halaman `/tentang` tidak menyebut lisensi.
- Kesimpulan: **lisensi tidak dinyatakan; syarat API tidak bisa dibaca tanpa melanggar robots.** Minta syarat penggunaan langsung ke forum.sdi@kepriprov.go.id sebelum menampilkan ulang data Kepri.

---

## 4. Rekomendasi

### 4.1 Boleh diambil langsung (API JSON resmi, tanpa scraping HTML)

| Sumber | Cara | Untuk fitur |
|---|---|---|
| Batam DCAT `GET /data/apisplp/apinasional/splp` | Ambil saat build (mingguan) dan bandingkan `identifier`/`issued` untuk mendeteksi dataset baru | Indeks menu "Dataset": judul, tema, produsen, tanggal, tautan |
| Batam `GET /data/json/{slug}` | Ambil per dataset yang dipilih, simpan sebagai JSON statis di repo atau cache, tampilkan tabel/grafik dan tautkan ke halaman resmi | Halaman statistik kecamatan: penduduk per umur/JK, KK, agama, guru, sekolah, koperasi, pencari kerja, hotel, faskes |
| Batam `GET /data/excel/{slug}` | Cukup ditautkan ke pengguna (jangan di-mirror) | Tombol "Unduh dari sumber" |
| Batam `POST /data/publik/homereaddataset` dan `homereaddata` | Untuk pencarian katalog lengkap (27.539 indikator) bila DCAT tidak cukup | Pencarian indikator nilai tunggal per kecamatan |
| Batam `POST /data/home/select2-geospasial` | Ambil sekali, **verifikasi titik per titik** sebelum tampil (aturan proyek: jangan menebak koordinat) | Lapisan peta SD/SMP negeri dan puskesmas |
| Batam `kecamatan.js` | Konversi ke GeoJSON sekali. Bandingkan dengan batas resmi (BIG/Kemendagri) | Peta choropleth kecamatan |
| Kepri `GET /api/3/action/package_search` + `GET /api/datastore/{resource_id}` | Untuk ~15 dataset perbandingan kab/kota di tabel 3.4, setelah ada kejelasan syarat API | Halaman "Batam dibanding Kepri" |

Teknis:
- Jalankan fetch **saat build atau terjadwal**, bukan dari peramban pengunjung. Batam tidak mengirim header CORS. Unduhan juga menaikkan penghitung download.
- Jeda ≥3 detik dan batas ~60 permintaan per run. Kepri membatasi 120/menit.
- Simpan setiap salinan dengan `sumber_url`, `tanggal_akses`, `produsen_data`, dan `tanggal_rilis` asli, sesuai standar redaksi dan log koreksi situs.
- Normalisasi nama kecamatan ke 12 nama baku. Ubah "352.111" menjadi 352111.

### 4.2 Perlu scraping halaman HTML

Hampir tidak ada. Satu-satunya yang hanya tersedia di HTML:
- Metadata tambahan di halaman detail Batam (Konsep, Definisi, Metodologi, Cara Pengumpulan, Jadwal Pemutakhiran, Jumlah Download) tidak ada di JSON maupun DCAT. Bila perlu, scraping `/data/detail/{slug}` boleh (tidak ada robots), dengan jeda.
- Daftar dokumen `/data/buku` (48 publikasi). Tautannya ke Google Drive, cukup ditautkan.

### 4.3 Tidak boleh atau jangan dipakai

- **Kepri: semua path `/data…`**. Ini termasuk URL unduhan XLSX `/data/resource/.../download/...`, `/data/docs/api`, dan `/data/panel`. Gunakan `/api/datastore/{id}`.
- **Data pajak hotel atau PBJT perhotelan** di Batam (6 entri tingkat kota 2021–2025: "Realisasi Pajak Hotel …" dan "Realisasi Pajak PBJT Atas Jasa Perhotelan …"). Aturan proyek melarang menambah data pajak hotel. Saring dengan kata kunci `pajak hotel|perhotelan`. Tabel gabungan seperti "Statistik Jumlah Target dan Realisasi Pajak dan Retribusi Daerah Tahun 2022" (`...-eaimlh`) kemungkinan memuat baris pajak hotel. Isinya belum saya periksa, jadi bila dipakai, buang baris itu.
- **Lapisan "Peta Area" Batam** karena terbukti berisi kesalahan (bagian 2.5 butir 6). Pakai dataset JSON-nya.
- **Halaman `/portal-kabkota-data/batam` di Kepri** sebagai sumber, karena hanya salinan katalog Batam. Ambil dari Batam langsung.
- Klaim "CC BY 4.0" untuk kedua portal: **tidak berdasar**. Tulis "lisensi tidak dinyatakan oleh sumber".

### 4.4 Usulan isi menu "Dataset" (urut prioritas)

1. **Penduduk per kecamatan** (umur, JK, KK, agama) dari Disdukcapil via Batam JSON, plus deret 2019–2023 dari Kepri untuk konteks.
2. **Peta fasilitas**: SD/SMP negeri dan puskesmas (231 titik). Wajib verifikasi. Lengkapi sekolah swasta dan SMA dari sumber lain (Dapodik), karena portal ini hanya memuat sekolah negeri tingkat SD/SMP.
3. **Pariwisata**: wisman Batam per tahun (Batam) dan pintu masuk (Kepri), jumlah hotel per kecamatan (bukan pajak).
4. **Transportasi**: armada, koridor, dan panjang lintasan Trans Batam. Angka penumpang perlu konfirmasi.
5. **Bencana dan kebakaran**: kejadian per jenis (BPBD) dan penanganan kebakaran (Damkar), dengan catatan definisi.
6. **Ekonomi**: UMKM per kab/kota (Kepri), koperasi per kecamatan (Batam), investasi PMA/PMDN (Kepri), pencari kerja per kecamatan.
7. **Layanan dasar**: air bersih, sanitasi, jalan baik/rusak, sampah, permukiman kumuh.

### 4.5 Pertanyaan yang sebaiknya dikirim ke pengelola (sebelum tayang)

- Batam (satudata@batam.go.id): lisensi penggunaan ulang, izin menampilkan ulang dan mirror JSON, asal koordinat titik fasilitas dan poligon kecamatan, serta koreksi angka (KK Batu Aji, penumpang Trans Batam, hotel 2024).
- Kepri (forum.sdi@kepriprov.go.id): isi syarat penggunaan API, karena dokumennya ada di path yang dilarang robots, dan lisensi dataset.

---

## 5. Berkas pendukung

Berkas sementara sesi riset 8 Nov 2026, tidak ikut repo. Katalog DCAT, daftar dataset, daftar indikator, titik fasilitas, dan poligon kecamatan sudah dipindah ke `dataset-arsip/satudata-batam/` (entri pajak dibuang), dan katalog Kepri ke `dataset-arsip/satudata-kepri/` (lihat `docs/DATASET.md`). Nama berkas aslinya:

- `b_catalog.csv`: 7.562 entri tingkat Kota Batam (judul, URL, urusan, tahun).
- `b_datasets.csv`: 678 "Dataset" Batam (id, tahun, urusan, OPD, judul, slug, satuan, rilis, diperbarui).
- `b_geospasial_titik.csv`: 231 titik fasilitas (lapisan, nama, lat, lng, tanda periksa).
- `b_kec_part.js`: berkas poligon kecamatan lengkap (nama berkas menyesatkan, isinya utuh).
- `s_batam.json`: katalog DCAT Batam (684 dataset).
- `b_geo.json`: respons mentah endpoint geospasial.
- `k_catalog.csv`: 1.535 dataset Kepri (name, judul, OPD, grup, tanggal, format, lisensi, ringkasan catatan).
- `k_all1.json`, `k_all2.json`: metadata CKAN mentah Kepri.
- `requests.log`: log seluruh permintaan (waktu, host, URL).
- `get.sh`, `dtparams.py`, `parse_b.py`: skrip yang dipakai.
