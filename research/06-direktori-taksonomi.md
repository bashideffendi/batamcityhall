# Batam City Hall: Rancangan Direktori dan Seed Data
> task_id: wf-9a2e3cf8-570e-5b8e-88b0-42be19b6a4c9

# Batam City Hall: Rancangan Direktori & Seed Data

Singkatnya: direktori Batam City Hall paling realistis dibangun dengan tiga lapis sumber. Data resmi untuk sekolah, faskes, rumah ibadah, dan kantor layanan publik. OpenStreetMap (Overpass) untuk belanja, transportasi, olahraga, dan ruang publik. Tukang Langganan untuk jasa harian, dokter per spesialis, dan kos, karena dua sumber pertama hampir tidak mencatatnya.

## TL;DR

- **Data resmi cukup jadi tulang punggung 4 kelompok.** Kemendikdasmen mencatat 437 SD sederajat, 240 SMP sederajat, dan 195 SMA/SMK/SLB di Kota Batam (dengan NPSN). Dinkes mencatat 21 puskesmas, 63 pustu, 21 RS, dan 156 klinik (semester 1 2024). Kemenag Batam mencatat 972 masjid. Imigrasi, Samsat, Bea Cukai, KPP, dan Air Batam Hilir punya alamat dan jam resmi.
- **OSM untuk kategori "berbentuk titik" yang jarang ada di data pemerintah:** mal, minimarket, SPBU, halte, lapangan, gym, money changer. Tarik pakai area Overpass dari relasi Kota Batam 10660353 (area id 3610660353), lalu kurasi. Kelengkapan OSM di Batam belum diukur, jadi jalankan query hitung dulu.
- **Tukang Langganan wajib untuk jasa dan dokter per spesialis.** Data resmi tidak memuat bengkel, servis AC, tukang jahit, pijat panggilan, atau jadwal dokter dan status BPJS-nya. Dari contoh tempat di seed, baru sebagian kecil yang koordinatnya terverifikasi; sisanya ditandai `perlu_diisi_user` atau `perlu_cek_ulang`.

## Key Findings

1. **Wilayah dasar sudah pasti.** Kota Batam punya 12 kecamatan dan 64 kelurahan (kode Kemendagri 21.71.01–21.71.12). Jadikan enum kolom `kecamatan`: Batam Kota, Batu Aji, Batu Ampar, Belakang Padang, Bengkong, Bulang, Galang, Lubuk Baja, Nongsa, Sagulung, Sei Beduk, Sekupang.
2. **Kesehatan (Dinkes via Satu Data Batam, rilis 14 Agustus 2024), semester 1 2024:** 3 RS pemerintah, 18 RS swasta, 21 puskesmas, 63 pustu, 156 klinik/polindes, 570 posyandu, total 831 faskes. Klinik turun dari 183 (semester 1 2023), entah karena tutup atau cara pendataan berubah, jadi angka klinik hanya indikatif.
3. **Rumah ibadah: angka antarsumber berbeda.** Kemenag Batam (Satu Jari): 972 masjid (1 Agung, 12 Besar, 849 Jami, 110 di tempat publik). BPS 2022: 912 masjid, 616 musala, 3 pura, 38 vihara. Satu Data Batam 2023 (produsen Kemenag): 75 vihara (35 di Lubuk Baja) dan hanya 52 gereja, padahal tabel FKUB 2019 mencatat 82 gereja Kristen di Kecamatan Batam Kota saja. Anggap angka 52 gereja baru sebagian yang terdata.
4. **Sekolah: Kemendikdasmen paling andal.** SD sederajat 437, SMP sederajat 240. Menengah 195 satuan: SMA 115, SMK 70, SLB 10; terbanyak di Batam Kota (46), Sagulung (27), Sekupang (24). Negeri: 145 SD, 66 SMP, dan 29 SMA negeri ikut SPMB 2025/2026.
5. **Hotel: tampilkan sebagai rentang.** Menurut GoKepri, yang mengutip data BPS Kota Batam, ada 75 hotel berbintang dan 160 nonbintang (9.004 dan 5.065 kamar). GoWest.id, yang juga mengutip BPS, menyebut angka berbeda: 69 berbintang dan 108 nonbintang. Disbudpar menyebut 275 hotel. Kompilasi lain: 69 berbintang dari 282 properti, 142 di Lubuk Baja. Rujukan primer terbaik: Tabel 24.1 "Jumlah Hotel Menurut Kecamatan" di Kompilasi Statistik Sektoral 2025 (Satu Data Batam), plus SISPEK Disbudpar untuk kelas bintang.
6. **Transportasi.** Trans Batam punya 9 koridor aktif. Jumlah busnya berbeda antarsumber: 65 unit menurut Wikipedia/Traveloka, sedangkan Kepala UPT Trans Batam Bambang Cipto kepada Kompas.id (13 September 2024) menyebut "ada 45 bus yang melayani sembilan koridor". Tarif Rp5.000 umum/Rp2.500 pelajar, wajib nontunai sejak 1 Januari 2023. Menurut Terasbatam, Trans Batam masuk Bandara Hang Nadim mulai 1 Juni 2026 dengan 19 bus BTS baru. Feri ke Singapura berangkat dari 5 pelabuhan (Batam Centre, Sekupang, Nongsapura, Harbour Bay, Gold Coast Bengkong), plus Waterfront City/Marina Teluk Senimba dengan jadwal terbatas.
7. **Air bersih bukan PDAM.** Sejak 15 November 2020 SPAM Batam di bawah BP Batam, dioperasikan PT Moya Indonesia lewat PT Air Batam Hilir. KPP Bengkong pindah ke Baraka Business Center mulai 8 Desember 2025, jadi alamat dari berita 2020 sudah basi.

## Tabel Taksonomi Lengkap

Cara isi: **R** = data resmi, **O** = OSM/Overpass, **W** = warga/Tukang Langganan, **K** = kurasi manual. Huruf pertama = sumber utama.

| Kategori | Subkategori | Tag OSM | Sumber utama | Isi |
|---|---|---|---|---|
| Belanja | Pasar tradisional/basah | `amenity=marketplace` | OSM, berita lokal, Disperindag | O, K |
| Belanja | Mal | `shop=mall`, `shop=department_store` | OSM | O |
| Belanja | Supermarket / minimarket | `shop=supermarket`, `shop=convenience` + `brand` | OSM | O |
| Belanja | Bahan bangunan | `shop=hardware`, `shop=doityourself`, `shop=trade` | OSM + warga | O, W |
| Belanja | ATK & buku | `shop=stationery`, `shop=books` | OSM | O |
| Belanja | HP, elektronik, komputer | `shop=mobile_phone`, `shop=electronics`, `shop=computer` | OSM | O |
| Belanja | Kain & bahan jahit | `shop=fabric`, `shop=sewing` | Warga + OSM | W, O |
| Belanja | Optik, bayi, mainan, oleh-oleh | `shop=optician`, `shop=baby_goods`, `shop=toys`, `shop=gift` | OSM | O |
| Belanja | Barang bekas/impor | `shop=second_hand` | Warga | W |
| Ruang publik | Taman, playground | `leisure=park`, `leisure=garden`, `leisure=playground` | OSM + Satu Data | O, R |
| Ruang publik | Perpustakaan | `amenity=library` | Satu Data (urusan Perpustakaan) + OSM | R, O |
| Ruang publik | Tempat wisata | `tourism=attraction`, `tourism=viewpoint`, `tourism=museum` | SISPEK Disbudpar + riset terpisah | R, K |
| Ruang publik | Pantai | `natural=beach` | OSM + SISPEK | O, R |
| Ruang publik | Toilet umum | `amenity=toilets` | OSM | O |
| Ibadah | Masjid & musala | `amenity=place_of_worship` + `religion=muslim` | SIMAS, Satu Jari Kemenag Batam | R, O |
| Ibadah | Gereja | `religion=christian` + `denomination=*` | Bimas Kristen/Katolik, FKUB | R, O |
| Ibadah | Vihara, klenteng, pura | `religion=buddhist` / `chinese_folk` / `taoist` / `hindu` | Bimas Buddha/Hindu, FKUB | R |
| Pemakaman | TPU per agama | `landuse=cemetery`, `amenity=grave_yard` + `religion` | OSM + Pemko + warga | O, K |
| Transportasi | Pelabuhan internasional/domestik | `amenity=ferry_terminal` | BP Batam, Imigrasi | R |
| Transportasi | Dermaga pompong | `man_made=pier` | Warga + OSM | W, O |
| Transportasi | Halte Trans Batam | `highway=bus_stop`, relasi `route=bus` | Dishub (SIP TB) + OSM | R, O |
| Transportasi | Bandara | `aeroway=aerodrome` | BP Batam | R |
| Transportasi | SPBU, SPKLU, parkir | `amenity=fuel`, `amenity=charging_station`, `amenity=parking` | OSM | O |
| Kesehatan | Rumah sakit | `amenity=hospital` | Kemenkes (kode RS), Dinkes | R |
| Kesehatan | Puskesmas & pustu | `amenity=clinic` + `healthcare=centre` (simpan `jenis=puskesmas`) | Komdat Kemenkes, Dinkes | R |
| Kesehatan | Klinik | `amenity=clinic` | Dinkes, BPJS | R, O |
| Kesehatan | Apotek, lab | `amenity=pharmacy`, `healthcare=laboratory` | OSM + Dinkes | O, R |
| Kesehatan | Dokter per spesialis | `amenity=doctors` + `healthcare:speciality=*` | Jadwal dokter situs RS + warga | W, K |
| Kesehatan | Dokter gigi | `amenity=dentist` | OSM + warga | O, W |
| Kesehatan | Psikolog/psikiater, fisioterapi, bidan | `healthcare=psychotherapist`, `physiotherapist`, `midwife` | RS + warga | W |
| Kesehatan | Dokter hewan | `amenity=veterinary` | OSM + warga | O, W |
| Pendidikan | PAUD, KB, TK, RA, daycare | `amenity=kindergarten`, `amenity=childcare` | Kemendikdasmen (PAUD), EMIS | R, W |
| Pendidikan | SD/MI, SMP/MTs, SMA/SMK/MA/SLB | `amenity=school` + `isced:level` | Kemendikdasmen, EMIS | R |
| Pendidikan | Universitas, politeknik | `amenity=university`, `amenity=college` | PDDikti | R |
| Pendidikan | Les, bimbel, kursus | `amenity=prep_school`, `language_school`, `music_school`, `driving_school` | OSM + warga | W, O |
| Pemerintahan | Kantor wali kota, kecamatan, kelurahan | `amenity=townhall`, `office=government` | Situs Pemko | R |
| Pemerintahan | Disdukcapil, Samsat, Imigrasi, Bea Cukai, KPP | `office=government` + `government=*` | Situs instansi | R |
| Pemerintahan | BPJS, kantor pos | `office=insurance`, `amenity=post_office` | Situs BPJS, Pos Indonesia | R, O |
| Pemerintahan | PLN Batam, Air Batam Hilir | `office=energy_supplier`, `office=water_utility` | Situs PLN Batam, hilir.airbatam.com | R |
| Pemerintahan | Polisi, damkar | `amenity=police`, `amenity=fire_station` | Polresta, Damkar + OSM | R, O |
| Pemerintahan | BP Batam, KUA | `office=government` | bpbatam.go.id, Kemenag | R |
| Akomodasi | Hotel, guest house, homestay | `tourism=hotel` + `stars`, `tourism=guest_house`, `tourism=hostel` | SISPEK, BPS + OSM | R, O |
| Akomodasi | Apartemen sewa | `tourism=apartment` | OSM + warga | O, W |
| Akomodasi | Kos | (jarang dipetakan) | Warga | W |
| Olahraga | Padel, badminton, futsal, mini soccer, basket, tenis, voli | `leisure=pitch`/`sports_centre` + `sport=*` | OSM + warga (booking) | O, W |
| Olahraga | Kolam renang, gym, golf, stadion | `leisure=swimming_pool`, `fitness_centre`, `golf_course`, `stadium` | OSM | O |
| Jasa | Bengkel, ban, cuci kendaraan | `shop=car_repair`, `shop=motorcycle_repair`, `shop=tyres`, `amenity=car_wash` | Warga + OSM | W, O |
| Jasa | Servis AC, elektronik, HP, laptop, mesin cuci, kulkas | `craft=hvac`, `craft=electronics_repair` | Warga | W |
| Jasa | Tukang kunci, jahit & permak | `shop=locksmith`, `craft=tailor` | Warga | W |
| Jasa | Laundry, salon, barbershop | `shop=laundry`, `shop=hairdresser`, `shop=beauty` | OSM + warga | O, W |
| Jasa | Pijat, refleksi, pijat panggilan | `shop=massage` (panggilan: tanpa titik) | Warga + SISPEK | W |
| Jasa | Fotokopi, percetakan, ekspedisi | `shop=copyshop`, `craft=printer`, `office=courier` | OSM + warga | O, W |
| Jasa | Money changer, bank, ATM | `amenity=bureau_de_change`, `amenity=bank`, `amenity=atm` | OSM + warga | O, W |
| Jasa | Tukang bangunan, listrik, ledeng | `craft=builder`, `craft=electrician`, `craft=plumber` | Warga | W |
| Khas Batam | Agen tiket feri | `shop=travel_agency` | Warga + operator | W |
| Khas Batam | Urusan paspor | lihat Pemerintahan | Imigrasi | R |
| Khas Batam | Titipan/jastip Singapura | (tanpa titik) | Warga | W |
| Khas Batam | Kawasan industri, dormitory, shuttle | `landuse=industrial`, `building=dormitory` | Geoportal BP Batam + OSM | R, O |
| Khas Batam | Klinik MCU kerja, LPK/penyalur kerja | `amenity=clinic`, `office=employment_agency` | Warga + Disnaker | W, R |

## Detail per Kelompok Kategori

Contoh tempat untuk tiap kelompok ada di Seed Data di bawah. Bagian ini fokus ke sumber dan kolom.

### 1. Belanja
**Sumber.** Mal, supermarket, dan minimarket paling efisien dari OSM karena bertitik dan punya `brand`. Pasar tradisional dikurasi dari berita lokal dan Disperindag karena statusnya berubah-ubah. Contohnya **Pasar Induk Jodoh**: Pemko Batam dan PT Usaha Jaya Karya Makmur meneken perjanjian kerja samanya pada Maret 2026 (ANTARA Kepri, GoKepri). Rencananya gedung lima lantai di lahan 2,1 hektare untuk lebih dari 1.800 pedagang, sebagai bagian penataan kawasan Tos 3000. Menurut Infosatelitnews (21 Agustus 2026), konstruksinya sudah berjalan.
**Kolom `atribut`.** `jenis_pasar` (basah/kering/campuran), `jam_ramai`, `metode_bayar`, `parkir`, `brand`, `kelengkapan` (array), `harga_relatif` (1–3).

### 2. Ruang Publik, Wisata, Pantai
**Sumber.** SISPEK Disbudpar memuat destinasi "terverifikasi resmi" lengkap dengan kecamatan, tapi juga diskotik dan salon, jadi wajib difilter. Taman dan pantai dari OSM (poligon → centroid). Perpustakaan dari urusan Perpustakaan di Satu Data Batam.
**Kolom.** `tiket_masuk`, `jam_buka`, `fasilitas`, `ramah_anak`, `aksesibel_kursi_roda`, `akses` (darat/laut), `waktu_terbaik`.

### 3. Ibadah dan Pemakaman
**Sumber.** SIMAS Kemenag dan portal Satu Jari Kemenag Batam (266 dataset dari 9 unit, termasuk Bimas Kristen, Katolik, Hindu, Buddha). FKUB Batam punya daftar rumah ibadah per kecamatan (data 2019). OSM melengkapi koordinat. TPU belum punya dataset terbuka: isi dari OSM (`landuse=cemetery`), lalu minta warga verifikasi agama dan pengelolanya. Catatan: Masjid Sultan Mahmud Riayat Syah ada di Jl. Brigjen Katamso, Tanjung Uncang, Batu Aji, bukan Tiban. Pura dan TPU belum punya contoh terverifikasi.
**Kolom.** `agama`, `denominasi`, `tipologi`, `jadwal_ibadah` (jam, bahasa), `kapasitas`, `fasilitas`, `id_simas`. Makam: `agama_makam`, `pengelola`, `masih_menerima`.

### 4. Transportasi
**Sumber.** Pelabuhan dan bandara dari BP Batam (batamport.bpbatam.go.id). Koordinat di halaman port Batam Centre milik BP Batam kemungkinan salah ketik (01°17'15", seharusnya ~01°07'), jangan dipakai mentah.

Koridor Trans Batam:
- Koridor 1 Sekupang–Batam Centre: 56 halte
- Koridor 2 Tanjung Uncang–Batam Centre: 78 halte
- Koridor 5 Jodoh–Batam Centre: 41 halte
- Koridor 6 Tanjung Piayu–Batam Centre: 58 halte
- Koridor 7 Nongsa–Batam Centre–Bandara Hang Nadim: 76 halte
- Punggur–Nongsa: mulai Juli 2024

Data halte OSM kemungkinan tertinggal. Usulan 27 halte baru dari Kadishub Salim (Batam Pos, November 2024) difokuskan di Koridor 2 (Tanjunguncang–Batam Center) dan Koridor 8 (Punggur–Jodoh). Menurut Kadishub Leo Putra (Batam Pos), sepanjang 2025 Dishub membangun 10 halte baru, ditambah 4 halte dari program CSR.

**Kolom.** Pelabuhan: `tujuan`, `operator` (Batamfast, Majestic, Sindo, Horizon), `internasional`, `ada_imigrasi`, `link_jadwal`. Halte: `koridor`, `tipe_halte`. SPBU: `brand`, `24_jam`, `bbm`.

### 5. Kesehatan
**Sumber.**
- RS: daftar kode RS Kemenkes. Wikipedia "Daftar rumah sakit di Kota Batam" merangkum kode, tipe, dan alamat, tapi tetap cek ulang ke Kemenkes. Tipe RS Awal Bros tercatat A di satu sumber dan B di sumber lain.
- Puskesmas: Komdat Kemenkes (nama, kode, rawat inap/non, alamat).
- Klinik mitra BPJS: aplikasi BPJS.
- Dokter per spesialis: tidak ada data terbuka. Kurasi dari halaman jadwal dokter tiap RS plus Tukang Langganan, dan simpan dokter sebagai entitas terpisah yang terhubung ke banyak tempat praktik.

**Kolom.** RS: `kode_rs`, `tipe`, `kepemilikan`, `igd_24jam`, `terima_bpjs`. Puskesmas: `kode_puskesmas`, `rawat_inap`, `wilayah_kerja`. Dokter: `spesialisasi`, `jadwal`, `terima_bpjs`, `perlu_janji`, `kanal_booking`.

### 6. Pendidikan
**Sumber.** Referensi Kemendikdasmen menyediakan daftar per kecamatan dengan NPSN, alamat, kelurahan, dan status, untuk PAUD, Dikdas, Dikmen, dan Dikmas (kode Kota Batam 316000). Madrasah dari EMIS, kampus dari PDDikti, les dari OSM + warga.

Sekolah swasta harus tampil setara dengan negeri. Disdik Batam menyiapkan 16.044 kursi di 145 SD negeri dan 16.803 kursi di 66 SMP negeri. Menurut Yusal, Kabid Pembinaan SD Disdik Batam (GoKepri, Juni 2026), lulusan SD mencapai sekitar 23.000 siswa, sehingga sekitar 6.000–7.000 siswa tidak tertampung di SMP negeri.

**Kolom.** `npsn`, `jenjang`, `status`, `akreditasi`, `kurikulum`, `agama_basis`, `biaya_relatif`. Les: `mata_pelajaran`, `usia`, `mode`.

### 7. Pemerintahan dan Layanan Publik
**Kolom.** `instansi_induk`, `layanan`, `jam_layanan` (JSON + istirahat), `antrean_online`, `kontak_wa`, `wilayah_kerja`, `layanan_sabtu`.

**Data penting.**
- **Imigrasi Kelas I Khusus TPI Batam:** Jl. Engku Putri No.3, Batam Centre. Senin–Kamis 07.30–16.00 (istirahat 12.00–13.00). Ada ULP Harbourbay, antrean via M-Paspor, Paspor Simpatik hari Sabtu secara berkala, WA 0811-700-2019.
- **Samsat Batam Centre:** Gedung Graha Kepri Lt. 3, Jl. Engku Putri/Raja Isa No.8. Senin–Jumat 08.00–15.00, Sabtu 08.00–12.00. Ada Samsat Corner di BCS Mall dan Kepri Mall.
- **Disdukcapil:** 08.00–15.00, istirahat 12.00–13.00; alamat perlu dicek.
- **KPU Bea Cukai Batam:** Jl. Kuda Laut, Batu Ampar, (0778) 429446.
- **KPP Pratama Batam Utara:** Jl. Kuda Laut No.1, Sungai Jodoh. Wilayah: Belakang Padang, Batu Ampar, Sekupang, Nongsa, Galang, Lubuk Baja.
- **KPP Pratama Batam Selatan:** Adhya Building Tower, Permata Niaga Bukit Indah Sukajadi Blok A No.1. Wilayah: Sei Beduk, Bulang, Bengkong, Batam Kota, Sagulung, Batu Aji.
- **Air Batam Hilir** (call center (0778) 5700 000):
  - KPP Pusat: Ruko Batam Centre Square Blok D No.2, Senin–Jumat 08.30–16.30.
  - KPP Bengkong: Baraka Business Center Blok B No.9.
  - KPP Batu Aji: Komp. Batu Permata, Blok A No.01 atau C No.1 (perlu dicek).
- **PLN Batam, BPJS, kantor pos, polisi, damkar:** belum diverifikasi. Tarik dari OSM, lalu cocokkan ke situs resmi.

### 8. Akomodasi
**Sumber.** SISPEK mencantumkan hotel dengan kecamatan dan kelas bintang, misalnya Hotel Maxone Batam (Lubuk Baja, bintang 3) dan Ibis Styles Hotel Batam (Bengkong, bintang 4). Kos hanya bisa lewat warga, dan sebaiknya ditampilkan per kelurahan, bukan per titik, demi privasi pemilik.
**Kolom.** `bintang`, `jumlah_kamar`, `kisaran_harga`, `dekat_pelabuhan`. Kos: `tipe`, `kamar_mandi_dalam`, `ac`, `harga_bulanan_kisaran`, `dekat_kawasan_industri`.

### 9. Olahraga
OSM dipakai untuk titik lapangan, warga untuk info yang paling dicari: cara booking, harga per jam, dan jam ramai. Padel dan mini soccer tumbuh cepat, jadi data OSM hampir pasti tertinggal. Belum ada contoh terverifikasi.
**Kolom.** `jenis_olahraga`, `jumlah_lapangan`, `indoor`, `permukaan`, `cara_booking`, `link_booking`, `harga_per_jam_kisaran`, `lampu_malam`. Kolam renang: `akses`, `kolam_anak`.

### 10. Jasa dan Servis
Kategori ini paling cocok untuk **Tukang Langganan**. OSM paling banter punya titik bengkel, laundry, dan salon besar. Money changer bisa ditarik dari OSM lalu diverifikasi warga. Jasa panggilan yang tidak punya titik ditampilkan dengan `area_layanan` (array kecamatan).
**Kolom.** `layanan`, `panggilan`, `area_layanan`, `kisaran_harga`, `garansi`, `kontak_wa`, `merek_spesialis`, `rekomendasi_count`.

### 11. Khas Batam
- **Tiket feri:** tautkan jadwal operator. Jangan simpan jadwal statis karena berubah bulanan.
- **Paspor:** Kanim Batam, ULP Harbourbay, panduan M-Paspor.
- **Jastip Singapura:** murni rekomendasi warga.
- **Pekerja industri** (dormitory, shuttle, klinik MCU, LPK): gabungkan geoportal BP Batam (13.594 dataset geospasial) dengan rekomendasi warga.

## Rekomendasi Cara Pengisian

| Kelompok | Paling cocok | Alasan |
|---|---|---|
| Sekolah, kampus | **Resmi** | Ada NPSN, lengkap sampai swasta, diperbarui tiap semester |
| RS, puskesmas, klinik | **Resmi** + OSM koordinat | Kode stabil, angka bisa dicek ke Dinkes |
| Rumah ibadah | **Resmi** + OSM | 900+ masjid, alamat resmi ada |
| Kantor layanan publik | **Resmi**, kurasi | Sedikit, tapi jam sering berubah → butuh `terakhir_diverifikasi` |
| Belanja, SPBU, bank, halte | **OSM** | Bertitik, ber-brand |
| Taman, pantai, olahraga | **OSM** + warga | Geometri dari OSM, info booking dari warga |
| Hotel | **Resmi** + OSM | Bintang resmi, koordinat OSM |
| Dokter per spesialis | **Kurasi** + warga | Tidak ada data terbuka dokter → tempat → jadwal → BPJS |
| Jasa, kos, pijat panggilan | **Tukang Langganan** | Tidak ada di data resmi, nilai utamanya kepercayaan |

## Skema Database Terpadu

```sql
-- PostgreSQL + PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TYPE status_koordinat AS ENUM ('terverifikasi','perlu_cek_ulang','perlu_diisi_user');
CREATE TYPE asal_data AS ENUM ('resmi','osm','warga','kurasi','campuran');

CREATE TABLE tempat (
  id                TEXT PRIMARY KEY,          -- slug, mis. 'kes-rsud-embung-fatimah'
  nama              TEXT NOT NULL,
  nama_alternatif   TEXT[] DEFAULT '{}',
  kategori          TEXT NOT NULL,             -- belanja, ruang_publik, ibadah, pemakaman, transportasi, kesehatan,
                                               -- pendidikan, pemerintahan, akomodasi, olahraga, jasa, khas_batam
  subkategori       TEXT NOT NULL,
  tag               TEXT[] DEFAULT '{}',
  kecamatan         TEXT CHECK (kecamatan IN ('Batam Kota','Batu Aji','Batu Ampar','Belakang Padang','Bengkong',
                      'Bulang','Galang','Lubuk Baja','Nongsa','Sagulung','Sei Beduk','Sekupang')),
  kelurahan         TEXT,
  alamat            TEXT,
  lat               DOUBLE PRECISION,
  lng               DOUBLE PRECISION,
  geom              GEOGRAPHY(POINT,4326) GENERATED ALWAYS AS (
                      CASE WHEN lat IS NOT NULL AND lng IS NOT NULL
                      THEN ST_SetSRID(ST_MakePoint(lng,lat),4326)::geography END) STORED,
  status_koordinat  status_koordinat NOT NULL DEFAULT 'perlu_diisi_user',
  area_layanan      TEXT[] DEFAULT '{}',       -- jasa panggilan tanpa titik
  telepon           TEXT,
  whatsapp          TEXT,
  website           TEXT,
  opening_hours_osm TEXT,                      -- 'Mo-Th 07:30-16:00'
  jam_buka          JSONB,
  kode_resmi        JSONB DEFAULT '{}',        -- {"npsn":".."} / {"kode_rs":".."} / {"kode_puskesmas":".."}
  atribut           JSONB DEFAULT '{}',        -- kolom khusus per kategori, mis. {"tipe":"B","igd_24jam":true,"terima_bpjs":true}
  label_museum      JSONB DEFAULT '{}',        -- {"judul":"..","tahun":"..","keterangan":".."}
  asal_data         asal_data NOT NULL,
  sumber_url        TEXT[] DEFAULT '{}',
  osm_type          TEXT CHECK (osm_type IN ('node','way','relation')),
  osm_id            BIGINT,
  status_tempat     TEXT DEFAULT 'aktif' CHECK (status_tempat IN ('aktif','tutup_sementara','tutup','pindah','rencana')),
  terakhir_diverifikasi DATE,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (osm_type, osm_id)
);
CREATE INDEX ON tempat USING GIST (geom);
CREATE INDEX ON tempat (kategori, subkategori);
CREATE INDEX ON tempat USING GIN (atribut);

CREATE TABLE dokter (
  id TEXT PRIMARY KEY, nama TEXT NOT NULL, gelar TEXT,
  spesialisasi TEXT NOT NULL,  -- umum, gigi, obgyn, anak, kulit, tht, mata, penyakit_dalam, saraf, jantung,
                               -- ortopedi, psikiater, psikolog, fisioterapi, bidan, gizi, hewan
  bahasa TEXT[] DEFAULT '{id}', sumber_url TEXT[] DEFAULT '{}'
);
CREATE TABLE praktik (
  dokter_id TEXT REFERENCES dokter(id) ON DELETE CASCADE,
  tempat_id TEXT REFERENCES tempat(id) ON DELETE CASCADE,
  jadwal JSONB, terima_bpjs BOOLEAN, perlu_janji BOOLEAN,
  kanal_booking TEXT, terakhir_dicek DATE,
  PRIMARY KEY (dokter_id, tempat_id)
);
CREATE TABLE rekomendasi_warga (           -- Tukang Langganan, tanpa listing berbayar
  id BIGSERIAL PRIMARY KEY,
  tempat_id TEXT REFERENCES tempat(id) ON DELETE CASCADE,
  pemberi_alias TEXT, cerita TEXT NOT NULL, kisaran_harga TEXT, tanggal_pakai DATE,
  ada_hubungan_bisnis BOOLEAN NOT NULL DEFAULT false,   -- true = tidak ditampilkan
  status_moderasi TEXT DEFAULT 'menunggu' CHECK (status_moderasi IN ('menunggu','tampil','ditolak')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Contoh Query Overpass API

Relasi Kota Batam di OSM: **10660353** (admin_level 5, wikidata Q10103). Area Overpass = 3600000000 + ID = **3610660353**.

**a) Kesehatan:**
```
[out:json][timeout:180];
area(id:3610660353)->.batam;
(
  nwr["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](area.batam);
  nwr["healthcare"~"^(laboratory|physiotherapist|psychotherapist|midwife|centre)$"](area.batam);
);
out center tags;
```

**b) Belanja harian:**
```
[out:json][timeout:180];
area(id:3610660353)->.batam;
(
  nwr["amenity"="marketplace"](area.batam);
  nwr["shop"~"^(mall|supermarket|convenience|hardware|doityourself|stationery|mobile_phone|fabric|electronics)$"](area.batam);
);
out center tags;
```

**c) Transportasi:**
```
[out:json][timeout:180];
area(id:3610660353)->.batam;
(
  nwr["amenity"~"^(ferry_terminal|fuel|charging_station)$"](area.batam);
  node["highway"="bus_stop"](area.batam);
  nwr["aeroway"="aerodrome"](area.batam);
  relation["route"="bus"](area.batam);
);
out center tags;
```

**d) Olahraga, ibadah, makam:**
```
[out:json][timeout:240];
area(id:3610660353)->.batam;
(
  nwr["leisure"~"^(pitch|sports_centre)$"]["sport"~"padel|badminton|futsal|soccer|basketball|tennis|volleyball"](area.batam);
  nwr["leisure"~"^(swimming_pool|fitness_centre)$"](area.batam);
  nwr["amenity"="place_of_worship"](area.batam);
  nwr["landuse"="cemetery"](area.batam);
);
out center tags;
```

**e) Ukur kelengkapan OSM dulu:**
```
[out:json][timeout:120];
area(id:3610660353)->.batam;
nwr["amenity"="place_of_worship"](area.batam); out count;
nwr["amenity"="school"](area.batam);           out count;
node["highway"="bus_stop"](area.batam);        out count;
```

Cara membaca hasil query (e): bandingkan dengan angka resmi. Kalau `place_of_worship` jauh di bawah ~1.500 (972 masjid + 616 musala + gereja/vihara), atau `school` jauh di bawah ~870 (437 + 240 + 195, belum termasuk PAUD), pakai OSM hanya untuk koordinat. Daftar induknya tetap dari data resmi.

Kalau area id gagal, pakai cadangan ini: `area["boundary"="administrative"]["admin_level"="5"]["name"="Kota Batam"]->.batam;`. Hindari bbox kasar karena mudah ikut menjaring wilayah Singapura.

## Caveats

- **Koordinat.** Hanya sedikit yang terverifikasi: Hang Nadim dan Masjid Agung (infobox Wikipedia), serta Mega Mall (OSM). Sisanya berasal dari direktori pihak ketiga, dan beberapa saling bertentangan. Contohnya Nongsapura, yang beda ~2,5 km antara OSM dan TripAdvisor.
- **Angka resmi tidak seragam** untuk gereja, hotel, dan tipe RS Awal Bros. Simpan angka beserta sumber dan tahunnya.
- **Data menua.** Daftar FKUB adalah data 2019, dan jadwal feri berubah bulanan. Pasar Induk Jodoh sedang dibangun menurut Infosatelitnews (21 Agustus 2026), dengan relokasi pedagang dijadwalkan 2027–2028 (GoKepri). Tandai `status_tempat = "rencana"` sampai pasar itu resmi dibuka.
- **Belum diriset:** PLN Batam, BPJS, kantor pos, Polresta, Damkar, pura, TPU, lapangan olahraga, dan jasa. Seed sengaja dikosongkan untuk kategori ini. Penilaian "OSM cocok" di laporan ini berdasarkan jenis datanya, bukan hasil hitungan.

## Seed Data (JSON)

```json
[
{"id":"trans-bandara-hang-nadim","nama":"Bandara Internasional Hang Nadim","kategori":"transportasi","subkategori":"bandara","kecamatan":"Nongsa","alamat":"Batu Besar","lat":1.12083,"lng":104.11861,"sumber_url":"https://en.wikipedia.org/wiki/Hang_Nadim_International_Airport","status_koordinat":"terverifikasi"},
{"id":"trans-pelabuhan-batam-centre","nama":"Pelabuhan Feri Internasional Batam Centre","kategori":"transportasi","subkategori":"pelabuhan_internasional","kecamatan":"Batam Kota","alamat":"Teluk Tering","lat":null,"lng":null,"sumber_url":"https://batamport.bpbatam.go.id/batam-centre/","status_koordinat":"perlu_diisi_user"},
{"id":"trans-pelabuhan-harbour-bay","nama":"Pelabuhan Feri Internasional Harbour Bay","kategori":"transportasi","subkategori":"pelabuhan_internasional","kecamatan":"Batu Ampar","alamat":"Harbour Bay","lat":1.15371,"lng":103.99746,"sumber_url":"https://mapcarta.com/N703813600","status_koordinat":"perlu_cek_ulang"},
{"id":"trans-pelabuhan-sekupang","nama":"Pelabuhan Feri Internasional Sekupang","kategori":"transportasi","subkategori":"pelabuhan_internasional","kecamatan":"Sekupang","alamat":"Sekupang","lat":null,"lng":null,"sumber_url":"https://batamport.bpbatam.go.id/sekupang/","status_koordinat":"perlu_diisi_user"},
{"id":"trans-pelabuhan-nongsapura","nama":"Pelabuhan Feri Internasional Nongsapura","kategori":"transportasi","subkategori":"pelabuhan_internasional","kecamatan":"Nongsa","alamat":"Nongsa Pura","lat":1.18834,"lng":104.09463,"sumber_url":"https://mapcarta.com/35845432","status_koordinat":"perlu_cek_ulang"},
{"id":"trans-pelabuhan-gold-coast","nama":"Pelabuhan Gold Coast Bengkong","kategori":"transportasi","subkategori":"pelabuhan_internasional","kecamatan":"Bengkong","alamat":"Bengkong","lat":null,"lng":null,"sumber_url":"https://batam.co.id/transportasi/panduan-feri-batam-singapura-lima-pelabuhan/","status_koordinat":"perlu_diisi_user"},
{"id":"trans-pelabuhan-telaga-punggur","nama":"Pelabuhan Domestik Telaga Punggur","kategori":"transportasi","subkategori":"pelabuhan_domestik","kecamatan":"Nongsa","alamat":"Telaga Punggur, Kabil","lat":1.1175,"lng":104.1683,"sumber_url":"https://batamport.bpbatam.go.id/telaga-punggur/","status_koordinat":"perlu_cek_ulang"},
{"id":"kes-rsud-embung-fatimah","nama":"RSUD Embung Fatimah","kategori":"kesehatan","subkategori":"rumah_sakit","kecamatan":"Batu Aji","alamat":"Jl. Letjen R. Suprapto Blok D 1-9, Bukit Tempayan","lat":1.0503185,"lng":103.9675684,"sumber_url":"https://idalamat.com/alamat/rsud-embung-fatimah-2382","status_koordinat":"perlu_cek_ulang"},
{"id":"kes-rs-awal-bros","nama":"RS Awal Bros Batam","kategori":"kesehatan","subkategori":"rumah_sakit","kecamatan":"Lubuk Baja","alamat":"Jl. Gajah Mada Kav. 1, Baloi Indah","lat":null,"lng":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"kes-rs-santa-elisabeth","nama":"RS Santa Elisabeth","kategori":"kesehatan","subkategori":"rumah_sakit","kecamatan":"Lubuk Baja","alamat":"Jl. Anggrek, Lubuk Baja Kota","lat":null,"lng":null,"sumber_url":"https://ban.wikipedia.org/wiki/Rumah_sakit_ring_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"kes-rs-elisabeth-batam-kota","nama":"RS Elisabeth Batam Kota","kategori":"kesehatan","subkategori":"rumah_sakit","kecamatan":"Batam Kota","alamat":"Jl. Raja Alikelana No.37, Belian","lat":null,"lng":null,"sumber_url":"https://ban.wikipedia.org/wiki/Rumah_sakit_ring_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"kes-rs-bhayangkara","nama":"RS Bhayangkara Batam","kategori":"kesehatan","subkategori":"rumah_sakit","kecamatan":"Nongsa","alamat":"Jl. Dang Merdu No.2, Batu Besar","lat":null,"lng":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"kes-rs-budi-kemuliaan","nama":"RS Budi Kemuliaan","kategori":"kesehatan","subkategori":"rumah_sakit","kecamatan":"Batu Ampar","alamat":"Jl. Budi Kemuliaan No.1, Kampung Seraya","lat":null,"lng":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"kes-rs-bp-batam","nama":"RS Badan Pengusahaan Batam","kategori":"kesehatan","subkategori":"rumah_sakit","kecamatan":"Sekupang","alamat":"Sekupang (perlu cek)","lat":null,"lng":null,"sumber_url":"https://ban.wikipedia.org/wiki/Rumah_sakit_ring_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-baloi-permai","nama":"Puskesmas Baloi Permai","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Batam Kota","alamat":"Jl. Graha Legenda Malaka","lat":null,"lng":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-botania","nama":"Puskesmas Botania","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Batam Kota","alamat":"Komp. Botania Garden, Belian","lat":null,"lng":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-lubuk-baja","nama":"Puskesmas Lubuk Baja","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Lubuk Baja","alamat":"Jl. Duyung, Tanjung Uma","lat":null,"lng":null,"sumber_url":"https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-kabil","nama":"Puskesmas Kabil","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Nongsa","alamat":"Jl. Hasanuddin No.1, Kabil","lat":null,"lng":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-sekupang","nama":"Puskesmas Sekupang","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Sekupang","alamat":"Jl. Raja Haji No.6, Sei Harapan","lat":null,"lng":null,"sumber_url":"https://batam.tribunnews.com/2019/07/17/daftar-lokasi-dan-alamat-puskesmas-di-kota-batam-provinsi-kepri","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-belakang-padang","nama":"Puskesmas Belakang Padang","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Belakang Padang","alamat":"Jl. Hang Tuah, Tanjung Sari","lat":null,"lng":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-galang","nama":"Puskesmas Galang","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Galang","alamat":"Jl. Batin Limat No.15, Sembulang","lat":null,"lng":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pkm-tanjung-uncang","nama":"Puskesmas Tanjung Uncang","kategori":"kesehatan","subkategori":"puskesmas","kecamatan":"Batu Aji","alamat":"Jl. Brigjen Katamso, Tanjung Uncang","lat":null,"lng":null,"sumber_url":"https://dinkes.batam.go.id/category/puskesmas/","status_koordinat":"perlu_diisi_user"},
{"id":"pem-imigrasi-batam","nama":"Kantor Imigrasi Kelas I Khusus TPI Batam","kategori":"pemerintahan","subkategori":"imigrasi","kecamatan":"Batam Kota","alamat":"Jl. Engku Putri No.3","lat":null,"lng":null,"sumber_url":"https://batam.imigrasi.go.id/page/kantor-imigrasi","status_koordinat":"perlu_diisi_user"},
{"id":"pem-samsat-batam-centre","nama":"Samsat Batam Centre","kategori":"pemerintahan","subkategori":"samsat","kecamatan":"Batam Kota","alamat":"Gedung Graha Kepri Lt. 3, Jl. Engku Putri/Raja Isa No.8","lat":1.1243068,"lng":104.0567985,"sumber_url":"https://dilokasi.com/Kepulauan-Riau/Places/Kantor-Samsat-Batam-Centre-4236979","status_koordinat":"perlu_cek_ulang"},
{"id":"pem-disdukcapil-batam","nama":"Disdukcapil Kota Batam","kategori":"pemerintahan","subkategori":"disdukcapil","kecamatan":null,"alamat":"Perlu cek","lat":null,"lng":null,"sumber_url":"https://disdukcapil.batam.go.id/jam-pelayanan-disdukcapil/","status_koordinat":"perlu_diisi_user"},
{"id":"pem-bea-cukai-batam","nama":"KPU Bea dan Cukai Batam","kategori":"pemerintahan","subkategori":"bea_cukai","kecamatan":"Batu Ampar","alamat":"Jl. Kuda Laut","lat":null,"lng":null,"sumber_url":"https://bcbatam.beacukai.go.id/hubungi-kami/","status_koordinat":"perlu_diisi_user"},
{"id":"pem-kpp-batam-utara","nama":"KPP Pratama Batam Utara","kategori":"pemerintahan","subkategori":"kantor_pajak","kecamatan":"Batu Ampar","alamat":"Jl. Kuda Laut No.1, Sungai Jodoh","lat":null,"lng":null,"sumber_url":"https://pajak.go.id/en/node/67017","status_koordinat":"perlu_diisi_user"},
{"id":"pem-kpp-batam-selatan","nama":"KPP Pratama Batam Selatan","kategori":"pemerintahan","subkategori":"kantor_pajak","kecamatan":"Batam Kota","alamat":"Adhya Building Tower, Permata Niaga Bukit Indah Blok A No.1, Sukajadi","lat":null,"lng":null,"sumber_url":"https://www.pajak.go.id/en/node/67018","status_koordinat":"perlu_diisi_user"},
{"id":"pem-bp-batam","nama":"Kantor BP Batam","kategori":"pemerintahan","subkategori":"bp_batam","kecamatan":"Batam Kota","alamat":"Jl. Ibnu Sutowo No.1","lat":null,"lng":null,"sumber_url":"https://bpbatam.go.id/pelayanan-publik-2/spam-sistem-penyediaan-air-minum/","status_koordinat":"perlu_diisi_user"},
{"id":"pem-kantor-walikota","nama":"Kantor Wali Kota Batam","kategori":"pemerintahan","subkategori":"kantor_pemkot","kecamatan":"Batam Kota","alamat":"Jl. Engku Putri No.1, Teluk Tering","lat":null,"lng":null,"sumber_url":"https://satudata.batam.go.id/","status_koordinat":"perlu_diisi_user"},
{"id":"pem-abh-pusat","nama":"Air Batam Hilir - KPP Pusat","kategori":"pemerintahan","subkategori":"air_bersih","kecamatan":"Batam Kota","alamat":"Ruko Batam Centre Square Blok D No.2","lat":null,"lng":null,"sumber_url":"https://hilir.airbatam.com/contact","status_koordinat":"perlu_diisi_user"},
{"id":"pem-abh-bengkong","nama":"Air Batam Hilir - KPP Bengkong","kategori":"pemerintahan","subkategori":"air_bersih","kecamatan":"Bengkong","alamat":"Baraka Business Center Blok B No.9, Jl. Yos Sudarso","lat":null,"lng":null,"sumber_url":"https://hilir.airbatam.com/","status_koordinat":"perlu_diisi_user"},
{"id":"pem-abh-batu-aji","nama":"Air Batam Hilir - KPP Batu Aji","kategori":"pemerintahan","subkategori":"air_bersih","kecamatan":"Batu Aji","alamat":"Komp. Pertokoan Batu Permata (blok perlu cek)","lat":null,"lng":null,"sumber_url":"https://hilir.airbatam.com/","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-masjid-agung-batam","nama":"Masjid Agung Batam (Raja Hamidah)","kategori":"ibadah","subkategori":"masjid","kecamatan":"Batam Kota","alamat":"Jl. Engku Putri","lat":1.12623971,"lng":104.05339589,"sumber_url":"https://id.wikipedia.org/wiki/Masjid_Agung_Batam","status_koordinat":"terverifikasi"},
{"id":"ibd-masjid-sultan-mahmud-riayat-syah","nama":"Masjid Sultan Mahmud Riayat Syah","kategori":"ibadah","subkategori":"masjid","kecamatan":"Batu Aji","alamat":"Jl. Brigjen Katamso, Tanjung Uncang","lat":1.049569,"lng":103.933903,"sumber_url":"https://commons.wikimedia.org/wiki/File:Masjid_Sultan_Mahmud_Riayat_Syah.jpg","status_koordinat":"perlu_cek_ulang"},
{"id":"ibd-masjid-tanwirun-naja","nama":"Masjid Tanwirun Naja (Masjid Tanjak)","kategori":"ibadah","subkategori":"masjid","kecamatan":null,"alamat":"Perlu cek","lat":null,"lng":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_tempat_ibadah_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-masjid-jabal-arafah","nama":"Masjid Jabal Arafah","kategori":"ibadah","subkategori":"masjid","kecamatan":null,"alamat":"Perlu cek","lat":null,"lng":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_tempat_ibadah_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-gereja-santo-petrus","nama":"Gereja Santo Petrus","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":null,"alamat":"Jl. Anggrek (kecamatan perlu cek)","lat":null,"lng":null,"sumber_url":"https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-gereja-kerahiman-ilahi","nama":"Gereja Kerahiman Ilahi","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":"Sekupang","alamat":"Tiban","lat":null,"lng":null,"sumber_url":"https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-gereja-bible-center","nama":"Gereja Bible Center","kategori":"ibadah","subkategori":"gereja","kecamatan":"Batam Kota","alamat":"Sukajadi","lat":null,"lng":null,"sumber_url":"https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-vihara-buddhayana","nama":"Vihara Buddhayana Batam","kategori":"ibadah","subkategori":"vihara","kecamatan":"Lubuk Baja","alamat":"Nagoya Point Blok L","lat":null,"lng":null,"sumber_url":"https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-vihara-hock-an-kiong","nama":"Vihara Hock An Kiong","kategori":"ibadah","subkategori":"vihara","kecamatan":"Batam Kota","alamat":"Kampung Belian","lat":null,"lng":null,"sumber_url":"https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-vihara-dharma-mulia","nama":"Vihara Dharma Mulia","kategori":"ibadah","subkategori":"vihara","kecamatan":"Batam Kota","alamat":"Legenda Malaka","lat":null,"lng":null,"sumber_url":"https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah","status_koordinat":"perlu_diisi_user"},
{"id":"blj-mega-mall","nama":"Mega Mall Batam Centre","kategori":"belanja","subkategori":"mal","kecamatan":"Batam Kota","alamat":"Jl. Engku Putri No.1, Teluk Tering","lat":1.12924,"lng":104.05598,"sumber_url":"https://mapcarta.com/W606276855","status_koordinat":"terverifikasi"},
{"id":"blj-nagoya-hill-mall","nama":"Nagoya Hill Mall","kategori":"belanja","subkategori":"mal","kecamatan":"Lubuk Baja","alamat":"Jl. Teuku Umar","lat":1.146512,"lng":104.012342,"sumber_url":"https://cityseeker.com/batam/1204133-nagoya-hill-shopping-mall","status_koordinat":"perlu_cek_ulang"},
{"id":"blj-bcs-mall","nama":"Batam City Square (BCS Mall)","kategori":"belanja","subkategori":"mal","kecamatan":"Lubuk Baja","alamat":"Jl. Bunga Raya, Batu Selicin","lat":null,"lng":null,"sumber_url":"https://kumparan.com/info-otomotif/samsat-batam-ini-informasi-layanan-dan-jam-operasionalnya-1xYrOqODWqq","status_koordinat":"perlu_diisi_user"},
{"id":"blj-kepri-mall","nama":"Kepri Mall","kategori":"belanja","subkategori":"mal","kecamatan":"Batam Kota","alamat":"Sukajadi","lat":null,"lng":null,"sumber_url":"https://samsatcorner.com/samsat-batam.html","status_koordinat":"perlu_diisi_user"},
{"id":"blj-grand-batam-mall","nama":"Grand Batam Mall","kategori":"belanja","subkategori":"mal","kecamatan":null,"alamat":"Perlu cek","lat":null,"lng":null,"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"blj-pasar-tos-3000","nama":"Pasar Tos 3000","kategori":"belanja","subkategori":"pasar_tradisional","kecamatan":"Lubuk Baja","alamat":"Kawasan Jodoh","lat":null,"lng":null,"sumber_url":"https://metropolis.batampos.co.id/rekomendasi-5-pasar-basah-modern-favorit-warga-batam-belanja-makin-nyaman/","status_koordinat":"perlu_diisi_user"},
{"id":"blj-pasar-fanindo","nama":"Pasar Fanindo","kategori":"belanja","subkategori":"pasar_tradisional","kecamatan":"Batu Aji","alamat":"Fanindo","lat":null,"lng":null,"sumber_url":"https://metropolis.batampos.co.id/rekomendasi-5-pasar-basah-modern-favorit-warga-batam-belanja-makin-nyaman/","status_koordinat":"perlu_diisi_user"},
{"id":"blj-pasar-mega-legenda","nama":"Pasar Mega Legenda","kategori":"belanja","subkategori":"pasar_tradisional","kecamatan":"Batam Kota","alamat":"Mega Legenda","lat":null,"lng":null,"sumber_url":"https://metropolis.batampos.co.id/rekomendasi-5-pasar-basah-modern-favorit-warga-batam-belanja-makin-nyaman/","status_koordinat":"perlu_diisi_user"},
{"id":"blj-pasar-mitra-raya","nama":"Pasar Mitra Raya","kategori":"belanja","subkategori":"pasar_tradisional","kecamatan":"Batam Kota","alamat":"Batam Centre","lat":null,"lng":null,"sumber_url":"https://rentalmobilbatam212.com/5-pasar-tradisional-di-batam-yang-tak-pernah-sepi-surganya-belanja-murah-dan-kuliner-lokal/","status_koordinat":"perlu_diisi_user"},
{"id":"blj-pasar-penuin","nama":"Pasar Penuin","kategori":"belanja","subkategori":"pasar_tradisional","kecamatan":"Lubuk Baja","alamat":"Penuin","lat":null,"lng":null,"sumber_url":"https://mediaindonesia.com/kuliner/716248/menjelajahi-jajanan-pasar-di-batam-kekayaan-kuliner-lokal","status_koordinat":"perlu_diisi_user"},
{"id":"blj-pasar-aviari","nama":"Pasar Aviari","kategori":"belanja","subkategori":"pasar_tradisional","kecamatan":"Batu Aji","alamat":"Aviari","lat":null,"lng":null,"sumber_url":"https://www.tempo.co/gaya-hidup/60-pasar-ramadan-tersebar-di-batam-ini-daftar-lokasinya-208409","status_koordinat":"perlu_diisi_user"},
{"id":"pub-dataran-engku-putri","nama":"Dataran Engku Putri","kategori":"ruang_publik","subkategori":"taman","kecamatan":"Batam Kota","alamat":"Batam Centre","lat":null,"lng":null,"sumber_url":"https://en.wikipedia.org/wiki/Batam_Center_Ferry_Terminal","status_koordinat":"perlu_diisi_user"},
{"id":"pub-taman-dang-anom","nama":"Taman Dang Anom","kategori":"ruang_publik","subkategori":"taman","kecamatan":"Batam Kota","alamat":"Batam Centre","lat":null,"lng":null,"sumber_url":"https://www.tempo.co/gaya-hidup/60-pasar-ramadan-tersebar-di-batam-ini-daftar-lokasinya-208409","status_koordinat":"perlu_diisi_user"},
{"id":"pub-pantai-melur","nama":"Pantai Melur","kategori":"ruang_publik","subkategori":"pantai","kecamatan":"Galang","alamat":"Sijantung, Pulau Galang","lat":0.755748,"lng":104.186082,"sumber_url":"https://us.trip.com/travel-guide/attraction/galang/pantai-melur-barelang-147494728/","status_koordinat":"perlu_cek_ulang"},
{"id":"pub-pantai-nongsa","nama":"Pantai Nongsa","kategori":"ruang_publik","subkategori":"pantai","kecamatan":"Nongsa","alamat":"Nongsa","lat":null,"lng":null,"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"pdk-sdn-005-batam-kota","nama":"SD Negeri 005 Batam Kota (NPSN 11001568)","kategori":"pendidikan","subkategori":"sd","kecamatan":"Batam Kota","alamat":"Plamo Garden, Baloi Permai","lat":null,"lng":null,"sumber_url":"https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/316012/3/jf/all/s1","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-sdn-009-batam-kota","nama":"SD Negeri 009 Batam Kota (NPSN 11003047)","kategori":"pendidikan","subkategori":"sd","kecamatan":"Batam Kota","alamat":"Komplek Botania Garden, Belian","lat":null,"lng":null,"sumber_url":"https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/316012/3/jf/all/s1","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-smpn-6-batam","nama":"SMP Negeri 6 Batam (NPSN 11000374)","kategori":"pendidikan","subkategori":"smp","kecamatan":"Batam Kota","alamat":"Jl. Laksamana Bintan, Sungai Panas","lat":null,"lng":null,"sumber_url":"https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/316012/3/jf/all/s1","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-smpn-12-batam","nama":"SMP Negeri 12 Batam (NPSN 11001739)","kategori":"pendidikan","subkategori":"smp","kecamatan":"Batam Kota","alamat":"Legenda Malaka, Baloi Permai","lat":null,"lng":null,"sumber_url":"https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/316012/3/jf/all/s1","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-smp-kalam-kudus-1","nama":"SMP Kristen Kalam Kudus 1 Batam (NPSN 11001775)","kategori":"pendidikan","subkategori":"smp","kecamatan":"Batam Kota","alamat":"Kompleks Orchid Park Blok C, Taman Baloi","lat":null,"lng":null,"sumber_url":"https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/316012/3/jf/6/s2","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-smp-binus-batam","nama":"SMP Swasta Bina Nusantara Batam (NPSN 69815455)","kategori":"pendidikan","subkategori":"smp","kecamatan":"Batam Kota","alamat":"Plamo Garden G4 9-14, Baloi Permai","lat":null,"lng":null,"sumber_url":"https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/316012/3/jf/6/s2","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-sman-1-batam","nama":"SMA Negeri 1 Batam","kategori":"pendidikan","subkategori":"sma","kecamatan":"Sekupang","alamat":"Sekupang (perlu cek)","lat":null,"lng":null,"sumber_url":"https://batam.tribunnews.com/2025/06/11/daftar-lengkap-kuota-spmb-sman-20252026-kota-batam-kepri-total-ada-29-sman","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-smkn-5-batam","nama":"SMK Negeri 5 Batam","kategori":"pendidikan","subkategori":"smk","kecamatan":null,"alamat":"Perlu cek","lat":null,"lng":null,"sumber_url":"https://batam.tribunnews.com/news/686380/dana-bos-2026-smasmk-di-batam-rp-1174-miliar-smk-negeri-5-batam-kelola-rp-106-miliar","status_koordinat":"perlu_diisi_user"},
{"id":"pdk-polibatam","nama":"Politeknik Negeri Batam","kategori":"pendidikan","subkategori":"politeknik","kecamatan":null,"alamat":"Perlu cek di PDDikti","lat":null,"lng":null,"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"pdk-unrika","nama":"Universitas Riau Kepulauan","kategori":"pendidikan","subkategori":"universitas","kecamatan":null,"alamat":"Perlu cek di PDDikti","lat":null,"lng":null,"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"pdk-upb","nama":"Universitas Putera Batam","kategori":"pendidikan","subkategori":"universitas","kecamatan":null,"alamat":"Perlu cek di PDDikti","lat":null,"lng":null,"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"pdk-uniba","nama":"Universitas Batam","kategori":"pendidikan","subkategori":"universitas","kecamatan":"Batam Kota","alamat":"Kawasan Uniba, Belian (perlu cek)","lat":null,"lng":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_rumah_sakit_di_Kota_Batam","status_koordinat":"perlu_diisi_user"},
{"id":"akm-hotel-maxone","nama":"Hotel Maxone Batam","kategori":"akomodasi","subkategori":"hotel","kecamatan":"Lubuk Baja","alamat":"Perlu cek","lat":null,"lng":null,"sumber_url":"https://sispek.batam.go.id/","status_koordinat":"perlu_diisi_user"},
{"id":"akm-ibis-styles-batam","nama":"Ibis Styles Hotel Batam","kategori":"akomodasi","subkategori":"hotel","kecamatan":"Bengkong","alamat":"Perlu cek","lat":null,"lng":null,"sumber_url":"https://sispek.batam.go.id/","status_koordinat":"perlu_diisi_user"},
{"id":"akm-montigo-resorts","nama":"Montigo Resorts Batam","kategori":"akomodasi","subkategori":"resort","kecamatan":"Nongsa","alamat":"Nongsa","lat":null,"lng":null,"sumber_url":"https://www.1001malam.com/hotel/batam-38/ct/hotel-bintang-5-di-batam","status_koordinat":"perlu_diisi_user"}
]
```

## Daftar Tempat yang Koordinatnya Belum Pasti

**A. Ada koordinat, perlu cek ulang:**
1. Harbour Bay: 1.15371, 103.99746. Sumbernya node OSM 703813600 bertipe `place=locality`, bukan gedung terminal.
2. Nongsapura: 1.18834, 104.09463 (OSM). TripAdvisor menyebut 1.17283, 104.07809.
3. Telaga Punggur: 1.1175, 104.1683 (BP Batam). Wikidata menyebut 1.03523, 104.13340, kemungkinan salah.
4. RSUD Embung Fatimah: 1.0503185, 103.9675684. Direktori lain menyebut 1.0651866, 104.0171811.
5. Samsat Batam Centre: 1.1243068, 104.0567985 (direktori pihak ketiga).
6. Masjid Sultan Mahmud Riayat Syah: 1.049569, 103.933903. Ini lokasi pengambilan foto, bukan titik bangunan.
7. Nagoya Hill Mall: 1.146512, 104.012342. Sumber lain menyebut 1.14583, 104.01202.
8. Pantai Melur: 0.755748, 104.186082 (Trip.com).

**B. Koordinat kosong, perlu diisi user:**
- **Transportasi:**
  - Pelabuhan Batam Centre. Kandidat ±1.1303, 104.0548 (estimasi). Jangan pakai angka BP Batam 01°17'15" karena salah ketik.
  - Pelabuhan Sekupang. BP Batam menyebut 1.1314, 103.9253, sedangkan Waze 1.125328, 103.925633.
  - Gold Coast Bengkong.
- **Kesehatan:**
  - RS Awal Bros, RS Santa Elisabeth, RS Elisabeth Batam Kota, RS Bhayangkara, RS Budi Kemuliaan, RS BP Batam.
  - Puskesmas Baloi Permai, Botania, Lubuk Baja, Kabil, Sekupang, Belakang Padang, Galang, Tanjung Uncang.
- **Pemerintahan:**
  - Imigrasi Batam, Disdukcapil (alamatnya juga perlu dicek), Bea Cukai, KPP Batam Utara, KPP Batam Selatan, BP Batam.
  - Kantor Wali Kota. Kandidat ±1.1282, 104.0548 (estimasi).
  - Air Batam Hilir: KPP Pusat, Bengkong, Batu Aji.
- **Ibadah:** Masjid Tanwirun Naja, Masjid Jabal Arafah, Gereja Santo Petrus, Gereja Kerahiman Ilahi, Gereja Bible Center, Vihara Buddhayana, Vihara Hock An Kiong, Vihara Dharma Mulia.
- **Belanja:** BCS Mall, Kepri Mall, Grand Batam Mall (kecamatannya juga perlu dicek), Pasar Tos 3000, Pasar Fanindo, Pasar Mega Legenda, Pasar Mitra Raya, Pasar Penuin, Pasar Aviari.
- **Ruang publik:**
  - Dataran Engku Putri. Kandidat ±1.128, 104.054 (estimasi).
  - Taman Dang Anom, Pantai Nongsa.
- **Pendidikan:** SDN 005 Batam Kota, SDN 009 Batam Kota, SMPN 6, SMPN 12, SMP Kalam Kudus 1, SMP Bina Nusantara, SMAN 1, SMKN 5 (kecamatannya juga perlu dicek), Politeknik Negeri Batam, Universitas Riau Kepulauan, Universitas Putera Batam, Universitas Batam.
- **Akomodasi:** Hotel Maxone, Ibis Styles Batam, Montigo Resorts.

## Daftar sumber
- kemendikdasmen — https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas/310000/1
- Wikipedia — https://id.wikipedia.org/wiki/Daftar_kecamatan_dan_kelurahan_di_Kota_Batam
- wikiwand — https://www.wikiwand.com/id/Daftar_kecamatan_dan_kelurahan_di_Kota_Batam
- batam — https://satudata.batam.go.id/satu/detail/statistik-jumlah-tenaga-kesehatan-di-kota-batam-tahun-2023-dan-2024-semester-1-ozovbr
- kemenag — https://batam.kemenag.go.id/satudata/view-data/view.php?id_data=223
- bps — https://batamkota.bps.go.id/en/statistics-table/2/MjE4IzI=/02-jumlah-tempat-peribadatan-menurut-kecamatan.html
- batam — https://satudata.batam.go.id/data/detail/statistik-jumlah-rumah-ibadah-vihara-menurut-kecamatan-hvgkxu
- batam — https://satudata.batam.go.id/data/detail/statistik-jumlah-rumah-ibadah-gereja-menurut-kecamatan-mxn5k6
- fkubbatam — https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah
- kemendikdasmen — https://referensi.data.kemendikdasmen.go.id/pendidikan/dikmen/316000/2
- tribunnews — https://batam.tribunnews.com/2025/06/11/daftar-lengkap-kuota-spmb-sman-20252026-kota-batam-kepri-total-ada-29-sman
- spmb-batam — https://spmb-batam.id/home
- gowest — https://gowest.id/data-akomodasi-batam-hub-utama-pariwisata-penggerak-okupansi-di-kepri/
- batam — https://satudata.batam.go.id/web/wp-content/uploads/2025/07/Kompilasi-Statistik-Sektoral-Tahun-2025.pdf
- batam — https://batam.co.id/transportasi/panduan-feri-batam-singapura-lima-pelabuhan/
- bpbatam — https://bpbatam.go.id/pelayanan-publik-2/spam-sistem-penyediaan-air-minum/
- kumparan — https://kumparan.com/batamnews/spam-beroperasi-ini-call-center-dan-pelayanan-pelanggan-air-minum-di-batam-1ubyST99RCj
- airbatam — https://hilir.airbatam.com/berita/--kategori/berita?page=3
- batam — https://sispek.batam.go.id/?or_id=gacor456
- batam — https://satudata.batam.go.id/satu/data
- kemenag — https://batam.kemenag.go.id/satudata/
- batamnews — https://www.batamnews.co.id/berita-98448-mengintip-keunikan-dan-keindahan-masjid-sultan-mahmud-riayat-syah-di-batam-kepulauan-riau.html
- bpbatam — https://batamport.bpbatam.go.id/
- bpbatam — https://batamport.bpbatam.go.id/batam-centre/
- kemkes — https://komdat.kemkes.go.id/baru/index_rpt.php?folder=dashboard/reports&pg=rptPkmListPuskesmas&kode_kabupaten=2171
- imigrasi — https://batam.imigrasi.go.id/page/kantor-imigrasi
- samsatbatamcentre — http://samsatbatamcentre.net/berita/layanan/kantor-samsat
- kumparan — https://kumparan.com/info-otomotif/samsat-batam-ini-informasi-layanan-dan-jam-operasionalnya-1xYrOqODWqq
- beacukai — https://bcbatam.beacukai.go.id/hubungi-kami/
- openstreetmap — https://www.openstreetmap.org/relation/10660353
- openstreetmap — https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL
- dilokasi — https://dilokasi.com/Kepulauan-Riau/Places/Kantor-Samsat-Batam-Centre-4236979
- trip — https://us.trip.com/travel-guide/attraction/galang/pantai-melur-barelang-147494728/
