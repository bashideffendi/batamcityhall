# Seed Data Tambahan Batam City Hall: Layanan Publik, Kesehatan, Ibadah, Olahraga, Transportasi dan Ruang Publik
> task_id: wf-c0d3f7b7-b11a-5eb3-8473-ac2bed4b91cd

# Seed Data Tambahan "Batam City Hall": Layanan Publik, Kesehatan, Ibadah, Olahraga, Transportasi & Ruang Publik

Inti hasilnya: data yang paling bisa dipercaya untuk langsung dijadikan seed adalah 12 kecamatan dan 64 kelurahan, 21 puskesmas, 21 rumah sakit, kantor-kantor vertikal (PN, PA, Kejari, BPN, Polresta, Disdukcapil, MPP, PLN, BPJS) dan koordinat terminal feri dari Wikidata/OSM. Sebaliknya, koordinat kantor kelurahan, polsek, KUA, jasa komersial, dan pelantar pompong hampir semuanya belum bisa diverifikasi, jadi isinya `null` dan statusnya `perlu_diisi_user`.

## TL;DR
- **Siap pakai:** nama dan alamat resmi untuk 21 puskesmas (Dinkes Batam/Kemenkes), 21 RS (daftar Kemenkes via Wikipedia), MPP Batam (Lt. Dasar Sumatera Convention Center), Disdukcapil (Jl. Ir. Sutami, Sekupang), PN Batam, PA Batam, BPN, Polresta Barelang, serta kantor PLN Batam dan BPJS. Koordinat yang terverifikasi baru ada untuk Batam Centre, Harbour Bay, Telaga Punggur, Bandara Hang Nadim, dan Jembatan Barelang 1.
- **Data yang berubah atau usang:** PLN UP3 Tiban pindah dari Jl. RE. Martadinata, Kawasan Industri Sekupang, ke Ruko Golden Sand Batam Blok A No. 12B–15, Tiban, mulai 4 Agustus 2025 (gokepri, 8/8/2025, mengutip Sekretaris Perusahaan PLN Batam, Samsul Bahri). Lahan makam Kristen di TPU Sei Temiang dipindah ke lahan baru di sebelah makam Tionghoa. PN Batam sudah tidak di Sekupang lagi, sekarang di Jl. Engku Haji Tua, Batam Centre. Alamat kecamatan dari sumber tahun 2009 wajib dicek ulang.
- **Yang belum terisi:** KUA per kecamatan, kantor pos, DPRD, money changer, ekspedisi, laundry, percetakan, servis resmi, SPBU, dan terminal bus belum terverifikasi dalam riset ini. Data JSON-nya sengaja ditandai `perlu_diisi_user` supaya tidak ada data karangan yang masuk peta.

## Ringkasan Singkat
Riset ini melengkapi seed sebelumnya. Prinsip yang dipakai: **koordinat hanya diisi kalau ada sumber yang bisa dicek** (Wikidata, OSM via Mapcarta, atau peta resmi). Sisanya `null`. Kode sumber (S1, S2, …) di tabel mengacu ke **Daftar Sumber** di bawah. Di JSON, URL-nya ditulis lengkap.

Status koordinat:
- `terverifikasi`: dari Wikidata/Wikipedia/OSM, dan kalau ada, sudah dicocokkan dengan ≥1 sumber lain.
- `perlu_cek_ulang`: dari direktori pihak ketiga (idalamat, batamgems, Waze, TripAdvisor) atau presisinya rendah.
- `perlu_diisi_user`: belum ada koordinat (`null`).

## Daftar Sumber (kode)
- S1 https://id.wikipedia.org/wiki/Daftar_kecamatan_dan_kelurahan_di_Kota_Batam
- S2 https://kecbatamkota.batam.go.id/2020/02/19/kantor-kecamatan-batam-kota/
- S3 http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html (2009, rawan usang)
- S4 https://batam.tribunnews.com/2019/01/19/tribunwiki-daftar-nama-camat-11-kecamatan-di-kota-batam
- S5 https://idalamat.com/alamat/kantor-kecamatan-batu-aji-batam-6365
- S6 https://disdukcapil.batam.go.id/kontak/
- S7 https://rri.co.id/daerah/231501/pelayanan-kantor-disdukcapil-batam-hadir-di-mal-pelayanan-publik
- S8 https://mpp.batam.go.id/
- S9 https://www.plnbatam.com/hubungi-kami/
- S10 https://www.plnbatam.com/pln-batam-resmikan-kantor-baru-up3-tiban-untuk-tingkatkan-pelayanan-pelangga/
- S11 https://www.bpjsketenagakerjaan.go.id/kantor-cabang/9/909/index.html
- S12 https://janganganggur.blogspot.com/2018/04/daftar-alamat-kantor-kantor-bpjs.html (blog 2018)
- S13 https://restabarelang.kepri.polri.go.id/profil/
- S14 https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/
- S15 https://damkar.batam.go.id/kontak/
- S16 https://kepri.co.id/14/05/2023/kalau-ada-kebakaran-atau-keadaan-darurat-hubungi-08116060113-damkar-bp-batam-siap-meluncur/
- S17 https://pn-batam.go.id/index.php/alamat/
- S18 https://pa-batam.go.id/tentang-pengadian/profile-pengadilan/alamat-pengadilan
- S19 https://direktori.batam.go.id/index.php/ru/ads/58451516c941f/instansi_vertikal/Kejaksaan-Negeri-Batam
- S20 https://kot-batam.atrbpn.go.id/kontak-kami
- S21 https://kepriau.com/daftar-alamat-kantor-dinas-kota-batam/
- S22 https://batam.kemenag.go.id/main/pegawai?page_hal=4
- S23 https://dispusip.batam.go.id/keanggotaan/
- S24 https://dispusip.batam.go.id/layanan-kerjasama/
- S25 https://jabalarafahbatam.com/perpustakaan-internet/
- S26 https://dinkes.batam.go.id/category/puskesmas/
- S27 https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171
- S28 https://batam.tribunnews.com/2019/07/17/daftar-lokasi-dan-alamat-puskesmas-di-kota-batam-provinsi-kepri
- S29 https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam
- S30 https://baliexpress.jawapos.com/balinese/671147898/padmasana-pura-agung-amerta-bhuana-batam-tertinggi-di-indonesia
- S31 https://batamgems.com/id/place/pura-agung-amerta-bhuana
- S32 https://batampos.jawapos.com/berita/2424616990/pemakaman-baru-umat-kristen-di-sei-temiang-mulai-digunakan
- S33 https://www.familysearch.org/en/wiki/Riau_Islands,_Indonesia_Cemeteries
- S34 https://batampos.co.id/2019/06/12/biaya-pemakaman-di-kota-batam/
- S35 https://batampos.jawapos.com/berita/2424064338/pemko-batam-usulkan-enam-tempat-pemakaman-baru-ini-lokasinya
- S36 https://bupa.bpbatam.go.id/unit-usaha/kawasan-temenggung-abdul-jamal/
- S37 https://ayo.co.id/venues/city/kota-batam
- S38 https://metropolis.batampos.co.id/mau-coba-padel-ini-3-rekomendasi-lapangan-padel-terbaik-di-batam/
- S39 https://ayo.co.id/v/tamora-padel-club-batam
- S40 https://www.wikidata.org/wiki/Q12504166
- S41 https://www.waze.com/live-map/directions/sekupang-international-ferry-terminal-re-martadinata-batam?to=place.w.68091915.681115761.3171608
- S42 https://www.wikidata.org/wiki/Q65091241
- S43 https://www.tripadvisor.com.sg/Attraction_Review-g2543930-d12199842-Reviews-Nongsa_Pura_Ferry_Terminal-Nongsa_Batam_Riau_Archipelago_Riau_Islands_Province.html
- S44 https://www.wikidata.org/wiki/Q14236384
- S45 https://shipnext.com/port/waterfront-city-ferry-terminal-idn
- S46 https://www.wikidata.org/wiki/Q780450
- S47 https://en.wikipedia.org/wiki/List_of_bridges_in_Indonesia
- S48 https://batamgems.com/place/dataran-engku-putri-batam-center
- S49 https://metro.batampos.co.id/meski-diguyur-hujan-transportasi-laut-ke-belakang-padang-normal/
- S50 https://idalamat.com/alamat/6364/kantor-kecamatan-batam-kota-batam
- S51 https://pajak.go.id/en/node/105674
- S52 https://bagekonomisda.batam.go.id/?page_id=16
- S53 https://mapcarta.com/N703813600
- S54 https://mapcarta.com/W575333267

---

## 1. Pemerintahan & Layanan Publik

### 1a. 12 Kantor Kecamatan
| nama | subkategori | kecamatan | kelurahan | alamat | jam/kontak | lat | lng | status | sumber |
|---|---|---|---|---|---|---|---|---|---|
| Kantor Camat Batam Kota | kecamatan | Batam Kota | Belian | Jl. Raja Ali Kelana No. 1 | (0778) 7485042 | 1.1066722 | 104.0803667 | perlu_cek_ulang | S2, S50 |
| Kantor Camat Batu Aji | kecamatan | Batu Aji | Kibing | Jl. Ahmad Yani, Kibing | – | null | null | perlu_diisi_user | S5 |
| Kantor Camat Batu Ampar | kecamatan | Batu Ampar | Sungai Jodoh | Jl. Kuda Laut No. 1 (data 2009) | – | null | null | perlu_diisi_user | S3, S4 |
| Kantor Camat Belakang Padang | kecamatan | Belakang Padang | Sekanak Raya | Jl. Raya Sekanak (data 2009) | – | null | null | perlu_diisi_user | S3 |
| Kantor Camat Bengkong | kecamatan | Bengkong | Sadai | Bengkong Sadai (data 2009/2019) | – | null | null | perlu_diisi_user | S3, S4 |
| Kantor Camat Bulang | kecamatan | Bulang | perlu cek | Pulau Bulang (data 2009) | – | null | null | perlu_diisi_user | S3 |
| Kantor Camat Galang | kecamatan | Galang | Sembulang | Sembulang (data 2009) | – | null | null | perlu_diisi_user | S3 |
| Kantor Camat Lubuk Baja | kecamatan | Lubuk Baja | Baloi Indah | Jl. Bunga Raya No. 3 (data 2009) | – | null | null | perlu_diisi_user | S3, S4 |
| Kantor Camat Nongsa | kecamatan | Nongsa | Kabil | Ruko Punggur Blok A, Kabil (data 2009) | – | null | null | perlu_diisi_user | S3 |
| Kantor Camat Sagulung | kecamatan | Sagulung | perlu cek | Perum Putri Hijau (data 2009) | – | null | null | perlu_diisi_user | S3 |
| Kantor Camat Sei Beduk | kecamatan | Sei Beduk | Tanjung Piayu | Sei Pancur Blok L No. 19–20 (data 2009) | – | null | null | perlu_diisi_user | S3 |
| Kantor Camat Sekupang | kecamatan | Sekupang | perlu cek | Jl. R. Soeprapto No. 1 (data 2009) | – | null | null | perlu_diisi_user | S3 |

⚠️ Alamat dari S3 berasal dari tahun 2009. Beberapa kantor camat kemungkinan besar sudah pindah, jadi **semua alamat itu perlu dicek ulang**.

### 1b. 64 Kelurahan (daftar resmi Kemendagri)
Alamat dan koordinat kantor kelurahan **belum ada** di riset ini. Untuk Claude Code: buat 64 entri `kantor_kelurahan` dari tabel ini dengan `alamat: null`, `lat/lng: null`, `status_koordinat: "perlu_diisi_user"`, `sumber_url: S1`.

| kecamatan (kode) | jumlah | kelurahan |
|---|---|---|
| Batam Kota (21.71.10) | 6 | Baloi Permai, Belian, Sukajadi, Sungai Panas, Taman Baloi, Teluk Tering |
| Batu Aji (21.71.12) | 4 | Bukit Tempayan, Buliang, Kibing, Tanjung Uncang |
| Batu Ampar (21.71.02) | 4 | Batu Merah, Kampung Seraya, Sungai Jodoh, Tanjung Sengkuang |
| Belakang Padang (21.71.01) | 6 | Kasu, Pecong, Pemping, Pulau Terong, Sekanak Raya, Tanjung Sari |
| Bengkong (21.71.09) | 4 | Bengkong Indah, Bengkong Laut, Sadai, Tanjung Buntung |
| Bulang (21.71.05) | 6 | Batu Legong, Bulang Lintang, Pantai Gelam, Pulau Buluh, Setokok, Temoyong |
| Galang (21.71.08) | 8 | Air Raja, Galang Baru, Karas, Pulau Abang, Rempang Cate, Sembulang, Sijantung, Subang Mas |
| Lubuk Baja (21.71.06) | 5 | Baloi Indah, Batu Selicin, Kampung Pelita, Lubuk Baja Kota, Tanjung Uma |
| Nongsa (21.71.04) | 4 | Batu Besar, Kabil, Ngenang, Sambau |
| Sagulung (21.71.11) | 6 | Sagulung Kota, Sungai Binti, Sungai Langkai, Sungai Lekop, Sungai Pelunggut, Tembesi |
| Sei Beduk (21.71.07) | 4 | Duriangkang, Mangsang, Muka Kuning, Tanjung Piayu |
| Sekupang (21.71.03) | 7 | Patam Lestari, Sungai Harapan, Tanjung Pinggir, Tanjung Riau, Tiban Baru, Tiban Indah, Tiban Lama |

Catatan: banyak situs kode pos masih memuat kelurahan lama seperti "Baloi", "Nongsa", "Bengkong Harapan", dan "Bukit Senyum". Itu data sebelum Perda 2/2005, **jangan dipakai**.

### 1c. Kantor Layanan Publik Utama
| nama | subkategori | kecamatan | kelurahan | alamat | jam/kontak | lat | lng | status | sumber |
|---|---|---|---|---|---|---|---|---|---|
| Kantor Wali Kota Batam | pemkot | Batam Kota | Teluk Tering | Jl. Engku Putri No. 01 | – | null | null | perlu_diisi_user | S52 |
| Disdukcapil Kota Batam | dukcapil | Sekupang | perlu cek | Jl. Ir. Sutami, Sekupang | (0778) 322287 | null | null | perlu_diisi_user | S6, S7 |
| Mal Pelayanan Publik (MPP) Batam | MPP | Batam Kota | Belian | Lt. Dasar Sumatera Convention Center, Jl. Engku Putri | Call center (0778) 468278; menurut situs resmi mpp.batam.go.id "mulai beroperasi pada tanggal 7 Desember 2017" (presentasi Pemko 2020 menyebut operasional mulai 27 November 2017, diresmikan MenPAN-RB 20 September 2018) | null | null | perlu_diisi_user | S8, S51 |
| Gerai Disdukcapil di MPP | dukcapil | Batam Kota | Belian | MPP, Sumatera Convention Center | Cetak KK, KIA, pindah, akta lahir & kematian, IKD (sejak 5 Mei 2023) | null | null | perlu_diisi_user | S7 |
| DPMPTSP Kota Batam | perizinan | Batam Kota | Belian | Mengelola MPP (alamat kantor perlu cek) | – | null | null | perlu_diisi_user | S7, S8 |
| PT PLN Batam – Kantor Pusat | listrik | Batam Kota | Teluk Tering | Jl. Engku Putri No. 3, Batam Centre | (0778) 463150; CC 123 | null | null | perlu_diisi_user | S9 |
| PLN Batam – Unit Distribusi & Pelayanan (Batam Centre) | listrik | Batam Kota | perlu cek | Capitol Superblock Imperium Blok B1/B2A, Jl. Jend. Sudirman, Baloi | (0778) 7482654 | null | null | perlu_diisi_user | S9 |
| PLN Batam – UP3 Tiban | listrik | Sekupang | perlu cek | Ruko Golden Sand Blok A No. 12B–15, Tiban (BARU, sejak 4 Agustus 2025) | – | null | null | perlu_diisi_user | S10 |
| PLN Batam – Kantor Pelayanan Batu Aji | listrik | Batu Aji | perlu cek | Ruko Mitra Halim Perkasa (SP Plaza) Blok DD No. 3–3A | (0778) 392821 | null | null | perlu_diisi_user | S9, S10 |
| PLN Batam – Kantor Pelayanan Nagoya | listrik | Lubuk Baja | perlu cek | Nagoya (alamat detail perlu cek) | – | null | null | perlu_diisi_user | S9 |
| BPJS Ketenagakerjaan Batam Nagoya | BPJS TK | Lubuk Baja | perlu cek | Jl. Imam Bonjol, Gd. Graha Nagoya Mas Lt. 1 | (0778) 458324 | null | null | perlu_diisi_user | S11 |
| BPJS Ketenagakerjaan Batam Sekupang | BPJS TK | Sekupang | Tiban Baru | Jl. Gajah Mada, Ruko Tiban Impian Blok A1 No. 1–3 | (0778) 7496442 | null | null | perlu_diisi_user | S11 |
| BPJS Kesehatan KC Batam | BPJS Kes | Batam Kota | Teluk Tering | Jl. Gurindam, Batam Centre (data blog 2018) | (0778) 4800571 | null | null | perlu_diisi_user | S12 |
| Polresta Barelang | polisi | Batam Kota | Sukajadi | Jl. Sudirman No. 4 | (0778) 457691 | null | null | perlu_diisi_user | S13 |
| Pengadilan Negeri Batam | pengadilan | Batam Kota | Teluk Tering | Jl. Engku Haji Tua, Batam Centre | (0778) 468828 | null | null | perlu_diisi_user | S17 |
| Pengadilan Agama Batam Kelas IA | pengadilan | Sekupang | Sungai Harapan | Jl. R.E. Martadinata No. 5 | (0778) 323308; WA 0812-6658-8031 | null | null | perlu_diisi_user | S18 |
| Kejaksaan Negeri Batam | kejaksaan | Batam Kota | Teluk Tering | Jl. Engku Putri, Batam Centre | (0778) 461828 | null | null | perlu_diisi_user | S19 |
| Kantor Pertanahan (BPN) Kota Batam | pertanahan | Sekupang | Sungai Harapan | Jl. Jaksa Agung R. Soeprapto | WA 0851-5000-0722 | null | null | perlu_diisi_user | S20 |
| Dinas Tenaga Kerja Kota Batam | disnaker | Sekupang | Sungai Harapan | Jl. Kartini I No. 29–30 | (0778) 327601 | null | null | perlu_diisi_user | S21 |
| Kantor Kemenag Kota Batam | kemenag/KUA induk | Sekupang | Sungai Harapan | Jl. Masjid Baiturrahman No. 1 | – | null | null | perlu_diisi_user | S22 |
| DPRD Kota Batam | legislatif | Batam Kota | perlu cek | Belum terverifikasi | – | null | null | perlu_diisi_user | – |
| Kantor Pos Batam (utama & cabang) | pos | – | – | Belum terverifikasi | – | null | null | perlu_diisi_user | – |
| KUA per kecamatan (12) | KUA | semua | – | Belum terverifikasi; induknya Kemenag Batam | – | null | null | perlu_diisi_user | S22 |

### 1d. Polsek (di bawah Polresta Barelang)
| nama | kecamatan | alamat | kontak | status | sumber |
|---|---|---|---|---|---|
| Polsek Lubuk Baja | Lubuk Baja | Jl. Bunga Raya, Baloi Indah | (0778) 457212 | perlu_diisi_user | S14 |
| Polsek Batam Kota | Batam Kota | Jl. Engku Putri, Baloi Permai | (0778) 463380 | perlu_diisi_user | S14 |
| Polsek Sekupang | Sekupang | Jl. Ir. Sutami, Sungai Harapan | (0778) 321744 | perlu_diisi_user | S14 |
| Polsek Nongsa | Nongsa | Jl. Hasanuddin, Batu Besar | (0778) 311110 | perlu_diisi_user | S14 |
| Polsek Batu Aji | Batu Aji | Jl. Brigjen Katamso, Tanjung Uncang | (0778) 393162 | perlu_diisi_user | S14 |
| Polsek Batu Ampar | Batu Ampar | Jl. Yos Sudarso | (0778) 432573 | perlu_diisi_user | S14 |
| Polsek Bengkong | Bengkong | Bengkong Laut | (0778) 413110 | perlu_diisi_user | S14 |
| Polsek Sei Beduk | Sei Beduk | Jl. Kapling Sei Pancur | (0778) 736234 | perlu_diisi_user | S14 |
| Polsek Sagulung | Sagulung | Jl. R. Suprapto (perlu cek) | – | perlu_diisi_user | S14 |
| Polsek Belakang Padang | Belakang Padang | perlu cek | – | perlu_diisi_user | S14 |
| Polsek Galang | Galang | Kecamatan Galang | – | perlu_diisi_user | S14 |
| Polsek Kawasan Pelabuhan (KKP) | Batu Ampar/Batam Kota | perlu cek | – | perlu_diisi_user | S14 |
| Polsek Kawasan Bandara (KKB) | Nongsa | Bandara Hang Nadim | (0778) 479276 | perlu_diisi_user | S14 |

Data polsek berasal dari kompilasi tahun 2020. Nama kapolsek tidak dicantumkan karena cepat berganti.

### 1e. Pemadam Kebakaran
Darurat: **113** atau **112**. Call center Damkar BP Batam (Pos Duriangkang): **0811-6060-113**. Menurut rilis BP Batam, armadanya terdiri dari "110 personel serta lebih dari 10 unit mobil pemadam yang tersebar di 6 pos aktif dan 2 pos pasif (pos tanpa armada yang berlokasi di Kantor BP Batam) dengan response time maksimal 15 menit".
| nama | pengelola | kontak | status | sumber |
|---|---|---|---|---|
| Dinas Damkar & Penyelamatan Kota Batam (kantor) | Pemko | Jl. Pramuka No. 2, Sekupang; (0778) 325622 | perlu_diisi_user | S15 |
| Pos Sei Panas | Pemko | Jl. Laksamana Bintan; (0778) 427366 | perlu_diisi_user | S15, S16 |
| Pos Kabil | Pemko | (0778) 7100011 | perlu_diisi_user | S15 |
| Pos Tembesi | Pemko | 0811-7747-000 | perlu_diisi_user | S15 |
| Pos Sekupang | BP Batam | (0778) 322233 | perlu_diisi_user | S16 |
| Pos Sagulung | BP Batam | (0778) 392317 | perlu_diisi_user | S16 |
| Pos Batu Ampar | BP Batam | (0778) 412324 | perlu_diisi_user | S16 |
| Pos Punggur | BP Batam | 0811-7760-602 | perlu_diisi_user | S16 |
| Pos Nongsa | BP Batam | 0812-7552-5937 | perlu_diisi_user | S16 |
| Pos Duriangkang (call center) | BP Batam | 0811-6060-113 | perlu_diisi_user | S16 |

⚠️ Situs "damkarbatam.com" dan "bpbd.damkarbatam.com" **bukan situs resmi**. Isinya janggal, misalnya alamat Prabumulih dan koordinat Jakarta. Jangan dipakai.

## 2. Perpustakaan
| nama | subkategori | kecamatan | alamat | jam/kontak | status | sumber |
|---|---|---|---|---|---|---|
| Perpustakaan Daerah / Dispusip Kota Batam | perpustakaan umum | Batam Kota | Kantor Dinas Bersama, Jl. Raja Isa No. 17 Lt. 4, Batam Centre | dispusip@batam.go.id | perlu_diisi_user | S23 |
| Perpustakaan Keliling (Pusling) Dispusip | perpustakaan keliling | semua | Mobil keliling; ajukan surat permohonan ke Dispusip; baca di tempat, buku tidak bisa dipinjam | dispusip@batam.go.id | null (bergerak) | S24 |
| Perpustakaan Umum Masjid Jabal Arafah | perpustakaan komunitas | Lubuk Baja | Jl. Imam Bonjol | Setiap hari 08.00–19.00; +62 811 7087 997 | perlu_diisi_user | S25 |
| Pojok Perpustakaan MPP | pojok baca | Batam Kota | MPP, Sumatera Convention Center | jam MPP | perlu_diisi_user | S8 |

Ada sumber lama (iBatam/Moco) yang mencantumkan alamat Dispusip di "Jl. Engku Putri No. 1 Lt. 7". Itu **kemungkinan alamat lama**. Yang dipakai adalah alamat dari situs resmi, yaitu Jl. Raja Isa No. 17. Perpustakaan provinsi, perpustakaan kampus yang terbuka untuk umum, dan TBM belum terverifikasi.

## 3. Kesehatan

### 3a. 21 Puskesmas
Status rawat inap diambil dari Komdat Kemenkes (S27). Kalau tertulis "perlu cek", artinya statusnya tidak muncul di sumber.
| nama | kecamatan | kelurahan | alamat | rawat inap | status koord | sumber |
|---|---|---|---|---|---|---|
| Puskesmas Sekupang | Sekupang | Sungai Harapan | Jl. Raja Haji No. 6; (0778) 8326339 | perlu cek | perlu_diisi_user | S26, S28 |
| Puskesmas Tiban Baru | Sekupang | Tiban Baru | Komp. Tiban Koperasi Blok K No. 84; (0778) 3553911 | perlu cek | perlu_diisi_user | S26, S28 |
| Puskesmas Mentarau | Sekupang | Tiban Indah | Komp. Ciptaland Mentarau | perlu cek | perlu_diisi_user | S26 |
| Puskesmas Batu Aji | Batu Aji | Buliang | Jl. Rindang Garden; (0778) 363063 | Non rawat inap | perlu_diisi_user | S27, S28 |
| Puskesmas Tanjung Uncang | Batu Aji | Tanjung Uncang | Jl. Brigjen Katamso No. 1 | Rawat inap | perlu_diisi_user | S26, S27 |
| Puskesmas Sei Langkai | Sagulung | Sungai Langkai | Jl. Utama Kavling Baru; (0778) 369873 | Rawat inap | perlu_diisi_user | S27, S28 |
| Puskesmas Sei Lekop | Sagulung | Sungai Lekop | Kavling Pelopor; (0778) 7368430 | perlu cek | perlu_diisi_user | S28 |
| Puskesmas Sei Pancur | Sei Beduk | Tanjung Piayu | Jl. S. Parman Kav. Sei Pancur | Rawat inap | perlu_diisi_user | S27 |
| Puskesmas Kabil | Nongsa | Kabil | Jl. Hasanuddin No. 1 | perlu cek | perlu_diisi_user | S26 |
| Puskesmas Sambau | Nongsa | Sambau | Jl. Hang Lekiu No. 1 | perlu cek | perlu_diisi_user | S28 |
| Puskesmas Kampung Jabi | Nongsa | Batu Besar | Jl. Hang Kesturi | Rawat inap | perlu_diisi_user | S27 |
| Puskesmas Botania | Batam Kota | Belian | Komp. Botania Garden | Non rawat inap | perlu_diisi_user | S27 |
| Puskesmas Baloi Permai | Batam Kota | Baloi Permai | Graha Legenda Malaka | perlu cek | perlu_diisi_user | S27 |
| Puskesmas Sei Panas | Bengkong (per Komdat) | Bengkong Indah | Jl. Laksamana Bintan | Rawat inap | perlu_diisi_user | S27 |
| Puskesmas Tanjung Buntung | Bengkong | Tanjung Buntung | perlu cek | perlu cek | perlu_diisi_user | S26 |
| Puskesmas Lubuk Baja | Lubuk Baja | Tanjung Uma | Jl. Duyung (per Komdat; ada sumber lain menyebut Baloi Centre) | Non rawat inap (perlu cek) | perlu_diisi_user | S27 |
| Puskesmas Tanjung Sengkuang | Batu Ampar | Tanjung Sengkuang | Jl. Tenggiri | Non rawat inap | perlu_diisi_user | S26, S27 |
| Puskesmas Belakang Padang | Belakang Padang | Tanjung Sari | Jl. Hang Tuah No. 1 | Rawat inap | perlu_diisi_user | S26, S27 |
| Puskesmas Bulang | Bulang | Pulau Buluh | Jl. Zakaria Ahmad | Rawat inap | perlu_diisi_user | S27 |
| Puskesmas Galang | Galang | Sembulang | Jl. Batin Limat No. 15 | Rawat inap | perlu_diisi_user | S26, S27 |
| Puskesmas Rempang Cate | Galang | Rempang Cate | Jl. Trans Barelang | Rawat inap | perlu_diisi_user | S27 |

Catatan: menu situs Dinkes menautkan "Puskesmas Tanjung Uncang" ke subdomain Tanjung Sengkuang. Itu kesalahan link di situs, bukan karena kedua puskesmas digabung.

### 3b. 21 Rumah Sakit (kode Kemenkes, via S29)
| nama | tipe | kecamatan | kelurahan | alamat | status koord |
|---|---|---|---|---|---|
| RSUD Embung Fatimah | RSUD B | Batu Aji | Bukit Tempayan | Jl. Pertiwi No. 27 | perlu_diisi_user |
| RS Awal Bros Batam | A (beberapa sumber menyebut B) | Lubuk Baja | Baloi Indah | Jl. Gajah Mada No. 1 | perlu_diisi_user |
| RS Bhayangkara Batam | D | Nongsa | Batu Besar | Jl. Dang Merdu No. 2 | perlu_diisi_user |
| RS Budi Kemuliaan | B | Batu Ampar | Kampung Seraya | Jl. Budi Kemuliaan No. 1 | perlu_diisi_user |
| RS Camatha Sahidya | C | Sei Beduk | Muka Kuning | Jl. Jend. Ahmad Yani No. 8 | perlu_diisi_user |
| RS Charis Medika | D | Batu Aji | Buliang | Jl. Pahlawan No. 1 | perlu_diisi_user |
| RS Darurat/RSKI Pulau Galang | RS khusus | Galang | Sijantung | Jl. Trans Barelang No. 24 | perlu_diisi_user |
| RS Graha Hermine | C | Batu Aji | Buliang | Jl. Brigjen Katamso No. 15 | perlu_diisi_user |
| RS Harapan Bunda | C | Batu Ampar | Kampung Seraya | Jl. Seraya No. 1 | perlu_diisi_user |
| RS Keluarga Husada | C | Batam Kota | Belian | Jl. Tengku Sulung No. 12 | perlu_diisi_user |
| RS BP Batam (RS Otorita) | B | Sekupang | Tanjung Pinggir | Jl. Dr. Cipto Mangunkusumo No. 1 | perlu_diisi_user |
| RS Santa Elisabeth Lubuk Baja | C | Lubuk Baja | Lubuk Baja Kota | Jl. Anggrek No. 2 | perlu_diisi_user |
| RS Santa Elisabeth Batam Kota | C | Batam Kota | Belian | Jl. Raja Ali Kelana No. 37 | perlu_diisi_user |
| RS Soedarsono Darmosoewito | C | Nongsa | Kabil | Jl. Hang Kasturi No. 4 | perlu_diisi_user |
| RSIA Frisdhy Angel | C | Lubuk Baja | Lubuk Baja Kota | Jl. Raden Patah No. 1 | perlu_diisi_user |
| RSIA Griya Medika | C | Batam Kota | Sungai Panas | Jl. Laksamana Bintan No. 3 | perlu_diisi_user |
| RSIA Kasih Sayang Ibu | C | Batam Kota | Taman Baloi | Jl. Raja H. Fisabilillah No. 11 | perlu_diisi_user |
| RSIA Mutiara Aini | C | Batu Aji | Buliang | Jl. Batu Aji II No. 1 | perlu_diisi_user |
| RSIA Nuruddiniyah | B | Batam Kota | Sungai Panas | Jl. Raya Sungai Panas No. 25 | perlu_diisi_user |
| RSIA Permata Hati | C | Lubuk Baja | Lubuk Baja Kota | Jl. Bunga No. 3A | perlu_diisi_user |
| RS Hj. Bunda Halimah | B | Batam Kota | Belian | Jl. Uniba Kawasan Uniba No. A09 | perlu_diisi_user |

Catatan:
- RS Awal Bros Batu Aji disebut di sumber lain (avitaliahealth) sebagai RS tipe C. RS ini tidak ada di daftar Wikipedia, jadi perlu cek apakah sebenarnya sudah ada RS ke-22.
- Seed lama RS mungkin sudah memuat koordinat. Kalau ada, pakai yang lama.
- Klinik 24 jam, laboratorium, dan apotek 24 jam belum diriset. Isi lewat kontribusi warga atau cek ulang.

## 4. Ibadah & Pemakaman
| nama | subkategori | kecamatan | kelurahan | alamat | jam/kontak | lat | lng | status | sumber |
|---|---|---|---|---|---|---|---|---|---|
| Pura Agung Amerta Bhuana | pura (terbesar di Batam, padmasana 13 m, diresmikan 16 Juni 2004) | Sekupang | perlu cek (Sei Ladi) | Jl. Gajah Mada No. 3, Sei Ladi | – | 1.112828 | 104.002754 | perlu_cek_ulang | S30, S31 |
| Pura Satya Dharma | pura | perlu cek | – | Belum terverifikasi | – | null | null | perlu_diisi_user | S30 |
| Pura Sekupang | pura | Sekupang | – | Belum terverifikasi | – | null | null | perlu_diisi_user | S30 |
| Masjid Jabal Arafah | masjid besar | Lubuk Baja | perlu cek | Jl. Imam Bonjol | – | null | null | perlu_diisi_user | S25 |
| TPU Sei Temiang | TPU (Islam, Kristen Bukit Aman, Buddha/Tionghoa) | Sekupang | Tanjung Riau | Sei Temiang, Marina, Tanjung Riau | dikelola Pemko | null | null | perlu_diisi_user | S33, S34, S35 |
| TPU Sei Temiang – lahan Kristen baru | TPU Kristen | Sekupang | Tanjung Riau | Sebelah makam Tionghoa, dekat Jl. Ahmad Dahlan (mulai Maret 2024, akses masih terjal) | – | null | null | perlu_diisi_user | S32 |
| TPU Taman Langgeng / Sei Panas | TPU | Batam Kota | Sungai Panas | Komp. Inti Batam, Jl. Laksamana Bintan No. 7 | – | null | null | perlu_diisi_user | S33, S34 |
| TPU Kavling Bagan | TPU | perlu cek | – | Belum terverifikasi | dikelola Pemko | null | null | perlu_diisi_user | S35 |
| TPU Sambau | TPU | Nongsa | Sambau | Sambau | – | null | null | perlu_diisi_user | S33, S34 |
| Pemakaman Tionghoa Sambau | makam Tionghoa | Nongsa | Sambau | Kompleks Pemakaman Sambau | – | null | null | perlu_diisi_user | S33 |
| Krematorium Yayasan Halim Batam | krematorium | Nongsa | Sambau | Sambau | +62 778 425205 | null | null | perlu_diisi_user | S33 |

Gereja per denominasi (Katolik, HKBP, GPdI, GBI), klenteng utama, dan Taman Makam Pahlawan belum terverifikasi di riset ini. Biaya makam yang dikutip media tahun 2019 (sekitar Rp1,35 juta untuk dewasa di Sei Temiang) **sudah usang**. Sejak itu Pemko mengambil alih pengelolaan dan menanggung biaya gali tutup makam di Sei Temiang, Sei Panas, dan Kavling Bagan (S35). Pada 30 Agustus 2023, Sekretaris Dinas Perkimtan Agung Fitrianto, seperti dikutip Batam Pos, mengusulkan TPU baru di enam lokasi: "Sei Temiang seluas 55 hektare, Tiban Lama seluas 20 hektare, Tanjungpiayu seluas 23 hektare, Tembesi 10 hektare, Sambau 33 hektare, dan Sekanak 7 hektare… Total ada 148 hektare". Batamtimes (26/5/2025) melaporkan usulan itu sudah diperkecil menjadi 5 lokasi seluas "sekitar 122,31 hektare" dan masih menunggu dokumen Amdal, jadi lokasi-lokasi ini belum boleh ditampilkan sebagai TPU yang sudah beroperasi.

## 5. Olahraga
| nama | subkategori | kecamatan | alamat | booking | status | sumber |
|---|---|---|---|---|---|---|
| Stadion Temenggung Abdul Jamal | stadion (kapasitas 10.000 menurut BP Batam; Wikipedia menyebut 2.800) | Sei Beduk | Jl. Ahmad Yani, Muka Kuning | Reservasi via HGAT BP Batam | perlu_diisi_user | S36 |
| Sport Hall/GOR Temenggung Abdul Jamal | GOR (badminton, voli, basket, atletik, panahan) | Sei Beduk | Kompleks TAJ, Jl. Ahmad Yani | Reservasi via HGAT BP Batam | perlu_diisi_user | S36 |
| The Padel House | padel indoor (standar FIP) | Batam Kota | Komp. Botania, Pasar Botania 2, Jl. Raja Ali Kelana No. 2 Lt. 2, Belian | AYO | perlu_diisi_user | S38, S37 |
| Play Padel | padel (2 lapangan) | Batam Kota | Teluk Tering | AYO, mulai Rp180.000/sesi | perlu_diisi_user | S38, S37 |
| Padel Box Orchid | padel | Batam Kota | Orchid Park, Taman Baloi | AYO, mulai Rp88.000/sesi | perlu_diisi_user | S38, S37 |
| Tamora Padel Club | padel (5 lapangan) | Batam Kota | Belian (plus code 43J7+4C) | AYO, mulai Rp350.000/sesi | perlu_diisi_user | S39 |
| Padel lain di AYO | padel | – | BC Padel Club, Dragon 89, TAO Padel Academy, Seaside Premium Padel, Zabbo, Padel Hill, Court One, Grand Padel Arena Nagoya, IPadel Club, Penguin Padel | AYO | perlu_diisi_user | S37 |

Padel tumbuh sangat cepat. Pada 4 Desember 2025, Batam Pos masih menulis "Saat ini Batam memiliki tiga lapangan padel yang aktif beroperasi." Pada November 2026, halaman AYO "Venue Olahraga Kota Batam" sudah mendaftar setidaknya 15 venue padel, antara lain Rally Padel, BC Padel Club, Dragon 89, TAO Padel Academy, Zabbo, Play Padel, The Padel House, dan Padel Box Orchid. Artinya daftar ini cepat usang, jadi sebaiknya padel diambil berkala dari AYO. Futsal, mini soccer, tenis, kolam renang umum, gym, jogging track, dan skatepark belum terverifikasi.

## 6. Jasa & Servis
Belum ada yang terverifikasi di riset ini: bengkel resmi, dealer, money changer Nagoya/Harbour Bay, ekspedisi (JNE, J&T, SiCepat, Pos), laundry, percetakan, dan servis resmi. Rekomendasinya, ambil dari locator resmi masing-masing merek (dealer, kantor cabang ekspedisi) supaya datanya bisa dipertanggungjawabkan. Untuk **Tukang Langganan**, kategori contohnya: tukang jahit, servis AC, pijat panggilan, tukang listrik, sedot WC, dan servis mesin cuci. Sumber komunitasnya adalah grup Facebook warga Batam per kawasan (misalnya grup jual-beli dan info per kecamatan). Jangan simpan data pribadi. Biarkan warga sendiri yang mendaftar.

## 7. Transportasi
| nama | subkategori | kecamatan | lat | lng | status | sumber |
|---|---|---|---|---|---|---|
| Terminal Feri Internasional Batam Centre | feri | Batam Kota | 1.130861 | 104.055231 | terverifikasi | S40 |
| Terminal Feri Sekupang | feri | Sekupang | 1.125328 | 103.925633 | perlu_cek_ulang | S41 |
| Terminal Feri Harbour Bay | feri | Batu Ampar | 1.153889 | 103.997111 | terverifikasi | S42, S53 |
| Terminal Feri Nongsapura | feri | Nongsa | 1.17283 | 104.07809 | perlu_cek_ulang | S43 |
| Pelabuhan Telaga Punggur | feri domestik | Nongsa | 1.035230 | 104.133397 | terverifikasi | S44, S54 |
| Terminal Feri Waterfront City (Teluk Senimba) | feri | Sekupang | null | null | perlu_diisi_user | S45 |
| Gold Coast Ferry Terminal Bengkong | feri (dibuka 2025) | Bengkong | null | null | perlu_diisi_user | – |
| Pelabuhan Rakyat/Pancung Sekupang → Belakang Padang | pelantar pompong | Sekupang | null | null | perlu_diisi_user | S49 |
| Pelabuhan Belakang Padang (Tanjung Sari) | pelantar pompong | Belakang Padang | null | null | perlu_diisi_user | S49 |
| Bandara Hang Nadim | bandara | Nongsa | 1.120833 | 104.118611 | terverifikasi | S46 |
| Terminal bus antarkota | terminal | – | null | null | perlu_diisi_user | – |

Catatan:
- Halaman resmi BP Batam memuat koordinat Nongsapura dan Telaga Punggur yang **jelas salah**, bisa meleset sampai sekitar 9 km. Jangan dipakai.
- Untuk Waterfront City, ShipNext hanya memberi titik kasar (sekitar 1.083, 103.933, presisi kira-kira 2 km). Karena itu nilainya tidak dimasukkan.
- Pelantar pancung Sekupang berada persis di sebelah terminal domestik Sekupang, kira-kira di 1.125–1.126, 103.925–103.927. Titik pastinya perlu diisi user.
- Menurut paper "Pengelolaan Antrian Kapal Pompong Berbasis Teknologi di Pelabuhan Sekupang-Belakang Padang" (ResearchGate, diterima 22 November 2024), pompong Sekupang–Belakang Padang dikelola koperasi PPMS dengan "waktu tempuh ± 25 menit. Tarif per penumpang adalah Rp 20.000". Sebagai pembanding, gokepri (21/1/2022) mencatat tarif naik dari Rp16.000 menjadi Rp18.000 per 17 Januari 2022.
- Jumlah SPBU belum terverifikasi.

## 8. Ruang Publik
| nama | subkategori | kecamatan | lat | lng | status | sumber |
|---|---|---|---|---|---|---|
| Dataran/Alun-alun Engku Putri | alun-alun | Batam Kota | 1.106639 | 104.052681 | perlu_cek_ulang | S48 |
| Jembatan Barelang 1 (Tengku Fisabilillah) | landmark wisata | Galang/Bulang (perbatasan) | 0.981694 | 104.041500 | terverifikasi | S47 |
| Pulau Belakang Padang | wisata pulau | Belakang Padang | null | null | perlu_diisi_user | S49 |
| Taman Dang Anom, Taman Kolam, Taman Mini, Taman Rusa | taman kota | – | null | null | perlu_diisi_user | – |

Taman kota, pantai, dan RTH lainnya belum terverifikasi di riset ini.

---

## Rekomendasi untuk Claude Code
1. Import JSON di bawah. Generate 64 entri kelurahan dari tabel 1b.
2. Entri yang koordinatnya `null` **jangan dirender di peta**. Tampilkan di list saja dengan badge "lokasi belum diisi".
3. Tambahkan field `catatan` untuk data usang (PLN Tiban, TPU Kristen, alamat kecamatan 2009).
4. Prioritas isi manual: kantor kecamatan → puskesmas → RS → polsek → pelantar pompong.

## Data JSON
```json
[
{"id":"kec-batamkota","nama":"Kantor Camat Batam Kota","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Jl. Raja Ali Kelana No. 1","lat":1.1066722,"lng":104.0803667,"jam_layanan":null,"kontak":"(0778) 7485042","sumber_url":"https://kecbatamkota.batam.go.id/2020/02/19/kantor-kecamatan-batam-kota/","status_koordinat":"perlu_cek_ulang"},
{"id":"kec-batuaji","nama":"Kantor Camat Batu Aji","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Batu Aji","kelurahan":"Kibing","alamat":"Jl. Ahmad Yani, Kibing","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://idalamat.com/alamat/kantor-kecamatan-batu-aji-batam-6365","status_koordinat":"perlu_diisi_user"},
{"id":"kec-batuampar","nama":"Kantor Camat Batu Ampar","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Batu Ampar","kelurahan":"Sungai Jodoh","alamat":"Jl. Kuda Laut No. 1 (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-belakangpadang","nama":"Kantor Camat Belakang Padang","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Belakang Padang","kelurahan":"Sekanak Raya","alamat":"Jl. Raya Sekanak (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-bengkong","nama":"Kantor Camat Bengkong","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Bengkong","kelurahan":"Sadai","alamat":"Bengkong Sadai (cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://batam.tribunnews.com/2019/01/19/tribunwiki-daftar-nama-camat-11-kecamatan-di-kota-batam","status_koordinat":"perlu_diisi_user"},
{"id":"kec-bulang","nama":"Kantor Camat Bulang","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Bulang","kelurahan":null,"alamat":"Pulau Bulang (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-galang","nama":"Kantor Camat Galang","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Galang","kelurahan":"Sembulang","alamat":"Sembulang (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-lubukbaja","nama":"Kantor Camat Lubuk Baja","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Lubuk Baja","kelurahan":"Baloi Indah","alamat":"Jl. Bunga Raya No. 3 (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-nongsa","nama":"Kantor Camat Nongsa","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Nongsa","kelurahan":"Kabil","alamat":"Ruko Punggur Blok A, Kabil (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-sagulung","nama":"Kantor Camat Sagulung","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Sagulung","kelurahan":null,"alamat":"Perum Putri Hijau (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-seibeduk","nama":"Kantor Camat Sei Beduk","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Sei Beduk","kelurahan":"Tanjung Piayu","alamat":"Sei Pancur Blok L No. 19-20 (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"kec-sekupang","nama":"Kantor Camat Sekupang","kategori":"pemerintahan","subkategori":"kecamatan","kecamatan":"Sekupang","kelurahan":null,"alamat":"Jl. R. Soeprapto No. 1 (data 2009, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"http://batamblitz.blogspot.com/2009/08/alamat-kantor-camat-di-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"pemkot-walikota","nama":"Kantor Wali Kota Batam","kategori":"pemerintahan","subkategori":"pemkot","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Putri No. 01","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://bagekonomisda.batam.go.id/?page_id=16","status_koordinat":"perlu_diisi_user"},
{"id":"disdukcapil","nama":"Disdukcapil Kota Batam","kategori":"pemerintahan","subkategori":"dukcapil","kecamatan":"Sekupang","kelurahan":null,"alamat":"Jl. Ir. Sutami, Sekupang","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 322287; disdukcapil@batam.go.id","sumber_url":"https://disdukcapil.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"mpp-batam","nama":"Mal Pelayanan Publik Kota Batam","kategori":"pemerintahan","subkategori":"mpp","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Lt. Dasar Sumatera Convention Center, Jl. Engku Putri","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 468278","sumber_url":"https://mpp.batam.go.id/","status_koordinat":"perlu_diisi_user"},
{"id":"mpp-disdukcapil","nama":"Gerai Disdukcapil di MPP","kategori":"pemerintahan","subkategori":"dukcapil","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"MPP, Sumatera Convention Center","lat":null,"lng":null,"jam_layanan":"Cetak KK, KIA, pindah, akta lahir/kematian, IKD","kontak":null,"sumber_url":"https://rri.co.id/daerah/231501/pelayanan-kantor-disdukcapil-batam-hadir-di-mal-pelayanan-publik","status_koordinat":"perlu_diisi_user"},
{"id":"dpmptsp","nama":"DPMPTSP Kota Batam","kategori":"pemerintahan","subkategori":"perizinan","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Pengelola MPP (alamat kantor perlu cek)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://mpp.batam.go.id/","status_koordinat":"perlu_diisi_user"},
{"id":"pln-pusat","nama":"PT PLN Batam Kantor Pusat","kategori":"layanan_publik","subkategori":"listrik","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Putri No. 3, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 463150; CC 123","sumber_url":"https://www.plnbatam.com/hubungi-kami/","status_koordinat":"perlu_diisi_user"},
{"id":"pln-imperium","nama":"PLN Batam Unit Distribusi & Pelayanan Batam Centre","kategori":"layanan_publik","subkategori":"listrik","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Capitol Superblock Imperium Blok B1/B2A, Jl. Jend. Sudirman, Baloi","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 7482654","sumber_url":"https://www.plnbatam.com/hubungi-kami/","status_koordinat":"perlu_diisi_user"},
{"id":"pln-tiban","nama":"PLN Batam UP3 Tiban","kategori":"layanan_publik","subkategori":"listrik","kecamatan":"Sekupang","kelurahan":null,"alamat":"Ruko Golden Sand Blok A No. 12B-15, Tiban (sejak 4 Agustus 2025)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.plnbatam.com/pln-batam-resmikan-kantor-baru-up3-tiban-untuk-tingkatkan-pelayanan-pelangga/","status_koordinat":"perlu_diisi_user"},
{"id":"pln-batuaji","nama":"PLN Batam Kantor Pelayanan Batu Aji","kategori":"layanan_publik","subkategori":"listrik","kecamatan":"Batu Aji","kelurahan":null,"alamat":"Ruko Mitra Halim Perkasa (SP Plaza) Blok DD No. 3-3A","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 392821","sumber_url":"https://www.plnbatam.com/hubungi-kami/","status_koordinat":"perlu_diisi_user"},
{"id":"pln-nagoya","nama":"PLN Batam Kantor Pelayanan Nagoya","kategori":"layanan_publik","subkategori":"listrik","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Nagoya (detail perlu cek)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.plnbatam.com/hubungi-kami/","status_koordinat":"perlu_diisi_user"},
{"id":"bpjstk-nagoya","nama":"BPJS Ketenagakerjaan Batam Nagoya","kategori":"layanan_publik","subkategori":"bpjs_tk","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Jl. Imam Bonjol, Gd. Graha Nagoya Mas Lt. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 458324","sumber_url":"https://www.bpjsketenagakerjaan.go.id/kantor-cabang/9/909/index.html","status_koordinat":"perlu_diisi_user"},
{"id":"bpjstk-sekupang","nama":"BPJS Ketenagakerjaan Batam Sekupang","kategori":"layanan_publik","subkategori":"bpjs_tk","kecamatan":"Sekupang","kelurahan":"Tiban Baru","alamat":"Jl. Gajah Mada, Ruko Tiban Impian Blok A1 No. 1-3","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 7496442","sumber_url":"https://www.bpjsketenagakerjaan.go.id/kantor-cabang/9/909/index.html","status_koordinat":"perlu_diisi_user"},
{"id":"bpjskes-batam","nama":"BPJS Kesehatan KC Batam","kategori":"layanan_publik","subkategori":"bpjs_kes","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Gurindam, Batam Centre (data 2018, cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 4800571","sumber_url":"https://janganganggur.blogspot.com/2018/04/daftar-alamat-kantor-kantor-bpjs.html","status_koordinat":"perlu_diisi_user"},
{"id":"polresta-barelang","nama":"Polresta Barelang","kategori":"keamanan","subkategori":"polres","kecamatan":"Batam Kota","kelurahan":"Sukajadi","alamat":"Jl. Sudirman No. 4","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 457691","sumber_url":"https://restabarelang.kepri.polri.go.id/profil/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-lubukbaja","nama":"Polsek Lubuk Baja","kategori":"keamanan","subkategori":"polsek","kecamatan":"Lubuk Baja","kelurahan":"Baloi Indah","alamat":"Jl. Bunga Raya","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 457212","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-batamkota","nama":"Polsek Batam Kota","kategori":"keamanan","subkategori":"polsek","kecamatan":"Batam Kota","kelurahan":"Baloi Permai","alamat":"Jl. Engku Putri","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 463380","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-sekupang","nama":"Polsek Sekupang","kategori":"keamanan","subkategori":"polsek","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Ir. Sutami","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 321744","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-nongsa","nama":"Polsek Nongsa","kategori":"keamanan","subkategori":"polsek","kecamatan":"Nongsa","kelurahan":"Batu Besar","alamat":"Jl. Hasanuddin","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 311110","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-batuaji","nama":"Polsek Batu Aji","kategori":"keamanan","subkategori":"polsek","kecamatan":"Batu Aji","kelurahan":"Tanjung Uncang","alamat":"Jl. Brigjen Katamso","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 393162","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-batuampar","nama":"Polsek Batu Ampar","kategori":"keamanan","subkategori":"polsek","kecamatan":"Batu Ampar","kelurahan":null,"alamat":"Jl. Yos Sudarso","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 432573","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-bengkong","nama":"Polsek Bengkong","kategori":"keamanan","subkategori":"polsek","kecamatan":"Bengkong","kelurahan":"Bengkong Laut","alamat":"Bengkong Laut","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 413110","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-seibeduk","nama":"Polsek Sei Beduk","kategori":"keamanan","subkategori":"polsek","kecamatan":"Sei Beduk","kelurahan":null,"alamat":"Jl. Kapling Sei Pancur","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 736234","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-sagulung","nama":"Polsek Sagulung","kategori":"keamanan","subkategori":"polsek","kecamatan":"Sagulung","kelurahan":null,"alamat":"perlu cek","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":null,"sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-belakangpadang","nama":"Polsek Belakang Padang","kategori":"keamanan","subkategori":"polsek","kecamatan":"Belakang Padang","kelurahan":null,"alamat":"perlu cek","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":null,"sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-galang","nama":"Polsek Galang","kategori":"keamanan","subkategori":"polsek","kecamatan":"Galang","kelurahan":null,"alamat":"Kecamatan Galang","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":null,"sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-kkp","nama":"Polsek Kawasan Pelabuhan","kategori":"keamanan","subkategori":"polsek","kecamatan":null,"kelurahan":null,"alamat":"perlu cek","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":null,"sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"polsek-kkb","nama":"Polsek Kawasan Bandara Hang Nadim","kategori":"keamanan","subkategori":"polsek","kecamatan":"Nongsa","kelurahan":"Batu Besar","alamat":"Bandara Hang Nadim","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 479276","sumber_url":"https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-dinas","nama":"Dinas Pemadam Kebakaran & Penyelamatan Kota Batam","kategori":"keamanan","subkategori":"damkar","kecamatan":"Sekupang","kelurahan":null,"alamat":"Jl. Pramuka No. 2, Sekupang","lat":null,"lng":null,"jam_layanan":"Darurat 24 jam (113)","kontak":"(0778) 325622","sumber_url":"https://damkar.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-seipanas","nama":"Pos Damkar Sei Panas","kategori":"keamanan","subkategori":"damkar","kecamatan":"Batam Kota","kelurahan":"Sungai Panas","alamat":"Jl. Laksamana Bintan","lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 427366","sumber_url":"https://damkar.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-kabil","nama":"Pos Damkar Kabil","kategori":"keamanan","subkategori":"damkar","kecamatan":"Nongsa","kelurahan":"Kabil","alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 7100011","sumber_url":"https://damkar.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-tembesi","nama":"Pos Damkar Tembesi","kategori":"keamanan","subkategori":"damkar","kecamatan":"Sagulung","kelurahan":"Tembesi","alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"0811-7747-000","sumber_url":"https://damkar.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-bp-sekupang","nama":"Pos Damkar BP Batam Sekupang","kategori":"keamanan","subkategori":"damkar","kecamatan":"Sekupang","kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 322233","sumber_url":"https://kepri.co.id/14/05/2023/kalau-ada-kebakaran-atau-keadaan-darurat-hubungi-08116060113-damkar-bp-batam-siap-meluncur/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-bp-sagulung","nama":"Pos Damkar BP Batam Sagulung","kategori":"keamanan","subkategori":"damkar","kecamatan":"Sagulung","kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 392317","sumber_url":"https://kepri.co.id/14/05/2023/kalau-ada-kebakaran-atau-keadaan-darurat-hubungi-08116060113-damkar-bp-batam-siap-meluncur/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-bp-batuampar","nama":"Pos Damkar BP Batam Batu Ampar","kategori":"keamanan","subkategori":"damkar","kecamatan":"Batu Ampar","kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"(0778) 412324","sumber_url":"https://kepri.co.id/14/05/2023/kalau-ada-kebakaran-atau-keadaan-darurat-hubungi-08116060113-damkar-bp-batam-siap-meluncur/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-bp-punggur","nama":"Pos Damkar BP Batam Punggur","kategori":"keamanan","subkategori":"damkar","kecamatan":"Nongsa","kelurahan":"Kabil","alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"0811-7760-602","sumber_url":"https://kepri.co.id/14/05/2023/kalau-ada-kebakaran-atau-keadaan-darurat-hubungi-08116060113-damkar-bp-batam-siap-meluncur/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-bp-nongsa","nama":"Pos Damkar BP Batam Nongsa","kategori":"keamanan","subkategori":"damkar","kecamatan":"Nongsa","kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"0812-7552-5937","sumber_url":"https://kepri.co.id/14/05/2023/kalau-ada-kebakaran-atau-keadaan-darurat-hubungi-08116060113-damkar-bp-batam-siap-meluncur/","status_koordinat":"perlu_diisi_user"},
{"id":"damkar-bp-duriangkang","nama":"Pos Damkar BP Batam Duriangkang (call center)","kategori":"keamanan","subkategori":"damkar","kecamatan":"Sei Beduk","kelurahan":"Duriangkang","alamat":null,"lat":null,"lng":null,"jam_layanan":"24 jam","kontak":"0811-6060-113","sumber_url":"https://kepri.co.id/14/05/2023/kalau-ada-kebakaran-atau-keadaan-darurat-hubungi-08116060113-damkar-bp-batam-siap-meluncur/","status_koordinat":"perlu_diisi_user"},
{"id":"pn-batam","nama":"Pengadilan Negeri Batam","kategori":"pemerintahan","subkategori":"pengadilan","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Haji Tua, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 468828","sumber_url":"https://pn-batam.go.id/index.php/alamat/","status_koordinat":"perlu_diisi_user"},
{"id":"pa-batam","nama":"Pengadilan Agama Batam Kelas IA","kategori":"pemerintahan","subkategori":"pengadilan","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. R.E. Martadinata No. 5","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 323308","sumber_url":"https://pa-batam.go.id/tentang-pengadian/profile-pengadilan/alamat-pengadilan","status_koordinat":"perlu_diisi_user"},
{"id":"kejari-batam","nama":"Kejaksaan Negeri Batam","kategori":"pemerintahan","subkategori":"kejaksaan","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Putri, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 461828","sumber_url":"https://direktori.batam.go.id/index.php/ru/ads/58451516c941f/instansi_vertikal/Kejaksaan-Negeri-Batam","status_koordinat":"perlu_diisi_user"},
{"id":"bpn-batam","nama":"Kantor Pertanahan Kota Batam","kategori":"pemerintahan","subkategori":"pertanahan","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Jaksa Agung R. Soeprapto","lat":null,"lng":null,"jam_layanan":null,"kontak":"WA 0851-5000-0722","sumber_url":"https://kot-batam.atrbpn.go.id/kontak-kami","status_koordinat":"perlu_diisi_user"},
{"id":"disnaker-batam","nama":"Dinas Tenaga Kerja Kota Batam","kategori":"pemerintahan","subkategori":"disnaker","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Kartini I No. 29-30","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 327601","sumber_url":"https://kepriau.com/daftar-alamat-kantor-dinas-kota-batam/","status_koordinat":"perlu_diisi_user"},
{"id":"kemenag-batam","nama":"Kantor Kementerian Agama Kota Batam","kategori":"pemerintahan","subkategori":"kemenag","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Masjid Baiturrahman No. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://batam.kemenag.go.id/main/pegawai?page_hal=4","status_koordinat":"perlu_diisi_user"},
{"id":"perpus-kota","nama":"Perpustakaan Daerah / Dispusip Kota Batam","kategori":"perpustakaan","subkategori":"perpustakaan_umum","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Kantor Dinas Bersama, Jl. Raja Isa No. 17 Lt. 4, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"dispusip@batam.go.id","sumber_url":"https://dispusip.batam.go.id/keanggotaan/","status_koordinat":"perlu_diisi_user"},
{"id":"perpus-keliling","nama":"Perpustakaan Keliling Dispusip Batam","kategori":"perpustakaan","subkategori":"perpustakaan_keliling","kecamatan":null,"kelurahan":null,"alamat":"Bergerak; ajukan permohonan ke Dispusip","lat":null,"lng":null,"jam_layanan":"Terjadwal","kontak":"dispusip@batam.go.id","sumber_url":"https://dispusip.batam.go.id/layanan-kerjasama/","status_koordinat":"perlu_diisi_user"},
{"id":"perpus-jabalarafah","nama":"Perpustakaan Umum Masjid Jabal Arafah","kategori":"perpustakaan","subkategori":"perpustakaan_komunitas","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Jl. Imam Bonjol","lat":null,"lng":null,"jam_layanan":"Setiap hari 08.00-19.00","kontak":"+62 811 7087 997","sumber_url":"https://jabalarafahbatam.com/perpustakaan-internet/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-sekupang","nama":"Puskesmas Sekupang","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Raja Haji No. 6","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 8326339","sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-tibanbaru","nama":"Puskesmas Tiban Baru","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Sekupang","kelurahan":"Tiban Baru","alamat":"Komp. Tiban Koperasi Blok K No. 84","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 3553911","sumber_url":"https://batam.tribunnews.com/2019/07/17/daftar-lokasi-dan-alamat-puskesmas-di-kota-batam-provinsi-kepri","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-mentarau","nama":"Puskesmas Mentarau","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Sekupang","kelurahan":"Tiban Indah","alamat":"Komp. Ciptaland Mentarau","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-batuaji","nama":"Puskesmas Batu Aji","kategori":"kesehatan","subkategori":"puskesmas_non_rawat_inap","kecamatan":"Batu Aji","kelurahan":"Buliang","alamat":"Jl. Rindang Garden","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 363063","sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-tanjunguncang","nama":"Puskesmas Tanjung Uncang","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Batu Aji","kelurahan":"Tanjung Uncang","alamat":"Jl. Brigjen Katamso No. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-seilangkai","nama":"Puskesmas Sei Langkai","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Sagulung","kelurahan":"Sungai Langkai","alamat":"Jl. Utama Kavling Baru","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 369873","sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-seilekop","nama":"Puskesmas Sei Lekop","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Sagulung","kelurahan":"Sungai Lekop","alamat":"Kavling Pelopor","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 7368430","sumber_url":"https://batam.tribunnews.com/2019/07/17/daftar-lokasi-dan-alamat-puskesmas-di-kota-batam-provinsi-kepri","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-seipancur","nama":"Puskesmas Sei Pancur","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Sei Beduk","kelurahan":"Tanjung Piayu","alamat":"Jl. S. Parman Kav. Sei Pancur","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-kabil","nama":"Puskesmas Kabil","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Nongsa","kelurahan":"Kabil","alamat":"Jl. Hasanuddin No. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-sambau","nama":"Puskesmas Sambau","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Nongsa","kelurahan":"Sambau","alamat":"Jl. Hang Lekiu No. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://batam.tribunnews.com/2019/07/17/daftar-lokasi-dan-alamat-puskesmas-di-kota-batam-provinsi-kepri","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-kampungjabi","nama":"Puskesmas Kampung Jabi","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Nongsa","kelurahan":"Batu Besar","alamat":"Jl. Hang Kesturi","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-botania","nama":"Puskesmas Botania","kategori":"kesehatan","subkategori":"puskesmas_non_rawat_inap","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Komp. Botania Garden","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-baloipermai","nama":"Puskesmas Baloi Permai","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Batam Kota","kelurahan":"Baloi Permai","alamat":"Graha Legenda Malaka","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-seipanas","nama":"Puskesmas Sei Panas","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Bengkong","kelurahan":"Bengkong Indah","alamat":"Jl. Laksamana Bintan","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 450535","sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-tanjungbuntung","nama":"Puskesmas Tanjung Buntung","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Bengkong","kelurahan":"Tanjung Buntung","alamat":null,"lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-lubukbaja","nama":"Puskesmas Lubuk Baja","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Lubuk Baja","kelurahan":"Tanjung Uma","alamat":"Jl. Duyung (cek ulang)","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-tanjungsengkuang","nama":"Puskesmas Tanjung Sengkuang","kategori":"kesehatan","subkategori":"puskesmas_non_rawat_inap","kecamatan":"Batu Ampar","kelurahan":"Tanjung Sengkuang","alamat":"Jl. Tenggiri","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-belakangpadang","nama":"Puskesmas Belakang Padang","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Belakang Padang","kelurahan":"Tanjung Sari","alamat":"Jl. Hang Tuah No. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-bulang","nama":"Puskesmas Bulang","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Bulang","kelurahan":"Pulau Buluh","alamat":"Jl. Zakaria Ahmad","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-galang","nama":"Puskesmas Galang","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Galang","kelurahan":"Sembulang","alamat":"Jl. Batin Limat No. 15","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pkm-rempangcate","nama":"Puskesmas Rempang Cate","kategori":"kesehatan","subkategori":"puskesmas_rawat_inap","kecamatan":"Galang","kelurahan":"Rempang Cate","alamat":"Jl. Trans Barelang","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"rs-embungfatimah","nama":"RSUD Embung Fatimah","kategori":"kesehatan","subkategori":"rs_tipe_b","kecamatan":"Batu Aji","kelurahan":"Bukit Tempayan","alamat":"Jl. Pertiwi No. 27","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-awalbros","nama":"RS Awal Bros Batam","kategori":"kesehatan","subkategori":"rs_tipe_a","kecamatan":"Lubuk Baja","kelurahan":"Baloi Indah","alamat":"Jl. Gajah Mada No. 1","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-bhayangkara","nama":"RS Bhayangkara Batam","kategori":"kesehatan","subkategori":"rs_tipe_d","kecamatan":"Nongsa","kelurahan":"Batu Besar","alamat":"Jl. Dang Merdu No. 2","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-budikemuliaan","nama":"RS Budi Kemuliaan","kategori":"kesehatan","subkategori":"rs_tipe_b","kecamatan":"Batu Ampar","kelurahan":"Kampung Seraya","alamat":"Jl. Budi Kemuliaan No. 1","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-camatha","nama":"RS Camatha Sahidya","kategori":"kesehatan","subkategori":"rs_tipe_c","kecamatan":"Sei Beduk","kelurahan":"Muka Kuning","alamat":"Jl. Jend. Ahmad Yani No. 8","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-charismedika","nama":"RS Charis Medika","kategori":"kesehatan","subkategori":"rs_tipe_d","kecamatan":"Batu Aji","kelurahan":"Buliang","alamat":"Jl. Pahlawan No. 1","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-galang","nama":"RSKI Pulau Galang","kategori":"kesehatan","subkategori":"rs_khusus","kecamatan":"Galang","kelurahan":"Sijantung","alamat":"Jl. Trans Barelang No. 24","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-grahahermine","nama":"RS Graha Hermine","kategori":"kesehatan","subkategori":"rs_tipe_c","kecamatan":"Batu Aji","kelurahan":"Buliang","alamat":"Jl. Brigjen Katamso No. 15","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-harapanbunda","nama":"RS Harapan Bunda","kategori":"kesehatan","subkategori":"rs_tipe_c","kecamatan":"Batu Ampar","kelurahan":"Kampung Seraya","alamat":"Jl. Seraya No. 1","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-keluargahusada","nama":"RS Keluarga Husada","kategori":"kesehatan","subkategori":"rs_tipe_c","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Jl. Tengku Sulung No. 12","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-bpbatam","nama":"RS BP Batam (RS Otorita)","kategori":"kesehatan","subkategori":"rs_tipe_b","kecamatan":"Sekupang","kelurahan":"Tanjung Pinggir","alamat":"Jl. Dr. Cipto Mangunkusumo No. 1","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-elisabeth-lb","nama":"RS Santa Elisabeth Lubuk Baja","kategori":"kesehatan","subkategori":"rs_tipe_c","kecamatan":"Lubuk Baja","kelurahan":"Lubuk Baja Kota","alamat":"Jl. Anggrek No. 2","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-elisabeth-bk","nama":"RS Santa Elisabeth Batam Kota","kategori":"kesehatan","subkategori":"rs_tipe_c","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Jl. Raja Ali Kelana No. 37","lat":null,"lng":null,"jam_layanan":"IGD 24 jam","kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-soedarsono","nama":"RS Soedarsono Darmosoewito","kategori":"kesehatan","subkategori":"rs_tipe_c","kecamatan":"Nongsa","kelurahan":"Kabil","alamat":"Jl. Hang Kasturi No. 4","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rsia-frisdhyangel","nama":"RSIA Frisdhy Angel","kategori":"kesehatan","subkategori":"rsia_tipe_c","kecamatan":"Lubuk Baja","kelurahan":"Lubuk Baja Kota","alamat":"Jl. Raden Patah No. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rsia-griyamedika","nama":"RSIA Griya Medika","kategori":"kesehatan","subkategori":"rsia_tipe_c","kecamatan":"Batam Kota","kelurahan":"Sungai Panas","alamat":"Jl. Laksamana Bintan No. 3","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rsia-ksi","nama":"RSIA Kasih Sayang Ibu","kategori":"kesehatan","subkategori":"rsia_tipe_c","kecamatan":"Batam Kota","kelurahan":"Taman Baloi","alamat":"Jl. Raja H. Fisabilillah No. 11","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rsia-mutiaraaini","nama":"RSIA Mutiara Aini","kategori":"kesehatan","subkategori":"rsia_tipe_c","kecamatan":"Batu Aji","kelurahan":"Buliang","alamat":"Jl. Batu Aji II No. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rsia-nuruddiniyah","nama":"RSIA Nuruddiniyah","kategori":"kesehatan","subkategori":"rsia_tipe_b","kecamatan":"Batam Kota","kelurahan":"Sungai Panas","alamat":"Jl. Raya Sungai Panas No. 25","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rsia-permatahati","nama":"RSIA Permata Hati","kategori":"kesehatan","subkategori":"rsia_tipe_c","kecamatan":"Lubuk Baja","kelurahan":"Lubuk Baja Kota","alamat":"Jl. Bunga No. 3A","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"rs-bundahalimah","nama":"RS Hj. Bunda Halimah","kategori":"kesehatan","subkategori":"rs_tipe_b","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Jl. Uniba Kawasan Uniba No. A09","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"pura-amertabhuana","nama":"Pura Agung Amerta Bhuana","kategori":"ibadah","subkategori":"pura","kecamatan":"Sekupang","kelurahan":null,"alamat":"Jl. Gajah Mada No. 3, Sei Ladi","lat":1.112828,"lng":104.002754,"jam_layanan":null,"kontak":null,"sumber_url":"https://batamgems.com/id/place/pura-agung-amerta-bhuana","status_koordinat":"perlu_cek_ulang"},
{"id":"masjid-jabalarafah","nama":"Masjid Jabal Arafah","kategori":"ibadah","subkategori":"masjid","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Jl. Imam Bonjol","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://jabalarafahbatam.com/perpustakaan-internet/","status_koordinat":"perlu_diisi_user"},
{"id":"tpu-seitemiang","nama":"TPU Sei Temiang","kategori":"pemakaman","subkategori":"tpu_multiagama","kecamatan":"Sekupang","kelurahan":"Tanjung Riau","alamat":"Sei Temiang, Marina, Tanjung Riau","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://batampos.jawapos.com/berita/2424064338/pemko-batam-usulkan-enam-tempat-pemakaman-baru-ini-lokasinya","status_koordinat":"perlu_diisi_user"},
{"id":"tpu-seitemiang-kristen","nama":"TPU Sei Temiang - Lahan Kristen Baru","kategori":"pemakaman","subkategori":"tpu_kristen","kecamatan":"Sekupang","kelurahan":"Tanjung Riau","alamat":"Sebelah makam Tionghoa, dekat Jl. Ahmad Dahlan","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://batampos.jawapos.com/berita/2424616990/pemakaman-baru-umat-kristen-di-sei-temiang-mulai-digunakan","status_koordinat":"perlu_diisi_user"},
{"id":"tpu-tamanlanggeng","nama":"TPU Taman Langgeng / Sei Panas","kategori":"pemakaman","subkategori":"tpu","kecamatan":"Batam Kota","kelurahan":"Sungai Panas","alamat":"Komp. Inti Batam, Jl. Laksamana Bintan No. 7","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.familysearch.org/en/wiki/Riau_Islands,_Indonesia_Cemeteries","status_koordinat":"perlu_diisi_user"},
{"id":"tpu-kavlingbagan","nama":"TPU Kavling Bagan","kategori":"pemakaman","subkategori":"tpu","kecamatan":null,"kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://batampos.jawapos.com/berita/2424064338/pemko-batam-usulkan-enam-tempat-pemakaman-baru-ini-lokasinya","status_koordinat":"perlu_diisi_user"},
{"id":"tpu-sambau","nama":"TPU Sambau","kategori":"pemakaman","subkategori":"tpu","kecamatan":"Nongsa","kelurahan":"Sambau","alamat":"Sambau","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://batampos.co.id/2019/06/12/biaya-pemakaman-di-kota-batam/","status_koordinat":"perlu_diisi_user"},
{"id":"makam-tionghoa-sambau","nama":"Pemakaman Tionghoa Sambau","kategori":"pemakaman","subkategori":"makam_tionghoa","kecamatan":"Nongsa","kelurahan":"Sambau","alamat":"Kompleks Pemakaman Sambau","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.familysearch.org/en/wiki/Riau_Islands,_Indonesia_Cemeteries","status_koordinat":"perlu_diisi_user"},
{"id":"krematorium-halim","nama":"Krematorium Yayasan Halim Batam","kategori":"pemakaman","subkategori":"krematorium","kecamatan":"Nongsa","kelurahan":"Sambau","alamat":"Sambau","lat":null,"lng":null,"jam_layanan":null,"kontak":"+62 778 425205","sumber_url":"https://www.familysearch.org/en/wiki/Riau_Islands,_Indonesia_Cemeteries","status_koordinat":"perlu_diisi_user"},
{"id":"stadion-taj","nama":"Stadion Temenggung Abdul Jamal","kategori":"olahraga","subkategori":"stadion","kecamatan":"Sei Beduk","kelurahan":"Muka Kuning","alamat":"Jl. Ahmad Yani, Muka Kuning","lat":null,"lng":null,"jam_layanan":"Reservasi via HGAT BP Batam","kontak":null,"sumber_url":"https://bupa.bpbatam.go.id/unit-usaha/kawasan-temenggung-abdul-jamal/","status_koordinat":"perlu_diisi_user"},
{"id":"gor-taj","nama":"Sport Hall Temenggung Abdul Jamal","kategori":"olahraga","subkategori":"gor","kecamatan":"Sei Beduk","kelurahan":"Muka Kuning","alamat":"Kompleks TAJ, Jl. Ahmad Yani","lat":null,"lng":null,"jam_layanan":"Reservasi via HGAT BP Batam","kontak":null,"sumber_url":"https://bupa.bpbatam.go.id/unit-usaha/kawasan-temenggung-abdul-jamal/","status_koordinat":"perlu_diisi_user"},
{"id":"padel-padelhouse","nama":"The Padel House","kategori":"olahraga","subkategori":"padel","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Komp. Botania, Pasar Botania 2, Jl. Raja Ali Kelana No. 2 Lt. 2","lat":null,"lng":null,"jam_layanan":"Booking via AYO","kontak":null,"sumber_url":"https://metropolis.batampos.co.id/mau-coba-padel-ini-3-rekomendasi-lapangan-padel-terbaik-di-batam/","status_koordinat":"perlu_diisi_user"},
{"id":"padel-playpadel","nama":"Play Padel","kategori":"olahraga","subkategori":"padel","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Teluk Tering","lat":null,"lng":null,"jam_layanan":"Booking via AYO","kontak":null,"sumber_url":"https://ayo.co.id/venues/city/kota-batam","status_koordinat":"perlu_diisi_user"},
{"id":"padel-boxorchid","nama":"Padel Box Orchid","kategori":"olahraga","subkategori":"padel","kecamatan":"Batam Kota","kelurahan":"Taman Baloi","alamat":"Orchid Park, Taman Baloi","lat":null,"lng":null,"jam_layanan":"Booking via AYO","kontak":null,"sumber_url":"https://ayo.co.id/venues/city/kota-batam","status_koordinat":"perlu_diisi_user"},
{"id":"padel-tamora","nama":"Tamora Padel Club","kategori":"olahraga","subkategori":"padel","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Plus code 43J7+4C Belian","lat":null,"lng":null,"jam_layanan":"Booking via AYO","kontak":null,"sumber_url":"https://ayo.co.id/v/tamora-padel-club-batam","status_koordinat":"perlu_diisi_user"},
{"id":"feri-batamcentre","nama":"Terminal Feri Internasional Batam Centre","kategori":"transportasi","subkategori":"terminal_feri","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Batam Centre","lat":1.130861,"lng":104.055231,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.wikidata.org/wiki/Q12504166","status_koordinat":"terverifikasi"},
{"id":"feri-sekupang","nama":"Terminal Feri Sekupang","kategori":"transportasi","subkategori":"terminal_feri","kecamatan":"Sekupang","kelurahan":null,"alamat":"Jl. R.E. Martadinata","lat":1.125328,"lng":103.925633,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.waze.com/live-map/directions/sekupang-international-ferry-terminal-re-martadinata-batam?to=place.w.68091915.681115761.3171608","status_koordinat":"perlu_cek_ulang"},
{"id":"feri-harbourbay","nama":"Terminal Feri Harbour Bay","kategori":"transportasi","subkategori":"terminal_feri","kecamatan":"Batu Ampar","kelurahan":null,"alamat":"Harbour Bay","lat":1.153889,"lng":103.997111,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.wikidata.org/wiki/Q65091241","status_koordinat":"terverifikasi"},
{"id":"feri-nongsapura","nama":"Terminal Feri Nongsapura","kategori":"transportasi","subkategori":"terminal_feri","kecamatan":"Nongsa","kelurahan":null,"alamat":"Nongsa","lat":1.17283,"lng":104.07809,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.tripadvisor.com.sg/Attraction_Review-g2543930-d12199842-Reviews-Nongsa_Pura_Ferry_Terminal-Nongsa_Batam_Riau_Archipelago_Riau_Islands_Province.html","status_koordinat":"perlu_cek_ulang"},
{"id":"feri-telagapunggur","nama":"Pelabuhan Telaga Punggur","kategori":"transportasi","subkategori":"terminal_feri_domestik","kecamatan":"Nongsa","kelurahan":"Kabil","alamat":"Telaga Punggur","lat":1.035230,"lng":104.133397,"jam_layanan":null,"kontak":null,"sumber_url":"https://www.wikidata.org/wiki/Q14236384","status_koordinat":"terverifikasi"},
{"id":"feri-waterfront","nama":"Terminal Feri Waterfront City (Teluk Senimba)","kategori":"transportasi","subkategori":"terminal_feri","kecamatan":"Sekupang","kelurahan":"Tanjung Riau","alamat":"Marina City, Tanjung Riau","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://shipnext.com/port/waterfront-city-ferry-terminal-idn","status_koordinat":"perlu_diisi_user"},
{"id":"feri-goldcoast","nama":"Gold Coast Ferry Terminal Bengkong","kategori":"transportasi","subkategori":"terminal_feri","kecamatan":"Bengkong","kelurahan":null,"alamat":"Kawasan Pantai Indah Mutiara Blok B No. 36-37, Golden City","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"pompong-sekupang","nama":"Pelabuhan Rakyat (Pancung) Sekupang","kategori":"transportasi","subkategori":"pelantar_pompong","kecamatan":"Sekupang","kelurahan":null,"alamat":"Sebelah terminal domestik Sekupang, Jl. R.E. Martadinata","lat":null,"lng":null,"jam_layanan":"Pagi-sore, tiap 15-30 menit","kontak":null,"sumber_url":"https://metro.batampos.co.id/meski-diguyur-hujan-transportasi-laut-ke-belakang-padang-normal/","status_koordinat":"perlu_diisi_user"},
{"id":"pompong-belakangpadang","nama":"Pelabuhan Belakang Padang (Tanjung Sari)","kategori":"transportasi","subkategori":"pelantar_pompong","kecamatan":"Belakang Padang","kelurahan":"Tanjung Sari","alamat":"Belakang Padang","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"sumber_url":"https://metro.batampos.co.id/meski-diguyur-hujan-transportasi-laut-ke-belakang-padang-normal/","status_koordinat":"perlu_diisi_user"},
{"id":"bandara-hangnadim","nama":"Bandara Internasional Hang Nadim","kategori":"transportasi","subkategori":"bandara","kecamatan":"Nongsa","kelurahan":"Batu Besar","alamat":"Jl. Hang Nadim No. 01","lat":1.120833,"lng":104.118611,"jam_layanan":null,"kontak":"(0778) 761507","sumber_url":"https://www.wikidata.org/wiki/Q780450","status_koordinat":"terverifikasi"},
{"id":"publik-engkuputri","nama":"Dataran/Alun-alun Engku Putri","kategori":"ruang_publik","subkategori":"alun_alun","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Putri No. 1","lat":1.106639,"lng":104.052681,"jam_layanan":null,"kontak":null,"sumber_url":"https://batamgems.com/place/dataran-engku-putri-batam-center","status_koordinat":"perlu_cek_ulang"},
{"id":"wisata-barelang1","nama":"Jembatan Barelang 1 (Tengku Fisabilillah)","kategori":"ruang_publik","subkategori":"landmark","kecamatan":"Bulang","kelurahan":"Setokok","alamat":"Jembatan Barelang 1","lat":0.981694,"lng":104.041500,"jam_layanan":null,"kontak":null,"sumber_url":"https://en.wikipedia.org/wiki/List_of_bridges_in_Indonesia","status_koordinat":"terverifikasi"}
]
```

---

## Daftar Tempat yang Koordinatnya Belum Pasti (untuk diisi user)

**Perlu cek ulang (sudah ada angka, tapi dari sumber pihak ketiga):**
- Pemerintahan: Kantor Camat Batam Kota
- Ibadah: Pura Agung Amerta Bhuana
- Transportasi: Terminal Feri Sekupang, Terminal Feri Nongsapura
- Ruang publik: Alun-alun Engku Putri

**Perlu diisi user (koordinat null):**
- **Pemerintahan:** 11 kantor camat (Batu Aji, Batu Ampar, Belakang Padang, Bengkong, Bulang, Galang, Lubuk Baja, Nongsa, Sagulung, Sei Beduk, Sekupang); 64 kantor kelurahan; Kantor Wali Kota; Disdukcapil; MPP; Gerai Disdukcapil MPP; DPMPTSP; PN Batam; PA Batam; Kejari; BPN; Disnaker; Kemenag; DPRD; kantor pos; 12 KUA
- **Layanan publik:** PLN Pusat, PLN Imperium, PLN UP3 Tiban, PLN Batu Aji, PLN Nagoya; BPJS TK Nagoya, BPJS TK Sekupang; BPJS Kesehatan
- **Keamanan:** Polresta Barelang; 13 polsek; kantor Dinas Damkar; 9 pos damkar (Sei Panas, Kabil, Tembesi, Sekupang, Sagulung, Batu Ampar, Punggur, Nongsa, Duriangkang)
- **Perpustakaan:** Perpustakaan Daerah/Dispusip; Perpustakaan Jabal Arafah (Perpustakaan Keliling bergerak, tidak perlu titik)
- **Kesehatan:** 21 puskesmas; 21 rumah sakit; klinik 24 jam, lab, dan apotek 24 jam (belum ada data)
- **Ibadah & pemakaman:** Masjid Jabal Arafah; Pura Satya Dharma; Pura Sekupang; TPU Sei Temiang; lahan Kristen baru Sei Temiang; TPU Taman Langgeng/Sei Panas; TPU Kavling Bagan; TPU Sambau; Pemakaman Tionghoa Sambau; Krematorium Yayasan Halim; gereja, klenteng, dan TMP (belum ada data)
- **Olahraga:** Stadion TAJ; Sport Hall TAJ; The Padel House; Play Padel; Padel Box Orchid; Tamora Padel Club; padel lain di AYO
- **Transportasi:** Waterfront City; Gold Coast Bengkong; Pelabuhan Pancung Sekupang; Pelabuhan Belakang Padang; terminal bus antarkota; SPBU
- **Ruang publik:** Pulau Belakang Padang; Taman Dang Anom, Taman Kolam, Taman Mini, Taman Rusa; pantai dan RTH lainnya
- **Jasa:** seluruh kategori jasa dan servis (diisi lewat locator merek atau kontribusi warga)

## Daftar sumber
- daftar-informasi — https://www.daftar-informasi.web.id/2020/11/Daftar-Kode-Pos-Kota-Batam.html
- Wikipedia — https://id.wikipedia.org/wiki/Daftar_kecamatan_dan_kelurahan_di_Kota_Batam
- tribunnews — https://batam.tribunnews.com/2020/03/23/daftar-21-puskesmas-di-batam-lengkap-dengan-alamatnya
- Wikipedia — https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam
- jawapos — https://batampos.jawapos.com/berita/2424616990/pemakaman-baru-umat-kristen-di-sei-temiang-mulai-digunakan
- pn-batam — https://pn-batam.go.id/index.php/alamat/
- konsultanhukum — https://www.konsultanhukum.net/berita/pengadilan-negeri-batam/
- indiespot — https://indiespot.id/2020/07/09/daftar-no-telepon-dan-alamat-kantor-polisi-polsek-di-wilayah-hukum-polresta-barelang-batam-kepulauan-riau/
- moco — https://ibatam.moco.co.id/howto.html
- avitaliahealth — https://www.avitaliahealth.com/2021/03/rumah-sakit-rs-tipe-b-c-d-di-kota-batam.html
- shipnext — https://shipnext.com/port/waterfront-city-ferry-terminal-idn
