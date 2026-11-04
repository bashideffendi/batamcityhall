# Siapa di Balik Nama Jalan: Tokoh-Tokoh yang Namanya Dipakai di Kota Batam
> task_id: wf-d6f02bac-a0a3-8339-8faa-3d61117e584a

# Siapa di Balik Nama Jalan: Tokoh-Tokoh yang Namanya Dipakai di Kota Batam

Sebagian besar nama tokoh di jalan, jembatan, bandara, dan stadion Batam berasal dari dua lapis sejarah. Lapis pertama adalah elite Kemaharajaan Johor–Riau–Lingga abad ke-18–20 (Raja Haji Fisabilillah, Engku Putri Raja Hamidah, Raja Ali Haji, Nong Isa, Temenggung Abdul Jamal, Raja Ali Kelana). Lapis kedua adalah tokoh Hikayat Hang Tuah dan Sejarah Melayu (Hang Tuah dan kawan-kawan, Hang Nadim). Lapis ketiga adalah pahlawan nasional dan perintis pembangunan Batam modern (Ibnu Sutowo, B.J. Habibie).

## TL;DR
- **Tiga tokoh paling "Batam" dan terverifikasi arsip:**
  - Nong Isa (Raja Isa bin Raja Ali) menerima mandat memerintah Nongsa pada 18 Desember 1829. Tanggal itu kini jadi hari jadi Batam.
  - Temenggung Abdul Jamal berbasis di Pulau Bulang dan merupakan leluhur para Temenggung Johor–Singapura.
  - Raja Ali Kelana mendirikan industri pertama di Batam, pabrik bata Batam Brickworks di Batu Aji.
- **Enam jembatan Barelang** memakai nama tokoh Melayu dari Kepulauan Riau dan Riau daratan. Tiga di antaranya pahlawan nasional: Raja Haji Fisabilillah, Raja Ali Haji, dan Tuanku Tambusai. Identitas "Nara Singa" dan "Sultan Zainal Abidin" hanya bisa ditelusuri lewat keterangan BP Batam, dan keterangan itu tidak sepenuhnya cocok dengan catatan sejarah. Kartu kedua tokoh ini perlu label "ada perbedaan versi".
- **Tokoh hikayat dan nama yang belum jelas:**
  - Hang Tuah, Hang Jebat, Hang Lekir, Hang Lekiu, Hang Kasturi, dan Dang Merdu adalah tokoh hikayat. Kesejarahan mereka diperdebatkan.
  - Dang Anom dan Laksamana Bintan belum teridentifikasi. Lokasi Jl. Engku Haji Tua, Jl. Tengku Sulung, Jl. Ibnu Sutowo, Jl. Hang Lekiu, Jl. Dang Merdu, dan Jl. Dang Anom juga belum terverifikasi. Sebaiknya semua ini tayang dengan status "perlu dicek".

## Ringkasan singkat

Batam punya "museum terbuka" yang tidak disadari warganya. Dari Simpang Jam sampai Galang Baru, papan jalan mengabadikan tiga generasi keluarga Bugis–Melayu:
- Raja Haji Fisabilillah;
- anak-anaknya, Engku Putri Raja Hamidah dan Engku Haji Tua (Raja Ahmad);
- cucunya, Raja Ali Haji.

Ada juga keluarga Temenggung dari Pulau Bulang yang kelak terlibat dalam lahirnya Singapura modern dan Kesultanan Johor modern.

Masalahnya, warga Batam memang lebih hafal simpang dan gedung daripada nama jalan. Batamnews mencatat bahwa "sebagian besar warganya tidak mengenal nama-nama jalan protokol". Karena itu fitur kartu tokoh ini relevan.

**Catatan metode:**
- Inventaris disusun dari daftar ruas jalan Dinas Perhubungan Kota Batam (2011, lewat Tribun Batam dan salinan blog), media lokal, situs Pemko dan BP Batam, serta halaman BPNB/BPCB Kemendikbud.
- Data OpenStreetMap belum ditarik langsung. Kolom `osm_name_bila_ada` di JSON masih kosong dan perlu diisi Claude Code lewat Overpass API (contoh kueri ada di bagian akhir).

## Tabel inventaris

Keterangan kelompok: (a) tokoh Melayu Riau-Lingga, Johor, Malaka, dan Riau daratan; (b) tokoh hikayat/legenda; (c) tokoh nasional dan pahlawan nasional; (d) tokoh pembangunan Batam; (e) tokoh lokal/adat.

| Nama tempat/jalan | Jenis | Kecamatan | Tokoh | Kelompok | Sumber |
|---|---|---|---|---|---|
| Bandar Udara Internasional Hang Nadim | Bandara | Nongsa (Kel. Batu Besar) | Laksamana Hang Nadim | a/b | https://hangnadimairport.bpbatam.go.id/about |
| Jl. Hang Nadim | Jalan | Bulang | Hang Nadim | a/b | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Stadion Temenggung Abdul Jamal | Stadion | Batam Kota/Sei Ladi (perlu dicek) | Temenggung Abdul Jamal | a/e | https://en.wikipedia.org/wiki/Temenggong_Abdul_Jamal |
| Makam & Masjid Temenggung Abdul Jamal | Makam/masjid | Bulang (Pulau Bulang Lintang) | Temenggung Abdul Jamal | a/e | https://kebudayaan.kemdikbud.go.id/bpcbsumbar/pulau-bulang-dalam-pusaran-kerajaan-melayu-riau/ |
| Jl. Temenggung Abdul Jamal | Jalan | Bulang | Temenggung Abdul Jamal | a/e | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Raja Maimunah | Jalan | Bulang | Raja Maimunah (istri Temenggung Abdul Jamal) | a/e | https://kepri.antaranews.com/berita/25686/warisan-sejarah-pulau-bulang-tanpa-rekam-jejak |
| Nongsa (nama kecamatan) | Kawasan | Nongsa | Nong Isa/Raja Isa | a | http://disbud.kepriprov.go.id/makam-nong-isa-batam/ |
| Jl. Raja Isa; Gedung Nong Isa | Jalan/gedung | Batam Kota (Batam Centre) | Nong Isa/Raja Isa | a | https://batamtoday.com/news/banjir-kembali-lumpuhkan-batam-centre-anggota-dprd-batam-soroti-drainase-dan-penimbunan-laut |
| Makam Zuriat Nong Isa | Makam | Nongsa (Kel. Sambau) | Keturunan Nong Isa | a | https://mediacenter.batam.go.id/2022/12/15/tak-lupakan-sejarah-rudi-ziarah-makam-zuriat-nong-isa/ |
| Jl. Engku Putri; Dataran Engku Putri | Jalan/alun-alun | Batam Kota | Engku Putri Raja Hamidah | a | https://jantungmelayu.co/2017/03/nama-jalan-batam-dievaluasi-berharap-unsur-budaya-lokal-lebih-ditonjolkan/ |
| Jl. Engku Putri Utara | Jalan | Batam Kota | Engku Putri Raja Hamidah | a | https://kepri.pikiran-rakyat.com/kepri/pr-2688930416/sosok-raja-h-fisabilillah-namanya-diabadikan-sebagai-jalan-di-batam |
| Masjid Agung/Masjid Raya di Dataran Engku Putri | Masjid | Batam Kota | Engku Putri (kaitan nama perlu dicek) | a | perlu dicek |
| Jembatan Barelang I "Tengku Fisabilillah" | Jembatan | Bulang (Batam–Tonton, perlu dicek) | Raja Haji Fisabilillah | a/c | https://www.detik.com/sumut/berita/d-7613289/jembatan-barelang-ikon-kota-batam-buah-tangan-presiden-habibie |
| Jl. Raja H. Fisabilillah | Jalan | Batam Kota (Simpang Jam–Bundaran Madani) | Raja Haji Fisabilillah | a/c | https://kepri.pikiran-rakyat.com/kepri/pr-2688930416/sosok-raja-h-fisabilillah-namanya-diabadikan-sebagai-jalan-di-batam |
| Jembatan Barelang II "Nara Singa" | Jembatan | Bulang (Tonton–Nipah) | Raja Narasinga II, Indragiri | a | https://batampos.co.id/2020/08/23/ini-fakta-jembatan-ii-barelang/ |
| Jembatan Barelang III "Raja Ali Haji" | Jembatan | Bulang (Nipah–Setokok) | Raja Ali Haji | a/c | https://www.sarahjalan.com/2023/07/6-nama-jembatan-di-barelang-apa-saja-itu.html |
| Jl. Raja Ali Haji | Jalan | Lubuk Baja; juga ada di Bulang | Raja Ali Haji | a/c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Museum Batam Raja Ali Haji | Museum | Batam Kota (perlu dicek) | Raja Ali Haji | a/c | https://batambanget.com/nong-isa-sang-penguasa-pertama-pulau-batam/ |
| Jembatan Barelang IV "Sultan Zainal Abidin" | Jembatan | Bulang–Galang (Setokok–Rempang) | Sultan Zainal Abidin Syah, Tambusai/Rokan (versi BP Batam) | a | https://batampos.co.id/2020/09/15/fakta-fakta-jembatan-4-barelang/ |
| Jembatan Barelang V "Tuanku Tambusai" | Jembatan | Galang (Rempang–Galang) | Tuanku Tambusai | c | https://khazanah.republika.co.id/berita/sie577483/kisah-tuanku-tambusai-ulama-penghancur-benteng-belanda |
| Jembatan Barelang VI "Raja Kecik" | Jembatan | Galang (Galang–Galang Baru) | Raja Kecik, pendiri Siak | a | https://id.wikipedia.org/wiki/Abdul_Jalil_Syah_dari_Siak |
| Masjid Sultan Mahmud Riayat Syah | Masjid | Batu Aji (perlu dicek) | Sultan Mahmud Riayat Syah | a/c | https://id.wikipedia.org/wiki/Daftar_tempat_wisata_di_Kepulauan_Riau |
| Jl. Sultan Abdul Rachman (St Abdurahman) | Jalan | Lubuk Baja (Simp. Lippo–Simp. Puri Garden) | Sultan Abdul Rahman Muazzam Syah (I atau II, perlu dicek) | a | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Raja Ali Kelana | Jalan | Batam Kota (Batam Centre) | Raja Ali Kelana | a/d | https://batamtoday.com/news/banjir-kembali-lumpuhkan-batam-centre-anggota-dprd-batam-soroti-drainase-dan-penimbunan-laut |
| Bumi Perkemahan Raja Ali Kelana | Kawasan | perlu dicek | Raja Ali Kelana | a/d | http://wartasejarah.blogspot.com/2015/12/sejarah-dan-budaya-batam.html |
| RSUD Embung Fatimah | Rumah sakit | Batu Aji | Tengku Embung Fatimah | a | https://kepri.antaranews.com/berita/200065/melestarikan-cagar-budaya-makam-embung-fatimah-di-pulau-penyengat |
| Jl. Engku Haji Tua | Jalan | perlu dicek | Raja Ahmad (Engku Haji Tua) | a/e | https://ms.wikipedia.org/wiki/Engku_Haji |
| Jl. Tengku Sulung | Jalan | perlu dicek | Tengku Sulung | a | https://www.kompas.com/stori/read/2021/12/16/100000279/tengku-sulung-panglima-besar-reteh-yang-gigih-melawan-belanda?page=all |
| Jl. Laksamana Bintan | Jalan | Lubuk Baja (Simp. Pelita Atas–Simp. Rosedale/BNI) | Gelar "Laksamana" di Bintan (identitas perlu dicek) | a/b | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Laksamana | Jalan | Bulang | Gelar Laksamana (perlu dicek) | a/b | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Hang Tuah | Jalan | Nongsa (Simp. Batu Besar–Bundaran Kabil); juga di Belakang Padang | Hang Tuah | b | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Hang Jebat | Jalan | Nongsa (Simp. Batu Besar–Nongsa Resort) | Hang Jebat | b | https://kepri.pikiran-rakyat.com/kepri/pr-2688930416/sosok-raja-h-fisabilillah-namanya-diabadikan-sebagai-jalan-di-batam |
| Jl. Hang Kesturi | Jalan | Nongsa (Simp. Batu Besar–Simp. Punggur); juga di Belakang Padang | Hang Kasturi | b | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Hang Lekir | Jalan | Nongsa (Simp. Hang Jebat–Nongsa Resort) | Hang Lekir | b | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Hang Lekiu | Jalan | perlu dicek | Hang Lekiu | b | perlu dicek |
| Jl. Dang Merdu | Jalan | perlu dicek | Dang Merdu (ibu Hang Tuah) | b | perlu dicek |
| Jl. Dang Anom | Jalan | perlu dicek | Dang Anom | b | perlu dicek |
| Jl. Batin Limat | Jalan | Galang (Simp. Sungai Raya–Simp. Sembulang) | Batin Limat bin Limbang | e | https://kecgalang.batam.go.id/2025/03/06/alamat-kecamatan-galang/ |
| Jl. Batin Bidin | Jalan | Galang | Batin Bidin | e | https://www.liputan6.com/regional/read/5421347/menulusuri-makam-keramat-teluk-lubuk-lanjut-jejak-awal-peradaban-di-pulau-rempang |
| Jl. Ibnu Sutowo | Jalan | perlu dicek | Ibnu Sutowo | d | perlu dicek |
| "Jembatan Habibie" (sebutan populer Barelang) | Julukan | Bulang–Galang | B.J. Habibie | d | https://en.wikipedia.org/wiki/Barelang_Bridge |
| Jl. Brigjen Katamso | Jalan | Sagulung (Simp. Base Camp–Tg. Uncang) | Brigjen Katamso | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. R. Suprapto | Jalan | Sei Beduk (Simp. Panbil–Simp. Base Camp) | Letjen R. Suprapto | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. S. Parman | Jalan | Sei Beduk (Simp. Panbil–Tg. Piayu) | Letjen S. Parman | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Ahmad Yani | Jalan | Batam Kota (Simp. Kabil–Simp. Panbil) | Jenderal Ahmad Yani | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Sudirman | Jalan | Batam Kota (Simp. Jam–Bundaran Kabil) | Jenderal Sudirman | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Gajah Mada | Jalan | Sekupang (Simp. Sei Harapan–Simp. Jam) | Gajah Mada (Majapahit) | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Imam Bonjol | Jalan | Lubuk Baja | Tuanku Imam Bonjol | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Teuku Umar | Jalan | Lubuk Baja | Teuku Umar | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |
| Jl. Raden Patah, Jl. Yos Sudarso, Jl. Diponegoro, Jl. Kartini, Jl. dr. Cipto Mangunkusumo, Jl. KH Ahmad Dahlan, Jl. R.E. Martadinata, Jl. Hasanuddin, Jl. Pattimura | Jalan | Lubuk Baja, Batu Ampar, Sekupang, Nongsa | Tokoh nasional | c | https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/ |

## Profil tokoh (format kartu)

### (a) Tokoh Melayu Riau-Lingga, Johor, Malaka, dan Riau daratan

**Nong Isa / Raja Isa bin Raja Ali**
- Gelar: pemegang perintah (wakil kerajaan) Riau-Lingga di Nongsa
- Masa hidup: sekitar 1780-an–1830-an. Versinya berbeda: Dinas Kebudayaan Provinsi Kepri menulis "Setelah Nong Isa wafat pada tahun 1831", sedangkan catatan lain menyebut usianya sekitar 50 tahun pada 1833.
- Kisah: Ia putra Raja Ali, Yang Dipertuan Muda (YDM) Riau V. Pada awal abad ke-19 ia dan rombongan kerabat kerajaan pindah dari pusat Riau-Lingga, lalu membuka kampung di Nongsa. Pada 22 Jumadil Akhir 1245 H (18 Desember 1829) ia menerima mandat memerintah Nongsa dan sekitarnya dari Sultan Abdul Rahman Muazzam Syah dan YDM VI Raja Jaafar. Salinan suratnya tersimpan dalam koleksi Arsip Riouw di ANRI. Penduduk menyebut kampungnya "Kampung Nong Isa", dari situlah nama Nongsa.
- Kaitan dengan Batam: tanggal mandatnya ditetapkan sebagai Hari Jadi Kota Batam. Makamnya sendiri belum ditemukan; yang ada di Nongsa Pantai adalah kompleks makam zuriat (keturunan)-nya.
- Tempat: Kecamatan Nongsa, Jl. Raja Isa, Gedung Nong Isa, Makam Zuriat Nong Isa (Kel. Sambau)
- Status: **terverifikasi** (dokumen arsip); ada perbedaan versi soal tahun wafat
- Sumber: http://disbud.kepriprov.go.id/makam-nong-isa-batam/ ; https://kebudayaan.kemdikbud.go.id/bpnbkepri/makam-nong-isa-dan-temenggung-abdul-jamal-jadi-destinasi-wisata/ ; https://mediacenter.batam.go.id/2022/12/15/tak-lupakan-sejarah-rudi-ziarah-makam-zuriat-nong-isa/

**Temenggung Abdul Jamal (Tun Abdul Jamal bin Tun Abbas)**
- Gelar: Temenggung Kerajaan Johor-Riau-Pahang
- Masa hidup: sekitar 1720–1802; menjabat Temenggung sekitar 1757–1802
- Kisah: Ia putra Tun Abbas, Datuk Bendahara Johor-Riau. Sejak 1722 Pulau Bulang menjadi markas keluarga Temenggung, cabang dari dinasti Bendahara. Temenggung adalah salah satu dari empat pemegang cap mohor di bawah sultan, dengan bendera "Fajar Menyingsing". Walau berbasis di Bulang, pemegang jabatan ini tidak pernah bergelar "Temenggung Bulang".
- Kaitan dengan Batam: ia dimakamkan di Pulau Bulang Lintang bersama istrinya, Raja Maimunah. Pemko Batam pernah merencanakan pemugaran makam ini bersama tim cagar budaya provinsi.
- Tempat: Stadion Temenggung Abdul Jamal; makam dan masjid di Pulau Bulang (Kec. Bulang); Jl. Temenggung Abdul Jamal (Bulang)
- Status: **terverifikasi** (tahun lahir masih perkiraan)
- Sumber: https://kebudayaan.kemdikbud.go.id/bpcbsumbar/pulau-bulang-dalam-pusaran-kerajaan-melayu-riau/ ; https://kepri.antaranews.com/berita/62685/makam-temenggung-abdul-jamal-bakal-dipugar ; https://en.wikipedia.org/wiki/Temenggong_Abdul_Jamal

**Raja Haji Fisabilillah (Marhum Teluk Ketapang)**
- Gelar: Yang Dipertuan Muda Riau IV (1777–1784); Pahlawan Nasional
- Masa hidup: 1725 atau 1727 (sumber berbeda) – 18 Juni 1784
- Kisah: Ia putra bangsawan Bugis Daeng Celak (YDM II). Pada 6 Januari 1784 pasukannya mengalahkan Belanda yang mendarat di Pulau Penyengat; peristiwa ini kini diperingati sebagai hari jadi Tanjungpinang. Ia lalu menyerang Malaka dan gugur di Teluk Ketapang pada 18 Juni 1784. Ia ditetapkan sebagai Pahlawan Nasional lewat Keppres No. 072/TK/1997 tanggal 11 Agustus 1997; menurut daftar Setneg, Keppres yang sama juga menganugerahinya Bintang Mahaputera Adipradana.
- Kaitan dengan Batam: namanya dipakai untuk jembatan ikon kota dan jalan protokol Batam Centre
- Tempat: Jembatan Barelang I "Tengku Fisabilillah"; Jl. Raja H. Fisabilillah (Batam Kota)
- Status: **terverifikasi**
- Sumber: http://ikpni.or.id/pahlawan/raja-haji-fisabilillah/ ; https://www.historia.id/article/cerita-kumis-pahlawan-nasional-raja-haji-fisabilillah-pewze ; https://kepri.antaranews.com/berita/171492/mengenal-tiga-pahlawan-nasional-asal-kepri

**Engku Putri Raja Hamidah**
- Gelar: Engku Puteri; permaisuri Sultan Mahmud Riayat Syah; pemegang regalia kerajaan
- Masa hidup: sekitar 1774 – 7 Juli 1844
- Kisah: Ia putri sulung Raja Haji Fisabilillah. Saat menikah dengan Sultan Mahmud Syah III (1803), ia menerima Pulau Penyengat sebagai mas kawin. Ia dipercaya memegang regalia (cogan, tepak sirih, keris panjang, nobat), alat kebesaran yang wajib ada dalam penobatan sultan. Setelah 1812 ia menolak menyerahkan regalia, baik kepada kubu yang didukung Inggris maupun kepada Belanda; sikap ini menjadi simbol perlawanan terhadap pecahnya Johor-Riau. Regalia itu akhirnya direbut Belanda.
- Kaitan dengan Batam: tokoh perempuan paling menonjol yang namanya dipakai di pusat pemerintahan Batam
- Tempat: Jl. Engku Putri, Jl. Engku Putri Utara, Dataran Engku Putri (Batam Kota)
- Status: **terverifikasi**; kaitan nama dengan masjid perlu dicek
- Sumber: https://disbudpar.tanjungpinangkota.go.id/destinasi-detail/komplek-makam-engku-putri-raja-hamidah-dan-raja-ali-h ; https://kupang.antaranews.com/berita/100885/artikel-sang-penjaga-regalia-kerajaan-melayu ; http://digilib.uinsa.ac.id/44087/2/Yune%20Thalia%20Razak_A72213146.pdf

**Raja Ali Haji**
- Gelar: pujangga, ulama, dan sejarawan Riau-Lingga; Pahlawan Nasional (2004)
- Masa hidup: sekitar 1808 – sekitar 1873 (tahun lahir dan wafat berbeda antarsumber, perlu dicek)
- Kisah: Ia cucu Raja Haji Fisabilillah dan putra Raja Ahmad (Engku Haji Tua). Karyanya antara lain Gurindam Dua Belas, Kitab Pengetahuan Bahasa, Tuhfat al-Nafis (sejarah Melayu-Bugis), dan Mukaddimah fi Intizam. Ia ditetapkan sebagai Pahlawan Nasional di bidang bahasa lewat Keppres No. 089/TK/2004 tanggal 5 November 2004; menurut Tribunnews, gelar itu diserahkan Presiden SBY pada 10 November 2004.
- Kaitan dengan Batam: Tuhfat al-Nafis karyanya adalah sumber utama hampir semua kisah di kartu-kartu ini
- Tempat: Jembatan Barelang III; Jl. Raja Ali Haji (Lubuk Baja dan Bulang); Museum Batam Raja Ali Haji
- Status: **terverifikasi**
- Sumber: https://www.detik.com/sumut/berita/d-7029197/mengenal-tiga-pahlawan-nasional-dari-provinsi-kepri ; https://kepri.kemenag.go.id/page/det/mengenal-tiga-pahlawan-nasional-dari-provinsi-kepri

**Sultan Mahmud Riayat Syah (Sultan Mahmud Syah III)**
- Gelar: Sultan Johor-Riau-Lingga-Pahang; Pahlawan Nasional
- Masa hidup: 24 Maret 1756 – 12 Januari 1811 atau 1812 (sumber berbeda)
- Kisah: Ia diangkat menjadi sultan saat masih kanak-kanak; tahun penobatannya disebut 1761 atau 1770, tergantung sumber. Ia terlibat dalam perang Teluk Riau 1784 dan memimpin perang gerilya laut melawan Belanda. Ia ditetapkan sebagai Pahlawan Nasional lewat Keppres No. 115/TK/2017 tertanggal 6 November 2017 (satu artikel Antara keliru menulis 2018). Makamnya di Daik, Lingga.
- Kaitan dengan Batam: wilayah kekuasaannya mencakup Batam; ia juga suami Engku Putri
- Tempat: Masjid Sultan Mahmud Riayat Syah (Batu Aji, perlu dicek)
- Status: **terverifikasi**, dengan perbedaan versi soal tanggal
- Sumber: https://nasional.kompas.com/read/2017/11/10/14115831/mahmud-riayat-syah-pahlawan-nasional-yang-jadi-sultan-sejak-umur-2-tahun ; https://linggakab.go.id/sultan-mahmud-riayat-syah-iii-resmi-menjadi-pahlawan-nasional/berita/2017/

**Sultan Abdul Rahman Muazzam Syah**
- Gelar: Sultan Riau-Lingga I
- Masa hidup: wafat 1832 (perlu dicek); memerintah 1812–1832, dan sejak 1824 Riau-Lingga berdiri sebagai kerajaan tersendiri
- Kisah: Ia putra Sultan Mahmud Riayat Syah. Pada 1812 ia dilantik oleh YDM Raja Jaafar tanpa regalia, karena Engku Putri menahannya. Setelah Traktat London 1824 memisahkan Johor dan Riau-Lingga, ia menjadi sultan pertama Riau-Lingga. Bersama YDM Raja Jaafar, dialah yang memberi mandat kepada Nong Isa pada 1829.
- Kaitan dengan Batam: penanda tangan mandat yang tanggalnya menjadi hari jadi Batam
- Tempat: Jl. Sultan Abdul Rachman (Lubuk Baja)
- Status: **perlu dicek** apakah nama jalan merujuk ke Abdul Rahman I ini atau ke Sultan Abdul Rahman Muazzam Syah II (sultan terakhir, 1883–1911)
- Sumber: https://mediacenter.batam.go.id/2022/12/15/tak-lupakan-sejarah-rudi-ziarah-makam-zuriat-nong-isa/ ; http://digilib.uinsa.ac.id/44087/2/Yune%20Thalia%20Razak_A72213146.pdf

**Raja Ali Kelana (Raja Ali ibni Raja Muhammad Yusuf al-Ahmadi)**
- Gelar: Kelana (jabatan dalam Kesultanan Riau-Lingga); juga dikenal sebagai Raja Ali Riau, Raja Ali Bukit, dan Engku Ali Riau
- Masa hidup: akhir abad ke-19 – awal abad ke-20 (tahun pasti perlu dicek)
- Kisah: Ia putra YDM Riau X Raja Muhammad Yusuf. Lewat surat bertarikh 26 Juli 1898 ia menerima anugerah sebagian tanah Pulau Batam. Bersama pengusaha Singapura Ong Sam Leong ia mengelola Batam Brickworks, pabrik batu bata bermesin di Batu Aji; bata bermerek "BATAM" buatannya dijual hingga ke Singapura. Ia juga motor perlawanan diplomatik terhadap Belanda dan memimpin misi ke Kesultanan Utsmaniyah (1904/1905 dan 1913). Ia menjual pabriknya sekitar 1910, lalu hijrah ke Johor pada 1911.
- Kaitan dengan Batam: perintis industri pertama di Pulau Batam
- Tempat: Jl. Raja Ali Kelana (Batam Centre); Bumi Perkemahan Raja Ali Kelana
- Status: **terverifikasi** pada garis besarnya. Menurut Disbudpar Kota Batam (2021), pabrik itu didirikan Raja Ali Kelana bersama Ong Sam Leong "sekitar tahun 1896" dengan kapasitas "30.000 batu bata yang keras (hard burnt brick) per hari"; sumber lain menyebut tahun 1901.
- Sumber: https://gowest.id/raja-ali-kelana/ ; https://www.hariankepri.com/raja-ali-kelana-dan-kepemilikan-kepulauan-batam/ ; https://en.wikipedia.org/wiki/Riau-Lingga_Sultanate

**Tengku Embung Fatimah**
- Gelar: Sultanah/Ratu Riau-Lingga
- Masa hidup: abad ke-19 (tahun lahir dan wafat perlu dicek); berkuasa 1883–1885
- Kisah: Ia putri tunggal Sultan Mahmud IV Muzaffar Syah dan istri YDM Raja Muhammad Yusuf al-Ahmadi (menikah 1847). Pada 17 September 1883 bangsawan Melayu dan Bugis memilihnya sebagai penguasa; ia lalu menyerahkan takhta kepada putranya, Sultan Abdul Rahman Muazzam Syah II, dan tetap menjadi wali bersama hingga 18 Februari 1885. Makamnya di Pulau Penyengat dirawat Dinas Kebudayaan Kepri sebagai cagar budaya.
- Kaitan dengan Batam: namanya dipakai untuk rumah sakit daerah Batam. Situs resmi RSUD tidak menjelaskan alasan pemilihan nama itu.
- Tempat: RSUD Embung Fatimah (Batu Aji)
- Status: **terverifikasi** sebagai tokoh; kaitan penamaan RSUD masih asumsi dan perlu konfirmasi Pemko
- Sumber: https://kepri.antaranews.com/berita/200065/melestarikan-cagar-budaya-makam-embung-fatimah-di-pulau-penyengat ; https://ms.wikipedia.org/wiki/Kesultanan_Riau-Lingga

**Tengku Sulung (Panglima Besar Reteh)**
- Gelar: Panglima Besar Reteh
- Masa hidup: sekitar 1799 – 7 November 1858; lahir di Lingga
- Kisah: Pada masa mudanya ia dikenal sebagai pemimpin bajak laut, lalu diampuni dan menetap di Sungai Reteh (kini Indragiri Hilir). Sultan Mahmud Muzaffar Syah mengangkatnya menjadi Panglima Besar Reteh. Setelah Belanda memakzulkan sultan itu, ia menolak mengakui sultan bentukan Belanda. Belanda mengirim armada dari Tanjungpinang pada 9 Oktober 1858, dan ia gugur dalam serangan besar 7 November 1858. Menurut Daftar Bintang Mahaputera 1959–2003 terbitan Setneg, ia dianugerahi Bintang Mahaputera Utama secara anumerta lewat Keppres No. 119/TK/TH.2000 tanggal 4 November 2000.
- Kaitan dengan Batam: tokoh perlawanan Riau-Lingga
- Tempat: Jl. Tengku Sulung (lokasi perlu dicek)
- Status: **terverifikasi** sebagai tokoh; lokasi jalan perlu dicek
- Sumber: https://www.kompas.com/stori/read/2021/12/16/100000279/tengku-sulung-panglima-besar-reteh-yang-gigih-melawan-belanda?page=all ; https://id.wikipedia.org/wiki/Tengku_Sulung

**Raja Narasinga II ("Nara Singa")**
- Gelar: Paduka Maulana Sri Sultan Alauddin Iskandarsyah Johan Zirullah Fil Alam, Sultan Indragiri ke-4
- Masa hidup: abad ke-15–16; memerintah 1473–1532 (sebagian di Malaka, lalu di Indragiri sejak 1508)
- Kisah: Ia keturunan sultan Malaka yang memindahkan pusat Indragiri ke Pekan Tua/Kota Lama. Menurut BPCB Sumbar, ia melawan Portugis selama 20 tahun (1512–1532). Makamnya di Kota Lama, Rengat Barat, Indragiri Hulu, tercatat sebagai cagar budaya.
- Kaitan dengan Batam: namanya dipakai untuk Jembatan Barelang II. BP Batam menyebut nama itu "diambil dari nama seorang Panglima Raja Indragiri Hulu", padahal sumber sejarah menyebut Narasinga II adalah rajanya sendiri. Kemungkinan besar ini hanya penulisan yang longgar.
- Tempat: Jembatan Barelang II "Nara Singa"
- Status: **ada perbedaan versi**
- Sumber: https://batampos.co.id/2020/08/23/ini-fakta-jembatan-ii-barelang/ ; https://kebudayaan.kemdikbud.go.id/bpcbsumbar/komplek-makam-narasinga-ii/

**Sultan Zainal Abidin Syah (Tambusai/Rokan)**
- Gelar: Sultan Tambusai, ulama dan pejuang Rokan
- Masa hidup: abad ke-19 – 5 September 1916 (wafat di Kediri, Jawa Timur)
- Kisah: BP Batam menyebut nama Jembatan IV diambil dari Sultan Zainal Abidin, "salah satu pejuang Riau, sekaligus ulama yang melakukan perlawanan terhadap penjajahan Belanda untuk mempersatukan Rokan dari Hulu sampai Hilir". Pemkab Rokan Hulu mencatat ia ditangkap Belanda pada 1904, lalu dibuang ke Jawa.
- Kaitan dengan Batam: namanya dipakai untuk Jembatan Barelang IV. Beberapa situs wisata menyebutnya sultan Riau-Lingga, tetapi klaim itu tidak bersumber dan bertentangan dengan keterangan BP Batam.
- Tempat: Jembatan Barelang IV
- Status: **ada perbedaan versi** (sumbernya hanya advertorial BP Batam dan situs Pemkab Rokan Hulu)
- Sumber: https://batampos.co.id/2020/09/15/fakta-fakta-jembatan-4-barelang/ ; https://rokanhulukab.go.id/detailpost/perang-siasat-politik-antara-sultan-zainal-abidin-lawan-kolonial-belanda

**Raja Kecik (Sultan Abdul Jalil Rahmat Syah)**
- Gelar: Sultan Johor (1718–1722); pendiri dan Sultan Siak Sri Inderapura pertama
- Masa hidup: ? – 1746
- Kisah: Menurut Hikayat Siak, ia putra Sultan Mahmud Syah II ("Mangkat Dijulang") dan Encik Pong yang lahir setelah ayahnya wafat, lalu dibesarkan di Pagaruyung; sebagian sejarawan meragukan kisah asal-usul ini. Pada 1718 ia merebut takhta Johor, tetapi pada 1722 dikalahkan koalisi Bugis yang lalu mengangkat Sultan Sulaiman. Ia kemudian mendirikan Siak di Buantan; tahunnya disebut 1722 atau 1723.
- Kaitan dengan Batam: perangnya dengan Bugis melahirkan jabatan Yang Dipertuan Muda bagi bangsawan Bugis di Riau, jabatan yang kelak dipegang keluarga Raja Haji
- Tempat: Jembatan Barelang VI
- Status: **terverifikasi** sebagai tokoh; kisah asal-usulnya versi hikayat
- Sumber: https://en.wikipedia.org/wiki/Raja_Kecil ; https://kesbangpol.riau.go.id/company/berita-detail/97dbed5c-299f-456e-9390-a9c8e7eb2788/kesultanan-siak-sri-inderapura

**Laksamana Bintan**
- Gelar: "Laksamana" adalah jabatan panglima laut. Bintan adalah pusat kerajaan setelah Malaka jatuh, dan menurut Hikayat Hang Tuah juga kampung masa kecil Hang Tuah.
- Status: **perlu dicek**. Belum ditemukan sumber yang menyebut tokoh tertentu di balik Jl. Laksamana Bintan. Untuk sementara kartu sebaiknya menjelaskan jabatannya dan merujuk ke Hang Tuah dan Hang Nadim sebagai Laksamana yang berkaitan dengan Bintan, tanpa mengklaim satu orang tertentu.
- Tempat: Jl. Laksamana Bintan (Lubuk Baja); Jl. Laksamana (Bulang)

### (b) Tokoh hikayat/legenda

Catatan umum untuk kartu kelompok ini:
- Kisah mereka berasal dari *Hikayat Hang Tuah* dan *Sejarah Melayu* (*Sulalatus Salatin*). Versi tertua kedua teks itu ditulis sekitar abad ke-17; naskah Hikayat Hang Tuah tertua yang diketahui berasal dari sekitar 1758.
- Para peneliti menilai hikayat ini menggabungkan peristiwa dari beberapa masa pemerintahan ke dalam satu raja dan membesar-besarkan peran Hang Tuah.
- Kedua teks saling berbeda: dalam Sejarah Melayu yang memberontak adalah Hang Kasturi, sedangkan dalam Hikayat Hang Tuah pemberontaknya Hang Jebat.
- Sumber Portugis dan Ryukyu mencatat seorang "laksamana" Malaka, tetapi belum bisa dipastikan bahwa itu Hang Tuah.

**Hang Tuah**
- Gelar: Laksamana Malaka
- Masa hidup: abad ke-15 (menurut hikayat)
- Kisah: Ia anak Hang Mahmud dan Dang Merdu yang pindah ke Bintan. Bersama empat sahabatnya ia mengabdi ke istana, menjadi Laksamana, dan diutus ke Majapahit, Tiongkok, dan negeri lain. Ia pernah dijatuhi hukuman mati karena fitnah tetapi diselamatkan Bendahara, lalu kembali untuk membunuh Hang Jebat yang memberontak.
- Kaitan dengan Batam: menurut tuturan sejarah lokal, kawasan Batam pernah berada dalam wilayah Laksamana Malaka
- Tempat: Jl. Hang Tuah (Nongsa; Belakang Padang)
- Status: **tokoh hikayat/legenda**, kesejarahannya diperdebatkan
- Sumber: https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah ; https://en.wikipedia.org/wiki/Hang_Tuah

**Hang Jebat, Hang Kasturi, Hang Lekir, Hang Lekiu**
- Kisah: Keempatnya sahabat Hang Tuah sejak kecil di Bintan. Dalam Hikayat Hang Tuah, Hang Jebat memberontak karena mengira Hang Tuah sudah dihukum mati, lalu tewas di tangan Hang Tuah. Dalam Sejarah Melayu, peran pemberontak itu dipegang Hang Kasturi. Kisah Hang Lekir dan Hang Lekiu jauh lebih tipis.
- Tempat: Jl. Hang Jebat, Jl. Hang Kesturi, Jl. Hang Lekir (Nongsa); Jl. Hang Kesturi (Belakang Padang); Jl. Hang Lekiu (lokasi perlu dicek)
- Status: **tokoh hikayat/legenda**
- Sumber: https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah

**Hang Nadim**
- Gelar: Laksamana (masa Sultan Mahmud Syah, Malaka–Bintan)
- Kisah: Menurut Sejarah Melayu, ia anak Hang Jebat dan Dang Wangi yang lahir setelah ayahnya terbunuh, lalu diasuh Hang Tuah. Setelah Malaka jatuh pada 1511, ia memimpin perlawanan terhadap Portugis, termasuk mempertahankan Bintan, sekitar 1511–1526.
- Kaitan dengan Batam: Dinas Kebudayaan Kepri menyebut kepulauan Batam sebagai wilayah "langlang laut" (patroli laut) Hang Nadim. Bandara Hang Nadim diresmikan sebagai bandara internasional oleh Presiden Soeharto pada 3 Januari 1995.
- Tempat: Bandara Hang Nadim (Nongsa); Jl. Hang Nadim (Bulang)
- Status: **semi-historis**. Perlawanannya terhadap Portugis tercatat, tetapi silsilahnya hanya berasal dari Sejarah Melayu.
- Sumber: https://en.wikipedia.org/wiki/Hang_Nadim ; https://www.m.batamtoday.com/berita-71652-Inilah-Dasar-dan-Sejarah-Bandara-Internasional-Hang-Nadim-Dikelola-BP-Batam.html

**Dang Merdu (Dang Merdu Wati)**
- Kisah: Dalam Hikayat Hang Tuah ia ibu Hang Tuah dan istri Hang Mahmud. Setelah Hang Mahmud bermimpi bulan turun di atas kepala anaknya, Dang Merdu memandikan Hang Tuah dan memberinya makan nasi kunyit.
- Tempat: Jl. Dang Merdu (lokasi perlu dicek)
- Status: **tokoh hikayat**
- Sumber: https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah

**Dang Anom**
- Status: **perlu dicek**. Belum ditemukan sumber kredibel tentang tokoh bernama Dang Anom dalam kisah-kisah Hang Tuah. Untuk sementara kartu cukup menjelaskan bahwa "Dang" adalah sebutan bagi perempuan istana atau dayang dalam hikayat Melayu.

### (c) Pahlawan nasional dan tokoh nasional (ringkas)

- **Tuanku Tambusai** (Muhammad Saleh, 5 November 1784 – 12 November 1882): ulama Padri dari Dalu-Dalu, Rokan Hulu, dijuluki "Harimau Padri dari Rokan". Pahlawan Nasional lewat Keppres 071/TK/1995; namanya dipakai untuk Jembatan Barelang V. Sumber: https://khazanah.republika.co.id/berita/sie577483/kisah-tuanku-tambusai-ulama-penghancur-benteng-belanda
- **Brigjen Katamso, Letjen R. Suprapto, Letjen S. Parman, Jenderal Ahmad Yani**: Pahlawan Revolusi, korban peristiwa 1965. Nama mereka dipakai untuk jalan di Sagulung, Sei Beduk, dan Batam Kota.
- **Jenderal Sudirman**: panglima besar TNI pertama.
- **Tuanku Imam Bonjol** (1772–1864): pemimpin Perang Padri.
- **Teuku Umar**: pejuang Perang Aceh.
- **Gajah Mada**: Mahapatih Majapahit; bukan pahlawan nasional resmi, tetapi tokoh sejarah nasional.
- **Raden Patah, Diponegoro, Kartini, dr. Cipto Mangunkusumo, KH Ahmad Dahlan, R.E. Martadinata, Sultan Hasanuddin, Pattimura, Yos Sudarso**: tokoh nasional yang namanya dipakai di Lubuk Baja, Sekupang, dan Nongsa. Rincian masing-masing bisa merujuk ke daftar Pahlawan Nasional Kemensos.

### (d) Tokoh pembangunan Batam

**Ibnu Sutowo**
- Gelar: Letnan Jenderal (Purn.); Direktur Utama Pertamina; Ketua Otorita Batam pertama
- Masa hidup: 23 September 1914 – 12 Januari 2001
- Kisah: Ia seorang dokter yang menjadi perwira militer, lalu menjabat Dirut Pertamina (1968–1976). Keppres 65/1970 menjadikan Batam basis logistik dan operasional minyak lepas pantai di bawah tanggung jawabnya. Ia memimpin Otorita Batam pada periode persiapan, 1971–1976; masa jabatannya berakhir bersamaan dengan krisis Pertamina.
- Tempat: Jl. Ibnu Sutowo (lokasi perlu dicek)
- Status: **terverifikasi**
- Sumber: https://www.metrotvnews.com/play/kj2CnVJa-kepemimpinan-bp-batam-dari-masa-ke-masa ; https://batam.go.id/icon_sejarah/

**B.J. Habibie**
- Ringkas: Ia menjabat Ketua Otorita Batam sejak 1978 (Keppres 194/M/1978) hingga menjadi Wakil Presiden, dan menggagas Jembatan Barelang (dibangun 1992–1998). Barelang populer disebut "Jembatan Habibie", tetapi itu julukan tidak resmi; nama resmi keenam jembatannya adalah tokoh-tokoh Melayu di atas.
- Sumber: https://batam-pedia.blogspot.com/2016/10/mengetahui-walikota-batam-dari-masa-ke.html ; https://en.wikipedia.org/wiki/Barelang_Bridge

### (e) Tokoh lokal/adat

**Engku Haji Tua (Raja Ahmad bin Raja Haji)**
- Gelar: Engku Haji; juga dikenal sebagai Raja Hitam
- Masa hidup: akhir abad ke-18 – pertengahan abad ke-19 (perlu dicek)
- Kisah: Ia putra keempat Raja Haji Fisabilillah dan Encik Mariam, lahir di Pulau Biram Dewa, Sungai Carang. Ia menjadi penasihat sekaligus wakil kakaknya, YDM VI Raja Jaafar, dan beberapa kali diutus ke Batavia untuk urusan penobatan Sultan Abdul Rahman. Sepulang naik haji pada 1828 bersama putranya, Raja Ali Haji, ia menarik diri dari politik dan dikenal sebagai Engku Haji Tua. Ia juga pengarang, antara lain Syair Perang Johor yang naskahnya tersimpan di Leiden.
- Tempat: Jl. Engku Haji Tua (lokasi perlu dicek)
- Status: **terverifikasi** sebagai tokoh (sumber ensiklopedis; sebaiknya dicocokkan dengan Tuhfat al-Nafis)
- Sumber: https://ms.wikipedia.org/wiki/Engku_Haji

**Batin Limat bin Limbang**
- Gelar: Batin, yaitu kepala suku atau pemimpin adat orang Rempang–Galang
- Masa hidup: akhir abad ke-19 – awal abad ke-20 (perlu dicek)
- Kisah: Liputan6 mencatat bahwa di Pulau Rempang dulu ada beberapa Batin, antara lain Batin Lawan, Batin Nama Lembu, Batin Limat, dan Batin Bidin. Menurut budayawan Raja Malik Hafrizal, ketika Belanda memakzulkan Sultan Abdul Rahman Muazzam Syah II (1911), Batin Limat mengumpulkan pengikutnya dan menawarkan diri kepada sultan untuk berperang melawan Belanda.
- Tempat: Jl. Batin Limat (Galang, Simp. Sungai Raya–Simp. Sembulang); kantor Kecamatan Galang beralamat di jalan ini
- Status: **perlu dicek** (hanya satu sumber, dari tradisi lisan/budayawan)
- Sumber: https://www.liputan6.com/regional/read/5421347/menulusuri-makam-keramat-teluk-lubuk-lanjut-jejak-awal-peradaban-di-pulau-rempang ; https://pijarkepri.com/2023/09/sejarah-penduduk-rempang-dan-galang/

**Raja Maimunah**
- Ringkas: Ia istri Temenggung Abdul Jamal dan dimakamkan di sampingnya di Pulau Bulang. Namanya dipakai untuk jalan di Bulang.
- Status: **terverifikasi** sebagai tokoh, tetapi detail biografinya minim
- Sumber: https://kepri.antaranews.com/berita/25686/warisan-sejarah-pulau-bulang-tanpa-rekam-jejak

## Hubungan antartokoh

**1. Silsilah Bugis–Riau (inti diagram)**
- Daeng Celak (YDM II) → ayah dari **Raja Haji Fisabilillah** (YDM IV)
- Raja Haji Fisabilillah → ayah dari **Engku Putri Raja Hamidah**, **Raja Jaafar** (YDM VI), dan **Raja Ahmad/Engku Haji Tua**
- Raja Ahmad/Engku Haji Tua → ayah dari **Raja Ali Haji**
- Engku Putri ⇄ istri **Sultan Mahmud Riayat Syah**
- Sultan Mahmud Riayat Syah → ayah dari **Sultan Abdul Rahman Muazzam Syah**, yang dilantik Raja Jaafar tanpa regalia karena regalia ditahan Engku Putri
- Sultan Abdul Rahman Muazzam Syah + YDM Raja Jaafar → pemberi mandat kepada **Nong Isa** (1829)
- **Nong Isa** adalah putra Raja Ali, YDM V. Raja Ali ini berbeda orang dari Raja Ali Haji dan Raja Ali Kelana; nama "Raja Ali" berulang di keluarga ini, jadi perlu catatan di UI.

**2. Generasi akhir Riau-Lingga**
- **Tengku Embung Fatimah** ⇄ istri YDM X Raja Muhammad Yusuf → ibu Sultan Abdul Rahman Muazzam Syah II
- **Raja Ali Kelana** adalah putra Raja Muhammad Yusuf, sehingga ia saudara seayah Sultan Abdul Rahman Muazzam Syah II
- **Batin Limat** → menyatakan kesetiaan kepada Sultan Abdul Rahman Muazzam Syah II saat pemakzulan 1911
- **Tengku Sulung** → panglima yang setia kepada Sultan Mahmud Muzaffar Syah (ayah Embung Fatimah) setelah sultan itu dimakzulkan pada 1857

**3. Jaringan Temenggung: Bulang–Johor–Singapura**
- Bendahara Tun Abbas → ayah **Temenggung Abdul Jamal** (⇄ Raja Maimunah)
- Abdul Jamal → ayah Tun Abdul Hamid → ayah **Temenggung Abdul Rahman**, yang pindah ke Singapura (1811) dan bersama Sultan Hussein menandatangani perjanjian dengan Raffles pada 6 Februari 1819
- Abdul Rahman → ayah **Temenggung Daeng Ibrahim** (lahir di Pulau Bulang, 1810) → ayah Abu Bakar, pendiri Kesultanan Johor modern
- Sumber: https://en.wikipedia.org/wiki/Temenggong_Abdul_Rahman ; https://en.wikipedia.org/wiki/Temenggong_Daeng_Ibrahim

**4. Johor–Siak–Bugis**
- **Raja Kecik** merebut Johor (1718) → dikalahkan Bugis (1722) → Bugis mengangkat Sultan Sulaiman dan mendapat jabatan YDM. Inilah latar naiknya keluarga Daeng Celak dan Raja Haji.
- Raja Kecik mengaku sebagai putra Sultan Mahmud Syah II, sultan yang dibunuh pada 1699 (versi Hikayat Siak).

**5. Laksamana dan Hang Tuah (hikayat)**
- Hang Mahmud ⇄ **Dang Merdu** → orang tua **Hang Tuah**
- Hang Tuah — sahabat seperguruan — **Hang Jebat, Hang Kasturi, Hang Lekir, Hang Lekiu**
- Hang Tuah membunuh Hang Jebat (versi Hikayat Hang Tuah) atau Hang Kasturi (versi Sejarah Melayu)
- Hang Jebat ⇄ Dang Wangi → **Hang Nadim** (versi Sejarah Melayu), yang diasuh Hang Tuah
- Hang Tuah dan Hang Nadim sama-sama bergelar **Laksamana**, mata rantai ke nama Jl. Laksamana dan Jl. Laksamana Bintan

**6. Riau daratan dan perlawanan antikolonial**
- **Tuanku Tambusai** dan **Sultan Zainal Abidin** sama-sama berasal dari Tambusai/Rokan Hulu. Sebuah artikel opini di GoRiau memakai julukan "Harimau Padri dari Rokan" untuk keduanya; pastikan julukan itu hanya dipakai di kartu Tuanku Tambusai.
- **Narasinga II** berasal dari Indragiri, keturunan sultan Malaka, dan melawan Portugis pada masa yang sama dengan perang Hang Nadim melawan Portugis.

## Penamaan resmi (konteks singkat)

- **Penetapan oleh Pemko:** Nama ruas jalan di Batam ditetapkan Pemerintah Kota Batam lewat **SK Wali Kota**. Tribun Batam (2011) melaporkan SK itu memuat 230 ruas jalan, 62 di antaranya sudah dirilis dengan panjang 387 km. Perda Kota Batam No. 9 Tahun 2001 tentang Lalu Lintas dan Angkutan Jalan (Pasal 11) menyebut setiap jaringan jalan yang selesai dibangun ditetapkan kinerjanya, termasuk "nama".
- **Evaluasi 2017:** Dinas Perhubungan mengevaluasi nama-nama jalan, misalnya usulan memperpanjang Jl. Engku Putri sampai Bundaran Madani. Hasilnya direncanakan dituangkan dalam Peraturan Wali Kota (perlu dicek apakah sudah terbit).
- **Usulan 2026:** Wali Kota Amsakar Achmad menyebut Lembaga Adat Melayu (LAM) Kepri dan Kota Batam sedang menginventarisasi usulan nama jalan, termasuk untuk ruas baru Batam Centre–Bandara. Menurut Riaukepri.com, surat LAM Batam No. 10/LAM-BATAM/V/2026 tertanggal 8 Mei 2026 kepada Wali Kota memuat usulan final 46 nama simpang dan bundaran.
- **Aset BP Batam:** bandara dan Jembatan Barelang dibangun dan dinamai pada era Otorita Batam/BP Batam, sehingga penjelasan nama jembatan bersumber dari BP Batam.
- Sumber: https://batam.tribunnews.com/2011/01/11/ini-dia-nama-jalan-baru-di-kota-batam ; https://kepri.bpk.go.id/wp-content/uploads/2009/09/perda-no-9-th-2001-lalin-dan-ang-jalan.pdf ; https://jantungmelayu.co/2017/03/nama-jalan-batam-dievaluasi-berharap-unsur-budaya-lokal-lebih-ditonjolkan/ ; https://metropolis.batampos.co.id/jalan-baru-batam-center-bandara-belum-diberi-nama-pemko-batam-siapkan-penamaan/

## Bacaan lanjutan

- **Raja Ali Haji, *Tuhfat al-Nafis***; edisi terjemahan Inggris: Virginia Matheson & Barbara Watson Andaya, *The Precious Gift* (Oxford University Press, 1982). Sumber primer silsilah Bugis–Melayu, Raja Haji, Engku Putri, dan Raja Kecik.
- ***Sulalatus Salatin/Sejarah Melayu*** (edisi A. Samad Ahmad, Dewan Bahasa dan Pustaka) dan ***Hikayat Hang Tuah*** (edisi Kassim Ahmad, DBP): sumber kisah Hang Tuah, Hang Nadim, dan Dang Merdu.
- **Carl A. Trocki, *Prince of Pirates: The Temenggongs and the Development of Johor and Singapore, 1784–1885*** (1979): jaringan Temenggung Bulang–Singapura–Johor.
- **Leonard Y. Andaya, *The Kingdom of Johor 1641–1728*** (1975), serta **Barbara Watson Andaya & Leonard Andaya, *A History of Malaysia***: konteks Raja Kecik dan naiknya Bugis.
- **Virginia Matheson Hooker**: kajian tentang Tuhfat al-Nafis dan penulisan sejarah Melayu.
- **Hasan Junus, *Engku Puteri Raja Hamidah: Pemegang Regalia Kerajaan Riau*** (UNRI Press, 2002).
- **Aswandi Syahri**: tulisan tentang sejarah Riau-Lingga dan Batam (Arsip Riouw, Raja Ali Kelana, Pulau Bulang), banyak yang dimuat ulang oleh BPNB Kepri dan media lokal.
- **Edi Sutrisno dkk., *Bercermin Sejarah Menyongsong Batam Masa Depan*** (2007); **Sabeth Muksin, *Mengungkap Fakta Pembangunan Batam***.
- **Rustam S. Abrus, *Sejarah Perjuangan Panglima Besar Reteh Tengku Sulung Melawan Belanda Tahun 1858***; **Mahidin Said, *Tuanku Tambusai Berjuang***; **Yussuwadinata dkk., *Riwayat Singkat Pahlawan Nasional Raja Haji Fisabilillah*** (2010).
- Lembaga: BPK Wilayah IV (eks BPNB Kepri), BPCB Sumbar (mencakup situs di Kepri dan Riau), Dinas Kebudayaan Provinsi Kepri, ANRI (Arsip Riouw), serta daftar Pahlawan Nasional Kemensos/IKPNI (ikpni.or.id).

## Caveats

- **Kualitas sumber:** banyak sumber web tentang Batam adalah artikel populer atau advertorial. Sumber paling kokoh adalah halaman BPCB/BPNB Kemendikbud, Disbud Kepri, Media Center Pemko Batam, dan Keppres pahlawan nasional. Penjelasan nama Jembatan II dan IV hanya bersumber dari pernyataan Humas BP Batam dalam advertorial koran lokal.
- **Daftar ruas jalan:** daftar per kecamatan diambil dari rilis Dishub 2011 yang disalin sebuah blog. Sebagian ruas mungkin sudah berganti nama atau batas setelah evaluasi 2017, jadi wajib dicocokkan dengan OpenStreetMap.
- **Tanggal yang berbeda antarsumber** sudah ditandai di kartu: tahun lahir Raja Haji, tahun wafat Sultan Mahmud dan Nong Isa, serta tahun pendirian Siak.

## Blok data JSON

Catatan untuk Claude Code: isi `osm_name_bila_ada` dengan hasil kueri Overpass, lalu cocokkan secara manual. Contoh kueri: `[out:json];area["name"="Batam"]["admin_level"="5"]->.a;(way["highway"]["name"~"Hang|Raja|Engku|Temenggung|Batin|Sultan|Laksamana|Dang|Tengku|Ibnu"](area.a););out tags;`. Nilai `null` berarti belum diverifikasi.

```json
{
  "tokoh": [
    {"id":"nong_isa","nama":"Raja Isa bin Raja Ali (Nong Isa)","gelar":"Pemegang perintah Nongsa","masa_hidup":"±1780-an – 1831/1833-an (beda versi)","kelompok":"a","ringkasan":"Putra YDM V Raja Ali; menerima mandat memerintah Nongsa 18 Des 1829 dari Sultan Abdul Rahman Muazzam Syah dan YDM VI Raja Jaafar.","kaitan_batam":"Tanggal mandatnya jadi Hari Jadi Kota Batam; asal nama Nongsa.","status_verifikasi":"terverifikasi_beda_versi","sumber_url":["http://disbud.kepriprov.go.id/makam-nong-isa-batam/","https://kebudayaan.kemdikbud.go.id/bpnbkepri/makam-nong-isa-dan-temenggung-abdul-jamal-jadi-destinasi-wisata/"]},
    {"id":"temenggung_abdul_jamal","nama":"Tun Abdul Jamal bin Tun Abbas","gelar":"Temenggung Johor-Riau","masa_hidup":"±1720 – 1802","kelompok":"a","ringkasan":"Temenggung yang berbasis di Pulau Bulang; leluhur Temenggung Johor-Singapura.","kaitan_batam":"Makam di Pulau Bulang Lintang; nama stadion.","status_verifikasi":"terverifikasi","sumber_url":["https://kebudayaan.kemdikbud.go.id/bpcbsumbar/pulau-bulang-dalam-pusaran-kerajaan-melayu-riau/","https://kepri.antaranews.com/berita/62685/makam-temenggung-abdul-jamal-bakal-dipugar"]},
    {"id":"raja_maimunah","nama":"Raja Maimunah","gelar":"Istri Temenggung Abdul Jamal","masa_hidup":"abad ke-18","kelompok":"e","ringkasan":"Dimakamkan di samping suaminya di Pulau Bulang.","kaitan_batam":"Nama jalan di Bulang.","status_verifikasi":"terverifikasi","sumber_url":["https://kepri.antaranews.com/berita/25686/warisan-sejarah-pulau-bulang-tanpa-rekam-jejak"]},
    {"id":"raja_haji_fisabilillah","nama":"Raja Haji Fisabilillah","gelar":"Yang Dipertuan Muda Riau IV; Pahlawan Nasional","masa_hidup":"1725/1727 – 18 Juni 1784","kelompok":"a","ringkasan":"Mengalahkan Belanda di Penyengat 6 Jan 1784, gugur di Teluk Ketapang; Keppres 072/TK/1997.","kaitan_batam":"Jembatan Barelang I dan Jl. Raja H. Fisabilillah.","status_verifikasi":"terverifikasi","sumber_url":["http://ikpni.or.id/pahlawan/raja-haji-fisabilillah/","https://kepri.antaranews.com/berita/171492/mengenal-tiga-pahlawan-nasional-asal-kepri"]},
    {"id":"engku_putri","nama":"Engku Putri Raja Hamidah","gelar":"Permaisuri; pemegang regalia","masa_hidup":"±1774 – 7 Juli 1844","kelompok":"a","ringkasan":"Putri Raja Haji; menerima Penyengat sebagai mas kawin 1803; menolak menyerahkan regalia kepada Inggris/Belanda.","kaitan_batam":"Jl. Engku Putri dan Dataran Engku Putri di pusat pemerintahan.","status_verifikasi":"terverifikasi","sumber_url":["https://disbudpar.tanjungpinangkota.go.id/destinasi-detail/komplek-makam-engku-putri-raja-hamidah-dan-raja-ali-h","https://kupang.antaranews.com/berita/100885/artikel-sang-penjaga-regalia-kerajaan-melayu"]},
    {"id":"engku_haji_tua","nama":"Raja Ahmad bin Raja Haji (Engku Haji Tua)","gelar":"Engku Haji; penasihat YDM VI","masa_hidup":"akhir abad ke-18 – abad ke-19 (perlu dicek)","kelompok":"e","ringkasan":"Putra Raja Haji, ayah Raja Ali Haji; diplomat ke Batavia; haji 1828; pengarang Syair Perang Johor.","kaitan_batam":"Nama jalan (lokasi perlu dicek).","status_verifikasi":"terverifikasi","sumber_url":["https://ms.wikipedia.org/wiki/Engku_Haji"]},
    {"id":"raja_ali_haji","nama":"Raja Ali Haji","gelar":"Pujangga; Pahlawan Nasional 2004","masa_hidup":"±1808 – ±1873 (perlu dicek)","kelompok":"a","ringkasan":"Cucu Raja Haji; penulis Gurindam Dua Belas, Tuhfat al-Nafis, Kitab Pengetahuan Bahasa; Keppres 089/TK/2004.","kaitan_batam":"Jembatan Barelang III, Jl. Raja Ali Haji, Museum Batam Raja Ali Haji.","status_verifikasi":"terverifikasi","sumber_url":["https://www.detik.com/sumut/berita/d-7029197/mengenal-tiga-pahlawan-nasional-dari-provinsi-kepri"]},
    {"id":"sultan_mahmud_riayat_syah","nama":"Sultan Mahmud Riayat Syah (Mahmud Syah III)","gelar":"Sultan Johor-Riau-Lingga-Pahang; Pahlawan Nasional","masa_hidup":"24 Mar 1756 – 12 Jan 1811/1812","kelompok":"a","ringkasan":"Sultan sejak kanak-kanak; gerilya laut melawan Belanda; Keppres 115/TK/2017.","kaitan_batam":"Masjid Sultan Mahmud Riayat Syah.","status_verifikasi":"terverifikasi_beda_versi","sumber_url":["https://nasional.kompas.com/read/2017/11/10/14115831/mahmud-riayat-syah-pahlawan-nasional-yang-jadi-sultan-sejak-umur-2-tahun","https://kepri.kemenag.go.id/page/det/mengenal-tiga-pahlawan-nasional-dari-provinsi-kepri"]},
    {"id":"sultan_abdul_rahman_1","nama":"Sultan Abdul Rahman Muazzam Syah","gelar":"Sultan Riau-Lingga I","masa_hidup":"? – 1832","kelompok":"a","ringkasan":"Dilantik 1812 tanpa regalia; pemberi mandat kepada Nong Isa 1829.","kaitan_batam":"Kemungkinan rujukan Jl. Sultan Abdul Rachman (perlu dicek vs Abdul Rahman II).","status_verifikasi":"perlu_dicek","sumber_url":["https://mediacenter.batam.go.id/2022/12/15/tak-lupakan-sejarah-rudi-ziarah-makam-zuriat-nong-isa/"]},
    {"id":"embung_fatimah","nama":"Tengku Embung Fatimah","gelar":"Sultanah Riau-Lingga","masa_hidup":"abad ke-19; berkuasa 1883–1885","kelompok":"a","ringkasan":"Putri Sultan Mahmud IV Muzaffar Syah; dipilih penguasa 1883, menyerahkan takhta kepada putranya Abdul Rahman Muazzam Syah II.","kaitan_batam":"Nama RSUD di Batu Aji.","status_verifikasi":"terverifikasi","sumber_url":["https://kepri.antaranews.com/berita/200065/melestarikan-cagar-budaya-makam-embung-fatimah-di-pulau-penyengat"]},
    {"id":"raja_ali_kelana","nama":"Raja Ali ibni Raja Muhammad Yusuf al-Ahmadi (Raja Ali Kelana)","gelar":"Kelana Riau-Lingga","masa_hidup":"akhir abad ke-19 – awal abad ke-20 (perlu dicek)","kelompok":"a","ringkasan":"Menerima tanah di Batam 1898; mengelola Batam Brickworks di Batu Aji (sekitar 1896, kapasitas 30.000 bata/hari); misi diplomatik ke Utsmaniyah; hijrah ke Johor 1911.","kaitan_batam":"Perintis industri pertama di Batam; Jl. Raja Ali Kelana.","status_verifikasi":"terverifikasi_beda_versi","sumber_url":["https://gowest.id/raja-ali-kelana/","https://www.hariankepri.com/raja-ali-kelana-dan-kepemilikan-kepulauan-batam/"]},
    {"id":"tengku_sulung","nama":"Tengku Sulung","gelar":"Panglima Besar Reteh; Bintang Mahaputera Utama (anumerta, Keppres 119/TK/2000)","masa_hidup":"±1799 – 7 Nov 1858","kelompok":"a","ringkasan":"Memimpin Perang Reteh 1858 melawan Belanda, gugur di benteng Reteh.","kaitan_batam":"Nama jalan (lokasi perlu dicek).","status_verifikasi":"terverifikasi","sumber_url":["https://www.kompas.com/stori/read/2021/12/16/100000279/tengku-sulung-panglima-besar-reteh-yang-gigih-melawan-belanda?page=all"]},
    {"id":"narasinga_2","nama":"Raja Narasinga II","gelar":"Sultan Indragiri ke-4","masa_hidup":"memerintah 1473–1532","kelompok":"a","ringkasan":"Keturunan sultan Malaka; melawan Portugis 1512–1532.","kaitan_batam":"Jembatan Barelang II; BP Batam menyebutnya 'Panglima Raja Indragiri Hulu'.","status_verifikasi":"beda_versi","sumber_url":["https://batampos.co.id/2020/08/23/ini-fakta-jembatan-ii-barelang/","https://kebudayaan.kemdikbud.go.id/bpcbsumbar/komplek-makam-narasinga-ii/"]},
    {"id":"sultan_zainal_abidin_rokan","nama":"Sultan Zainal Abidin Syah (Tambusai/Rokan)","gelar":"Sultan Tambusai","masa_hidup":"abad ke-19 – 5 Sep 1916","kelompok":"a","ringkasan":"Ulama-pejuang Rokan; ditangkap Belanda 1904 dan dibuang ke Jawa.","kaitan_batam":"Jembatan Barelang IV (versi BP Batam).","status_verifikasi":"beda_versi","sumber_url":["https://batampos.co.id/2020/09/15/fakta-fakta-jembatan-4-barelang/","https://rokanhulukab.go.id/detailpost/perang-siasat-politik-antara-sultan-zainal-abidin-lawan-kolonial-belanda"]},
    {"id":"raja_kecik","nama":"Raja Kecik (Sultan Abdul Jalil Rahmat Syah)","gelar":"Sultan Johor 1718–1722; pendiri Siak","masa_hidup":"? – 1746","kelompok":"a","ringkasan":"Merebut Johor 1718, dikalahkan Bugis 1722, mendirikan Siak di Buantan.","kaitan_batam":"Jembatan Barelang VI.","status_verifikasi":"terverifikasi_asal_usul_hikayat","sumber_url":["https://en.wikipedia.org/wiki/Raja_Kecil","https://kesbangpol.riau.go.id/company/berita-detail/97dbed5c-299f-456e-9390-a9c8e7eb2788/kesultanan-siak-sri-inderapura"]},
    {"id":"laksamana_bintan","nama":"Laksamana (Bintan)","gelar":"Jabatan panglima laut","masa_hidup":"-","kelompok":"a","ringkasan":"Tokoh spesifik belum teridentifikasi; tampilkan sebagai penjelasan jabatan.","kaitan_batam":"Jl. Laksamana Bintan, Jl. Laksamana.","status_verifikasi":"perlu_dicek","sumber_url":[]},
    {"id":"hang_tuah","nama":"Hang Tuah","gelar":"Laksamana Malaka","masa_hidup":"abad ke-15 (hikayat)","kelompok":"b","ringkasan":"Pahlawan Hikayat Hang Tuah dan Sejarah Melayu; kesejarahan diperdebatkan.","kaitan_batam":"Jl. Hang Tuah (Nongsa, Belakang Padang).","status_verifikasi":"hikayat","sumber_url":["https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah","https://en.wikipedia.org/wiki/Hang_Tuah"]},
    {"id":"hang_jebat","nama":"Hang Jebat","gelar":"Sahabat Hang Tuah","masa_hidup":"abad ke-15 (hikayat)","kelompok":"b","ringkasan":"Pemberontak dalam Hikayat Hang Tuah, dibunuh Hang Tuah.","kaitan_batam":"Jl. Hang Jebat (Nongsa).","status_verifikasi":"hikayat","sumber_url":["https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"]},
    {"id":"hang_kasturi","nama":"Hang Kasturi","gelar":"Sahabat Hang Tuah","masa_hidup":"abad ke-15 (hikayat)","kelompok":"b","ringkasan":"Pemberontak versi Sejarah Melayu.","kaitan_batam":"Jl. Hang Kesturi (Nongsa, Belakang Padang).","status_verifikasi":"hikayat","sumber_url":["https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"]},
    {"id":"hang_lekir","nama":"Hang Lekir","gelar":"Sahabat Hang Tuah","masa_hidup":"abad ke-15 (hikayat)","kelompok":"b","ringkasan":"Salah satu lima bersaudara seperguruan.","kaitan_batam":"Jl. Hang Lekir (Nongsa).","status_verifikasi":"hikayat","sumber_url":["https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"]},
    {"id":"hang_lekiu","nama":"Hang Lekiu","gelar":"Sahabat Hang Tuah","masa_hidup":"abad ke-15 (hikayat)","kelompok":"b","ringkasan":"Salah satu lima bersaudara seperguruan.","kaitan_batam":"Jl. Hang Lekiu (lokasi perlu dicek).","status_verifikasi":"hikayat","sumber_url":["https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"]},
    {"id":"hang_nadim","nama":"Hang Nadim","gelar":"Laksamana","masa_hidup":"akhir abad ke-15 – abad ke-16","kelompok":"b","ringkasan":"Menurut Sejarah Melayu anak Hang Jebat, diasuh Hang Tuah; memimpin perlawanan terhadap Portugis pasca 1511.","kaitan_batam":"Bandara Hang Nadim; perairan Batam disebut wilayah langlang lautnya.","status_verifikasi":"semi_historis","sumber_url":["https://en.wikipedia.org/wiki/Hang_Nadim","https://hangnadimairport.bpbatam.go.id/about"]},
    {"id":"dang_merdu","nama":"Dang Merdu (Dang Merdu Wati)","gelar":"Ibu Hang Tuah","masa_hidup":"hikayat","kelompok":"b","ringkasan":"Istri Hang Mahmud, ibu Hang Tuah dalam Hikayat Hang Tuah.","kaitan_batam":"Jl. Dang Merdu (lokasi perlu dicek).","status_verifikasi":"hikayat","sumber_url":["https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"]},
    {"id":"dang_anom","nama":"Dang Anom","gelar":"-","masa_hidup":"-","kelompok":"b","ringkasan":"Belum ditemukan sumber kredibel.","kaitan_batam":"Jl. Dang Anom (perlu dicek).","status_verifikasi":"perlu_dicek","sumber_url":[]},
    {"id":"tuanku_tambusai","nama":"Tuanku Tambusai (Muhammad Saleh)","gelar":"Pahlawan Nasional","masa_hidup":"5 Nov 1784 – 12 Nov 1882","kelompok":"c","ringkasan":"Pemimpin Padri dari Dalu-Dalu, Rokan Hulu; Keppres 071/TK/1995.","kaitan_batam":"Jembatan Barelang V.","status_verifikasi":"terverifikasi","sumber_url":["https://khazanah.republika.co.id/berita/sie577483/kisah-tuanku-tambusai-ulama-penghancur-benteng-belanda"]},
    {"id":"ibnu_sutowo","nama":"Ibnu Sutowo","gelar":"Letjen (Purn.); Dirut Pertamina; Ketua Otorita Batam I","masa_hidup":"23 Sep 1914 – 12 Jan 2001","kelompok":"d","ringkasan":"Penanggung jawab pengembangan Batam sejak Keppres 65/1970; Ketua OB 1971–1976.","kaitan_batam":"Perintis Batam modern; Jl. Ibnu Sutowo (lokasi perlu dicek).","status_verifikasi":"terverifikasi","sumber_url":["https://www.metrotvnews.com/play/kj2CnVJa-kepemimpinan-bp-batam-dari-masa-ke-masa","https://batam.go.id/icon_sejarah/"]},
    {"id":"bj_habibie","nama":"B.J. Habibie","gelar":"Ketua Otorita Batam; Presiden RI ke-3","masa_hidup":"1936 – 2019","kelompok":"d","ringkasan":"Ketua OB sejak 1978; penggagas Jembatan Barelang.","kaitan_batam":"Julukan populer 'Jembatan Habibie'.","status_verifikasi":"terverifikasi","sumber_url":["https://en.wikipedia.org/wiki/Barelang_Bridge"]},
    {"id":"batin_limat","nama":"Batin Limat bin Limbang","gelar":"Batin (kepala suku) Rempang-Galang","masa_hidup":"akhir abad ke-19 – awal abad ke-20 (perlu dicek)","kelompok":"e","ringkasan":"Menawarkan perang melawan Belanda saat pemakzulan Sultan Abdul Rahman Muazzam Syah II (1911), menurut budayawan.","kaitan_batam":"Jl. Batin Limat (Galang).","status_verifikasi":"perlu_dicek","sumber_url":["https://pijarkepri.com/2023/09/sejarah-penduduk-rempang-dan-galang/","https://www.liputan6.com/regional/read/5421347/menulusuri-makam-keramat-teluk-lubuk-lanjut-jejak-awal-peradaban-di-pulau-rempang"]},
    {"id":"batin_bidin","nama":"Batin Bidin","gelar":"Batin Rempang","masa_hidup":"perlu dicek","kelompok":"e","ringkasan":"Disebut sebagai salah satu Batin di Pulau Rempang.","kaitan_batam":"Jl. Batin Bidin (Galang).","status_verifikasi":"perlu_dicek","sumber_url":["https://www.liputan6.com/regional/read/5421347/menulusuri-makam-keramat-teluk-lubuk-lanjut-jejak-awal-peradaban-di-pulau-rempang"]}
  ],
  "penamaan": [
    {"id":"p01","nama_tempat":"Bandar Udara Internasional Hang Nadim","jenis":"bandara","kecamatan":"Nongsa","tokoh_id":"hang_nadim","osm_name_bila_ada":null,"sumber_url":"https://hangnadimairport.bpbatam.go.id/about"},
    {"id":"p02","nama_tempat":"Jl. Hang Nadim","jenis":"jalan","kecamatan":"Bulang","tokoh_id":"hang_nadim","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p03","nama_tempat":"Stadion Temenggung Abdul Jamal","jenis":"stadion","kecamatan":null,"tokoh_id":"temenggung_abdul_jamal","osm_name_bila_ada":null,"sumber_url":"https://en.wikipedia.org/wiki/Temenggong_Abdul_Jamal"},
    {"id":"p04","nama_tempat":"Makam Temenggung Abdul Jamal","jenis":"makam","kecamatan":"Bulang","tokoh_id":"temenggung_abdul_jamal","osm_name_bila_ada":null,"sumber_url":"https://gowest.id/makam-temenggung-abdul-jamal-di-pulau-bulang/"},
    {"id":"p05","nama_tempat":"Jl. Temenggung Abdul Jamal","jenis":"jalan","kecamatan":"Bulang","tokoh_id":"temenggung_abdul_jamal","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p06","nama_tempat":"Jl. Raja Maimunah","jenis":"jalan","kecamatan":"Bulang","tokoh_id":"raja_maimunah","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p07","nama_tempat":"Kecamatan Nongsa","jenis":"kawasan","kecamatan":"Nongsa","tokoh_id":"nong_isa","osm_name_bila_ada":null,"sumber_url":"http://disbud.kepriprov.go.id/makam-nong-isa-batam/"},
    {"id":"p08","nama_tempat":"Jl. Raja Isa","jenis":"jalan","kecamatan":"Batam Kota","tokoh_id":"nong_isa","osm_name_bila_ada":null,"sumber_url":"https://batamtoday.com/news/banjir-kembali-lumpuhkan-batam-centre-anggota-dprd-batam-soroti-drainase-dan-penimbunan-laut"},
    {"id":"p09","nama_tempat":"Gedung Nong Isa","jenis":"gedung","kecamatan":null,"tokoh_id":"nong_isa","osm_name_bila_ada":null,"sumber_url":"http://wartasejarah.blogspot.com/2015/12/sejarah-dan-budaya-batam.html"},
    {"id":"p10","nama_tempat":"Makam Zuriat Nong Isa","jenis":"makam","kecamatan":"Nongsa","tokoh_id":"nong_isa","osm_name_bila_ada":null,"sumber_url":"https://mediacenter.batam.go.id/2022/12/15/tak-lupakan-sejarah-rudi-ziarah-makam-zuriat-nong-isa/"},
    {"id":"p11","nama_tempat":"Jl. Engku Putri","jenis":"jalan","kecamatan":"Batam Kota","tokoh_id":"engku_putri","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p12","nama_tempat":"Dataran Engku Putri","jenis":"alun-alun","kecamatan":"Batam Kota","tokoh_id":"engku_putri","osm_name_bila_ada":null,"sumber_url":"http://wartasejarah.blogspot.com/2015/12/sejarah-dan-budaya-batam.html"},
    {"id":"p13","nama_tempat":"Jl. Engku Putri Utara","jenis":"jalan","kecamatan":"Batam Kota","tokoh_id":"engku_putri","osm_name_bila_ada":null,"sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2688930416/sosok-raja-h-fisabilillah-namanya-diabadikan-sebagai-jalan-di-batam"},
    {"id":"p14","nama_tempat":"Jembatan Tengku Fisabilillah (Barelang I)","jenis":"jembatan","kecamatan":"Bulang (perlu dicek)","tokoh_id":"raja_haji_fisabilillah","osm_name_bila_ada":null,"sumber_url":"https://www.detik.com/sumut/berita/d-7613289/jembatan-barelang-ikon-kota-batam-buah-tangan-presiden-habibie"},
    {"id":"p15","nama_tempat":"Jl. Raja H. Fisabilillah","jenis":"jalan","kecamatan":"Batam Kota","tokoh_id":"raja_haji_fisabilillah","osm_name_bila_ada":null,"sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2688930416/sosok-raja-h-fisabilillah-namanya-diabadikan-sebagai-jalan-di-batam"},
    {"id":"p16","nama_tempat":"Jembatan Nara Singa (Barelang II)","jenis":"jembatan","kecamatan":"Bulang (perlu dicek)","tokoh_id":"narasinga_2","osm_name_bila_ada":null,"sumber_url":"https://batampos.co.id/2020/08/23/ini-fakta-jembatan-ii-barelang/"},
    {"id":"p17","nama_tempat":"Jembatan Raja Ali Haji (Barelang III)","jenis":"jembatan","kecamatan":"Bulang (perlu dicek)","tokoh_id":"raja_ali_haji","osm_name_bila_ada":null,"sumber_url":"https://www.sarahjalan.com/2023/07/6-nama-jembatan-di-barelang-apa-saja-itu.html"},
    {"id":"p18","nama_tempat":"Jl. Raja Ali Haji","jenis":"jalan","kecamatan":"Lubuk Baja; Bulang","tokoh_id":"raja_ali_haji","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p19","nama_tempat":"Museum Batam Raja Ali Haji","jenis":"museum","kecamatan":null,"tokoh_id":"raja_ali_haji","osm_name_bila_ada":null,"sumber_url":"https://batambanget.com/nong-isa-sang-penguasa-pertama-pulau-batam/"},
    {"id":"p20","nama_tempat":"Jembatan Sultan Zainal Abidin (Barelang IV)","jenis":"jembatan","kecamatan":"Bulang–Galang","tokoh_id":"sultan_zainal_abidin_rokan","osm_name_bila_ada":null,"sumber_url":"https://batampos.co.id/2020/09/15/fakta-fakta-jembatan-4-barelang/"},
    {"id":"p21","nama_tempat":"Jembatan Tuanku Tambusai (Barelang V)","jenis":"jembatan","kecamatan":"Galang","tokoh_id":"tuanku_tambusai","osm_name_bila_ada":null,"sumber_url":"https://www.sarahjalan.com/2023/07/6-nama-jembatan-di-barelang-apa-saja-itu.html"},
    {"id":"p22","nama_tempat":"Jembatan Raja Kecik (Barelang VI)","jenis":"jembatan","kecamatan":"Galang","tokoh_id":"raja_kecik","osm_name_bila_ada":null,"sumber_url":"https://www.sarahjalan.com/2023/07/6-nama-jembatan-di-barelang-apa-saja-itu.html"},
    {"id":"p23","nama_tempat":"Masjid Sultan Mahmud Riayat Syah","jenis":"masjid","kecamatan":"Batu Aji (perlu dicek)","tokoh_id":"sultan_mahmud_riayat_syah","osm_name_bila_ada":null,"sumber_url":"https://id.wikipedia.org/wiki/Daftar_tempat_wisata_di_Kepulauan_Riau"},
    {"id":"p24","nama_tempat":"Jl. Sultan Abdul Rachman","jenis":"jalan","kecamatan":"Lubuk Baja","tokoh_id":"sultan_abdul_rahman_1","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p25","nama_tempat":"Jl. Raja Ali Kelana","jenis":"jalan","kecamatan":"Batam Kota","tokoh_id":"raja_ali_kelana","osm_name_bila_ada":null,"sumber_url":"https://batamtoday.com/news/banjir-kembali-lumpuhkan-batam-centre-anggota-dprd-batam-soroti-drainase-dan-penimbunan-laut"},
    {"id":"p26","nama_tempat":"Bumi Perkemahan Raja Ali Kelana","jenis":"kawasan","kecamatan":null,"tokoh_id":"raja_ali_kelana","osm_name_bila_ada":null,"sumber_url":"http://wartasejarah.blogspot.com/2015/12/sejarah-dan-budaya-batam.html"},
    {"id":"p27","nama_tempat":"RSUD Embung Fatimah","jenis":"rumah_sakit","kecamatan":"Batu Aji","tokoh_id":"embung_fatimah","osm_name_bila_ada":null,"sumber_url":"https://rsud.batam.go.id/sejarah-singkat-rsud/"},
    {"id":"p28","nama_tempat":"Jl. Engku Haji Tua","jenis":"jalan","kecamatan":null,"tokoh_id":"engku_haji_tua","osm_name_bila_ada":null,"sumber_url":null},
    {"id":"p29","nama_tempat":"Jl. Tengku Sulung","jenis":"jalan","kecamatan":null,"tokoh_id":"tengku_sulung","osm_name_bila_ada":null,"sumber_url":null},
    {"id":"p30","nama_tempat":"Jl. Laksamana Bintan","jenis":"jalan","kecamatan":"Lubuk Baja","tokoh_id":"laksamana_bintan","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p31","nama_tempat":"Jl. Hang Tuah","jenis":"jalan","kecamatan":"Nongsa; Belakang Padang","tokoh_id":"hang_tuah","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p32","nama_tempat":"Jl. Hang Jebat","jenis":"jalan","kecamatan":"Nongsa","tokoh_id":"hang_jebat","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p33","nama_tempat":"Jl. Hang Kesturi","jenis":"jalan","kecamatan":"Nongsa; Belakang Padang","tokoh_id":"hang_kasturi","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p34","nama_tempat":"Jl. Hang Lekir","jenis":"jalan","kecamatan":"Nongsa","tokoh_id":"hang_lekir","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p35","nama_tempat":"Jl. Hang Lekiu","jenis":"jalan","kecamatan":null,"tokoh_id":"hang_lekiu","osm_name_bila_ada":null,"sumber_url":null},
    {"id":"p36","nama_tempat":"Jl. Dang Merdu","jenis":"jalan","kecamatan":null,"tokoh_id":"dang_merdu","osm_name_bila_ada":null,"sumber_url":null},
    {"id":"p37","nama_tempat":"Jl. Dang Anom","jenis":"jalan","kecamatan":null,"tokoh_id":"dang_anom","osm_name_bila_ada":null,"sumber_url":null},
    {"id":"p38","nama_tempat":"Jl. Batin Limat","jenis":"jalan","kecamatan":"Galang","tokoh_id":"batin_limat","osm_name_bila_ada":null,"sumber_url":"https://kecgalang.batam.go.id/2025/03/06/alamat-kecamatan-galang/"},
    {"id":"p39","nama_tempat":"Jl. Batin Bidin","jenis":"jalan","kecamatan":"Galang","tokoh_id":"batin_bidin","osm_name_bila_ada":null,"sumber_url":"https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/"},
    {"id":"p40","nama_tempat":"Jl. Ibnu Sutowo","jenis":"jalan","kecamatan":null,"tokoh_id":"ibnu_sutowo","osm_name_bila_ada":null,"sumber_url":null}
  ],
  "relasi": [
    {"tokoh_a":"raja_haji_fisabilillah","tokoh_b":"engku_putri","jenis_hubungan":"ayah-anak","sumber_url":"https://disbudpar.tanjungpinangkota.go.id/destinasi-detail/komplek-makam-engku-putri-raja-hamidah-dan-raja-ali-h"},
    {"tokoh_a":"raja_haji_fisabilillah","tokoh_b":"engku_haji_tua","jenis_hubungan":"ayah-anak","sumber_url":"https://ms.wikipedia.org/wiki/Engku_Haji"},
    {"tokoh_a":"engku_haji_tua","tokoh_b":"raja_ali_haji","jenis_hubungan":"ayah-anak","sumber_url":"https://ms.wikipedia.org/wiki/Engku_Haji"},
    {"tokoh_a":"raja_haji_fisabilillah","tokoh_b":"raja_ali_haji","jenis_hubungan":"kakek-cucu","sumber_url":"https://www.detik.com/sumut/berita/d-7029197/mengenal-tiga-pahlawan-nasional-dari-provinsi-kepri"},
    {"tokoh_a":"engku_putri","tokoh_b":"engku_haji_tua","jenis_hubungan":"saudara","sumber_url":"https://ms.wikipedia.org/wiki/Engku_Haji"},
    {"tokoh_a":"engku_putri","tokoh_b":"sultan_mahmud_riayat_syah","jenis_hubungan":"suami-istri","sumber_url":"https://kebudayaan.kemdikbud.go.id/bpnbkepri/berdarah-melayu-pertama-sejak-kepri-terbentuk-sultan-mahmud-riayat-syah-jadi-pahlawan-nasional/"},
    {"tokoh_a":"sultan_mahmud_riayat_syah","tokoh_b":"sultan_abdul_rahman_1","jenis_hubungan":"ayah-anak","sumber_url":"https://en.wikipedia.org/wiki/Mahmud_Shah_III_of_Johor"},
    {"tokoh_a":"engku_putri","tokoh_b":"sultan_abdul_rahman_1","jenis_hubungan":"menahan regalia saat penobatan 1812","sumber_url":"http://digilib.uinsa.ac.id/44087/2/Yune%20Thalia%20Razak_A72213146.pdf"},
    {"tokoh_a":"sultan_abdul_rahman_1","tokoh_b":"nong_isa","jenis_hubungan":"pemberi mandat 1829","sumber_url":"https://mediacenter.batam.go.id/2022/12/15/tak-lupakan-sejarah-rudi-ziarah-makam-zuriat-nong-isa/"},
    {"tokoh_a":"temenggung_abdul_jamal","tokoh_b":"raja_maimunah","jenis_hubungan":"suami-istri","sumber_url":"https://kepri.antaranews.com/berita/25686/warisan-sejarah-pulau-bulang-tanpa-rekam-jejak"},
    {"tokoh_a":"embung_fatimah","tokoh_b":"raja_ali_kelana","jenis_hubungan":"ibu tiri (Raja Ali Kelana saudara seayah putra Embung Fatimah)","sumber_url":"https://www.hariankepri.com/raja-ali-kelana-dan-kepemilikan-kepulauan-batam/"},
    {"tokoh_a":"batin_limat","tokoh_b":"embung_fatimah","jenis_hubungan":"setia kepada putranya, Sultan Abdul Rahman II, saat pemakzulan 1911","sumber_url":"https://pijarkepri.com/2023/09/sejarah-penduduk-rempang-dan-galang/"},
    {"tokoh_a":"raja_kecik","tokoh_b":"raja_haji_fisabilillah","jenis_hubungan":"kekalahan Raja Kecik dari Bugis (1722) membuka jabatan YDM bagi keluarga Daeng Celak","sumber_url":"https://en.wikipedia.org/wiki/Sulaiman_Badrul_Alam_Shah_of_Johor"},
    {"tokoh_a":"hang_tuah","tokoh_b":"hang_jebat","jenis_hubungan":"sahabat; Hang Tuah membunuh Hang Jebat (hikayat)","sumber_url":"https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"},
    {"tokoh_a":"hang_tuah","tokoh_b":"hang_kasturi","jenis_hubungan":"sahabat; pemberontak versi Sejarah Melayu","sumber_url":"https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"},
    {"tokoh_a":"hang_tuah","tokoh_b":"hang_lekir","jenis_hubungan":"sahabat seperguruan","sumber_url":"https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"},
    {"tokoh_a":"hang_tuah","tokoh_b":"hang_lekiu","jenis_hubungan":"sahabat seperguruan","sumber_url":"https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"},
    {"tokoh_a":"dang_merdu","tokoh_b":"hang_tuah","jenis_hubungan":"ibu-anak (hikayat)","sumber_url":"https://en.wikipedia.org/wiki/Hikayat_Hang_Tuah"},
    {"tokoh_a":"hang_jebat","tokoh_b":"hang_nadim","jenis_hubungan":"ayah-anak (Sejarah Melayu)","sumber_url":"https://en.wikipedia.org/wiki/Hang_Nadim"},
    {"tokoh_a":"hang_tuah","tokoh_b":"hang_nadim","jenis_hubungan":"ayah angkat (Sejarah Melayu)","sumber_url":"https://en.wikipedia.org/wiki/Hang_Nadim"},
    {"tokoh_a":"hang_tuah","tokoh_b":"laksamana_bintan","jenis_hubungan":"pemegang gelar Laksamana","sumber_url":"https://en.wikipedia.org/wiki/Hang_Tuah"},
    {"tokoh_a":"tuanku_tambusai","tokoh_b":"sultan_zainal_abidin_rokan","jenis_hubungan":"sama-sama pejuang Tambusai/Rokan","sumber_url":"https://rokanhulukab.go.id/detailpost/perang-siasat-politik-antara-sultan-zainal-abidin-lawan-kolonial-belanda"},
    {"tokoh_a":"ibnu_sutowo","tokoh_b":"bj_habibie","jenis_hubungan":"pendahulu-penerus di Otorita Batam","sumber_url":"https://www.metrotvnews.com/play/kj2CnVJa-kepemimpinan-bp-batam-dari-masa-ke-masa"}
  ]
}
```

## Daftar sumber

- kepriprov — http://disbud.kepriprov.go.id/makam-nong-isa-batam/
- antaranews — https://jambi.antaranews.com/berita/371613/pemerintah-batam-akan-memugar-makam-temenggung-abdul-jamal
- Wikipedia — https://en.wikipedia.org/wiki/Temenggong_Abdul_Rahman
- melayupedia — https://www.melayupedia.com/berita/624/cerobong-asap-tua-peninggalan-pabrik-batu-bata-pertama-di-batam
- hariankepri — https://www.hariankepri.com/raja-ali-kelana-dan-kepemilikan-kepulauan-batam/
- detik — https://www.detik.com/sumut/berita/d-6586348/mengunjungi-jembatan-barelang-batam-buah-tangan-presiden-habibie
- batamnews — https://www.batamnews.co.id/berita-120863-warga-batam-lebih-hafal-simpang-dan-gedung-ketimbang-nama-jalan-protokol.html
- pksbatam — https://pksbatam.com/pilihan/sejarah-awal-nama-batam-berawal-dari-nama-perkampungan-batuampar-milenial-wajib-tahu/
- kepriprov — https://disbud.kepriprov.go.id/nong-isa/
- suara — https://batam.suara.com/read/2021/07/05/092905/mengungkap-sejarah-raja-pertama-kota-batam-dari-makam-zuriat-nong-isa
- detik — https://www.detik.com/sumut/berita/d-7613289/jembatan-barelang-ikon-kota-batam-buah-tangan-presiden-habibie
- rri — https://rri.co.id/pekanbaru/iptek/2742292/jembatan-barelang-jejak-visi-habibie-yang-mengubah-wajah-batam
- batampos — https://batampos.co.id/2020/08/23/ini-fakta-jembatan-ii-barelang/
- kumparan — https://kumparan.com/batamnews/fakta-fakta-jembatan-dua-barelang-1u1FPD1Zi85
- nadiftourbatam — https://www.nadiftourbatam.com/bukan-cuma-jembatan-1-ini-nama-asli-6-jembatan-barelang-yang-jarang-diketahui/
- batampos — https://batampos.co.id/2020/09/15/fakta-fakta-jembatan-4-barelang/
- sarahjalan — https://www.sarahjalan.com/2015/12/nama2-jembatan-dibarelang-batam.html
- smarttourism — https://saiful.smarttourism.biz.id/tentang-barelang/
- stekom — https://p2k.stekom.ac.id/ensiklopedia/Rumah_Sakit_Umum_Daerah_Embung_Fatimah
- batam — https://kecgalang.batam.go.id/2025/03/06/alamat-kecamatan-galang/
- batam — https://dinkes.batam.go.id/2021/04/07/puskesmas-galang/
- Wikipedia — https://en.wikipedia.org/wiki/Barelang_Bridge
- majalahoutsiders — https://www.majalahoutsiders.com/raja-isa-pendiri-kampung-tua-nongsa-batam/
- batam — https://mediacenter.batam.go.id/2022/12/15/tak-lupakan-sejarah-rudi-ziarah-makam-zuriat-nong-isa/
- kemdikbud — https://kebudayaan.kemdikbud.go.id/bpnbkepri/makam-nong-isa-dan-temenggung-abdul-jamal-jadi-destinasi-wisata/
- batamnews — https://www.batamnews.co.id/berita-13772-makam-zuriat-nong-isa-bukti-jejak-para-raja-di-kepulauan-riau.html
- melayupedia — https://www.melayupedia.com/berita/463/wisata-religi-ke-makam-nongsa-berkain-kuning-di-batam
- exploreperjalanan — https://exploreperjalanan.com/wisatawan/destinasi/detail_destinasi/58
- mediaindonesia — https://mediaindonesia.com/weekend/214534/jejak-historis-di-makam-nong-isa
- Wikipedia — https://en.wikipedia.org/wiki/Temenggong_Abdul_Jamal
- kemdikbud — https://kebudayaan.kemdikbud.go.id/bpcbsumbar/pulau-bulang-dalam-pusaran-kerajaan-melayu-riau/
- antaranews — https://kepri.antaranews.com/berita/25686/warisan-sejarah-pulau-bulang-tanpa-rekam-jejak
- antaranews — https://kepri.antaranews.com/berita/62685/makam-temenggung-abdul-jamal-bakal-dipugar
- setneg — https://cdn.setneg.go.id/_multimedia/document/20180910/41462-Bintang_Mahaputera_tahun_1959-2003.pdf
- antaranews — https://kepri.antaranews.com/berita/171492/mengenal-tiga-pahlawan-nasional-asal-kepri
- Wikipedia — https://en.wikipedia.org/wiki/Raja_Haji_Fisabilillah
- detik — https://www.detik.com/sumut/berita/d-7029197/mengenal-tiga-pahlawan-nasional-dari-provinsi-kepri
- historia — https://www.historia.id/article/cerita-kumis-pahlawan-nasional-raja-haji-fisabilillah-pewze
- ikpni — http://ikpni.or.id/pahlawan/raja-haji-fisabilillah/
- koranmakassar — https://koranmakassar.com/17-juni-1784-raja-haji-fisabilillah-gugur-saat-menyerang-pangkalan-maritim-belanda-di-teluk-ketapang/
- batamtoday — https://batamtoday.com/news/lam-kepri-usulkan-46-simpang-dan-bundaran-di-batam-ganti-nama-tokoh-melayu
- tanjungpinangkota — https://disbudpar.tanjungpinangkota.go.id/destinasi-detail/komplek-makam-engku-putri-raja-hamidah-dan-raja-ali-h
- blogspot — https://ajiemintebo.blogspot.com/2019/01/engku-puteri-kutemui-jawapan-tentang-ke.html
- kompas — https://kilaskementerian.kompas.com/kemenparekraf/read/2020/02/14/183935027/festival-pulau-penyengat-2020-angkat-kebesaran-engku-putri-raja-hamidah
- merdeka — https://www.merdeka.com/peristiwa/read/7813636/kisah-penjaga-regalia-kerajaan-melayu
- uinsa — http://digilib.uinsa.ac.id/44087/2/Yune%20Thalia%20Razak_A72213146.pdf
- unilak — https://ptip.unilak.ac.id/berita/detail/pahlawan-melayu-raja-ali-haji-tampil-di-google-doodle-ini-kisahnya
- tribunnews — https://video.tribunnews.com/view/90068/profil-raja-ali-haji-pahlawan-nasional
- Wikipedia — https://en.wikipedia.org/wiki/Raja_Ali_Haji
- bacadoloe — https://www.bacadoloe.com/2022/11/mengenal-raja-ali-haji-bin-raja-haji.html
- melayupedia — https://www.melayupedia.com/berita/2717/tiga-pahlawan-nasional-dari-kepulauan-riau-beserta-jasa-jasanya?page=all
- kemenag — https://kepri.kemenag.go.id/page/det/mengenal-tiga-pahlawan-nasional-dari-provinsi-kepri
- orami — https://www.orami.co.id/magazine/raja-ali-haji
- tribunnewswiki — https://www.tribunnewswiki.com/2019/08/07/pahlawan-nasional-raja-ali-haji
- civitasbook — https://civitasbook.com/singo.php?_i=wall&amp=&amp=&amp=&amp=&cb=non&id1=aaaaaaaatamu&id2=&id3=aaaaamnp123_pahlawan
- porosjakarta — https://www.porosjakarta.com/nusantara/062955722/rempang-galang-dan-bulang-jejak-silsilah-kesultanan-riau-lingga
- kompas — https://nasional.kompas.com/read/2017/11/10/14115831/mahmud-riayat-syah-pahlawan-nasional-yang-jadi-sultan-sejak-umur-2-tahun
- batampos — https://batampos.co.id/2017/11/07/sultan-mahmud-ditetapkan-sebagai-pahlawan-nasional/
- Wikipedia — https://en.wikipedia.org/wiki/Mahmud_Shah_III_of_Johor
- cnnindonesia — https://www.cnnindonesia.com/nasional/20230915102448-12-999359/rempang-dan-perlawanan-keturunan-pasukan-elite-300-tahun-silam
- liputan6 — https://www.liputan6.com/regional/read/3171842/sultan-mahmud-riayat-syah-hantu-laut-yang-bikin-voc-gemetar
- kemdikbud — https://kebudayaan.kemdikbud.go.id/bpnbkepri/berdarah-melayu-pertama-sejak-kepri-terbentuk-sultan-mahmud-riayat-syah-jadi-pahlawan-nasional/
- Wikipedia — https://en.wikipedia.org/wiki/Abdul_Rahman_Muazzam_Shah_of_Riau-Lingga
- Wikipedia — https://ms.wikipedia.org/wiki/Kesultanan_Riau-Lingga
- infomakam — https://www.infomakam.id/makam-nong-isa-batam/
- gowest — https://gowest.id/raja-ali-kelana/
- jantungmelayu — https://jantungmelayu.com/2017/05/batam-di-antara-puing-dan-bangunan-tua/
- batamnews — https://www.batamnews.co.id/berita-19853-ini-sejarah-raja-h-ali-kelana-membangun-pulau-batam.html
- Wikipedia — https://en.wikipedia.org/wiki/Riau-Lingga_Sultanate
- suara — https://batam.suara.com/read/2021/08/17/114406/bikin-bangga-batam-ternyata-pernah-kuasai-bisnis-batu-bata-internasional-pada-abad-18
- blogspot — http://batam-pedia.blogspot.com/2016/
- batamtoday — https://batamtoday.com/news/banjir-kembali-lumpuhkan-batam-centre-anggota-dprd-batam-soroti-drainase-dan-penimbunan-laut
- tribunnews — https://batam.tribunnews.com/2021/03/10/batam-punya-pabrik-batu-bata-tertua-kini-ditelusuri-disbudpar-batam
- antaranews — https://kepri.antaranews.com/berita/200065/melestarikan-cagar-budaya-makam-embung-fatimah-di-pulau-penyengat
- blogspot — https://borneohistory57.blogspot.com/2019/04/sejarah-kerajaan-di-daik-lingga.html
- royalark — https://www.royalark.net/Indonesia/lingga4.htm
- batam — https://rsud.batam.go.id/sejarah-singkat-rsud/
- batamnow — https://batamnow.com/rumah-sakit-embung-fatimah-pasien-kejari-batam-lagi-ini-temuan-bpk-tahun-2016/
- Wikipedia — https://id.wikipedia.org/wiki/Tengku_Sulung
- gowest — https://gowest.id/tengku-sulung/
- kompas — https://www.kompas.com/stori/read/2021/12/16/100000279/tengku-sulung-panglima-besar-reteh-yang-gigih-melawan-belanda?page=all
- wordpress — https://tambeh.wordpress.com/2011/06/21/tengku-sulung-sebagai-panglima-dan-panglima-besar-calon-pahlawan-nasional-asal-riau/
- blogspot — http://wartasejarah.blogspot.com/2013/12/perjuangan-tengku-sulung-untuk-tanah.html
- Wikipedia — https://id.wikipedia.org/wiki/Bintang_Mahaputera_Utama
- kosabudaya — https://guruku.kosabudaya.id/materipembelajaran/budayamelayuriau/tokoh-tokoh-pejuang-riau-masa-kolonial/2/
- kemdikbud — https://kebudayaan.kemdikbud.go.id/bpcbsumbar/komplek-makam-narasinga-ii/
- riau — https://ppid.riau.go.id/berita/11729/raja-narasinga-ii--pahlawan-dari-indragiri-penakluk-portugis
- neliti — https://www.neliti.com/publications/201303/kerajaan-indragiri-pada-masa-pemerintahan-paduka-maulana-sri-sultan-alauddin-isk
- kemdikbud — http://cagarbudaya.kemdikbud.go.id/cagarbudaya/detail/PO2016021300008/kompleks-makam-narasinga-ii
- posmetro — https://posmetro.co/2020/08/20/fakta-jembatan-ii-barelang/
- goriau — https://www.goriau.com/ragam/mendorong-kembangkan-situs-sejarah-tuanku-tambusai-dan-sultan-zainal-abidin.html
- rokanhulukab — https://rokanhulukab.go.id/detailpost/perang-siasat-politik-antara-sultan-zainal-abidin-lawan-kolonial-belanda
- Wikipedia — https://en.wikipedia.org/wiki/Raja_Kecil
- Wikipedia — https://id.wikipedia.org/wiki/Abdul_Jalil_Syah_dari_Siak
- Wikipedia — https://en.wikipedia.org/wiki/Sulaiman_Badrul_Alam_Shah_of_Johor
- Wikipedia — https://en.wikipedia.org/wiki/Abdul_Jalil_Shah_IV_of_Johor
- riau — https://kesbangpol.riau.go.id/company/berita-detail/97dbed5c-299f-456e-9390-a9c8e7eb2788/kesultanan-siak-sri-inderapura
- pijarkepri — https://pijarkepri.com/2023/09/sejarah-penduduk-rempang-dan-galang/
- regionalnews — https://regionalnews.id/2023/09/10/selayang-pandang-rempang-galang-dan-perannya-masa-imperium-melayu/
- wordpress — https://hrhand.wordpress.com/2011/05/09/nama-nama-jalan-di-pulau-batam/
