# Peta Kampung Tua Batam: Riset Konten dan Seed Data untuk Batam City Hall
> task_id: wf-53f818cd-96c6-5733-bd7f-b2fab18bdc30

# Peta Kampung Tua Batam: Riset Konten & Seed Data untuk "Batam City Hall"

Jawaban singkatnya: daftar yang paling layak dipakai untuk peta adalah **37 titik kampung tua di Pulau Batam (mainland)**. Daftar ini disebut berbagai sumber resmi dan dipakai Pemko Batam sampai 2026. Tapi dokumen dasarnya sendiri tidak seragam (33 vs 37). Rempang–Galang dan hinterland punya daftar terpisah yang jauh lebih cair (16, 45, sampai total 134). Sejarah per kampung kebanyakan masih bersandar pada tutur lisan. Satu hal juga perlu diluruskan dulu: payung tata ruangnya adalah **Perda Kota Batam No. 2 Tahun 2004** tentang RTRW 2004–2014. Penyebutan "Perda No. 2/2014" di artikel opini Antara kemungkinan salah ketik.

## TL;DR
- **Pakai 37 titik mainland sebagai "lapisan utama" peta**, Rempang–Galang (16 kampung) sebagai lapisan kedua dengan label khusus, dan hinterland (Bulang, Belakang Padang, Pulau Buluh) sebagai lapisan "situs & kampung lama" yang belum punya daftar resmi tunggal. Semua koordinat di laporan ini masih **estimasi kasar** dan wajib di-geocode ulang sebelum tayang.
- **Kampung yang paling terdokumentasi** adalah Nongsa Pantai (Nong Isa, mandat 18 Desember 1829), Batu Besar/Kampung Melayu (Rumah Limas Potong, cagar budaya), Tanjung Bemban, Tanjung Uma, Tanjung Riau, Bagan, Tanjung Piayu Laut, dan Pulau Bulang Lintang (Temenggung Abdul Jamal). Cerita asal-usul nama di luar itu sebagian besar tutur lisan dan harus diberi label "cerita rakyat".
- **Status legalitas masih berjalan.** Sertifikasi dilakukan bertahap. Pada 16 Oktober 2026, dalam silaturahmi RT/RW/LPM Lubuk Baja, Wali Kota Amsakar Achmad menyebut "sebanyak 1.450 sertifikat tanah telah diselesaikan" (batam.go.id; juga dikutip Kompas.com 19 Okt 2026). Ranperda Penataan Kampung Tua masuk DPRD pada 15 Agustus 2026. Pansus menggelar rapat perdana pada 16 September 2026 (dipimpin Wakil Ketua Pansus Kamaruddin Muda) dan rapat lanjutan pada 22 September 2026 (dipimpin Ketua Pansus Muhammad Yunus). Rempang masih diperdebatkan: proyek tidak lagi tercantum dalam daftar PSN Perpres 12/2025, tetapi BP Batam tetap melanjutkan pergeseran warga. Fitur ini sebaiknya tidak menampilkan batas, luas, atau status lahan sama sekali.

---

## 1. Kenapa jumlahnya beda-beda? (dan mana yang dipegang)

Jumlah kampung tua bergantung pada **siapa yang menghitung, kapan, dan wilayah mana yang dihitung**. Ringkasannya:

| Angka | Sumber | Konteks |
|---|---|---|
| **33 titik** (mainland) | SK Wali Kota Batam No. KPTS.105/HK/III/2004 (23 Maret 2004), menurut kajian STPN 2016 | Penetapan awal. Diktum kedua: kampung tua "tidak direkomendasikan kepada Otorita Batam untuk diberikan Hak Pengelolaan". http://repository.stpn.ac.id/133/1/3%20menata%20tanah%20kota%20batam%20jalan%20penyelesaian%20penguasaan%20tanah%20kampung%20tua.pdf |
| **39 → 37 titik** | Catatan lapangan tim STPN 2016 dan RKWB | 39 titik di 9 kecamatan, dikurangi Sungai Kasam dan Ketapang yang "sudah berkurang", jadi 37. Rapat BPN–Pemko–Pemprov–BP Batam–RKWB pada 25 Agustus 2016 mengusulkan kenaikan dari 33 ke 37. (sumber sama) |
| **37 titik** | Surat RKWB No. 047/RKWB/VIII/2016 (29 Agustus 2016), Ranperda DPRD 2019, BPN (9 kecamatan, 18 kelurahan) | Angka yang dipakai luas sejak 2019, termasuk oleh Wali Kota Amsakar pada 2025–2026. https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all |
| **37 titik "berdasarkan SK 105/2004"** | Batam Pos (2025) | Bertentangan dengan STPN yang menyebut SK 105/2004 berisi 33. Kemungkinan Batam Pos menyederhanakan. https://metropolis.batampos.co.id/status-kampung-tua-prioritas-amsakar-li-claudia/ |
| **134 titik** (mainland + hinterland) | Kepala Badan Pertanahan Kota Batam Buralimar, arsip Humas Pemko | "Pengukuran Kampung Tua di wilayah mainland sudah dilaksanakan sebanyak 34 titik, sedangkan untuk wilayah hinterland baru 8 titik dari total keseluruhan sebanyak 134 titik". https://webarchive.batam.go.id/humas.com/01/index-2685.html |
| **39 + 98 titik** | Surat RKWB ke Presiden No. 053/RKWB/IV/2015 | 39 di Kota Batam dan 98 "di sekitar Batam". (STPN, link di atas) |
| **16 kampung** (Rempang–Galang) | Ombudsman RI, BP Batam (via CNN), media | Daftar paling konsisten untuk Rempang. https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan |
| **45 titik** (Pulau Rempang) | Artikel opini di e-paper Perpustakaan DPR; kajian Trend Asia | Angka lebih luas, sumber primernya tidak jelas. https://perpustakaan.dpr.go.id/epaper/index/popup/id/18042 |
| **3 kampung tua di Galang dalam SK 105/2004** | Ombudsman RI (Johanes Widijantoro) | Sembulang, Dapur 6, Tanjung Banon. https://www.tempo.co/ekonomi/soroti-sejarah-hukum-kampung-tua-di-rempang-ombudsman-ini-unik-138618 |

**Sumber yang disarankan untuk dipegang:**
1. **Daftar 37 versi Ranperda DPRD 2019 / RKWB 2016** (via TribunBatam), dicocokkan dengan kajian STPN 2016. Hanya daftar ini yang memuat nama, kelurahan, dan kecamatan sekaligus dan bisa diakses publik.
2. **Untuk Rempang**, pakai 16 nama versi Ombudsman RI. Ombudsman memeriksa lapangan dengan merujuk SK 105/2004.
3. **Untuk hinterland**, belum ada daftar terbuka yang bisa dicek. Tampilkan hanya situs yang dasarnya jelas, misalnya cagar budaya SK Wali Kota No. 483/2022.
4. Lampiran SK 105/2004 dan SK 89/HK/III/2006 tidak ditemukan daring. **Minta salinannya ke Dinas Pertanahan/Bagian Hukum Pemko Batam atau LAM Kota Batam** sebelum menyebut fitur ini "lengkap".

**Soal Perda:** kajian STPN dan Batam Pos sama-sama menyebut definisi kampung tua ada di **Perda No. 2 Tahun 2004** (RTRW 2004–2014). Bunyinya: "kelompok rumah yang berfungsi sebagai lingkungan tempat tinggal penduduk asli Kota Batam sebelum tahun 1970 saat Batam mulai dibangun, yang mengandung nilai sejarah, budaya tempatan, dan atau agama…". Perda RTRW yang baru, **Perda No. 3 Tahun 2021 (RTRW 2021–2041)**, menurut Batam Pos "tidak ada ketentuan spesifik yang mengatur terkait dengan perkampungan tua".

**Kriteria kampung tua** menurut surat Dinas Pertanahan Pemko (25 April 2005, via STPN):
- sudah ada sebelum Otorita Batam berdiri;
- belum pernah diganti rugi;
- punya bukti berupa surat lama, tapak kampung, situs purbakala, kuburan tua, tanaman budidaya berumur tua, bangunan bernilai budaya, atau silsilah keluarga.

---

## 2. Tabel kampung tua per kecamatan

**Akurasi koordinat:** semua lat/lng di bawah adalah **estimasi kasar (±1–3 km)** yang diturunkan dari letak kelurahan atau pesisir, dan belum dicek ke OSM/Wikidata. Riset ini tidak berhasil mengambil koordinat dari OpenStreetMap, Wikidata, atau Wikimapia. Untuk peta ilustrasi skala kota sudah cukup, tapi **wajib dikoreksi** sebelum dipakai untuk petunjuk arah.

**Sumber daftar kampung, kelurahan, dan kecamatan (S1):** TribunBatam 6 Mei 2019, daftar Ranperda DPRD. Halaman penuhnya gagal dimuat, jadi sebagian entri direkonstruksi dari potongan teks. Ejaannya perlu dicek ulang.

### Kecamatan Nongsa (14 titik)

| Nama | Nama populer | Kelurahan | Lat | Lng | Akurasi | Asal-usul nama | Suku awal | Masa berdiri | Yang bisa dilihat | Sumber |
|---|---|---|---|---|---|---|---|---|---|---|
| Nongsa Pantai | Nongsa | Sambau | 1.199 | 104.095 | estimasi kasar | Dari "Nong Isa", nama timang Raja Isa (terverifikasi arsip) | Melayu (keturunan Riau-Lingga), Bugis | Awal abad ke-19; mandat 18 Des 1829 | Kompleks Makam Zuriat Raja Isa (cagar budaya), pantai, penyeberangan ke Pulau Putri | https://disbud.kepriprov.go.id/asal-usul-nama-kampung-tua-nongsa/ ; http://kronologi.ppj.unp.ac.id/index.php/jk/article/download/949/564 |
| Tereh | Terih | Sambau | 1.190 | 104.060 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Pantai (disebut Batamnews) | S1; https://www.batamnews.co.id/berita-98675-menikmati-suasana-kampung-tua-batam-yang-alami-dan-kental-budaya-melayu.html |
| Bakau Serip | – | Sambau | 1.185 | 104.050 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Teluk Mata Ikan | – | Sambau | 1.170 | 104.130 | estimasi kasar | Belum ditemukan | Melayu (perlu dicek) | Pra-Otorita | Gapura kuning bergaya Melayu, pantai pasir putih, pohon kelapa | S1; batamnews (link di atas) |
| Kampung Melayu | Kampung Melayu Batu Besar | Batu Besar | 1.150 | 104.140 | estimasi kasar | – | Melayu | Akhir abad ke-19 (lisan) | Rumah Limas Potong (cagar budaya, 1959) | S1; https://www.detik.com/sumut/berita/d-8088809/cagar-budaya-rumah-limas-potong-batam-memprihatinkan-ini-kata-disparbud |
| Jabi | Kampung Jabi | Batu Besar | 1.125 | 104.150 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Tanjung Bemban | – | Batu Besar | 1.130 | 104.155 | estimasi kasar | Dari pohon "bemban/beremban" | Melayu (disebut keturunan raja Riau-Lingga) | Tak pasti; dikaitkan dengan legenda Sang Nila Utama | Gapura Adat, pantai Tanjung Bemban | https://disbud.kepriprov.go.id/tanjung-bemban/ |
| Batu Besar | Lagorap / Labong Gorap | Batu Besar | 1.145 | 104.135 | estimasi kasar | Dari batu besar di tepi pantai; nama lama dari kerang kecil "gorap" | Melayu, lalu Tionghoa (~1870) dan Bugis | Akhir abad ke-19 | Jejak kebun kelapa/kopra, SD tua (SR 1957) | https://kebudayaan.kemdikbud.go.id/bpnbkepri/meneroka-batu-besar-di-batam/ |
| Panglong | – | Batu Besar | 1.140 | 104.125 | estimasi kasar | "Panglong" lazim berarti tempat olah kayu (dugaan, perlu dicek) | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Kampung Tengah | – | Batu Besar | 1.135 | 104.120 | estimasi kasar | – | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Teluk Nipah | – | Kabil | 1.065 | 104.140 | estimasi kasar | Dari pohon nipah (dugaan) | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Telaga Punggur | Punggur | Kabil | 1.058 | 104.150 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Dekat Pelabuhan Telaga Punggur | S1 |
| Teluk Lengung | – | Kabil | 1.080 | 104.150 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Panau | Kampung Panau | Kabil | 1.100 | 104.130 | estimasi kasar | Cerita rakyat: istri penghuni pertama berpenyakit kulit "panau" | Melayu; 1949–1953 berdatangan Bugis, Buton, Flores | Ramai sejak 1949 | Perlu cek lapangan | https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam |

### Kecamatan Bengkong (2)

| Nama | Nama populer | Kelurahan | Lat | Lng | Akurasi | Asal-usul nama | Suku awal | Masa berdiri | Yang bisa dilihat | Sumber |
|---|---|---|---|---|---|---|---|---|---|---|
| Bengkong Laut | – | Bengkong Laut | 1.165 | 104.040 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Bengkong Sadai | Sadai | Sadai/Bengkong Sadai | 1.150 | 104.040 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |

### Kecamatan Batu Ampar (4)

| Nama | Nama populer | Kelurahan | Lat | Lng | Akurasi | Asal-usul nama | Suku awal | Masa berdiri | Yang bisa dilihat | Sumber |
|---|---|---|---|---|---|---|---|---|---|---|
| Batu Merah | Melcem (kawasan) | Batu Merah | 1.168 | 104.010 | estimasi kasar | Dari "Pak Merah", pengumpul batu (cerita lokal) | Dibuka orang Bugis, Daeng Tambak | Ramai 1976 | Perlu cek lapangan | https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam |
| Sei Tering | Melcem | Batu Merah | 1.165 | 104.005 | estimasi kasar | Belum ditemukan | Muara: Tionghoa; hulu: Jawa (versi Antara) | Dihuni sekitar 1960-an | Perlu cek lapangan | sama |
| Tanjung Sengkuang | – | Tanjung Sengkuang | 1.162 | 103.995 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Air Raja | – | Tanjung Sengkuang (menurut S1, janggal) | – | – | tidak dipetakan | – | – | – | – | S1; perlu dicek: "Air Raja" juga nama kelurahan di Galang |

### Kecamatan Batam Kota (1) dan Lubuk Baja (1)

| Nama | Nama populer | Kelurahan | Lat | Lng | Akurasi | Asal-usul nama | Suku awal | Masa berdiri | Yang bisa dilihat | Sumber |
|---|---|---|---|---|---|---|---|---|---|---|
| Belian | Kampung Belian | Belian (Batam Kota) | 1.140 | 104.055 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Makam tua, disebut "berumur 200 tahun, panjang 3 meter" (blog, perlu dicek) | S1; https://www.yuliamarza.com/2016/08/mengenal-sejarah-kampung-tua-yang-ada.html |
| Tanjung Uma | Tanjung Ume | Tanjung Uma (Lubuk Baja) | 1.158 | 103.988 | estimasi kasar | "Uma" = rumah (rumah panggung) di antara Tanjung Pangkal Lepu dan Tanjung Kubur; versi lain dari kerang "tuma" | Melayu dan Bugis keluarga diraja Riau-Lingga | Sebelum kemerdekaan | Bukit Kubur, makam dekat Masjid Baitussyakur, rumah pelantar | https://disbud.kepriprov.go.id/tanjung-uma/ |

### Kecamatan Sekupang (3–4)

| Nama | Nama populer | Kelurahan | Lat | Lng | Akurasi | Asal-usul nama | Suku awal | Masa berdiri | Yang bisa dilihat | Sumber |
|---|---|---|---|---|---|---|---|---|---|---|
| Tanjung Riau | – | Tanjung Riau | 1.140 | 103.910 | estimasi kasar | Belum ditemukan | Melayu pesisir | Lisan: persinggahan raja Johor–Riau–Lingga | Pelantar lingkar, taman atas laut (Kotaku), rumah panggung Melayu pesisir | https://kkn.undip.ac.id/?p=324467 ; https://batampos.co.id/2021/05/11/tanjungriau-kampung-tua-yang-disulap-jadi-destinasi-wisata/ |
| Patam Lestari | Patam | Patam Lestari | 1.115 | 103.940 | estimasi kasar | Blog: penghulu Kampung Patam ingin meluas ke Pulau Lepu (tak jelas) | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Mentarau | – | Patam Lestari | 1.120 | 103.945 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Tiban (belum terkonfirmasi di daftar 37) | Tiban Kampung | Tiban Lama? | 1.115 | 103.965 | estimasi kasar | – | Orang Ladi pengabdi Raja Melayu; lalu Bugis ("Semani"), kemudian Minang dan Selayar di hulu | Tak pasti | Perlu cek lapangan | https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam |

### Kecamatan Sagulung (6) dan Batu Aji (1)

| Nama | Nama populer | Kelurahan | Lat | Lng | Akurasi | Asal-usul nama | Suku awal | Masa berdiri | Yang bisa dilihat | Sumber |
|---|---|---|---|---|---|---|---|---|---|---|
| Tembesi | – | Tembesi | 1.045 | 103.985 | estimasi kasar | Dari pohon tembesi (dugaan) | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Tiawangkang | Tiangwangkang | Tembesi | 1.020 | 103.970 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Tanjung Gundap | – | Tembesi | 1.015 | 103.960 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Dapur 12 | – | Sei Pelunggut | 1.030 | 103.950 | estimasi kasar | "Dapur" lazim merujuk dapur arang (dugaan) | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Sei Lekop | – | Sei Lekop | 1.040 | 103.990 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Sei Binti | – | Sei Binti | 1.055 | 103.940 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |
| Cunting | – | Tanjung Uncang (Batu Aji) | 1.060 | 103.920 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | Perlu cek lapangan | S1 |

### Kecamatan Sei Beduk (3)

| Nama | Nama populer | Kelurahan | Lat | Lng | Akurasi | Asal-usul nama | Suku awal | Masa berdiri | Yang bisa dilihat | Sumber |
|---|---|---|---|---|---|---|---|---|---|---|
| Tanjung Piayu Laut | Piayu Laut | Tanjung Piayu | 1.025 | 104.050 | estimasi kasar | Belum ditemukan | Melayu | Pra-1970 | Rumah kayu pesisir, pantai, wisata kuliner laut | https://www.journal.unrika.ac.id/index.php/journalhistoria/article/download/5487/3607/ |
| Bagan | Tanjung Bagan | Tanjung Piayu | 1.040 | 104.040 | estimasi kasar | "Bagan/bebagan" = berkemah membuka hutan | Melayu (perlu dicek) | Blog: 1879 (konflik data, lihat profil) | Masjid tua At Taubah, makam keluarga tetua adat, tugu dan gapura kampung tua | STPN (link §1); https://kampungkb.bkkbn.go.id/kampung/1798/kampung-kb-tanjung-piayu |
| Setengar | Setenga | Tanjung Piayu | 1.030 | 104.030 | estimasi kasar | Belum ditemukan | Perlu dicek | Pra-1970 | STPN menyebut warga Setenga pernah direlokasi masa Otorita | BKKBN (link di atas); STPN |

**Entri ke-37:** S1 menyebut **"Seranggong/Seranggon"** tanpa kelurahan atau kecamatan. Statusnya belum jelas, jadi tidak dipetakan. 1–2 entri lain gagal dipulihkan; kandidat terkuatnya Tiban.

### Kecamatan Galang: Pulau Rempang–Galang (16 kampung versi Ombudsman RI)

Daftarnya: Tanjung Kertang, Rempang Cate, Tebing Tinggi, Blongkeng, Monggak, Pasir Panjang, Pantai Melayu, Tanjung Kelingking, Sembulang, Dapur Enam, Tanjung Banun/Banon, Sungai Raya, Sijantung, Air Lingka, Kampung Baru, Tanjung Pengapit.

- Pulau Rempang terdiri dari dua kelurahan, **Rempang Cate dan Sembulang** (Perpustakaan DPR).
- **Perlu dicek:** pembagian kelurahan per kampung, dan apakah Sijantung, Air Lingka, Kampung Baru, dan Tanjung Pengapit sebenarnya ada di Pulau Galang.
- **Suku awal:** tokoh warga Gerisman Ahmad menyebut Melayu, Orang Laut, dan Orang Darat, yang "diyakini telah bermukim… sejak tahun 1834". Ini klaim tokoh warga, bukan arsip yang sudah dicek. https://perpustakaan.dpr.go.id/sipinter/index/detail/id/121
- **Situs yang disebut:** monumen eks tentara Jepang di Sembulang (GNFI). Kawasan Galang juga punya bekas kamp pengungsi Vietnam, tapi itu bukan kampung tua.

### Hinterland (Belakang Padang, Bulang): belum ada daftar terbuka

| Situs/kampung | Kecamatan | Lat | Lng | Akurasi | Catatan | Sumber |
|---|---|---|---|---|---|---|
| Pulau Bulang Lintang: Makam Temenggung Abdul Jamal | Bulang | 1.000 | 103.880 | estimasi kasar | Basis keluarga Temenggung sejak 1722; cagar budaya SK 483/2022 | https://disbud.kepriprov.go.id/kompleks-makam-temenggung-abdul-jamal/ |
| Pulau Buluh: Perigi Batu | Bulang | 1.070 | 103.930 | estimasi kasar | Perigi peninggalan Raja Ali Kelana (versi Disbudpar); cagar budaya SK 483/2022 | https://kepri.antaranews.com/berita/149763/pemkot-batam-tetapkan-empat-peninggalan-sejarah-jadi-cagar-budaya |
| Belakang Padang | Belakang Padang | 1.153 | 103.893 | estimasi kasar | Ibu kota Kecamatan Batam 1959–1983, pindahan dari Pulau Buluh; bangunan tua dan kuliner | https://disbudpar.batam.go.id/2020/07/29/melihat-wisata-sejarah-di-belakang-padang/ |

---

## 3. Profil kampung tua yang paling terdokumentasi

### 1) Nongsa Pantai: "kampung asal" Hari Jadi Batam
- **Lokasi:** Kelurahan Sambau, Kecamatan Nongsa, pesisir utara menghadap Selat Singapura.
- **Sejarah (terverifikasi arsip):**
  - Raja Isa bin Raja Ali (Nong Isa), putra Yang Dipertuan Muda Riau V, mendapat mandat memegang perintah atas Nongsa dan rantau sekitarnya.
  - Mandat itu datang dari Sultan Abdulrahman Syah dan YDM Riau VI Raja Jakfar, bertanggal **22 Jumadil Akhir 1245 H / 18 Desember 1829**.
  - Tanggal ini dijadikan Hari Jadi Kota Batam lewat Perda No. 4/2009.
  - Toponim "Nongsa" berasal dari "Nong Isa". https://disbud.kepriprov.go.id/asal-usul-nama-kampung-tua-nongsa/
- **Jejak peta:** "Kampong Nongsa" tercatat di peta Belanda 1847 (KITLV Leiden), menurut jurnal Kronologi UNP 2025. http://kronologi.ppj.unp.ac.id/index.php/jk/article/download/949/564
- **Data yang bertabrakan:**
  - Sejumlah media menyebut Nong Isa wafat 1831. Padahal catatan Belanda 1833 yang dikutip sejarawan Aswandi Syahri menyebut ia "berusia sekitar 50 tahun" pada 1833.
  - Makam Nong Isa sendiri **belum diketahui**. Yang ada di Nongsa adalah makam zuriat/keturunannya.
  - Di kartu, tulis: "tahun wafat masih diperdebatkan".
- **Yang bisa dilihat sekarang:** Kompleks Makam Zuriat Raja Isa di atas bukit kecil (59 anak tangga menurut satu laporan), cagar budaya lewat SK Wali Kota No. 483/2022. Ada juga pantai Nongsa dan perahu ke Pulau Putri.
- **Tradisi** (wawancara dengan Ketua Kampung Tua Nongsa Pantai, Ibu Hasnida, di jurnal Kronologi): tepuk tepung tawar, kenduri arwah/haul jama', mandi Safar, bubur Asyura, khatam Al-Qur'an. Warganya mayoritas keturunan Melayu dan Bugis.

### 2) Batu Besar & Kampung Melayu: dari "Lagorap" ke kopra
- **Lokasi:** Kelurahan Batu Besar, Nongsa, dekat Bandara Hang Nadim.
- **Asal nama:** dari sebuah batu besar dekat bibir pantai. Nama lamanya Labong Gorap, dari kerang kecil di tepi pantai.
- **Penghuni awal** (sumber: **Balai Pelestarian Nilai Budaya Kepri**, sebagian berdasar tutur lisan): https://kebudayaan.kemdikbud.go.id/bpnbkepri/meneroka-batu-besar-di-batam/
  - M. Akib dari Malaka, akhir abad ke-19, dimakamkan di Teluk Kampung Melayu.
  - Pendatang Tionghoa merintis sejak ~1870; Theng Huang disebut generasi Tionghoa ketiga.
  - Setelah itu datang orang Melayu dan Bugis. Kampung ini penghasil kopra yang dijual ke Singapura.
- **Sekolah Rakyat pertama, 1957:** disebut blog dan GoWest/Beplus. GoWest juga menyebut SD 001 Nongsa sebagai yang tertua. Perlu dicek ke Disdik.
- **Rumah Limas Potong:**
  - Dibangun keluarga **Haji Muhammad Sain**, berdiri sejak 1959, di Kampung Melayu RT 01/RW 13.
  - Ditetapkan cagar budaya lewat SK 483/2022.
  - Kondisinya "memprihatinkan" dan masih milik keluarga (Kadisbudpar Ardiwinata, Agustus 2025).
  - Sumber berbeda soal bentuknya: ada yang menyebut rumah panggung kayu, ada kutipan keluarga yang menyebut "bukan rumah panggung".
  - https://www.detik.com/sumut/berita/d-8088809/cagar-budaya-rumah-limas-potong-batam-memprihatinkan-ini-kata-disparbud ; https://gowest.id/kondisi-rumah-haji-sain-yang-dijadikan-cagar-budaya-memprihatinkan/
- **Etika:** ini rumah pribadi. Jangan masuk tanpa izin keluarga.

### 3) Tanjung Bemban: kampung legenda
- **Lokasi:** Kelurahan Batu Besar, Nongsa, dekat Hang Nadim dan Pelabuhan Telaga Punggur.
- **Asal nama:** dari pohon "beremban/bemban" (Disbud Kepri).
- **Cerita rakyat:**
  - (a) Menurut *Sejarah Melayu*, Sang Nila Utama/Sri Tri Buana pernah berburu pelanduk di sini. Ini teks hikayat, **bukan bukti arkeologis**.
  - (b) Kisah anak durhaka yang dikutuk jadi batu "Malang Orang", di tepi pantai antara Jabi dan Tanjung Buton.
- **Setelah kemerdekaan**, banyak warga pindah ke Batu Besar. https://disbud.kepriprov.go.id/tanjung-bemban/
- **Yang bisa dilihat:** Gapura Adat Kampung Tua (difoto tim STPN) dan Pantai Tanjung Bemban yang tenang.

### 4) Tanjung Uma: "tanah bertuah" di depan Jodoh
- **Lokasi:** Kelurahan Tanjung Uma, Lubuk Baja.
- **Asal nama** (Disbud Kepri, mengutip buku *Nong Isa, Tonggak Awal Pemerintahan Batam*): "uma" berarti rumah/tempat tinggal, merujuk rumah panggung bertiang kayu di antara Tanjung Pangkal Lepu dan Tanjung Kubur. Versi lain: dari kata Inggris "home". Versi Antara: dari kerang "tuma". https://disbud.kepriprov.go.id/tanjung-uma/
- **Penghuni awal:** Melayu dan Bugis dari keluarga diraja Riau-Lingga, hidup sebagai nelayan dan pekebun kelapa.
- **Yang bisa dilihat:**
  - Bukit Kubur, dengan makam yang "diperkirakan berusia ratusan tahun". Di sini warga menggelar tradisi **jejak tanah** bagi bayi.
  - Makam di samping Masjid Baitussyakur. Cerita rakyat menyebutnya makam saudara Habib Nuh (Singapura).
- **Pantun lokal:** *"Pokok kurma di bawah lembah / Tanam senduduk bercabang due / Tanjung ume tanah bertuah / Semoge kekal selame-lamenye."*
- **Sensitif:** Tanjung Uma termasuk kampung yang legalitasnya paling alot. Kunjungan Menteri ATR 2019 berangkat dari masalah di sini, dan pada Oktober 2026 Wali Kota menyebutnya masih diupayakan. Jangan sentuh topik lahan di kartu.

### 5) Tanjung Riau: pelantar yang jadi ruang publik
- **Lokasi:** Kelurahan Tanjung Riau, Sekupang. Dari lampu merah Sekupang ambil arah Sungai Harapan.
- **Cerita lisan:** tempat persinggahan raja-raja Johor–Riau–Lingga hingga Indragiri, dengan banyak "Perigi Raja" (tokoh masyarakat Pak Saptono, via KKN Undip). https://kkn.undip.ac.id/?p=324467
- **Kondisi sekarang:**
  - Pilot project **Kotaku (Kementerian PUPR)**: pelantar lingkar, plaza, taman atas laut, gapura.
  - Dananya Rp15 miliar APBN dan Rp1,562 miliar APBD, ditargetkan selesai Juni 2021.
  - Warga sudah menerima sertifikat hak milik. https://kepri.bpk.go.id/taman-atas-laut-tanjungriau-selesai-ikon-baru-wisata-batam/
- **Arsitektur:** rumah panggung Melayu pesisir di atas air; kolong rumahnya dipakai untuk kebutuhan ekonomi (jurnal arsitektur UIB). https://journal.uib.ac.id/index.php/jad/article/download/5952/2166/9353
- **Spot:** sunset sambil melihat lalu lintas kapal dan galangan.

### 6) Bagan: masjid tua dan makam tetua
- **Lokasi:** Kelurahan Tanjung Piayu, Sei Beduk. Menurut BKKBN, satu dari tiga kampung tua di kelurahan itu (Bagan, Piayu Laut, Setengar).
- **Asal nama:** "Tanjung Bagan" berarti tanjung tempat "bebagan" (berkemah) saat membuka hutan untuk kebun (blog).
- **Konflik data:** blog yang sama menyebut kampung ini dibuka **1879 oleh Nong Isa**. Itu tidak mungkin jika Nong Isa wafat sekitar 1830-an. Tandai **"perlu dicek"**.
- **Yang bisa dilihat:**
  - Masjid tua At Taubah, yang menurut cerita berdiri di lahan tempat "bebagan".
  - Makam keluarga tetua adat **Raja Mahmud**, dicatat tim STPN 2016. Keterangan fotonya menulis "Raja Muhammad", jadi namanya perlu dicek.
  - Kompleks makam warga, pohon kelapa berumur lebih dari 80 tahun, dan tugu kampung tua.
- **Sejarah militer:** disebut sebagai markas KKO pada 1965 (blog, perlu dicek).

### 7) Tanjung Piayu Laut: ujung selatan, wisata kuliner laut
- **Lokasi:** Kelurahan Tanjung Piayu, Sei Beduk, di ujung kelurahan, ke arah Jembatan Barelang.
- **Kondisi sekarang:** jurnal Historia UNRIKA meneliti perubahan sosial-ekonomi warga setelah tumbuhnya **wisata kuliner** (2010–2022). Kampung pesisir dengan rumah kayu ini disebut "masih teguh memegang adat budaya leluhur". https://www.journal.unrika.ac.id/index.php/journalhistoria/article/download/5487/3607/
- **Cerita rakyat:** jalur penyamaran Sultan Sulaiman. Sumbernya hanya keterangan gambar di ResearchGate, jadi lemah.
- **Infrastruktur:** BP Batam merencanakan jaringan pipa air baru ke sini (Batam Pos, 2025).

### 8) Teluk Mata Ikan: pantai kelapa di Nongsa
- **Lokasi:** Kelurahan Sambau, Nongsa.
- **Yang bisa dilihat:** gapura kuning bergaya Melayu, pantai pasir putih, deretan kelapa (Batamnews).
- **Catatan:** pada 2025 tokoh warganya menagih legalitas. Kampung ini masuk daftar 37 tapi belum punya legalitas (Batam Pos). https://metropolis.batampos.co.id/amsakar-berkomitmen-selesaikan-persoalan-kampung-tua-di-batam/

### 9) Panau: nama dari panau
- **Lokasi:** Kelurahan Kabil, Nongsa.
- **Cerita rakyat:**
  - Penghuni pertamanya sepasang suami istri. Sang istri berpenyakit kulit panau; suaminya berkulit gelap dan dipanggil "Wak Keling".
  - Penduduk bertambah pada 1949–1953 dengan pendatang Bugis, Buton, dan Flores di samping Melayu.
  - Sumbernya artikel **opini** di Antara yang ditulis pejabat KPPN, bukan sejarawan. https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam
- **Catatan penyajian:** kata "keling" bisa dianggap merendahkan. Kalau dikutip, beri konteks bahwa ini kutipan cerita lama, atau parafrasekan.

### 10) Batu Merah & Sei Tering: Melcem
- **Lokasi:** Kelurahan Batu Merah, Batu Ampar.
- **Cerita lokal (artikel opini Antara):**
  - Sekitar 1960-an, muara sungai dihuni orang Tionghoa dan hulunya orang Jawa; kawasan ini dikenal sebagai "Melcem".
  - Batu Merah dibuka orang Bugis, Daeng Tambak, lalu diteruskan Pak Merah, seorang pengumpul batu. Dari namanya muncul "Batu Merah", dan kawasan ramai pada 1976.
  - Tahun 1949 masih kampung nelayan kecil dengan kelong milik orang Tionghoa.
- **Status:** cerita lokal, perlu dicek ke tetua.

### 11) Pulau Bulang Lintang (hinterland): pusat Temenggung
- **Lokasi:** Kecamatan Bulang.
- **Sejarah (terdokumentasi):**
  - Pulau Bulang menjadi "markas besar" keluarga Temenggung Riau-Johor sejak **1722**.
  - Tun Abdul Jamal (lahir ~1720) bergelar Temenggung sejak 1757 dan wafat ~1802.
  - Ayahnya, Bendahara Tun Abbas, juga dimakamkan di sini (Trocki, via Disbud Kepri). https://disbud.kepriprov.go.id/kompleks-makam-temenggung-abdul-jamal/
- **Yang bisa dilihat:**
  - Kompleks makam (cagar budaya SK 483/2022) dan makam istrinya, Raja Maimunah.
  - Masjid.
  - Benda pusaka (tombak, tongkat, keris) di rumah ahli waris, hanya bisa dilihat atas izin. https://mediacenter.batam.go.id/2022/03/01/ardi-dan-asppi-napak-tilas-amir-pulau-buluh/
- **Catatan:** namanya diabadikan sebagai Stadion Temenggung Abdul Jamal. Antara (2014) mencatat minimnya informasi tertulis di lokasi.

### 12) Sembulang (Rempang): ringkas dan hati-hati
- **Lokasi:** Kelurahan Sembulang, Galang.
- **Sejarah lokal** (SwaraKepri, tulisan warga): https://swarakepri.com/sejarah-kampung-sembulang-pulau-rempang/
  - Sembulang adalah gabungan kampung kecil: Sembulang Hulu, Tanjung Gemuk, Air Lingseng, Sembulang Tanjung, Pasir Merah, Dapur Enam, Tanjung Banon, dan lainnya.
  - Tokoh pembuka yang disebut antara lain Muse dan Langking.
  - Nipis, istri Langking, wafat 1958 dan dimakamkan di pemakaman umum Al Fajri.
- **Status:** tulisan warga, belum dicek ulang.
- **Rekomendasi:** tampilkan hanya sejarah dan budaya. Untuk konteks lain, arahkan ke catatan bertanggal di bagian 4.

### Toponim lama yang sering disebut "kampung tua" tapi tidak ada di daftar 37
Jodoh, Sekupang, Batu Aji, Kabil, dan Muka Kuning punya kisah asal-usul di artikel Antara. Contohnya:
- Jodoh: kisah Putri Mayang dan Pangeran Bugis.
- Kabil: dari "ma'bul/Kabul", ucapan Cik Awang asal Siak (1909).
- Muka Kuning: dari ikan seriding kuning.

Ini cocok sebagai fitur **"Kisah Nama Tempat"** dengan label cerita rakyat, **bukan** sebagai pin kampung tua.

---

## 4. Status legalitas: ringkasan netral & bertanggal

**Kerangka dasar:**
- Keppres No. 41/1973 menyerahkan seluruh areal Pulau Batam dengan Hak Pengelolaan (HPL) kepada Otorita Batam, kini BP Batam.
- HPL kemudian diperluas ke Rempang, Galang, dan pulau lain lewat PP 5/2011 (kajian STPN).
- Titik tegangnya: SK Wali Kota 2004 "tidak merekomendasikan" kampung tua masuk HPL. Kajian STPN menilai SK itu "apabila dikaji bertentangan" dengan Keppres 41/1973, tapi juga menyebutnya "langkah penyelesaian sengketa yang bijak dan adil".

**Kronologi:**

| Tanggal | Peristiwa | Siapa bilang |
|---|---|---|
| 23 Mar 2004 | SK Wali Kota KPTS.105/HK/III/2004 menetapkan kampung tua. Tanggalnya diperingati sebagai "Hari Marwah Kampung Tua". | STPN |
| 2004 | Perda No. 2/2004 RTRW 2004–2014 memuat definisi perkampungan tua. | STPN; Batam Pos |
| 5 & 25 Apr 2005 | Ketua Otorita meminta penjelasan; Dinas Pertanahan Pemko menjawab dengan kriteria kampung tua. | STPN |
| 29 Mar 2006 | SK Wali Kota KPTS.89/HK/III/2006 tentang penetapan wilayah perkampungan tua. | Harmidi Umar Husein (DPRD), via TribunBatam |
| 2008 | Rapat akbar / Piagam Kampung Tua RKWB. | Batam Pos 2019 |
| 22 Mar 2010 | "Maklumat Kampung Tua". | STPN |
| 19 Agu 2011 | SKB Wali Kota–BP Batam membentuk Tim Penyelesaian Kampung Tua. | DPRD via TribunBatam |
| 2012–2014 | 2012: baru 5 titik diukur (BP Batam via Antara). 2013: 7 titik terverifikasi. 2014: 21 titik. | Antara; Kronologi UNP |
| 21 Apr 2015 | Surat RKWB ke Presiden; dijawab Kemensetneg 12 Mei 2015 (minta kajian). | STPN |
| Nov 2016 | Aksi "Geram UWTO" menolak PMK 148/2016 dan Perka BP 19/2016 (tarif UWTO). | STPN |
| 1 Apr 2019 | Menteri ATR/BPN mendengar aspirasi. RKWB (Makmur Ismail): 37 titik, ±1.600 ha. LAM (Nyat Kadir): istilah kampung tua lahir dari masalah 2004. | Media Center Pemko |
| Akhir 2019 | 1.456 bidang di Tanjung Riau, Sei Binti, Tanjung Gundap disertifikasi. | Media Center Pemko 6 Jan 2020 |
| Nov 2020 | Pemko: 7 kampung tua bebas persoalan hutan lindung. | TribunBatam |
| 2021 | Perda No. 3/2021 RTRW 2021–2041 tanpa ketentuan spesifik kampung tua. | Batam Pos |
| 25 Sep 2025 | Perka BP Batam No. 6/2025 tentang Pengelolaan Pertanahan. Batam Pos menyebutnya menegaskan pengakuan kampung tua (isi pasal belum dicek). | Hukumonline; Batam Pos |
| 30 Apr 2026 | Wali Kota Amsakar memperjuangkan kampung tua dalam revisi RTRW Kepri. | diskan.batam.go.id |
| Jul 2026 | Sertifikat PTSL diserahkan ke warga Kampung Tua (contoh: Batu Besar), setelah lahan dilepas dari HPL BP Batam. | Kompas.com 10 Jul 2026 |
| 15 Agu 2026 | Pemko menyampaikan **Ranperda Penataan Kampung Tua** ke DPRD. | DPRD Batam |
| 16 & 22 Sep 2026 | Rapat perdana Pansus Ranperda bersama Pemko pada 16/9, dipimpin Wakil Ketua Pansus Kamaruddin Muda. Rapat lanjutan 22/9 dipimpin Ketua Pansus Muhammad Yunus. Tahap berikutnya "audiensi dan penjaringan aspirasi dari masyarakat Kampung Tua". | dprd.batam.go.id |
| 16 Okt 2026 | Dalam silaturahmi RT/RW/LPM Kecamatan Lubuk Baja di Hotel AP Premier, Amsakar menyatakan "sebanyak 1.450 sertifikat tanah telah diselesaikan". Kepastian hukum Tanjung Uma masih diupayakan, "termasuk melalui penyusunan peraturan daerah khusus tentang Kampung Tua". | batam.go.id; Kompas.com 19 Okt 2026 |

Catatan: sejak 2025, Wali Kota Batam (Amsakar Achmad) juga merangkap Kepala BP Batam. Rangkap jabatan ini mengubah dinamika hubungan Pemko–BP.

**Catatan khusus Rempang (faktual, bertanggal):**
- **Agustus–September 2023:** pemerintah mengumumkan Rempang Eco-City, kerja sama BP Batam dan PT Makmur Elok Graha (MEG), berstatus PSN. Bentrokan warga dan aparat terjadi pada September 2023.
- **Klaim soal skala dampak berbeda-beda:**
  - Koordinator Riset Walhi Riau, Umi Ma'rufah, pada 13/9/2023 menyebut "perlawanan masyarakat di 16 Kampung Melayu Tua di Rempang Galang".
  - Kepala BP Batam saat itu, Muhammad Rudi, menyatakan "hanya ada 3 kampung" pada tahap 2.000 ha: Sembulang Hulu, Sembulang Tanjung, Pasir Panjang.
  - BP Batam di kesempatan lain menyebut empat kampung.
  - Lagat Parroha Patar Siadari dari Ombudsman Perwakilan Kepri (dikutip Kompas.id) menyebut "lebih dari 70 persen warga di lima kampung menolak relokasi atau penggeseran".
- **Januari 2024:** Ombudsman RI (investigasi Sep 2023–Jan 2024) menemukan malaadministrasi, antara lain pemerintah "belum mengakui keberadaan kampung tua di Rempang". Ombudsman juga mencatat warga 10 kampung mendukung investasi tapi menolak relokasi. https://www.kompas.id/baca/nusantara/2024/01/29/ombudsman-ri-kampung-tua-rempang-harus-dihormati-dan-dilindungi
- **10 Februari 2025:** Perpres 12/2025 (RPJMN 2025–2029) tidak mencantumkan Rempang Eco-City di daftar 77 PSN. Ketua Komisi VI DPR membenarkannya pada 28 April 2025. BP Batam (Ariastuty Sirait, Maret 2025) menyatakan proyek ini masih ada di Lampiran IV, bagian arah pembangunan kewilayahan. https://www.tempo.co/ekonomi/dpr-buktikan-proyek-rempang-eco-city-tak-masuk-daftar-77-psn-prabowo-1284270
- **Relokasi ke Tanjung Banon:**
  - Tempo, 27/2/2025: "Setidaknya terdapat 60 kepala keluarga" sudah pindah. Warga Samsudin Bujur: "masalah sertifikat (SHM) kami belum terima, tetapi kami sudah pindah". Menurut transmigrasi.go.id, SHM untuk 68 KK baru diserahkan Menko AHY pada 18/3/2025.
  - Ketik.com, 12/5/2026, mengutip Deputi Pelayanan Umum BP Batam Ariastuty Sirait: total penghuni "kini mencapai 242 KK atau sebanyak 842 jiwa".
  - Eko Yunanda (Walhi Riau), mengutip kajian *Kronik PSN Rempang Eco-City, Kontroversi Investasi Tiongkok, dan Resistensi Masyarakat Rempang* (via Betahita): "hanya 20% masyarakat di lima kampung tua… (Sembulang Pasir Merah, Sembulang Hulu, Sembulang Tanjung, Pasir Panjang, dan Belongkeng) yang menerima relokasi".
- **September 2025:** konflik baru soal penetapan Taman Buru di Sungai Raya (Tempo).
- **15 Juni 2026:** Walhi Riau dan LBH Pekanbaru mengecam pematokan lahan di Pantai Melayu untuk Sekolah Merah Putih. Tanggapan BP Batam soal ini belum diperoleh.

**Untuk fitur:** cukup satu kalimat di kartu Rempang, misalnya: *"Kampung-kampung di Pulau Rempang berada dalam kawasan yang direncanakan untuk Rempang Eco-City sejak 2023. Status dan pandangan para pihak masih berkembang; lihat sumber bertanggal."* Tautkan ke Ombudsman dan BP Batam, dua-duanya.

---

## 5. Arsip, foto lama, dan narasumber untuk diajak kolaborasi

**Lembaga**
- **LAM Kota Batam.** Ketua Umum Raja Muhammad Amin (per 2025), sebelumnya Sekretaris Umum RKWB. Pintu masuk ke tokoh tiap kampung.
- **RKWB (Rumpun Khazanah Warisan Batam).** Ketua Umum H. Machmur/Makmur Ismail (ejaan namanya berbeda antarmedia). Pemegang daftar 37 titik (surat 047/RKWB/VIII/2016).
- **Dinas Kebudayaan dan Pariwisata Kota Batam.** Kadis Ardiwinata; Kabid Kebudayaan Muhammad Zen (2023). Mengelola cagar budaya dan menerbitkan buku Nong Isa. https://disbudpar.batam.go.id
- **Tim Ahli Cagar Budaya (TACB) Kota Batam.** Ketua Anasrudin Albatamy (2022).
- **Balai Pelestarian Kebudayaan Wilayah IV** (dulu BPNB Kepri): artikel Batu Besar dan makam Nong Isa. https://kebudayaan.kemdikbud.go.id/bpnbkepri/
- **Dinas Kebudayaan Provinsi Kepri:** seri "asal-usul kampung tua". https://disbud.kepriprov.go.id/category/ragam-budaya/
- **Dinas Pertanahan Pemko Batam:** salinan SK 105/2004 dan SK 89/2006 beserta lampiran nama.
- **Museum Raja Ali Haji Batam:** koleksi sketsa Nong Isa.

**Arsip & foto lama**
- **KITLV / Leiden University Digital Collections:** peta 1847 *Kaart van de Noordkust van het Eiland Bantang* dan foto kolonial.
- **ANRI (Arsip Riouw) dan Perpustakaan Nasional:** dokumen mandat Nong Isa dan catatan 1833.
- Arsip foto Otorita/BP Batam era 1970–80-an (Humas BP Batam).
- Repository STPN (kajian 2013, 2015, 2016), berisi foto lapangan Bagan dan Tanjung Bemban.

**Buku, jurnal & tulisan**
- Ahmad Dahlan, Aswandi Syahri, Edi Sutrisno, *Nong Isa: Tonggak Awal Pemerintahan Batam* (Disbudpar Batam).
- Jurnal Kronologi UNP (2025), *Eksistensi Kampung Tua Nongsa Pantai…*.
- Journal Historia UNRIKA (Piayu Laut).
- Journal of Architecture & Design UIB (Tanjung Riau, tipologi rumah Melayu).
- Jurnal Potensi Universitas Batam (Tanjung Riau sebagai kampung budaya).
- Jurnal SARGA Untag Semarang (Kampung Tua Tanjung Piayu).
- Sejarawan **Aswandi Syahri** (Tanjungpinang).
- Penulis lokal **Bintoro Suryo** (bintorosuryo.com, GoWest.id/Beplus), banyak meliput Nongsa, Batu Besar, dan Tanjung Bemban.
- UMRAH dan skripsi lain belum ditelusuri dalam riset ini; cari di repository kampus.

**Narasumber per kampung yang namanya sudah tercatat di sumber publik**
- Ibu Hasnida (Ketua Kampung Tua Nongsa Pantai).
- Raja Erwan (disebut keturunan ke-9 Raja Isa).
- Keluarga Haji Muhammad Sain (Rumah Limas Potong).
- Pak Saptono (tokoh Tanjung Riau).
- Ahli waris Temenggung Abdul Jamal di Bulang Lintang.

Hubungi mereka lewat LAM atau RKWB, bukan langsung lewat kontak pribadi dari internet.

**Media sosial:** riset ini tidak memverifikasi akun komunitas tertentu. Ambil handle resmi dari situs lembaga terkait, dan hindari akun anonim.

---

## 6. Panduan etika penyajian

**Izin & kredit**
- Foto warga, rumah, makam, atau pusaka hanya dengan **izin tertulis atau rekaman izin lisan**.
- Untuk foto lama, catat pemilik, tahun, dan lisensinya. KITLV punya ketentuan reproduksi sendiri.
- Kredit narasumber dengan format: *"Tutur: [Nama], tokoh Kampung Tua X, diwawancarai [tanggal]"*. Sediakan opsi anonim.
- Beri warga **hak koreksi**, misalnya lewat tombol "Ada yang keliru? Kabari kami".

**Etika berkunjung (untuk kartu)**
- Berpakaian sopan, terutama dekat masjid dan makam. Ucapkan salam.
- Makam dan perigi adalah tempat ziarah, bukan latar konten. Jangan duduk atau berdiri di atas nisan.
- Pelantar dan rumah panggung adalah ruang privat warga. Jangan masuk kolong atau teras tanpa diundang.
- Belanja di warung lokal dan bawa pulang sampahmu. (Pesan soal sampah juga pernah disampaikan Wali Kota di Tanjung Riau.)
- Jangan jadikan sengketa lahan bahan obrolan basa-basi dengan warga.
- Hormati jadwal kampung: Jumat siang dan bulan Ramadan punya ritme sendiri.

**Menulis topik sensitif**
- Atribusikan setiap klaim: "menurut BP Batam…", "menurut Ombudsman…", "menurut warga…".
- Jangan pakai kata "menggusur" atau "merampas" sebagai narasi redaksi. Kalau perlu, kutip apa adanya dan sebut siapa yang mengatakannya.
- **Jangan tampilkan** luas, batas, poligon, atau status sertifikat per kampung. Data luas versi Pemko, BP, maupun masyarakat sengaja tidak dimasukkan ke seed.
- Beri tanggal di setiap pernyataan status, karena situasinya cepat berubah.
- Hati-hati dengan istilah etnis lama dalam cerita rakyat (misalnya "keling"). Parafrasekan, atau beri catatan konteks.

**Menandai ketidakpastian (badge UI)**
- `terverifikasi`: didukung arsip atau sumber lembaga.
- `sumber_tunggal`: hanya satu media atau blog.
- `cerita_rakyat`: legenda atau tutur lisan. Tampilkan dengan ikon berbeda (misalnya ✦).
- `perlu_cek_ulang`: data bertabrakan atau belum ditemukan.
- Koordinat `estimasi_kasar`: tampilkan sebagai pin "melayang" (lingkaran samar) sampai ada koordinat terverifikasi.

---

## 7. Seed data JSON

Blok di bawah berisi 55 entri: 36 entri lapisan mainland (35 dari daftar Ranperda 2019, termasuk Air Raja dan Seranggong yang perlu dicek, plus Tiban yang belum terkonfirmasi), 16 entri Rempang–Galang, dan 3 entri hinterland. Daftar Ranperda 2019 aslinya berisi 37 nama; 1–2 entri belum berhasil dipulihkan (lihat Caveats).

Catatan teknis:
- `lat`/`lng` bernilai `null` jika tidak dipetakan.
- Semua koordinat berstatus `estimasi_kasar_belum_diverifikasi`. Jalankan geocoding (Nominatim/OSM) dan koreksi manual sebelum produksi.
- `status_verifikasi` mengikuti badge di bagian 6.

```json
[
  {"id":"kt-nongsa-pantai","nama":"Kampung Tua Nongsa Pantai","nama_populer":"Nongsa","kecamatan":"Nongsa","kelurahan":"Sambau","lat":1.199,"lng":104.095,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":"Dari 'Nong Isa', nama timang Raja Isa bin Raja Ali","suku_awal":"Melayu (keturunan Riau-Lingga) dan Bugis","masa_berdiri":"Awal abad ke-19; mandat 18 Desember 1829; 'Kampong Nongsa' di peta 1847","ringkasan":"Kampung tempat Raja Isa (Nong Isa) memegang perintah atas Nongsa dan rantau sekitarnya; tanggal mandatnya dijadikan Hari Jadi Kota Batam (Perda 4/2009). Makam Nong Isa sendiri belum diketahui; yang ada adalah makam zuriatnya.","yang_bisa_dilihat":["Kompleks Makam Zuriat Raja Isa (cagar budaya SK 483/2022)","Pantai Nongsa","Penyeberangan ke Pulau Putri","Tradisi: tepuk tepung tawar, mandi Safar, bubur Asyura"],"cerita_rakyat":null,"sumber_url":["https://disbud.kepriprov.go.id/asal-usul-nama-kampung-tua-nongsa/","http://kronologi.ppj.unp.ac.id/index.php/jk/article/download/949/564","https://kepri.antaranews.com/berita/149763/pemkot-batam-tetapkan-empat-peninggalan-sejarah-jadi-cagar-budaya"],"status_verifikasi":"terverifikasi (sejarah); tahun wafat Nong Isa perlu_cek_ulang"},
  {"id":"kt-tereh","nama":"Kampung Tua Tereh","nama_populer":"Terih","kecamatan":"Nongsa","kelurahan":"Sambau","lat":1.190,"lng":104.060,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Kampung tua pesisir di Nongsa yang mulai banyak dikunjungi wisatawan.","yang_bisa_dilihat":["Pantai (perlu cek lapangan)"],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all","https://www.batamnews.co.id/berita-98675-menikmati-suasana-kampung-tua-batam-yang-alami-dan-kental-budaya-melayu.html"],"status_verifikasi":"sumber_tunggal"},
  {"id":"kt-bakau-serip","nama":"Kampung Tua Bakau Serip","nama_populer":null,"kecamatan":"Nongsa","kelurahan":"Sambau","lat":1.185,"lng":104.050,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-teluk-mata-ikan","nama":"Kampung Tua Teluk Mata Ikan","nama_populer":null,"kecamatan":"Nongsa","kelurahan":"Sambau","lat":1.170,"lng":104.130,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu (perlu dicek)","masa_berdiri":"Pra-Otorita Batam","ringkasan":"Kampung pesisir dengan pantai pasir putih dan deretan kelapa; disambut gapura kuning bergaya Melayu.","yang_bisa_dilihat":["Gapura kampung tua","Pantai pasir putih"],"cerita_rakyat":null,"sumber_url":["https://www.batamnews.co.id/berita-98675-menikmati-suasana-kampung-tua-batam-yang-alami-dan-kental-budaya-melayu.html","https://metropolis.batampos.co.id/amsakar-berkomitmen-selesaikan-persoalan-kampung-tua-di-batam/"],"status_verifikasi":"sumber_tunggal"},
  {"id":"kt-kampung-melayu-batu-besar","nama":"Kampung Tua Kampung Melayu","nama_populer":"Kampung Melayu Batu Besar","kecamatan":"Nongsa","kelurahan":"Batu Besar","lat":1.150,"lng":104.140,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu","masa_berdiri":"Akhir abad ke-19 (tutur lisan)","ringkasan":"Lokasi Rumah Limas Potong milik keluarga Haji Muhammad Sain (berdiri 1959), cagar budaya Kota Batam.","yang_bisa_dilihat":["Rumah Limas Potong (rumah pribadi, izin keluarga)"],"cerita_rakyat":"Pembuka lahan pertama disebut M. Akib dari Malaka, dimakamkan di Teluk Kampung Melayu (tutur lisan)","sumber_url":["https://www.detik.com/sumut/berita/d-8088809/cagar-budaya-rumah-limas-potong-batam-memprihatinkan-ini-kata-disparbud","https://kebudayaan.kemdikbud.go.id/bpnbkepri/meneroka-batu-besar-di-batam/"],"status_verifikasi":"terverifikasi (cagar budaya); detail arsitektur perlu_cek_ulang"},
  {"id":"kt-jabi","nama":"Kampung Tua Jabi","nama_populer":"Kampung Jabi","kecamatan":"Nongsa","kelurahan":"Batu Besar","lat":1.125,"lng":104.150,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua; disebut dalam legenda batu Malang Orang (antara Jabi dan Tanjung Buton).","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-tanjung-bemban","nama":"Kampung Tua Tanjung Bemban","nama_populer":null,"kecamatan":"Nongsa","kelurahan":"Batu Besar","lat":1.130,"lng":104.155,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":"Dari pohon 'beremban/bemban' yang tumbuh di kampung","suku_awal":"Melayu (disebut dihuni keturunan raja Riau-Lingga)","masa_berdiri":"Tak pasti","ringkasan":"Kampung pesisir timur yang dikaitkan dengan kisah Sejarah Melayu; banyak warganya pindah ke Batu Besar pascakemerdekaan.","yang_bisa_dilihat":["Gapura Adat Kampung Tua","Pantai Tanjung Bemban"],"cerita_rakyat":"Menurut Sejarah Melayu, Sang Nila Utama/Sri Tri Buana berburu pelanduk di sini; legenda anak durhaka yang menjadi batu 'Malang Orang'","sumber_url":["https://disbud.kepriprov.go.id/tanjung-bemban/","https://beplus.id/2019/05/tanjung-bemban-kampung-raja-raja-part-1-beplus-story/"],"status_verifikasi":"cerita_rakyat (asal-usul); lokasi terverifikasi"},
  {"id":"kt-batu-besar","nama":"Kampung Tua Batu Besar","nama_populer":"Lagorap / Labong Gorap","kecamatan":"Nongsa","kelurahan":"Batu Besar","lat":1.145,"lng":104.135,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":"Dari batu besar dekat bibir pantai; nama lama dari kerang kecil 'gorap'","suku_awal":"Melayu; Tionghoa sejak ~1870; lalu Bugis","masa_berdiri":"Akhir abad ke-19","ringkasan":"Kampung penghasil kopra yang dijual ke Singapura; disebut punya Sekolah Rakyat pada 1957.","yang_bisa_dilihat":["Jejak kebun kelapa","Sekolah tua (perlu dicek)"],"cerita_rakyat":null,"sumber_url":["https://kebudayaan.kemdikbud.go.id/bpnbkepri/meneroka-batu-besar-di-batam/","https://gowest.id/batu-besar-lagorap-penghasil-kopra-di-lintasan-waktu/"],"status_verifikasi":"terverifikasi (BPNB); detail SR 1957 sumber_tunggal"},
  {"id":"kt-panglong","nama":"Kampung Tua Panglong","nama_populer":null,"kecamatan":"Nongsa","kelurahan":"Batu Besar","lat":1.140,"lng":104.125,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-kampung-tengah","nama":"Kampung Tua Kampung Tengah","nama_populer":null,"kecamatan":"Nongsa","kelurahan":"Batu Besar","lat":1.135,"lng":104.120,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-teluk-nipah","nama":"Kampung Tua Teluk Nipah","nama_populer":null,"kecamatan":"Nongsa","kelurahan":"Kabil","lat":1.065,"lng":104.140,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-telaga-punggur","nama":"Kampung Tua Telaga Punggur","nama_populer":"Punggur","kecamatan":"Nongsa","kelurahan":"Kabil","lat":1.058,"lng":104.150,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Kampung tua dekat Pelabuhan Telaga Punggur.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-teluk-lengung","nama":"Kampung Tua Teluk Lengung","nama_populer":null,"kecamatan":"Nongsa","kelurahan":"Kabil","lat":1.080,"lng":104.150,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-panau","nama":"Kampung Tua Panau","nama_populer":"Kampung Panau","kecamatan":"Nongsa","kelurahan":"Kabil","lat":1.100,"lng":104.130,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":"Dari penyakit kulit 'panau' istri penghuni pertama (cerita rakyat)","suku_awal":"Melayu; 1949–1953 berdatangan Bugis, Buton, Flores","masa_berdiri":"Ramai sejak 1949","ringkasan":"Kampung dekat Nongsa yang penduduknya bertambah pesat pada 1949–1953.","yang_bisa_dilihat":[],"cerita_rakyat":"Penghuni pertama: istri berpanau dan suami berkulit gelap yang dipanggil 'Wak Keling' (gunakan parafrase)","sumber_url":["https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam"],"status_verifikasi":"cerita_rakyat"},
  {"id":"kt-bengkong-laut","nama":"Kampung Tua Bengkong Laut","nama_populer":null,"kecamatan":"Bengkong","kelurahan":"Bengkong Laut","lat":1.165,"lng":104.040,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-bengkong-sadai","nama":"Kampung Tua Bengkong Sadai","nama_populer":"Sadai","kecamatan":"Bengkong","kelurahan":"Sadai","lat":1.150,"lng":104.040,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-batu-merah","nama":"Kampung Tua Batu Merah","nama_populer":"Melcem (kawasan)","kecamatan":"Batu Ampar","kelurahan":"Batu Merah","lat":1.168,"lng":104.010,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":"Dari 'Pak Merah', pengumpul batu","suku_awal":"Dibuka orang Bugis (Daeng Tambak)","masa_berdiri":"Ramai sejak 1976","ringkasan":"Kampung yang dibuka Daeng Tambak lalu diteruskan Pak Merah.","yang_bisa_dilihat":[],"cerita_rakyat":"Asal nama Batu Merah dari Pak Merah si pengumpul batu","sumber_url":["https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam"],"status_verifikasi":"cerita_rakyat"},
  {"id":"kt-sei-tering","nama":"Kampung Tua Sei Tering","nama_populer":"Melcem","kecamatan":"Batu Ampar","kelurahan":"Batu Merah","lat":1.165,"lng":104.005,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Muara: Tionghoa; hulu: Jawa (versi Antara)","masa_berdiri":"Dihuni sekitar 1960-an; kampung nelayan kecil pada 1949","ringkasan":"Kawasan yang dikenal sebagai Melcem; dulu ada kelong-kelong milik orang Tionghoa di pinggir pantai.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam"],"status_verifikasi":"sumber_tunggal"},
  {"id":"kt-tanjung-sengkuang","nama":"Kampung Tua Tanjung Sengkuang","nama_populer":null,"kecamatan":"Batu Ampar","kelurahan":"Tanjung Sengkuang","lat":1.162,"lng":103.995,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-air-raja","nama":"Kampung Tua Air Raja","nama_populer":null,"kecamatan":"Batu Ampar (menurut daftar, janggal)","kelurahan":"Tanjung Sengkuang (menurut daftar)","lat":null,"lng":null,"akurasi_koordinat":"tidak_dipetakan","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":null,"ringkasan":"Muncul di daftar 37 versi Ranperda 2019; lokasinya janggal karena Air Raja juga nama kelurahan di Galang.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-belian","nama":"Kampung Tua Belian","nama_populer":"Kampung Belian","kecamatan":"Batam Kota","kelurahan":"Belian","lat":1.140,"lng":104.055,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Kampung tua di tepi Batam Centre.","yang_bisa_dilihat":["Makam tua (disebut berumur ±200 tahun, panjang 3 m — perlu dicek)"],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all","https://www.yuliamarza.com/2016/08/mengenal-sejarah-kampung-tua-yang-ada.html"],"status_verifikasi":"sumber_tunggal"},
  {"id":"kt-tanjung-uma","nama":"Kampung Tua Tanjung Uma","nama_populer":"Tanjung Ume","kecamatan":"Lubuk Baja","kelurahan":"Tanjung Uma","lat":1.158,"lng":103.988,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":"'Uma' = rumah (rumah panggung) di antara Tanjung Pangkal Lepu dan Tanjung Kubur; versi lain dari 'home' atau kerang 'tuma'","suku_awal":"Melayu dan Bugis dari keluarga diraja Riau-Lingga","masa_berdiri":"Sebelum kemerdekaan","ringkasan":"Kampung nelayan dan pekebun kelapa di pesisir utara yang berhadapan dengan Selat Singapura.","yang_bisa_dilihat":["Bukit Kubur (makam tua)","Makam di samping Masjid Baitussyakur","Rumah pelantar"],"cerita_rakyat":"Makam di Bukit Kubur disebut milik saudara Habib Nuh; tradisi 'jejak tanah' bagi bayi","sumber_url":["https://disbud.kepriprov.go.id/tanjung-uma/","https://ulasan.co/mengintip-sejarah-kampung-tua-tanjung-uma-ditengah-pembagunan-kota-batam/"],"status_verifikasi":"terverifikasi (Disbud Kepri); cerita_rakyat untuk makam"},
  {"id":"kt-tanjung-riau","nama":"Kampung Tua Tanjung Riau","nama_populer":null,"kecamatan":"Sekupang","kelurahan":"Tanjung Riau","lat":1.140,"lng":103.910,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu pesisir","masa_berdiri":"Pra-1970","ringkasan":"Kampung nelayan di atas air; pilot project Kotaku PUPR dengan pelantar lingkar dan taman atas laut.","yang_bisa_dilihat":["Pelantar lingkar","Taman atas laut","Rumah panggung Melayu pesisir","Sunset"],"cerita_rakyat":"Persinggahan raja-raja Johor–Riau–Lingga hingga Indragiri, dengan banyak 'Perigi Raja' (tutur Pak Saptono)","sumber_url":["https://kepri.bpk.go.id/taman-atas-laut-tanjungriau-selesai-ikon-baru-wisata-batam/","https://kkn.undip.ac.id/?p=324467","https://journal.uib.ac.id/index.php/jad/article/download/5952/2166/9353"],"status_verifikasi":"terverifikasi (kondisi kini); cerita_rakyat (persinggahan raja)"},
  {"id":"kt-patam-lestari","nama":"Kampung Tua Patam Lestari","nama_populer":"Patam","kecamatan":"Sekupang","kelurahan":"Patam Lestari","lat":1.115,"lng":103.940,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-mentarau","nama":"Kampung Tua Mentarau","nama_populer":null,"kecamatan":"Sekupang","kelurahan":"Patam Lestari","lat":1.120,"lng":103.945,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-tiban","nama":"Kampung Tiban","nama_populer":"Tiban Kampung","kecamatan":"Sekupang","kelurahan":"Tiban Lama (perlu dicek)","lat":1.115,"lng":103.965,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Orang Ladi pengabdi Raja Melayu; lalu Bugis (keturunan 'Semani'); Minang dan Selayar di hulu","masa_berdiri":"Tak pasti","ringkasan":"Disebut sebagai kampung tua di artikel Antara, tetapi belum terkonfirmasi ada di daftar resmi 37.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-tembesi","nama":"Kampung Tua Tembesi","nama_populer":null,"kecamatan":"Sagulung","kelurahan":"Tembesi","lat":1.045,"lng":103.985,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-tiawangkang","nama":"Kampung Tua Tiawangkang","nama_populer":"Tiangwangkang","kecamatan":"Sagulung","kelurahan":"Tembesi","lat":1.020,"lng":103.970,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-tanjung-gundap","nama":"Kampung Tua Tanjung Gundap","nama_populer":null,"kecamatan":"Sagulung","kelurahan":"Tembesi","lat":1.015,"lng":103.960,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-dapur-12","nama":"Kampung Tua Dapur 12","nama_populer":null,"kecamatan":"Sagulung","kelurahan":"Sei Pelunggut","lat":1.030,"lng":103.950,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-sei-lekop","nama":"Kampung Tua Sei Lekop","nama_populer":null,"kecamatan":"Sagulung","kelurahan":"Sei Lekop","lat":1.040,"lng":103.990,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-sei-binti","nama":"Kampung Tua Sei Binti","nama_populer":null,"kecamatan":"Sagulung","kelurahan":"Sei Binti","lat":1.055,"lng":103.940,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-cunting","nama":"Kampung Tua Cunting","nama_populer":null,"kecamatan":"Batu Aji","kelurahan":"Tanjung Uncang","lat":1.060,"lng":103.920,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Termasuk daftar 37 kampung tua.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-tanjung-piayu-laut","nama":"Kampung Tua Tanjung Piayu Laut","nama_populer":"Piayu Laut","kecamatan":"Sei Beduk","kelurahan":"Tanjung Piayu","lat":1.025,"lng":104.050,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu","masa_berdiri":"Pra-1970","ringkasan":"Kampung pesisir di ujung Piayu yang berkembang dengan wisata kuliner laut sejak 2010-an dan masih memegang adat leluhur.","yang_bisa_dilihat":["Rumah kayu pesisir","Pantai","Kuliner laut"],"cerita_rakyat":"Jalur penyamaran Sultan Sulaiman (sumber lemah)","sumber_url":["https://www.journal.unrika.ac.id/index.php/journalhistoria/article/download/5487/3607/","https://kampungkb.bkkbn.go.id/kampung/1798/kampung-kb-tanjung-piayu"],"status_verifikasi":"terverifikasi (jurnal); cerita_rakyat sumber_tunggal"},
  {"id":"kt-bagan","nama":"Kampung Tua Bagan","nama_populer":"Tanjung Bagan","kecamatan":"Sei Beduk","kelurahan":"Tanjung Piayu","lat":1.040,"lng":104.040,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":"'Bebagan' = berkemah saat membuka hutan untuk kebun","suku_awal":"Melayu (perlu dicek)","masa_berdiri":"Blog menyebut 1879 (konflik data)","ringkasan":"Kampung dengan masjid tua, makam keluarga tetua adat, dan pohon kelapa berumur lebih dari 80 tahun yang dicatat tim STPN 2016.","yang_bisa_dilihat":["Masjid tua At Taubah","Makam keluarga tetua adat (Raja Mahmud/Raja Muhammad — perlu dicek)","Tugu kampung tua"],"cerita_rakyat":"Dibuka oleh 'Nong Isa' pada 1879 (blog; bertentangan dengan masa hidup Nong Isa)","sumber_url":["http://repository.stpn.ac.id/133/1/3%20menata%20tanah%20kota%20batam%20jalan%20penyelesaian%20penguasaan%20tanah%20kampung%20tua.pdf","https://www.yuliamarza.com/2016/08/mengenal-sejarah-kampung-tua-yang-ada.html"],"status_verifikasi":"terverifikasi (situs, STPN); masa berdiri perlu_cek_ulang"},
  {"id":"kt-setengar","nama":"Kampung Tua Setengar","nama_populer":"Setenga","kecamatan":"Sei Beduk","kelurahan":"Tanjung Piayu","lat":1.030,"lng":104.030,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":"Pra-1970","ringkasan":"Satu dari tiga kampung tua di Kelurahan Tanjung Piayu menurut BKKBN.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://kampungkb.bkkbn.go.id/kampung/1798/kampung-kb-tanjung-piayu"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"kt-seranggong","nama":"Seranggong","nama_populer":"Seranggon","kecamatan":null,"kelurahan":null,"lat":null,"lng":null,"akurasi_koordinat":"tidak_dipetakan","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":null,"ringkasan":"Entri ke-37 di daftar Ranperda 2019 tanpa kelurahan/kecamatan.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-tanjung-kertang","nama":"Tanjung Kertang","nama_populer":null,"kecamatan":"Galang","kelurahan":"Rempang Cate (perlu dicek)","lat":0.970,"lng":104.140,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan","https://perpustakaan.dpr.go.id/sipinter/index/detail/id/121"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-rempang-cate","nama":"Rempang Cate","nama_populer":null,"kecamatan":"Galang","kelurahan":"Rempang Cate","lat":0.950,"lng":104.130,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-tebing-tinggi","nama":"Tebing Tinggi","nama_populer":null,"kecamatan":"Galang","kelurahan":"perlu dicek","lat":0.930,"lng":104.130,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-blongkeng","nama":"Blongkeng","nama_populer":"Belongkeng","kecamatan":"Galang","kelurahan":"perlu dicek","lat":0.860,"lng":104.160,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-monggak","nama":"Monggak","nama_populer":"Mongak","kecamatan":"Galang","kelurahan":"perlu dicek","lat":0.860,"lng":104.120,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI; kajian Trend Asia menyebut tepian Monggak sebagai lokasi kampung tua pertama di Rempang.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan","https://trendasia.org/proyek-rempang-eco-city-prahara-daerah-surga-investasi/"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-pasir-panjang","nama":"Pasir Panjang","nama_populer":null,"kecamatan":"Galang","kelurahan":"Sembulang (perlu dicek)","lat":0.850,"lng":104.150,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-pantai-melayu","nama":"Pantai Melayu","nama_populer":null,"kecamatan":"Galang","kelurahan":"Rempang Cate","lat":0.880,"lng":104.130,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Kampung tua sekaligus destinasi pantai di Rempang.","yang_bisa_dilihat":["Pantai"],"cerita_rakyat":null,"sumber_url":["https://sumut.idntimes.com/news/indonesia/indah-permata-sari-15/duka-warga-kampung-tua-rempang-tali-pusar-kami-tertanam-di-sini"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-tanjung-kelingking","nama":"Tanjung Kelingking","nama_populer":null,"kecamatan":"Galang","kelurahan":"perlu dicek","lat":0.920,"lng":104.100,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-sembulang","nama":"Sembulang","nama_populer":null,"kecamatan":"Galang","kelurahan":"Sembulang","lat":0.830,"lng":104.180,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu (tulisan warga)","masa_berdiri":"Tak pasti","ringkasan":"Gabungan kampung kecil (Sembulang Hulu, Sembulang Tanjung, Pasir Merah, dll.); disebut dalam SK 105/2004 menurut Ombudsman.","yang_bisa_dilihat":["Monumen eks tentara Jepang (disebut GNFI)"],"cerita_rakyat":"Tokoh pembuka kampung disebut Muse dan Langking (tulisan warga)","sumber_url":["https://swarakepri.com/sejarah-kampung-sembulang-pulau-rempang/","https://www.tempo.co/ekonomi/soroti-sejarah-hukum-kampung-tua-di-rempang-ombudsman-ini-unik-138618"],"status_verifikasi":"sumber_tunggal"},
  {"id":"rg-dapur-enam","nama":"Dapur Enam","nama_populer":"Dapur 6","kecamatan":"Galang","kelurahan":"Sembulang","lat":0.825,"lng":104.205,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Tak pasti","ringkasan":"Disebut dalam SK 105/2004 menurut Ombudsman.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://www.tempo.co/ekonomi/soroti-sejarah-hukum-kampung-tua-di-rempang-ombudsman-ini-unik-138618"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-tanjung-banon","nama":"Tanjung Banon","nama_populer":"Tanjung Banun","kecamatan":"Galang","kelurahan":"Sembulang","lat":0.820,"lng":104.200,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Tak pasti","ringkasan":"Disebut dalam SK 105/2004 menurut Ombudsman; kini juga lokasi permukiman relokasi.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://www.tempo.co/ekonomi/soroti-sejarah-hukum-kampung-tua-di-rempang-ombudsman-ini-unik-138618","https://mongabay.co.id/2025/03/22/longsor-bayangi-komplek-perumahan-relokasi-rempang-eco-city/"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-sungai-raya","nama":"Sungai Raya","nama_populer":null,"kecamatan":"Galang","kelurahan":"perlu dicek","lat":0.900,"lng":104.160,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu, Orang Laut, Orang Darat (klaim tokoh warga)","masa_berdiri":"Diyakini sejak 1834 (klaim)","ringkasan":"Satu dari 16 kampung tua Rempang–Galang versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-sijantung","nama":"Sijantung","nama_populer":"Sijatung","kecamatan":"Galang","kelurahan":"Sijantung (perlu dicek)","lat":null,"lng":null,"akurasi_koordinat":"tidak_dipetakan","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":null,"ringkasan":"Masuk daftar 16 versi Ombudsman RI; lokasi pulau (Rempang atau Galang) perlu dicek.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-air-lingka","nama":"Air Lingka","nama_populer":null,"kecamatan":"Galang","kelurahan":"perlu dicek","lat":null,"lng":null,"akurasi_koordinat":"tidak_dipetakan","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":null,"ringkasan":"Masuk daftar 16 versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-kampung-baru","nama":"Kampung Baru","nama_populer":null,"kecamatan":"Galang","kelurahan":"perlu dicek","lat":null,"lng":null,"akurasi_koordinat":"tidak_dipetakan","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":null,"ringkasan":"Masuk daftar 16 versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"rg-tanjung-pengapit","nama":"Tanjung Pengapit","nama_populer":null,"kecamatan":"Galang","kelurahan":"perlu dicek","lat":null,"lng":null,"akurasi_koordinat":"tidak_dipetakan","asal_usul_nama":null,"suku_awal":null,"masa_berdiri":null,"ringkasan":"Masuk daftar 16 versi Ombudsman RI.","yang_bisa_dilihat":[],"cerita_rakyat":null,"sumber_url":["https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan"],"status_verifikasi":"perlu_cek_ulang"},
  {"id":"hl-bulang-lintang","nama":"Pulau Bulang Lintang","nama_populer":"Pulau Bulang","kecamatan":"Bulang","kelurahan":"Bulang Lintang","lat":1.000,"lng":103.880,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu (keluarga Temenggung Riau-Johor)","masa_berdiri":"Basis keluarga Temenggung sejak 1722","ringkasan":"Pusat keluarga Temenggung; Tun Abdul Jamal (±1720–1802) memerintah dari sini sejak 1757.","yang_bisa_dilihat":["Makam Temenggung Abdul Jamal (cagar budaya SK 483/2022)","Makam Raja Maimunah","Masjid","Benda pusaka di rumah ahli waris (atas izin)"],"cerita_rakyat":null,"sumber_url":["https://disbud.kepriprov.go.id/kompleks-makam-temenggung-abdul-jamal/","https://mediacenter.batam.go.id/2022/03/01/ardi-dan-asppi-napak-tilas-amir-pulau-buluh/"],"status_verifikasi":"terverifikasi (situs); belum tentu tercatat sebagai 'kampung tua' resmi"},
  {"id":"hl-pulau-buluh","nama":"Pulau Buluh","nama_populer":null,"kecamatan":"Bulang","kelurahan":"Pulau Buluh","lat":1.070,"lng":103.930,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu (perlu dicek)","masa_berdiri":"Tak pasti","ringkasan":"Pulau dengan perigi batu peninggalan Raja Ali Kelana (versi Disbudpar), bangunan kuno, dan bekas sekolah rakyat.","yang_bisa_dilihat":["Perigi Batu (cagar budaya SK 483/2022)","Bangunan kuno"],"cerita_rakyat":null,"sumber_url":["https://kepri.antaranews.com/berita/149763/pemkot-batam-tetapkan-empat-peninggalan-sejarah-jadi-cagar-budaya","https://gokepri.com/menelusuri-mosaik-amir-pulau-buluh/"],"status_verifikasi":"terverifikasi (cagar budaya); status kampung tua perlu_cek_ulang"},
  {"id":"hl-belakang-padang","nama":"Belakang Padang","nama_populer":"Pulau Penawar Rindu","kecamatan":"Belakang Padang","kelurahan":"perlu dicek","lat":1.153,"lng":103.893,"akurasi_koordinat":"estimasi_kasar_belum_diverifikasi","asal_usul_nama":null,"suku_awal":"Melayu (perlu dicek)","masa_berdiri":"Ibu kota Kecamatan Batam 1959–1983","ringkasan":"Pulau dengan bangunan bersejarah dan kuliner; pernah menjadi ibu kota Kecamatan Batam.","yang_bisa_dilihat":["Kantor Camat bersejarah","Gedung Nasional","Kompleks Angkatan Laut lama","Kuliner"],"cerita_rakyat":null,"sumber_url":["https://disbudpar.batam.go.id/2020/07/29/melihat-wisata-sejarah-di-belakang-padang/"],"status_verifikasi":"sumber_tunggal; status kampung tua perlu_cek_ulang"}
]
```

---

## Caveats
- **Daftar 37 belum 100% pulih.** Halaman TribunBatam gagal dimuat penuh, jadi 34–36 entri direkonstruksi dari potongan teks. Ejaan (Tereh/Terih, Tiawangkang/Tiangwangkang, Setengar/Setenga) dan 1–2 entri (Tiban? Air Raja? Seranggong) harus dicocokkan dengan lampiran SK resmi.
- **Semua koordinat masih estimasi**, bukan hasil OSM/Wikidata. Jangan dipakai untuk navigasi sebelum di-geocode.
- **Banyak "sejarah" bersumber dari artikel opini, blog, atau tutur lisan.** Sumber terkuat ada di Disbud Kepri, BPNB/BPK Wilayah IV, kajian STPN, dan jurnal. Sisanya sudah ditandai.
- **Kuliner per kampung belum terdata**, kecuali kuliner laut di Nongsa dan Piayu Laut, serta Belakang Padang. Isi lewat kunjungan lapangan atau narasumber, jangan mengarang.
- **Situasi Rempang dan legalitas terus bergerak.** Ranperda baru masuk Pansus pada September 2026. Cantumkan tanggal "terakhir diperbarui" di UI.

## Daftar sumber
- stpn — http://repository.stpn.ac.id/133/1/3%20menata%20tanah%20kota%20batam%20jalan%20penyelesaian%20penguasaan%20tanah%20kampung%20tua.pdf
- batam — https://mediacenter.batam.go.id/2019/06/25/walikota-roadshow-37-titik-kampung-tua/
- tribunnews — https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=2
- antaranews — https://kepri.antaranews.com/berita/225337/amsakar-tegaskan-komitmen-tuntaskan-legalitas-kampung-tua
- batam — https://webarchive.batam.go.id/humas.com/01/index-2685.html
- cnnindonesia — https://www.cnnindonesia.com/ekonomi/20230920101723-92-1001321/warga-masih-menolak-pendaftaran-relokasi-rempang-diperpanjang
- ombudsman — https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan
- dpr — https://perpustakaan.dpr.go.id/epaper/index/popup/id/18042
- trendasia — https://trendasia.org/proyek-rempang-eco-city-prahara-daerah-surga-investasi/
- tempo — https://www.tempo.co/ekonomi/soroti-sejarah-hukum-kampung-tua-di-rempang-ombudsman-ini-unik-138618
- batampos — https://metropolis.batampos.co.id/status-kampung-tua-prioritas-amsakar-li-claudia/
- unp — http://kronologi.ppj.unp.ac.id/index.php/jk/article/download/949/564
- antaranews — https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam
- batamnews — https://www.batamnews.co.id/berita-98675-menikmati-suasana-kampung-tua-batam-yang-alami-dan-kental-budaya-melayu.html
- tribunnews — https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all
- yuliamarza — https://www.yuliamarza.com/2016/08/mengenal-sejarah-kampung-tua-yang-ada.html
- rendratopan — https://rendratopan.com/2019/05/28/mengenal-sejarah-kampung-tua-yang-ada-di-batam-marzaqueen/
- goodnewsfromindonesia — https://goodnewsfromindonesia.id/2023/10/20/melacak-potensi-wbtb-dan-cagar-budaya-di-pulau-rempang
- kepriprov — https://disbud.kepriprov.go.id/kompleks-makam-temenggung-abdul-jamal/
- antaranews — https://kepri.antaranews.com/berita/149763/pemkot-batam-tetapkan-empat-peninggalan-sejarah-jadi-cagar-budaya
- batam — https://disbudpar.batam.go.id/2020/07/29/melihat-wisata-sejarah-di-belakang-padang/
- batamnews — https://www.batamnews.co.id/berita-13772-makam-zuriat-nong-isa-bukti-jejak-para-raja-di-kepulauan-riau.html
- Wikipedia — https://id.wikipedia.org/wiki/Batu_Besar,_Nongsa,_Batam
- kemdikbud — https://kebudayaan.kemdikbud.go.id/bpnbkepri/meneroka-batu-besar-di-batam/
- detik — https://www.detik.com/sumut/berita/d-8088809/cagar-budaya-rumah-limas-potong-batam-memprihatinkan-ini-kata-disparbud
- gowest — https://gowest.id/kondisi-rumah-haji-sain-yang-dijadikan-cagar-budaya-memprihatinkan/
- ariranews — https://ariranews.com/27/09/2025/ketika-warga-dan-pelaku-pariwisata-bersatu-menjaga-warisan-leluhur-rumah-limas-potong/
- kepriprov — https://disbud.kepriprov.go.id/tanjung-bemban/
- tribunnews — https://batam.tribunnews.com/2020/12/26/terungkap-inilah-sejarah-dan-asal-usul-nama-kampung-tua-tanjung-uma
- kepriprov — https://disbud.kepriprov.go.id/tanjung-uma/
- seniberjalan — https://seniberjalan.com/pelantar-lingkar-wisata-baru-kampung-tua-tanjungriau/
- undip — https://kkn.undip.ac.id/?p=324467
- batam — https://mediacenter.batam.go.id/2020/01/06/legalitas-kampung-tua-diselesaikan-parsial/
- batampos — https://metropolis.batampos.co.id/amsakar-berkomitmen-selesaikan-persoalan-kampung-tua-di-batam/
- stpn — http://repository.stpn.ac.id/232/1/18%20Permasalahan%20Penguasaan%20Tanah%20Perkampungan.pdf
- batampos — https://batampos.co.id/2019/06/22/5-jejak-perjuangan-masyarakat-kampung-tua-sejak-2004-hingga-sekarang/
- antaranews — https://kepri.antaranews.com/berita/26578/bp-batam-minta-pengukuran-kampung-tua-diselesaikan
- batam — https://mediacenter.batam.go.id/2019/04/01/menteri-atr-dengarkan-aspirasi-masyarakat-kampung-tua/
- tribunnews — https://batam.tribunnews.com/2020/11/28/daftar-nama-7-kampung-tua-di-batam-bebas-dari-kasus-hutan-lindung
- hukumonline — https://www.hukumonline.com/pusatdata/detail/lt68edc053cfce1/peraturan-kepala-badan-pengusahaan-kawasan-perdagangan-bebas-dan-pelabuhan-bebas-batam-nomor-6-tahun-2025/legal_bases/
- batam — https://diskan.batam.go.id/2026/04/30/amsakar-li-claudia-perjuangkan-kampung-tua-dalam-revisi-rtrw-kepri-2026/
- kompas — https://www.kompas.com/properti/read/2026/07/10/070348421/warga-kampung-tua-mulai-terima-sertifikat-lahan-dilepas-dari-hpl-bp
- batam — https://dprd.batam.go.id/2026/08/15/dprd-kota-batam-gelar-paripurna-wali-kota-usulkan-tiga-ranperda-penataan-kampung-tua-pengelolaan-barang-milik-daerah-dam-perubahan-perda-pajak-daerah/
- rri — https://rri.co.id/batam/regional/2655541/dprd-batam-terima-3-usulan-ranperda-dari-pemko-ini-isinya
- dpr — https://perpustakaan.dpr.go.id/sipinter/index/detail/id/121
- harianhaluan — https://kepri.harianhaluan.com/daerah/1315064055/rempang-eco-city-tak-masuk-daftar-psn-2025-2029
- pikiran-rakyat — https://depokraya.pikiran-rakyat.com/nusantara/pr-3299151523/proyek-rempang-eco-city-dicabut-dari-daftar-psn-aktivis-batam-desak-penghentian-total
- dialogue — https://dialogue.earth/en/business/indonesian-islands-traditional-residents-face-relocation-due-to-sustainable-megaproject/
- wanaloka — https://wanaloka.com/usai-proyek-eco-city-pulau-rempang-dipatok-sepihak-untuk-sekolah-merah-putih/
- tempo — https://www.tempo.co/hiburan/empat-cagar-budaya-baru-di-batam-jadi-destinasi-sejarah-238844
- linasasmita — https://www.linasasmita.com/2018/05/pesona-ramadan-2018-di-kampung-tua-tanjung-uma.html
- bintorosuryo — https://bintorosuryo.com/2021/09/05/menelusur-nongsa-masa-lalu-tengku-h-puang-kepala-desa-batam-dan-makam-raja-isa-yang-tak-diketahui/
- batam — https://mediacenter.batam.go.id/2022/03/01/ardi-dan-asppi-napak-tilas-amir-pulau-buluh/
