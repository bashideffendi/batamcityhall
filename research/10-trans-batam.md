# Peta Bus Trans Batam: Riset Data dan Desain untuk Batam City Hall (November 2026)
> task_id: wf-36063ca2-a5e1-819c-a7c8-6e6e789889d3

# Peta Bus Trans Batam: Riset Data dan Desain untuk Batam City Hall (per 4 November 2026)

Intinya: per November 2026 Trans Batam menjalankan **9 koridor aktif**. Koridor 7 sekarang lewat Bandara Hang Nadim (mulai 2 Juli 2026). Data rute dan urutan halte bisa dikumpulkan dari berita lokal 2025–2026 yang mengutip aplikasi SIP TB/Dishub. Masalahnya, **koordinat halte belum ada satu pun yang terverifikasi di level halte**, dan tidak ditemukan relasi `route=bus` Trans Batam di OpenStreetMap maupun GTFS resmi atau komunitas. Jadi strategi paling realistis: bangun seed data dari daftar halte berurutan, isi koordinat terminal/transfer point dari landmark (status `perlu_cek_ulang`), lalu lengkapi halte biasa lewat survei lapangan atau pemetaan OSM.

## TL;DR

- **9 koridor aktif** (K1–K9), umumnya beroperasi setiap hari sekitar 06.00–18.00/19.00 WIB. K1 dan K2 mulai 05.45. Menurut Kepala UPT Trans Batam Bambang Cipto (BatamToday, 3 Juli 2026), K7 (Nongsa–Bandara Hang Nadim–Batam Centre) beroperasi setiap hari pukul 06.00–19.00 WIB dengan interval kedatangan sekitar 20–30 menit sejak 2 Juli 2026. Koridor 10 (Tembesi–Barelang/Galang) dan feeder masih **rencana**, jangan digambar sebagai layanan aktif.
- **Data halte**: urutan halte bisa disusun untuk semua koridor, tapi kebanyakan sumber hanya memuat daftar ringkas (contohnya K1 tercatat 56 halte, sementara yang dipublikasikan sekitar 31 nama). Jumlah halte juga bertentangan antarsumber (K5: 41 vs 65; K6: 41 vs 58). Semua koordinat di laporan ini level landmark, belum level halte.
- **Rekomendasi teknis**: MapLibre + GeoJSON milik sendiri (stops, patterns, routes), `line-offset` atau plugin `maplibre-gl-lanes` untuk ruas berimpit, dan diagram skematik oktilinier (0/45/90°) yang dibuat dengan LOOM atau SVG manual. Hub utamanya Transferpoint Batam Center (5 koridor), Transferpoint Sekupang (3), Terminal Jodoh (3), dan Transferpoint Punggur (2).

## Ringkasan singkat

Jaringan Trans Batam berbentuk "bintang ganda". Pusat pertamanya **Transferpoint Batam Center** (dekat Mega Mall dan Pelabuhan Batam Centre), tempat K1, K2, K5, K6, dan K7 berakhir. Simpul sekundernya **Sekupang** (K1, K3, K4), **Jodoh** (K3, K5, K8), dan **Punggur** (K8, K9). Cocok sekali untuk diagram ala metro: satu hub besar di tengah, cabang ke barat (Sekupang, Tanjung Uncang, Sagulung), ke selatan (Piayu, Mukakuning), ke utara (Jodoh/Nagoya), dan ke timur (Nongsa, Bandara, Punggur).

## Key Findings

1. **Jumlah koridor aktif = 9.** Wikipedia ID dan banyak berita 2026 konsisten menyebut 9 koridor aktif. Klaim "10 koridor" dari Kadishub (Mei 2025) memasukkan Tembesi–Barelang, yang statusnya masih "disiapkan". Rencana jangka panjang adalah 10 koridor utama dengan koridor terakhir Tembesi–Galang, plus feeder yang ditargetkan mulai pertengahan 2027. Feeder ini masih menunggu pengesahan anggaran 2027.
2. **K7 berubah besar pada Juli 2026.** Peluncuran dan uji coba lintasan dilakukan 29 Juni 2026, operasional mulai 2 Juli 2026. Menurut Kepala UPT Trans Batam Bambang Cipto (BatamToday, 3 Juli 2026), K7 beroperasi setiap hari pukul 06.00–19.00 WIB dengan interval kedatangan sekitar 20–30 menit (sekitar 20 menit di jam sibuk pagi, 30 menit siang–sore), 5 armada plus 1 cadangan, dan waktu tempuh bandara–Batam Centre sekitar 30 menit. Halte bandara ada di **area pintu kedatangan**. Daftar halte K7 sebelum Juli 2026 (76 halte) belum memuat halte bandara, jadi posisinya di urutan halte harus dicek ulang.
3. **Armada bertambah 19 bus pada 2026.** Wikipedia ID menyebut peresmian oleh Kemenhub pada 26 Mei 2026 dengan target headway di bawah 10 menit. Menurut Dirjen Hubdat Kemenhub Aan Suhanan (BeritaTrans, 26 Mei 2026), bus baru melayani "lima koridor strategis menuju Batam Centre yakni Sekupang, Tanjung Uncang, Jodoh, Tanjung Piayu, dan Nongsa". Asisten Pemkot Batam Suhar (Serantau Media, 26 Mei 2026) merinci pembagiannya: 5 unit Jodoh–BC, 6 Piayu–BC, 6 Nongsa–BC, dan masing-masing 1 unit untuk K1 dan K2. Kadishub Batam Leo Putra (dikutip ANTARA Kepri) menyebut "Realisasi per 1 Juni dan pola yang digunakan pola BTS" untuk "memperkuat koridor 5, 6, dan 7." Target "di bawah 10 menit" itu **target, bukan kondisi terukur**.
4. **Jumlah armada simpang siur**: 65 unit (Satu Data Batam/GoKepri, akhir 2023); "sekitar 20 unit bus Trans Batam yang beroperasi setiap harinya" menurut Kadishub Salim (ANTARA, 17 Juli 2024); dan 52 unit armada BTS menurut Dirjen Hubdat Aan Suhanan (Kompas Otomotif, 28 Mei 2026), yaitu 20 unit awal, ditambah 13 unit pada 2025 dan 19 unit pada 2026. Angka 52 itu hanya armada BTS, sedangkan klaim "120 halte" (blog hotel, 2026) belum terverifikasi. Di UI sebaiknya jangan tampilkan angka armada total. Tampilkan headway per koridor saja.
5. **Tidak ada data geometri terbuka.** Tidak ditemukan relasi `route=bus` maupun node halte bertag Trans Batam di OSM, dan tidak ada GTFS komunitas di GitHub (pencarian hanya menemukan proyek Transjakarta). Moovit punya 8 jalur dan 384 stop, tapi datanya lama (K7 versi lama, belum ada K9) dan tidak boleh di-scrape otomatis.
6. **Aplikasi resmi SIP TB** (Sistem Informasi Penumpang Trans Batam, dikembangkan PT Nusantara Global Inovasi, paket `ngi.muchi.transbatam`, versi 2.0.1 per Desember 2025) punya fitur posisi bus, rute, halte terdekat, dan tiket nontunai. Untuk K7, UPT juga menyebut pemantauan posisi bus lewat aplikasi Mitra Darat.

## Tabel koridor (status per November 2026)

| No | Rute | Terminal A → B | Jalan/kawasan utama | Jam operasi | Headway | Hari | Jml halte (sumber) | Status data |
|---|---|---|---|---|---|---|---|---|
| K1 | Sekupang–Batam Centre | Transferpoint Sekupang → Transferpoint Batam Center | Sei Harapan, Tiban, UIB, Baloi, Simpang Jam, Sei Panas, Bundaran Madani, Engku Putri | 05.45–19.00 | ±20–35 mnt (jadwal Moovit lama) | Setiap hari, ada jeda Jumat siang | 56 | Jam terverifikasi (berita 2025–2026) |
| K2 | Tanjung Uncang–Batam Centre | Hidayatullah/Tanjung Uncang → TP Batam Center | Sagulung, Fanindo, Basecamp, Batu Aji, Simpang Tembesi, Mukakuning, Panbil, Kepri Mall | 05.45–19.00 | perlu_diisi | Setiap hari | 78 | Jam terverifikasi |
| K3 | Sekupang–Jodoh | TP Sekupang → TP Terminal Jodoh | Tiban, UIB, Baloi, Grand Mall, Nagoya, Jodoh | 06.00–19.00 | ±20–35 mnt (jadwal Moovit lama) | Setiap hari, jeda Jumat siang | 65 | Jam terverifikasi |
| K4 | Sagulung–Sekupang | Pelabuhan Sagulung → TP Sekupang | Fanindo, Basecamp, Marina, Tanjung Riau, Sei Harapan | 06.00–18.00 | perlu_diisi | Setiap hari | 69 | Jam terverifikasi |
| K5 | Jodoh–Batam Centre | TP Terminal Jodoh → TP Batam Center | Batu Ampar, Harbour Bay, Bengkong, Sei Panas, Bundaran Madani | 06.00–18.00 | perlu_cek_ulang (Moovit lama: 60 mnt) | Setiap hari | **41 vs 65 (konflik)** | Jumlah halte bertentangan |
| K6 | Tanjung Piayu–Batam Centre | Tanjung Piayu Laut → TP Batam Center | Sei Pancur, Simpang Bagan, Bidaayu, Mukakuning, Panbil, Kepri Mall, Politeknik | 06.00–18.00 | perlu_diisi | Setiap hari | **41 vs 58 (konflik)** | Jumlah halte bertentangan |
| K7 | Nongsa–Bandara Hang Nadim–Batam Centre | Teluk Mata Ikan → TP Batam Center | Nongsa, Batu Besar, Simpang Bandara, **Bandara (kedatangan)**, Dotamana, Botania, Uniba, KDA, Puri Legenda | 06.00–19.00 | 20–30 mnt | Setiap hari | 76 (sebelum Juli 2026) | Rute baru, urutan halte bandara perlu_cek_ulang |
| K8 | Punggur–Jodoh | TP Punggur → TP Terminal Jodoh | Kabil, Simpang Kepri Mall, Simpang Jam, Baloi, DC Mall, Pasar Induk | 06.00–18.00 | perlu_diisi | Setiap hari | 78 | Jumlah bus bertentangan (3 vs 8) |
| K9 | Punggur–Nongsa | TP Punggur → Nongsa | Kabil, Batu Besar, Kampung Mangga, Polda Kepri, Sambau | 06.00–18.00 (dari Nongsa 06.00, dari Punggur 06.40) | jarang (1–3 bus) | Setiap hari | 54 | Penomoran sempat tumpang tindih (lihat bawah) |
| K10 (rencana) | Tembesi–Barelang/Galang | — | — | — | — | — | — | **Belum beroperasi** |

**Catatan perbedaan antarsumber (mana yang paling mutakhir):**
- **Sumber terbaik untuk K7**: berita peluncuran 29 Juni–3 Juli 2026 (BatamToday, Tribun Batam, ANTARA Kepri, RRI, Terasbatam), yang mengutip langsung Kepala UPT Trans Batam. Artikel InspirasiToday Mei 2026 (06.00–18.00, 3 bus) sudah **usang** untuk K7.
- **Jumlah halte dan jam per koridor**: seri artikel Kepri Post (kepri.pikiran-rakyat.com) dan InspirasiToday 2025–2026 menyebut datanya "mengutip aplikasi SIP TB" atau "situs Dishub". Isinya berulang tiap bulan, kadang dengan salah ketik (contohnya artikel K8 Juni 2026 menulis "Rute: Nongsa–Batam Center"). Anggap sebagai sumber sekunder.
- **Dua penomoran lama yang harus diabaikan**: RailTravel Station (terakhir diubah April 2024, isinya era 2017, tarif Rp4.000) memakai K5 = Piayu–Jodoh, K6 = Nongsa–BC, K7 = Punggur–Jodoh. Moovit versi Indonesia juga masih memakai penomoran lama ini. **Jangan dipakai.**
- **K9**: Kompas (September 2024) menulis "koridor 9, rute Batam Centre–Nongsa" berangkat dari halte Pelabuhan Batam Centre, sedangkan semua sumber 2025–2026 menyebut K9 = Punggur–Nongsa. Pakai Punggur–Nongsa.
- **Jeda Jumat**: jadwal Moovit untuk K1 (dari Batam Center) melompat dari 10.55 ke 13.20 setiap Jumat, dan K3 (dari Jodoh) dari 11.10 ke 13.15. Kemungkinan ini jeda salat Jumat. Data Moovit bisa usang, jadi simpan sebagai `perlu_cek_ulang`.

## Tabel halte per koridor (berurutan)

Legenda status: **T** = nama dan urutan dari sumber, tapi koordinat belum ada · **…** = ada halte yang tidak tercantum di sumber (gap) · semua koordinat halte = `perlu_diisi_user` kecuali disebut lain.

### K1 Sekupang → Batam Centre (sumber: Kepri Post Mei/Juli 2025; 31 dari 56 halte)
| # | Halte | Kecamatan (perkiraan) | Catatan |
|---|---|---|---|
| 1 | Transferpoint Sekupang | Sekupang | Transfer K1/K3/K4; dekat Pelabuhan Domestik Sekupang |
| 2 | Taman Palapa | Sekupang | |
| 3 | Telkom Sekupang | Sekupang | |
| 4 | Shangrila A | Sekupang | |
| 5 | Lampu Merah Patam Lestari | Sekupang | |
| 6 | Kartini | Sekupang | Juga K3 |
| 7 | STC | Sekupang | Juga K3 |
| 8 | GOR Sekupang A | Sekupang | Juga K3 |
| 9 | Mutiara View | Sekupang | Juga K3 |
| 10 | Tiban III | Sekupang | Juga K3 |
| 11 | Tiban Raya | Sekupang | Juga K3 |
| 12 | Taman Sari A | Sekupang | Juga K3 |
| 13 | Tiban Center | Sekupang | Juga K3 |
| 14 | Tiban Ayu A | Sekupang | Juga K3 |
| 15 | Tiban Kampung A | Sekupang | Juga K3 |
| 16 | UIB A | null | Kampus UIB; titik pisah K1/K3 |
| 17 | Baloi View | null | |
| 18 | RS Awal Bros | Batam Kota | Rumah sakit |
| 19 | Orchid A | null | |
| 20 | Gelael A | null | |
| 21 | Raflesia A | Batam Kota | Juga K5 |
| 22 | Kawasaki A | Batam Kota | Juga K5 |
| 23 | Royal Grande | Batam Kota | Juga K5 |
| 24 | Bundaran Madani | Batam Kota | Juga K5 |
| 25 | Kadin | Batam Kota | Juga K5 |
| 26 | Ikan Daun | Batam Kota | Juga K2/K5 |
| 27 | INKO | Batam Kota | Juga K2/K5 |
| 28 | Engku Putri | Batam Kota | Juga K5 |
| 29 | Imigrasi | Batam Kota | Juga K5 |
| 30 | Mega Mall | Batam Kota | Juga K5 |
| 31 | Transferpoint Batam Center | Batam Kota | Hub K1/K2/K5/K6/K7 |

**Arah balik K1 (Batam Center → Sekupang), sebagian:** Transferpoint Batam Center – Kantor Pos – Harmoni One – Green Land – Yos Sudarso – Kawasaki B – … – Taman Sari B – Tiban Raya – Cipta Puri – Mutiara View – GOR Sekupang B – Sei Harapan – Kartini – PCI – … – Transferpoint Sekupang. Arah balik **berbeda** dari arah pergi (lewat Green Land/Yos Sudarso, Cipta Puri, Sei Harapan), jadi patterns per arah wajib dipisah.

### K2 Batam Centre → Tanjung Uncang (sumber: Kepri Post Juli 2025; daftar ada gap; total 78)
Transferpoint Batam Center – Kantor Pos – Harmoni One – Ikan Daun – INKO – Masjid Agung – Centro Coffee – Politeknik B – Simpang Frangky B – Anggrek Sari – Simpang Kara B – Plamo – Kepri Mall B – Taman Niaga B – Stadion Temenggung B – Panbil Mukakuning – Top 100 Batuaji B – … – Simpang Tembesi B – Villa Mukakuning B – Putri Tujuh B – JPO Plaza SP B – Putri Hijau B – Pandawa – Kavling Baru B – Buana Raya – Puskopkar B – Classic B – Kavling Lama B – GOR Batuaji B – Base Camp B – … – SMPN 9 Batam B – Taman Carina B – JPO PJB B – MTs – Top 100 Regency B – Tunas – Hidayatullah B.
Arah sebaliknya diawali "Hidayatullah A" (menurut Moovit). Kecamatan: Batam Kota → Sei Beduk (Mukakuning/Panbil) → Batu Aji → Sagulung (perkiraan, perlu cek).

### K3 Sekupang → Jodoh (sumber: Warta Jaya Vision, Desember 2025; total 65)
**Pergi:** Transferpoint Sekupang – Taman Palapa – Telkom Sekupang – Shangrila A – Lampu Merah Patam Lestari – Kartini – STC – GOR Sekupang A – Mutiara View – Tiban III – Tiban Raya – Taman Sari A – Tiban Center – Tiban Ayu A – Tiban Kampung A – UIB A – Taman Kota – Pantai Permata – Baloi Mas – Grand Mall – Pantai Harapan – Harmoni Suites – Nagoya Hill – BRI Nagoya – … – Transferpoint Terminal Jodoh.
**Balik:** Transferpoint Terminal Jodoh – Top 100 Jodoh – DC Mall SW – Tanjunguma – DC Mall – Pasar Angkasa B – Pasar Induk – Pacific Hotel – BRI Jodoh B – BCA Jodoh B – BPJS Ketenagakerjaan – Dana Graha – Bank Mandiri – Nagoya Hill – Windsor – Vihara – Penuin – UIB B – Tiban Kampung – … – Transferpoint Sekupang.
Kecamatan: Sekupang → Lubuk Baja (Nagoya) → Batu Ampar (Jodoh).

### K4 Sagulung → Sekupang (sumber: Kepri Post Februari 2026; daftar ringkas, total 69)
Pelabuhan Sagulung – Latrade – Hidayatullah – Masjid Agung Sultan Riayat Syah – Fanindo – Basecamp – Jupiter – Balai Pelatihan Kesehatan – Marina Waterfront – Harris Resort – Tanjung Riau – Sunbread – Sei Harapan – Transferpoint Sekupang. Versi 2022 (Batamnews) menyebut juga RSBP sebelum Sekupang. Kecamatan: Sagulung → Batu Aji → Sekupang.

### K5 Jodoh ↔ Batam Centre (sumber: Kepri Post Agustus 2025/2026 + Moovit)
**Jodoh → BC (Kepri Post):** Transferpoint Terminal Jodoh – Top 100 Jodoh – Pasar Angkasa (muncul di versi Agustus 2026) – DC Mall SW – Pacific Hotel – Polsek Batu Ampar – (Monte Siena) – Bengkong Garama – Damkar Sei Panas – Bank Riau Kepri – Rafflesia – Kawasaki – Royal Grande – Bundaran Madani – (Kadin) – Mega Mall – Transferpoint Batam Center.
**BC → Jodoh (Moovit, 22 stop, kemungkinan usang):** Transfer Point Batam Center – Kantor Pos – Harmoni One – Kadin – Bundaran Madani – Royal Grande – Kawasaki B – Raflesia B – Bank Riau B – Damkar Sei Panas B – Garama 2 – Melchem 2 – Tg Sengkuang – Lurah Sengkuang – TVS 2 – Sindo 2 – Monte Siena 2 – Batu Ampar – Harbourbay – … – Transferpoint Terminal Jodoh.
**Ujung arah Jodoh → BC versi Moovit:** … Damkar Sei Panas A – Bank Riau A – Raflesia A – Kawasaki A – Royal Grande – Bundaran Madani – Kadin – Ikan Daun – Inko – Engku Putri – Imigrasi – Mega Mall Batam Center – Transfer Point Batam Center.
Kecamatan: Batu Ampar → Bengkong → Batam Kota.

### K6 Tanjung Piayu → Batam Centre (sumber: InspirasiToday Mei 2026; 27 nama)
| # | Halte | Kecamatan (perkiraan) | Catatan |
|---|---|---|---|
| 1 | Tanjung Piayu Laut | Sei Beduk | Terminus |
| 2 | Kampung Jawa | Sei Beduk | |
| 3 | Laguna | Sei Beduk | |
| 4 | Oleana | Sei Beduk | |
| 5 | Bukit Barelang | Sei Beduk | |
| 6 | Rhabayu Asri A | Sei Beduk | |
| 7 | SMPN 40 | Sei Beduk | |
| 8 | Simpang Pancur | Sei Beduk | |
| 9 | Pasar Pancur | Sei Beduk | |
| 10 | Simpang Bagan | Sei Beduk | |
| 11 | Simpang ATB | Sei Beduk | |
| 12 | Bidaayu Pintu 3 | Sei Beduk | |
| 13 | Bidaayu Pintu | Sei Beduk | |
| 14 | SMPN 16 | Sei Beduk | |
| 15 | Bidadari | Sei Beduk | |
| 16 | Nusa Indah | Sei Beduk | |
| 17 | Bukit Sentosa | Sei Beduk | |
| 18 | Pintu 4 Mukakuning | Sei Beduk | Kawasan industri Mukakuning |
| 19 | Pintu 3 Mukakuning | Sei Beduk | |
| 20 | Pintu 2 Mukakuning | Sei Beduk | |
| 21 | Kawasan Industri Panbil | Sei Beduk | |
| 22 | Best Western Panbil | Sei Beduk | |
| 23 | Stadion Temenggung | Batam Kota | Juga K2 (sisi B) |
| 24 | Kepri Mall | Batam Kota | Juga K2 |
| 25 | Politeknik | Batam Kota | Juga K2 |
| 26 | Masjid Agung | Batam Kota | Juga K2 |
| 27 | Transfer Point Batam Center | Batam Kota | Hub |

### K7 Nongsa → Bandara Hang Nadim → Batam Centre (sumber: InspirasiToday Mei 2026 + berita Juli 2026)
Teluk Mata Ikan – Pelabuhan Nongsa – Turi Beach – Polda Kepri – Bandoeng Resto – Citra Mas – Kampung Mangga – Kampung Tengah – Simpang Ojek – Darul Falah – Pura Asri – Family Garden – Pasar MTC – Simpang Bandara – **[Bandara Hang Nadim, halte pintu kedatangan; posisi urutan perlu_cek_ulang]** – Dotamana – Bida Asri 2 – Kapita Plaza – Botania 2 – Uniba – Mustafa Plaza – Kantor Camat Batam Kota – KDA – Puri Legenda – Grand Mas – Purimas – Gedung LAM – Transferpoint Batam Center.
Halte Polda Kepri, Bandoeng Resto, Citra Mas, dan Kampung Mangga juga dilayani K9 (titik transfer K7↔K9). Kecamatan: Nongsa → Batam Kota.

### K8 Punggur → Jodoh (sumber: Kepri Post Maret–April 2026; daftar sangat ringkas, total 78)
Transferpoint Punggur – PLTU Tanjung Kasam – TPA – Polsek Nongsa – Pasar Top One – Kabil Raya – … (via Simpang Kepri Mall, Simpang Jam, Baloi/BCS Mall, DC Mall, Pasar Induk menurut Batamnews 2022) – Pasar Angkasa – Terminal Jodoh.

### K9 Punggur → Nongsa (sumber: 1news.id Oktober 2025, Kepri Post Maret 2026; total 54)
Transferpoint Punggur – PLTU Tanjung Kasam – TPA – Polsek Nongsa – Pasar Top One – Kabil Raya – Al Munawaroh – BRI Batu Besar – Kampung Mangga – Citra Mas – Bandoeng Resto – Polda Kepri – Kampung Sambau – … (ujung Nongsa).
Enam halte pertama sama dengan K8 (koridor berimpit Punggur–Kabil).

### Halte transit/persinggungan utama
| Halte | Koridor | Fungsi |
|---|---|---|
| Transferpoint Batam Center | K1, K2, K5, K6, K7 | Hub utama, dekat Pelabuhan Batam Centre dan Mega Mall |
| Mega Mall / Imigrasi / Engku Putri | K1, K5 (+K2/K6 di sekitar) | Koridor pusat |
| Bundaran Madani, Royal Grande, Kawasaki, Raflesia | K1, K5 | Ruas berimpit, butuh line-offset |
| Ikan Daun, INKO, Kantor Pos, Harmoni One | K1, K2, K5 | Ruas berimpit |
| Kepri Mall, Politeknik, Masjid Agung, Stadion Temenggung | K2, K6 | Ruas berimpit selatan |
| Transferpoint Sekupang | K1, K3, K4 | Hub barat |
| Kartini → UIB (± 11 halte) | K1, K3 | Ruas berimpit panjang |
| Transferpoint Terminal Jodoh, Top 100 Jodoh, DC Mall SW | K3, K5, K8 | Hub utara |
| Transferpoint Punggur → Kabil Raya | K8, K9 | Hub timur |
| Kampung Mangga, Citra Mas, Bandoeng Resto, Polda Kepri | K7, K9 | Transfer Nongsa |
| Fanindo, Basecamp, Hidayatullah | K2, K4 | Transfer Sagulung/Batu Aji |

## Data geometri rute

- **OpenStreetMap**: tidak ditemukan relasi `route=bus` maupun node halte bertag Trans Batam. Batas kota Batam ada sebagai relasi 10660353. Yang ada di OSM hanya jalan hasil impor lama (source=Batam Mapping Project) dan relasi feri Batam Centre–HarbourFront (15412932). Konfirmasi final tetap perlu lewat query Overpass di bawah.
- **Moovit**: 8 jalur dan 384 stop dengan nama halte dan bentuk rute, tapi penomoran dan rute sebagian usang (K7 lama mulai Teluk Mata Ikan dengan 39 stop, belum ada K9). Situsnya menolak akses otomatis, dan lisensi datanya tidak terbuka, jadi pakai hanya sebagai **referensi visual saat verifikasi manual**.
- **Google Maps transit**: tidak ditemukan bukti Trans Batam punya feed GTFS di Google Maps.
- **Komunitas**: tidak ada GTFS atau repo GitHub. Satu-satunya jejak akademik adalah WebGIS 19 halte utama (Politeknik Negeri Batam, ICAE 2022), yang koordinatnya tidak dicetak di paper. Peta Google MyMaps RailTravel Station hanya "estimasi" rute era 2017.

**Cara terbaik menyusun GeoJSON:**
1. **Halte dulu, baru jalur.** Kumpulkan titik halte (survei GPS di lapangan, foto Mapillary, atau klik manual di citra satelit). Untuk tiap halte, simpan sisi jalan (A/B), karena hampir semua halte berpasangan A/B.
2. **Jalur = map-matching dari urutan halte.** Ambil graf jalan dari OSM (query 4 di bawah), lalu rutekan halte demi halte per arah dengan mesin routing open source (OSRM/Valhalla/GraphHopper dengan profil bus/mobil). Simpan hasilnya sebagai satu LineString per arah per koridor. Kalau nanti ada GTFS, tool `pfaedle` (bagian dari ekosistem LOOM) bisa melakukan map-matching otomatis.
3. **Kontribusikan balik ke OSM (opsional tapi ideal):** buat relasi PTv2 (satu relasi per arah plus `route_master`), dengan halte berperan `platform` dan diurutkan sesuai urutan berhenti. Editor Relatify memudahkan penyusunan urutan. Setelah itu, data bisa ditarik ulang otomatis lewat Overpass dan `osmtogeojson`.
4. **Pisahkan geometri dari jadwal.** `routes.geojson` hanya berisi bentuk jalur. Urutan halte di `patterns.json`, jadwal/headway di `service.json`.

## Contoh query Overpass (Kota Batam)

```
/* 1. Semua halte bus di Kota Batam (relasi batas 10660353 → area 3610660353) */
[out:json][timeout:90];
area(3610660353)->.batam;
(
  node["highway"="bus_stop"](area.batam);
  node["public_transport"="platform"]["bus"="yes"](area.batam);
  node["public_transport"="stop_position"]["bus"="yes"](area.batam);
);
out body;
```

```
/* 2. Relasi rute bus (PTv2) beserta anggota & geometri */
[out:json][timeout:120];
area(3610660353)->.batam;
(
  relation["type"="route"]["route"="bus"](area.batam);
  relation["type"="route_master"]["route_master"="bus"](area.batam);
);
out body;
>;
out skel qt;
```

```
/* 3. Cari jejak Trans Batam berdasarkan nama/network/operator */
[out:json][timeout:90];
area(3610660353)->.batam;
(
  nwr["network"~"Trans ?Batam",i](area.batam);
  nwr["operator"~"Trans ?Batam|Dishub",i](area.batam);
  nwr["name"~"Trans ?Batam|Transfer ?point|Halte",i](area.batam);
);
out center tags;
```

```
/* 4. Kerangka jalan utama untuk map-matching jalur koridor */
[out:json][timeout:180];
area(3610660353)->.batam;
way["highway"~"^(trunk|primary|secondary|tertiary)(_link)?$"](area.batam);
out geom;
```

Catatan: kalau `area(3610660353)` kosong, ganti dengan `area["name"="Batam"]["boundary"="administrative"]->.batam;` atau bbox kasar `(0.95,103.85,1.22,104.20)`. Ekspor hasil Overpass Turbo ke GeoJSON, atau konversi dengan `osmtogeojson`.

## Info praktis untuk warga

- **Tarif**: Rp5.000 umum, Rp2.500 pelajar. BatamToday (Paskalis Rianghepat, 3 Juli 2026) menulis tarifnya "Rp 5.000 untuk penumpang umum dan Rp 2.500 bagi pelajar, mahasiswa, serta anak-anak di bawah usia 12 tahun." Tarif ke bandara tidak ada tambahan. Sejak 1 Januari 2023 pembayaran wajib nontunai, jadi artikel 2026 yang masih menyebut "tunai di dalam bus" kemungkinan menyalin template lama. **Jangan tampilkan opsi tunai.**
- **Cara bayar**: kartu BRIZZI (BRI), QRIS (LinkAja, GoPay, DANA, OVO, ShopeePay, AstraPay), dan m-banking. Kerja sama kartu uang elektronik ditandatangani 12 Juli 2024 dengan Bank Mandiri, BRI, BNI, BCA, dan PT Nusantara Global Inovasi. Artinya e-money Mandiri, TapCash BNI, dan Flazz BCA *seharusnya* diterima, tapi sumber berita 2026 hanya konsisten menyebut BRIZZI dan QRIS. Tandai `perlu_cek_ulang`.
- **Transit/pindah koridor**: tidak ditemukan aturan transfer gratis. Pola lama (era tiket kertas) adalah bayar ulang setiap naik bus baru. Asumsikan **tiap naik = satu tarif** sampai ada konfirmasi UPT.
- **Fasilitas halte**: ada dua tipe, *halte bangunan* (atap dan tempat duduk) dan *bus stop* (hanya tiang rambu). Untuk peta, beri simbol berbeda. Bus baru dilengkapi AC, CCTV, dan GPS. Bus tidak boleh mengetem di halte karena operator dibayar per kilometer (skema BTS).
- **Aksesibilitas & layanan khusus**: tidak ditemukan data resmi soal lantai rendah, ramp, tarif lansia, atau layanan disabilitas. Tulis jujur di UI: "Belum ada informasi aksesibilitas resmi".
- **Kontak**: call center Dishub/Trans Batam **0822-8828-6064** (dipublikasikan Media Center Pemkot Batam, Desember 2022, perlu_cek_ulang karena sudah lama).
- **Pelacak bus**: aplikasi SIP TB (Android, Google Play `ngi.muchi.transbatam`) untuk posisi bus, rute, halte terdekat, dan tiket. Untuk K7, UPT juga menyebut aplikasi Mitra Darat. Moovit juga menyediakan perencana perjalanan, tapi datanya usang.
- **Rencana ke depan (bukan layanan aktif)**: lajur khusus BRT bercat merah, feeder pertama pada pertengahan 2027 (Dapur 12–Fanindo, Dapur 12–Pasar Melayu, kawasan Tiban), dan 8 halte baru pada 2026 yang lokasinya belum ditentukan.

## Konektivitas: titik penting dan halte terdekat

| Titik penting | Halte terdekat | Koridor | Status |
|---|---|---|---|
| Pelabuhan Batam Centre (feri internasional) | Transferpoint Batam Center (±240 m dari terminal menurut Moovit) | K1, K2, K5, K6, K7 | perlu_cek_ulang |
| Pelabuhan Sekupang (domestik/internasional) | Transferpoint Sekupang | K1, K3, K4 | perlu_cek_ulang |
| Pelabuhan Harbour Bay | Halte "Harbourbay" (Moovit) | K5 | perlu_cek_ulang (urutan K5 2026 tidak menyebutnya) |
| Pelabuhan Telaga Punggur | Transferpoint Punggur | K8, K9 | perlu_cek_ulang |
| Pelabuhan Nongsa Pura | Pelabuhan Nongsa / Teluk Mata Ikan | K7 (dan ujung K9) | perlu_cek_ulang |
| Pelabuhan Sagulung | Pelabuhan Sagulung | K4 | perlu_cek_ulang |
| Bandara Hang Nadim | Halte pintu kedatangan | K7 | terverifikasi (lokasi deskriptif, koordinat belum) |
| Mega Mall / One Batam Mall | Mega Mall; Masjid Raya A (±108 m dari One Batam Mall menurut Moovit) | K1, K2, K5, K6, K7 | perlu_cek_ulang |
| Grand Mall, Nagoya Hill | Grand Mall, Nagoya Hill | K3 | dari daftar halte |
| DC Mall, Pasar Induk Jodoh | DC Mall, DC Mall SW, Pasar Induk | K3, K5, K8 | dari daftar halte |
| Kepri Mall | Kepri Mall / Kepri Mall B | K2, K6 (K8 lewat Simpang Kepri Mall) | dari daftar halte |
| Panbil Mall & kawasan industri | Panbil Mukakuning; Kawasan Industri Panbil; Best Western Panbil | K2, K6 | dari daftar halte |
| Batamindo/Mukakuning | Pintu 2/3/4 Mukakuning; Villa Mukakuning | K6, K2 | dari daftar halte |
| Kawasan Tanjung Uncang | Hidayatullah (ujung K2) | K2 | perlu_cek_ulang |
| Kawasan Kabil | Kabil Raya, PLTU Tanjung Kasam | K8, K9 | dari daftar halte |
| RS Awal Bros | RS Awal Bros | K1 | dari daftar halte |
| RS BP Batam (Sekupang) | RSBP (rute K4 versi 2022) | K4 | perlu_cek_ulang |
| UIB | UIB A / UIB B | K1, K3 | dari daftar halte |
| Politeknik Negeri Batam | Politeknik / Politeknik B | K2, K6 | dari daftar halte |
| Universitas Batam (Uniba) | Uniba | K7 | dari daftar halte |

## Referensi desain peta transit

**Contoh dan inspirasi:**
- **Transit Maps oleh Cameron Booth** (transitmap.net). Proyek UTA Rail + BRT-nya relevan langsung: koridor BRT digambar *sederhana* di diagram utama, lalu ditautkan ke **inset strip map** yang memuat semua nama halte. Ini solusi ideal untuk Trans Batam, yang koridornya punya 54–78 halte. Booth juga menekankan hierarki informasi yang kuat, penanda transfer yang jelas, dan label horizontal. Peta favoritnya, Stuttgart sekitar tahun 2000, memakai grid isometrik 30°.
- **Strip map Lisbon dan Prague** (diulas di Transit Maps): mengorbankan geografi demi keterbacaan, cocok untuk tampilan per koridor di mobile.
- **TransJakarta**: rujukan lokal untuk sistem penomoran koridor plus warna. Peta resminya padat, jadi ambil logika warna dan kode koridornya, bukan kepadatannya.

**Prinsip desain diagram:**
- Sudut **0°/45°/90°** (oktilinier). Jarak antarhalte dibuat seragam di antara dua halte transfer.
- **Satu warna per koridor**. Ruas berimpit digambar sebagai garis paralel (bukan ditumpuk), urutannya konsisten sepanjang ruas.
- **Halte transfer** = lingkaran/kapsul bergaris tebal yang menghubungkan semua garis. Halte biasa = tick kecil. Terminal = kapsul tebal di ujung.
- **Label horizontal**, satu keluarga huruf. Halte A/B digabung jadi satu nama di diagram (A/B hanya dipakai di peta geografis).
- **Legenda**: warna koridor, simbol transfer, pelabuhan (jangkar), bandara (pesawat), halte bangunan vs tiang, dan garis putus-putus untuk koridor rencana.
- **Hierarki**: koridor aktif tebal, rencana tipis/putus-putus, feri sebagai garis tipis biru-abu ke Singapura/pulau lain (menyambung nuansa peta laut).

**Tools dan library untuk web:**
- **LOOM** (github.com/ad-freiburg/loom, Universitas Freiburg, GPL-3.0): pipeline `topo | loom | octi | transitmap` menghasilkan SVG geografis, oktilinier, atau ortoradial dari GeoJSON atau GTFS. Ada plugin QGIS buatan Transport for Cairo. Cocok untuk menghasilkan **draf** tata letak, lalu dirapikan manual di Figma/Illustrator atau sebagai SVG.
- **transit-map** (github.com/juliuste/transit-map): oktilinier berbasis MIP. Butuh solver Gurobi dan masih berlabel "work in progress". Kurang praktis.
- **SVG manual + D3** untuk interaksi (hover halte, highlight koridor). Untuk 9 koridor, menggambar manual di grid sering lebih cepat dan lebih indah daripada otomatis.
- **MapLibre `line-offset`** untuk layer geografis: offset dalam piksel, konsisten di semua zoom. Kelemahannya, bisa rusak di persimpangan kompleks. Alternatif terbaru: **maplibre-gl-lanes v1.0.0** (rilis September 2026), plugin yang menghitung urutan garis paralel ala LOOM sesuai zoom.

**Usulan palet (selaras peta laut: kertas gading, tinta hampir hitam, biru-abu, terakota, tinta risograph)**

| Elemen | Nama | Hex |
|---|---|---|
| Latar | Kertas gading | #F4EDDC |
| Teks/garis dasar | Tinta hampir hitam | #1C1B19 |
| Laut/feri | Biru-abu | #5B7083 |
| K1 Sekupang–BC | Biru federal (riso) | #2F4C7E |
| K2 T. Uncang–BC | Terakota | #B5532F |
| K3 Sekupang–Jodoh | Teal (riso) | #1F7A74 |
| K4 Sagulung–Sekupang | Emas tua (riso flat gold, digelapkan) | #9A7533 |
| K5 Jodoh–BC | Merah marine (riso) | #C0444F |
| K6 Piayu–BC | Burgundy (riso) | #7A4466 |
| K7 Nongsa–Bandara–BC | Aqua laut | #2E86A8 |
| K8 Punggur–Jodoh | Hijau lumut | #5E7D3A |
| K9 Punggur–Nongsa | Abu baja | #6B7F8E |
| Rencana (K10/feeder) | Garis putus tinta 40% | #1C1B19 @ 40% |

Tips: beri setiap garis *casing* tipis warna kertas (#F4EDDC, 1–1,5 px) supaya garis paralel tetap terpisah. Pastikan kontras grafis minimal 3:1 terhadap latar; warna emas dan abu paling rawan, makanya sudah digelapkan. Efek risograph bisa didapat lewat tekstur noise halus dan *misregistration* 0,5 px, khusus di versi poster/diagram, jangan di peta interaktif.

## Struktur data yang disarankan untuk Claude Code

**File:**
- `corridors.json`: id, nomor, nama, warna, terminal, status (`aktif`/`rencana`), jam, headway, hari, catatan, sumber.
- `stops.geojson`: Point per halte fisik (sisi A dan B dipisah), properti sesuai skema di bawah.
- `stop_groups.json`: mengelompokkan A/B dan halte transfer jadi satu "stasiun" untuk diagram.
- `patterns.json`: urutan halte per koridor **per arah** (karena arah pergi dan balik sering berbeda).
- `routes.geojson`: LineString per koridor per arah (hasil map-matching).
- `service.json`: jam operasi, headway per periode, jeda Jumat, dan hari operasi.
- `schematic.json`: koordinat grid (x, y) untuk diagram, terpisah dari lat/lng.

**Aturan ketidakpastian (berlaku di semua objek):**
- `status_koordinat`: `terverifikasi` (dicek di lapangan atau citra satelit, akurasi ≤15 m) / `perlu_cek_ulang` (dari landmark atau sumber sekunder) / `perlu_diisi_user` (null).
- `status_data`: `terverifikasi` / `perlu_cek_ulang` / `mungkin_usang`, plus `diverifikasi_pada` (tanggal) dan `sumber_url[]`.
- Di UI, halte berstatus selain `terverifikasi` ditampilkan dengan simbol berongga dan tooltip "lokasi perkiraan".

**Seed data JSON** (koordinat = landmark terdekat, bukan halte; semua `perlu_cek_ulang` atau `null`):

```json
{
  "meta": {
    "versi": "2026-11-04",
    "catatan": "Koordinat adalah titik landmark (pelabuhan/mal/kampus), BUKAN posisi halte. Belum ada koordinat halte terverifikasi. Halte dalam 'urutan' yang tidak ada di 'halte' harus dibuat otomatis dengan lat/lng null dan status_koordinat 'perlu_diisi_user'.",
    "status_enum": ["terverifikasi", "perlu_cek_ulang", "perlu_diisi_user"]
  },
  "koridor": [
    {"id":"K1","nama":"Sekupang – Batam Centre","warna":"#2F4C7E","status":"aktif","jam":"05:45-19:00","headway_menit":null,"hari":"setiap hari","jeda_jumat":"perlu_cek_ulang","jumlah_halte_sumber":56,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689482812/jadwal-dan-tarif-trans-batam-rute-sekupang-ke-batam-center-juli-2025","https://id.wikipedia.org/wiki/Trans_Batam"]},
    {"id":"K2","nama":"Tanjung Uncang – Batam Centre","warna":"#B5532F","status":"aktif","jam":"05:45-19:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":78,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689482853/jadwal-dan-tarif-trans-batam-rute-batam-center-ke-tanjung-uncang-juli-2025"]},
    {"id":"K3","nama":"Sekupang – Jodoh","warna":"#1F7A74","status":"aktif","jam":"06:00-19:00","headway_menit":null,"hari":"setiap hari","jeda_jumat":"perlu_cek_ulang","jumlah_halte_sumber":65,"sumber_url":["https://wartajayavision.com/jadwal-trans-batam-rute-sekupang-jodoh-2025-pembayaran-dana/"]},
    {"id":"K4","nama":"Sagulung – Sekupang","warna":"#9A7533","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":69,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689989631/jadwal-dan-tarif-tiket-trans-batam-rute-sagulung-sekupang-februari-2026?page=all"]},
    {"id":"K5","nama":"Jodoh – Batam Centre","warna":"#C0444F","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":{"nilai":[41,65],"status":"perlu_cek_ulang"},"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689553172/jadwal-trans-batam-rute-jodoh-ke-batam-center-agustus-2025-lengkap-tarif-umum-dan-pelajar","https://kepri.pikiran-rakyat.com/kepri/pr-26810369499/bisa-bayar-pakai-brizzi-bri-catat-jadwal-trans-batam-jodoh-batam-center-agustus-2026?page=all"]},
    {"id":"K6","nama":"Tanjung Piayu – Batam Centre","warna":"#7A4466","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":{"nilai":[41,58],"status":"perlu_cek_ulang"},"sumber_url":["https://inspirasitoday.com/ini-jadwal-trans-batam-rute-tanjung-piayu-batam-center-mei-2026/"]},
    {"id":"K7","nama":"Nongsa – Bandara Hang Nadim – Batam Centre","warna":"#2E86A8","status":"aktif","mulai":"2026-07-02","jam":"06:00-19:00","headway_menit":{"pagi_sibuk":20,"siang_sore":30},"armada":"5 + 1 cadangan","hari":"setiap hari","jumlah_halte_sumber":{"nilai":76,"catatan":"sebelum rute bandara"},"sumber_url":["https://batamtoday.com/news/trans-batam-koridor-7-resmi-layani-bandara-hang-nadim-tarif-mulai-rp-2500","https://www.terasbatam.id/mulai-2-juli-trans-batam-resmi-layani-rute-bandara-hang-nadim/","https://inspirasitoday.com/jadwal-trans-batam-rute-nongsa-batam-center-mei-2026/"]},
    {"id":"K8","nama":"Punggur – Jodoh","warna":"#5E7D3A","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":78,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-26810054749/koridor-8-trans-batam-rute-punggur-jodoh-catat-jadwal-maret-2026?page=all"]},
    {"id":"K9","nama":"Punggur – Nongsa","warna":"#6B7F8E","status":"aktif","jam":"06:00-18:00","berangkat_pertama":{"dari_nongsa":"06:00","dari_punggur":"06:40"},"headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":54,"sumber_url":["https://1news.id/54-titik-pemberhentian-rute-trans-batam-punggur-ke-nongsa-oktober-2025/","https://www.batamnews.co.id/berita-126767-jadwal-lengkap-trans-batam-di-9-koridor-dari-sekupang-hingga-punggur-jangan-sampai-ketinggalan.html"]},
    {"id":"K10","nama":"Tembesi – Barelang/Galang","warna":"#1C1B19","status":"rencana","sumber_url":["https://metro.batampos.co.id/13-bus-baru-layani-rute-jodoh-punggur-dan-sekupang-sagulung/"]}
  ],
  "halte": [
    {"id":"tp-batam-center","nama":"Transferpoint Batam Center","koridor":["K1","K2","K5","K6","K7"],"urutan":{"K1":31,"K2":1,"K5":"akhir","K6":27,"K7":"akhir"},"kecamatan":"Batam Kota","alamat":"Jl. Duyung / kawasan Mega Mall–Pelabuhan Batam Centre (perlu_cek_ulang)","lat":1.130856,"lng":104.055225,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik terminal feri, halte ±240 m","sumber_url":"https://en.wikipedia.org/wiki/Batam_Center_Ferry_Terminal"},
    {"id":"tp-sekupang","nama":"Transferpoint Sekupang","koridor":["K1","K3","K4"],"urutan":{"K1":1,"K3":1,"K4":"akhir"},"kecamatan":"Sekupang","alamat":"Pelabuhan Domestik Sekupang","lat":1.13139,"lng":103.92528,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik pelabuhan (BP Batam)","sumber_url":"https://batamport.bpbatam.go.id/sekupang-domestik/"},
    {"id":"tp-jodoh","nama":"Transferpoint Terminal Jodoh","koridor":["K3","K5","K8"],"urutan":{"K3":"akhir","K5":1,"K8":"akhir"},"kecamatan":"Batu Ampar","alamat":"Sungai Jodoh (Waze plus code 42X3+XR8)","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","catatan_koordinat":"landmark dekat: Jodoh Square II 1.1525,104.0036","sumber_url":"https://www.waze.com/live-map/directions/id/riau-islands/trans-batam-jodoh-bus-terminal?to=place.ChIJ-fM5rCeK2TERgyGcNjnZ8NQ"},
    {"id":"tp-punggur","nama":"Transferpoint Punggur","koridor":["K8","K9"],"urutan":{"K8":1,"K9":1},"kecamatan":"Nongsa","alamat":"Pelabuhan Telaga Punggur","lat":1.03523,"lng":104.133397,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"Wikidata; BP Batam memberi 1.1175,104.1683 (konflik ±9 km)","sumber_url":"https://www.wikidata.org/wiki/Q14236384"},
    {"id":"bandara-hang-nadim","nama":"Bandara Hang Nadim (pintu kedatangan)","koridor":["K7"],"urutan":{"K7":"setelah Simpang Bandara (perlu_cek_ulang)"},"kecamatan":"Nongsa","alamat":"Area kedatangan Bandara Internasional Hang Nadim","lat":1.12083,"lng":104.11861,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik referensi bandara","sumber_url":"https://en.wikipedia.org/wiki/Hang_Nadim_International_Airport"},
    {"id":"pelabuhan-nongsa","nama":"Pelabuhan Nongsa","koridor":["K7"],"urutan":{"K7":2},"kecamatan":"Nongsa","alamat":"Nongsa Pura Ferry Terminal","lat":1.188382,"lng":104.094902,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik terminal feri (Wikidata)","sumber_url":"https://www.wikidata.org/wiki/Q12504175"},
    {"id":"teluk-mata-ikan","nama":"Teluk Mata Ikan","koridor":["K7"],"urutan":{"K7":1},"kecamatan":"Nongsa","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://inspirasitoday.com/jadwal-trans-batam-rute-nongsa-batam-center-mei-2026/"},
    {"id":"pelabuhan-sagulung","nama":"Pelabuhan Sagulung","koridor":["K4"],"urutan":{"K4":1},"kecamatan":"Sagulung","alamat":"Pelabuhan Rakyat Sagulung","lat":1.026217,"lng":103.9255162,"status_koordinat":"perlu_cek_ulang","sumber_url":"https://www.waze.com/id/live-map/directions/id/kepulauan-riau/pelabuhan-rakyat-sagulung-batam?to=place.ChIJScMGBvaT2TERTuNEtDjrbXo"},
    {"id":"hidayatullah","nama":"Hidayatullah (A/B)","koridor":["K2","K4"],"urutan":{"K2":"akhir","K4":3},"kecamatan":"Sagulung","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2689482853/jadwal-dan-tarif-trans-batam-rute-batam-center-ke-tanjung-uncang-juli-2025"},
    {"id":"tanjung-piayu-laut","nama":"Tanjung Piayu Laut","koridor":["K6"],"urutan":{"K6":1},"kecamatan":"Sei Beduk","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://inspirasitoday.com/ini-jadwal-trans-batam-rute-tanjung-piayu-batam-center-mei-2026/"},
    {"id":"harbourbay","nama":"Harbourbay","koridor":["K5"],"urutan":{"K5":"perlu_cek_ulang"},"kecamatan":"Batu Ampar","alamat":"Jl. Duyung, Sungai Jodoh","lat":1.15389,"lng":103.99711,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik terminal feri (Wikidata)","sumber_url":"https://www.wikidata.org/wiki/Q65091241"},
    {"id":"kepri-mall","nama":"Kepri Mall (A/B)","koridor":["K2","K6"],"urutan":{"K2":13,"K6":24},"kecamatan":"Batam Kota","alamat":"Jl. Jend. Sudirman","lat":1.10111,"lng":104.03639,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik mal","sumber_url":"https://wikimapia.org/14749451/Kepri-Mall"},
    {"id":"panbil","nama":"Panbil Mukakuning / Kawasan Industri Panbil","koridor":["K2","K6"],"urutan":{"K2":16,"K6":21},"kecamatan":"Sei Beduk","alamat":"Jl. Ahmad Yani, Muka Kuning","lat":1.072,"lng":104.024,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik Panbil Mall","sumber_url":"https://id.wikipedia.org/wiki/Panbil_Mall"},
    {"id":"politeknik","nama":"Politeknik (A/B)","koridor":["K2","K6"],"urutan":{"K2":8,"K6":25},"kecamatan":"Batam Kota","alamat":"Jl. Ahmad Yani, Batam Centre","lat":1.11869,"lng":104.048442,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik kampus Polibatam","sumber_url":"https://www.wikidata.org/wiki/Q12506025"},
    {"id":"mega-mall","nama":"Mega Mall","koridor":["K1","K5"],"urutan":{"K1":30},"kecamatan":"Batam Kota","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2689482812/jadwal-dan-tarif-trans-batam-rute-sekupang-ke-batam-center-juli-2025"},
    {"id":"bundaran-madani","nama":"Bundaran Madani","koridor":["K1","K5"],"urutan":{"K1":24},"kecamatan":"Batam Kota","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2689482812/jadwal-dan-tarif-trans-batam-rute-sekupang-ke-batam-center-juli-2025"},
    {"id":"uib","nama":"UIB (A/B)","koridor":["K1","K3"],"urutan":{"K1":16,"K3":16},"kecamatan":null,"alamat":"Jl. Gajah Mada (perlu_cek_ulang)","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://wartajayavision.com/jadwal-trans-batam-rute-sekupang-jodoh-2025-pembayaran-dana/"},
    {"id":"kabil-raya","nama":"Kabil Raya","koridor":["K8","K9"],"urutan":{"K8":6,"K9":6},"kecamatan":"Nongsa","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://1news.id/54-titik-pemberhentian-rute-trans-batam-punggur-ke-nongsa-oktober-2025/"},
    {"id":"kampung-mangga","nama":"Kampung Mangga","koridor":["K7","K9"],"urutan":{"K7":7,"K9":9},"kecamatan":"Nongsa","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://inspirasitoday.com/jadwal-trans-batam-rute-nongsa-batam-center-mei-2026/"}
  ],
  "urutan_ringkas": {
    "K1_pergi": ["tp-sekupang","taman-palapa","telkom-sekupang","shangrila-a","lampu-merah-patam-lestari","kartini","stc","gor-sekupang-a","mutiara-view","tiban-iii","tiban-raya","taman-sari-a","tiban-center","tiban-ayu-a","tiban-kampung-a","uib","baloi-view","rs-awal-bros","orchid-a","gelael-a","raflesia-a","kawasaki-a","royal-grande","bundaran-madani","kadin","ikan-daun","inko","engku-putri","imigrasi","mega-mall","tp-batam-center"],
    "K6_pergi": ["tanjung-piayu-laut","kampung-jawa","laguna","oleana","bukit-barelang","rhabayu-asri-a","smpn-40","simpang-pancur","pasar-pancur","simpang-bagan","simpang-atb","bidaayu-pintu-3","bidaayu-pintu","smpn-16","bidadari","nusa-indah","bukit-sentosa","pintu-4-mukakuning","pintu-3-mukakuning","pintu-2-mukakuning","panbil","best-western-panbil","stadion-temenggung","kepri-mall","politeknik","masjid-agung","tp-batam-center"],
    "K7_pergi": ["teluk-mata-ikan","pelabuhan-nongsa","turi-beach","polda-kepri","bandoeng-resto","citra-mas","kampung-mangga","kampung-tengah","simpang-ojek","darul-falah","pura-asri","family-garden","pasar-mtc","simpang-bandara","bandara-hang-nadim","dotamana","bida-asri-2","kapita-plaza","botania-2","uniba","mustafa-plaza","kantor-camat-batam-kota","kda","puri-legenda","grand-mas","purimas","gedung-lam","tp-batam-center"],
    "K9_pergi": ["tp-punggur","pltu-tanjung-kasam","tpa","polsek-nongsa","pasar-top-one","kabil-raya","al-munawaroh","bri-batu-besar","kampung-mangga","citra-mas","bandoeng-resto","polda-kepri","kampung-sambau"],
    "catatan": "Urutan K2, K3, K4, K5, K8 ada di tabel laporan; daftar sumber tidak lengkap (ada gap '…'), tandai pola sebagai lengkap=false."
  }
}
```

## Rekomendasi

1. **MVP dalam 2 tahap.** Tahap 1: diagram skematik (tidak butuh koordinat halte, cukup urutan dan hub) plus layer geografis berisi titik hub saja. Tahap 2: halte lengkap dan jalur hasil map-matching setelah survei.
2. **Jadikan Transferpoint Batam Center pusat diagram.** Gambar K1/K5 sebagai garis paralel di ruas Bundaran Madani–Mega Mall, dan K2/K6 paralel di ruas Kepri Mall–Masjid Agung.
3. **Pakai pendekatan "diagram + strip map" ala Cameron Booth.** Diagram utama hanya menampilkan halte transfer dan landmark (pelabuhan, bandara, mal, kampus, kawasan industri). Klik koridor membuka strip map berisi semua halte.
4. **Tampilkan tanggal verifikasi di tiap koridor** ("data per Nov 2026") dan tautan ke SIP TB untuk posisi bus real-time. Jangan menjanjikan jadwal tetap; tampilkan headway.
5. **Jangan gambar K10/feeder sebagai layanan aktif.** Pakai garis putus-putus berlabel "rencana".
6. **Kontribusikan halte hasil survei ke OSM** supaya tahun depan data bisa ditarik otomatis lewat Overpass.

## Caveats

- Hampir semua daftar halte berasal dari media sekunder (Kepri Post, InspirasiToday, Warta Jaya Vision, 1news) yang menyalin data SIP TB atau Dishub dengan format template. Sering ada salah ketik dan daftar yang dipangkas. Akses langsung ke situs Dishub dan aplikasi SIP TB tidak bisa dilakukan dalam riset ini.
- Koordinat di seed JSON **semuanya titik landmark**. Beberapa sumber resmi bahkan saling bertentangan (Telaga Punggur: Wikidata vs BP Batam berbeda ±9 km; Harbour Bay: Wikidata vs Tripadvisor ±1,5 km).
- Angka penumpang tahunan 2.350.305 di infobox Wikipedia diberi label "(2026)", padahal tahun 2026 belum selesai. Kemungkinan salah label; jangan dipakai.
- Jadwal dan frekuensi Moovit kemungkinan usang (penomoran lama, K5 tiap 60 menit). Pakai hanya untuk cek silang.
- Target headway di bawah 10 menit dari penambahan 19 bus adalah target kebijakan, bukan kondisi terukur.

## Daftar halte yang koordinatnya belum pasti (isi sendiri)

Semua halte di bawah berstatus `perlu_diisi_user` (lat/lng = null), kecuali yang diberi tanda **(landmark, perlu_cek_ulang)**.

**K1 Sekupang–Batam Centre:** Transferpoint Sekupang (landmark, perlu_cek_ulang), Taman Palapa, Telkom Sekupang, Shangrila A, Lampu Merah Patam Lestari, Kartini, STC, GOR Sekupang A, Mutiara View, Tiban III, Tiban Raya, Taman Sari A, Tiban Center, Tiban Ayu A, Tiban Kampung A, UIB A, Baloi View, RS Awal Bros, Orchid A, Gelael A, Raflesia A, Kawasaki A, Royal Grande, Bundaran Madani, Kadin, Ikan Daun, INKO, Engku Putri, Imigrasi, Mega Mall, Transferpoint Batam Center (landmark, perlu_cek_ulang); arah balik: Kantor Pos, Harmoni One, Green Land, Yos Sudarso, Kawasaki B, Taman Sari B, Cipta Puri, GOR Sekupang B, Sei Harapan, PCI, plus ±25 halte yang belum tercantum di sumber.

**K2 Tanjung Uncang–Batam Centre:** Kantor Pos, Harmoni One, Ikan Daun, INKO, Masjid Agung, Centro Coffee, Politeknik B (landmark, perlu_cek_ulang), Simpang Frangky B, Anggrek Sari, Simpang Kara B, Plamo, Kepri Mall B (landmark, perlu_cek_ulang), Taman Niaga B, Stadion Temenggung B, Panbil Mukakuning (landmark, perlu_cek_ulang), Top 100 Batuaji B, Simpang Tembesi B, Villa Mukakuning B, Putri Tujuh B, JPO Plaza SP B, Putri Hijau B, Pandawa, Kavling Baru B, Buana Raya, Puskopkar B, Classic B, Kavling Lama B, GOR Batuaji B, Base Camp B, SMPN 9 Batam B, Taman Carina B, JPO PJB B, MTs, Top 100 Regency B, Tunas, Hidayatullah A/B, plus semua halte sisi A dan gap.

**K3 Sekupang–Jodoh:** Taman Kota, Pantai Permata, Baloi Mas, Grand Mall, Pantai Harapan, Harmoni Suites, Nagoya Hill, BRI Nagoya, Transferpoint Terminal Jodoh, Top 100 Jodoh, DC Mall SW, Tanjunguma, DC Mall, Pasar Angkasa B, Pasar Induk, Pacific Hotel, BRI Jodoh B, BCA Jodoh B, BPJS Ketenagakerjaan, Dana Graha, Bank Mandiri, Windsor, Vihara, Penuin, UIB B, Tiban Kampung (B), plus halte yang sama dengan K1 di ruas Sekupang–UIB.

**K4 Sagulung–Sekupang:** Pelabuhan Sagulung (landmark, perlu_cek_ulang), Latrade, Hidayatullah, Masjid Agung Sultan Riayat Syah, Fanindo, Basecamp, Jupiter, Balai Pelatihan Kesehatan, Marina Waterfront, Harris Resort, Tanjung Riau, Sunbread, Sei Harapan, RSBP (perlu_cek_ulang), plus ±55 halte yang belum tercantum.

**K5 Jodoh–Batam Centre:** Top 100 Jodoh, Pasar Angkasa, DC Mall SW, Pacific Hotel, Polsek Batu Ampar, Monte Siena (A/2), Bengkong Garama / Garama 2, Melchem 2, Tg Sengkuang, Lurah Sengkuang, TVS 2, Sindo 2, Batu Ampar, Harbourbay (landmark, perlu_cek_ulang), Damkar Sei Panas A/B, Bank Riau Kepri A/B, Raflesia A/B, Kawasaki A/B, Royal Grande, Bundaran Madani, Kadin, Ikan Daun, Inko, Engku Putri, Imigrasi, Mega Mall, Kantor Pos, Harmoni One.

**K6 Tanjung Piayu–Batam Centre:** Tanjung Piayu Laut, Kampung Jawa, Laguna, Oleana, Bukit Barelang, Rhabayu Asri A, SMPN 40, Simpang Pancur, Pasar Pancur, Simpang Bagan, Simpang ATB, Bidaayu Pintu 3, Bidaayu Pintu, SMPN 16, Bidadari, Nusa Indah, Bukit Sentosa, Pintu 4 Mukakuning, Pintu 3 Mukakuning, Pintu 2 Mukakuning, Kawasan Industri Panbil (landmark, perlu_cek_ulang), Best Western Panbil, Stadion Temenggung, Kepri Mall (landmark, perlu_cek_ulang), Politeknik (landmark, perlu_cek_ulang), Masjid Agung.

**K7 Nongsa–Bandara–Batam Centre:** Teluk Mata Ikan, Pelabuhan Nongsa (landmark, perlu_cek_ulang), Turi Beach, Polda Kepri, Bandoeng Resto, Citra Mas, Kampung Mangga, Kampung Tengah, Simpang Ojek, Darul Falah, Pura Asri, Family Garden, Pasar MTC, Simpang Bandara, Bandara Hang Nadim pintu kedatangan (landmark, perlu_cek_ulang), Dotamana, Bida Asri 2, Kapita Plaza, Botania 2, Uniba, Mustafa Plaza, Kantor Camat Batam Kota, KDA, Puri Legenda, Grand Mas, Purimas, Gedung LAM.

**K8 Punggur–Jodoh:** Transferpoint Punggur (landmark, perlu_cek_ulang, sumber konflik), PLTU Tanjung Kasam, TPA, Polsek Nongsa, Pasar Top One, Kabil Raya, Pasar Angkasa, Terminal Jodoh, plus ±70 halte via Simpang Kepri Mall–Simpang Jam–Baloi–DC Mall yang belum tercantum.

**K9 Punggur–Nongsa:** Transferpoint Punggur (landmark, perlu_cek_ulang), PLTU Tanjung Kasam, TPA, Polsek Nongsa, Pasar Top One, Kabil Raya, Al Munawaroh, BRI Batu Besar, Kampung Mangga, Citra Mas, Bandoeng Resto, Polda Kepri, Kampung Sambau, plus ±40 halte yang belum tercantum hingga ujung Nongsa.

## Daftar sumber
- batamtoday — https://batamtoday.com/news/trans-batam-koridor-7-resmi-layani-bandara-hang-nadim-tarif-mulai-rp-2500
- moovitapp — https://moovitapp.com/index/en/public_transit-One_Batam_Mall-Batam-site_218776077-5423
- moovitapp — https://moovitapp.com/index/en/public_transit-Halte_Tranfer_Point_Batam_Center-Batam-site_204685611-5423
- Wikipedia — https://id.wikipedia.org/wiki/Trans_Batam
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-2689304264/trans-batam-rute-sekupang-batam-center-jadwal-dan-info-terbaru-mei-2025?page=all
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-2689315111/trans-batam-rute-sagulung-sekupang-jadwal-dan-info-terbaru-mei-2025
- batampos — https://metro.batampos.co.id/13-bus-baru-layani-rute-jodoh-punggur-dan-sekupang-sagulung/
- ulasan — https://ulasan.co/batam-siapkan-lajur-khusus-trans-batam-bercat-merah-dan-feeder-mulai-2027/
- rri — https://rri.co.id/batam/regional/2535691/trans-batam-mulai-layani-bandara-hang-nadim-pemko-uji-coba-koridor-baru
- inspirasitoday — https://inspirasitoday.com/jadwal-trans-batam-rute-nongsa-batam-center-mei-2026/
- moovitapp — https://moovitapp.com/index/en/public_transit-lines-Batam-5423-1141210
- antaranews — https://kepri.antaranews.com/berita/128765/pemkot-hadirkan-aplikasi-sip-trans-batam-berikan-kemudahan-bagi-masyarakat
- google — https://play.google.com/store/apps/details?id=ngi.muchi.transbatam&hl=en_US
- softonic — https://sip-tb.en.softonic.com/android
- tribunnews — https://batam.tribunnews.com/kota-batam/687761/bandara-hang-nadim-batam-kini-terhubung-bus-trans-batam-simak-jadwal-dan-tarifnya
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-26810046276/koridor-2-trans-batam-rute-batam-center-tanjung-uncang-catat-jadwal-maret-2026
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-26810112616/jadwal-trans-batam-rute-sekupang-jodoh-april-2026-bisa-bayar-pakai-dana?page=all
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-2689989631/jadwal-dan-tarif-tiket-trans-batam-rute-sagulung-sekupang-februari-2026?page=all
- inspirasitoday — https://inspirasitoday.com/inilah-jadwal-dan-tarif-tiket-trans-batam-rute-sekupang-ke-batam-center-sepanjang-februari-2026/
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-2689553172/jadwal-trans-batam-rute-jodoh-ke-batam-center-agustus-2025-lengkap-tarif-umum-dan-pelajar
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-26810369499/bisa-bayar-pakai-brizzi-bri-catat-jadwal-trans-batam-jodoh-batam-center-agustus-2026?page=all
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-26810054749/koridor-8-trans-batam-rute-punggur-jodoh-catat-jadwal-maret-2026?page=all
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-26810255750/trans-batam-punggur-jodoh-juni-2026-cek-jadwal-rute-dan-tarif-tiket
- railtravelstation — https://railtravelstation.com/trans-batam/
- moovitapp — https://moovitapp.com/index/in/Tranportasi_Umum-lines-Batam-5423-1141210
- kompas — https://www.kompas.id/artikel/trans-batam-anomali-di-kota-surga-kendaraan-pribadi
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-26810054765/koridor-9-trans-batam-rute-punggur-nongsa-catat-jadwal-maret-2026?page=all
- 1news — https://1news.id/54-titik-pemberhentian-rute-trans-batam-punggur-ke-nongsa-oktober-2025/
- moovitapp — https://moovitapp.com/index/id/Tranportasi_Umum-time-kor_3-Batam-5423-1141210-708467-6909640-0
- moovitapp — https://moovitapp.com/index/en/public_transit-time-kor_1-Batam-5423-1141210-708465-6909636-0
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-2689482853/jadwal-dan-tarif-trans-batam-rute-batam-center-ke-tanjung-uncang-juli-2025
- moovitapp — https://moovitapp.com/index/en/public_transit-line-kor_2-Batam-5423-1141210-708466-0
- wartajayavision — https://wartajayavision.com/jadwal-trans-batam-rute-sekupang-jodoh-2025-pembayaran-dana/
- batamnews — https://www.batamnews.co.id/berita-92057-info-terbaru-jadwal-dan-harga-tiket-bus-trans-batam-seluruh-rute.html
- moovitapp — https://moovitapp.com/index/en/public_transit-line-kor_5-Batam-5423-1141210-136320273-1
- moovitapp — https://moovitapp.com/index/en/public_transit-line-kor_5-Batam-5423-1141210-136320273-0
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-26810114754/jadwal-trans-batam-rute-punggur-jodoh-april-2026-bisa-bayar-pakai-dana
- openstreetmap — https://www.openstreetmap.org/node/506735403
- openstreetmap — https://www.openstreetmap.org/way/55925612/history
- openstreetmap — https://www.openstreetmap.org/relation/15412932/history/
- eudl — https://eudl.eu/pdf/10.4108/eai.5-10-2022.2329499
- uni-freiburg — https://ad-publications.cs.uni-freiburg.de/smw-brosi.pdf
- openstreetmap — https://wiki.openstreetmap.org/wiki/Tag:route=bus
- openstreetmap — https://wiki.openstreetmap.org/wiki/Buses
- openstreetmap — https://wiki.openstreetmap.org/wiki/Relatify
- inspirasitoday — https://inspirasitoday.com/ini-jadwal-trans-batam-rute-tanjung-piayu-batam-center-mei-2026/
- batampos — https://metropolis.batampos.co.id/trans-batam-segera-layani-rute-bandara-hang-nadim-tarif-tetap-rp5-ribu/
- terasbatam — https://www.terasbatam.id/mulai-2-juli-trans-batam-resmi-layani-rute-bandara-hang-nadim/
- batam — https://mediacenter.batam.go.id/2022/12/15/bus-trans-batam-akan-menerapkan-pembayaran-non-tunai-tahun-2023/
- moovitapp — https://moovitapp.com/index/en/public_transit-line-kor_1-Batam-5423-1141210-708465-0
- terasbatam — https://www.terasbatam.id/trans-batam-siapkan-lajur-khusus-dan-10-koridor/
- batampos — https://metropolis.batampos.co.id/trans-batam-resmi-masuk-bandara-hang-nadim-ini-penampakan-bus-dan-rute-yang-dilalui/
- transitmap — https://transitmap.net/uta-2023cameron-booth/
- Gizmodo — https://gizmodo.com/how-to-design-the-perfect-subway-map-1543146718
- transitmap — https://transitmap.net/author/transit-maps/page/127/
- github — https://github.com/transportforcairo/loom_qgis
- github — https://github.com/ad-freiburg/loom
- github — https://github.com/juliuste/transit-map/
- dev — https://dev.to/geoapify-maps-api/how-to-visualize-multiple-overlapping-routes-on-a-maplibre-gl-map-2om9
- nuxx — https://nuxx.net/blog/2026/09/27/maplibre-gl-lanes-v1-0-0/
