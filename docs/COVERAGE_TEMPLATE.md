# COVERAGE (templat)

Salin file ini menjadi `docs/COVERAGE.md` di repo website, lalu isi selama bekerja.

Aturan:
- Setiap baris adalah satu bagian laporan riset (judul bagian asli). Di bawah tiap bagian, **pecah menjadi sub-butir untuk setiap temuan, rekomendasi, tabel, atau daftar** yang ada di bagian itu. Judul saja tidak cukup.
- Tandai `[x] <route/komponen/file>` kalau diterapkan, `[-] <alasan>` kalau sengaja tidak/ditunda (alasan harus spesifik, misalnya "butuh ilustrasi dari pemilik proyek"), atau biarkan `[ ]` kalau belum.
- Bagian yang murni konteks (misalnya metodologi atau daftar sumber) tetap ditandai `[-] konteks, tidak perlu fitur`.
- Selesai = tidak ada `[ ]` tersisa, termasuk di bagian "File data" di bawah.

## Peleburan situs lama (CLAUDE_CODE_PROMPT bagian 4.0; rinci di docs/PARITAS.md)

- [ ] hujandibatam: semua fitur di daftar paritas berjalan di /langit-laut
- [ ] hujandibatam: semua aturan kejujuran (proksi MSS, Langsung/Tertunda/Terputus, frame 404, OFS basi, cek playlist CCTV, tanpa autoplay massal) dipertahankan
- [ ] hujandibatam: uji paritas visual radar & ombak (situs lama vs baru) lulus
- [ ] batam-bites: semua fitur di daftar paritas berjalan di /makan
- [ ] batam-bites: data dipindah ke data/makan/, konversi ke data/places/17-batam-bites.json, kategori `kuliner` ditambahkan
- [ ] batam-bites: 117 koordinat perkiraan ditandai perlu_cek_ulang dan masuk CSV koordinat
- [ ] Widget silang (hujan per kecamatan di kartu, berteduh terdekat, feri terakhir di detail makan, Hari Ini, mural)
- [ ] Batas kecamatan BIG dari hujandibatam dipakai ulang (lisensi dicatat)
- [ ] Atribusi gabungan di footer/kolofon
- [ ] Peta redirect 301 + sw.js pengganti siap (eksekusi hanya setelah izin pemilik proyek)

## 00-keputusan-percakapan.md

- [ ] 00 › 1. Identitas proyek
- [ ] 00 › 2. Nada & estetika (keputusan user, tegas)
- [ ] 00 › 3. Struktur menu "Loket"
- [ ] 00 › 4. Tukang Langganan (keputusan user)
- [ ] 00 › 5. Direktori: kategori yang diminta user (semua wajib ada)
- [ ] 00 › 6. Data hotel dari user
- [ ] 00 › 7. Koordinat
- [ ] 00 › 8. Hal yang ditunda / belum diriset
- [ ] 00 › 9. Hasil riset kecil di chat (tidak ada di laporan lain)
  - [ ] 00 › 9.1 Situs indie kota lain yang disebut (inspirasi, selain laporan 01)
  - [ ] 00 › 9.2 Konsep peta (disepakati sebelum riset gaya)
  - [ ] 00 › 9.3 Konsep mural (disepakati)
  - [ ] 00 › 9.4 Catatan riset sumber data yang dilakukan di chat (pelengkap; jangan bangun ulang fitur cuaca)
  - [ ] 00 › 9.5 Sumber geoportal yang diberikan user

## 01-inspirasi-konsep.md

- [ ] 01 › Batam City Hall: Riset Contoh Website Kota, Direktori Hyperlocal & Konsep Lengkap
- [ ] 01 › TL;DR
- [ ] 01 › Key Findings
- [ ] 01 › Details
  - [ ] 01 › 1. Contoh website kota/area yang bagus
  - [ ] 01 › 2. Contoh direktori rekomendasi layanan hyperlocal
  - [ ] 01 › 3. Fitur umum dan unik di website kota (selain cuaca, ombak, CCTV, kuliner)
  - [ ] 01 › 4. Konteks Batam yang bisa jadi bahan fitur
- [ ] 01 › Konsep Lengkap "Batam City Hall"
  - [ ] 01 › Visi & tone
  - [ ] 01 › Struktur menu ("Loket")
  - [ ] 01 › Daftar fitur per kelompok
  - [ ] 01 › Cara menggabungkan hujandibatam & batam-bites
  - [ ] 01 › Konsep visual
  - [ ] 01 › Crowdsourcing Tukang Langganan & cara menjaga kualitas
  - [ ] 01 › Tech stack & sumber data
  - [ ] 01 › Roadmap realistis untuk developer solo
- [ ] 01 › Recommendations
- [ ] 01 › Caveats

## 02-teknik-mural-peta.md

- [ ] 02 › Batam City Hall: Riset Teknik Mural Interaktif & Peta Artsy (bahan prompt Claude Code)
- [ ] 02 › TL;DR
- [ ] 02 › Key Findings
- [ ] 02 › 1. Bagaimana proyek sejenis dibuat
  - [ ] 02 › Isometric NYC: contoh terbaik yang terdokumentasi
  - [ ] 02 › Mural Tokyo Skytree (teamLab): inspirasi Mural Jakarta
  - [ ] 02 › Mural Jakarta (jakarta.oyenza.com)
- [ ] 02 › 2. Perbandingan library gambar raksasa
  - [ ] 02 › Membuat tile
  - [ ] 02 › Hosting
- [ ] 02 › 3. Georeferensi ilustrasi non-ortografis
- [ ] 02 › 4. Overlay hidup
  - [ ] 02 › Hujan yang dibatasi poligon
  - [ ] 02 › Ombak dengan intensitas variabel
  - [ ] 02 › Kapal feri sesuai jadwal
  - [ ] 02 › Siang–senja–malam
  - [ ] 02 › prefers-reduced-motion & anggaran performa
- [ ] 02 › 5. Hotspot & permainan mencari
  - [ ] 02 › Penyimpanan anotasi
  - [ ] 02 › Area klik presisi
  - [ ] 02 › Aksesibilitas
  - [ ] 02 › Link per titik yang bisa dibagikan
  - [ ] 02 › Hidden-object game
- [ ] 02 › 6. Alur produksi ilustrasi untuk dev solo
  - [ ] 02 › Opsi A: Ilustrator lokal (direkomendasikan untuk landmark + kunci gaya)
  - [ ] 02 › Opsi B: AI per tile dari render peta (gaya Isometric NYC)
  - [ ] 02 › Opsi C: Hibrida (rekomendasi)
  - [ ] 02 › Pendekatan hibrida paling murah: peta chart + sketsa landmark
- [ ] 02 › 7. Styling MapLibre bergaya nautical chart
  - [ ] 02 › Contoh style yang ada
  - [ ] 02 › Resep "Chart Batam"
  - [ ] 02 › Kontur kedalaman dari GEBCO
- [ ] 02 › 8. Rekomendasi akhir: arsitektur & MVP bertahap
  - [ ] 02 › Stack
  - [ ] 02 › Struktur folder
  - [ ] 02 › Jalur MVP bertahap (dev solo, perkiraan kasar, ASUMSI)
- [ ] 02 › Caveats

## 03-landmark-jalur-mural.md

- [ ] 03 › Batam City Hall — Seed Data & Brief Ilustrator: Jalur Cerita Mural "Utara ke Selatan"
- [ ] 03 › TL;DR
- [ ] 03 › Legenda status
- [ ] 03 › Key Findings
- [ ] 03 › Tabel Segmen Jalur Cerita
- [ ] 03 › Segmen 1 — Sekupang & Belakang Padang
- [ ] 03 › Segmen 2 — Harbour Bay–Nagoya–Jodoh
- [ ] 03 › Segmen 3 — Batam Centre
- [ ] 03 › Segmen 4 — Nongsa & Hang Nadim
- [ ] 03 › Segmen 5 — Koridor Industri (Mukakuning–Batu Aji–Sagulung–Tanjung Uncang)
- [ ] 03 › Segmen 6 — Barelang 1–4
- [ ] 03 › Segmen 7 — Rempang
- [ ] 03 › Segmen 8 — Galang & Galang Baru
- [ ] 03 › Daftar Prioritas Ikon Mode Peta (urut dari paling ikonik)
- [ ] 03 › Catatan Topik Sensitif
- [ ] 03 › Caveats
- [ ] 03 › Seed Data (JSON)

## 04-kampung-tua.md

- [ ] 04 › Peta Kampung Tua Batam: Riset Konten & Seed Data untuk "Batam City Hall"
- [ ] 04 › TL;DR
- [ ] 04 › 1. Kenapa jumlahnya beda-beda? (dan mana yang dipegang)
- [ ] 04 › 2. Tabel kampung tua per kecamatan
  - [ ] 04 › Kecamatan Nongsa (14 titik)
  - [ ] 04 › Kecamatan Bengkong (2)
  - [ ] 04 › Kecamatan Batu Ampar (4)
  - [ ] 04 › Kecamatan Batam Kota (1) dan Lubuk Baja (1)
  - [ ] 04 › Kecamatan Sekupang (3–4)
  - [ ] 04 › Kecamatan Sagulung (6) dan Batu Aji (1)
  - [ ] 04 › Kecamatan Sei Beduk (3)
  - [ ] 04 › Kecamatan Galang: Pulau Rempang–Galang (16 kampung versi Ombudsman RI)
  - [ ] 04 › Hinterland (Belakang Padang, Bulang): belum ada daftar terbuka
- [ ] 04 › 3. Profil kampung tua yang paling terdokumentasi
  - [ ] 04 › 1) Nongsa Pantai: "kampung asal" Hari Jadi Batam
  - [ ] 04 › 2) Batu Besar & Kampung Melayu: dari "Lagorap" ke kopra
  - [ ] 04 › 3) Tanjung Bemban: kampung legenda
  - [ ] 04 › 4) Tanjung Uma: "tanah bertuah" di depan Jodoh
  - [ ] 04 › 5) Tanjung Riau: pelantar yang jadi ruang publik
  - [ ] 04 › 6) Bagan: masjid tua dan makam tetua
  - [ ] 04 › 7) Tanjung Piayu Laut: ujung selatan, wisata kuliner laut
  - [ ] 04 › 8) Teluk Mata Ikan: pantai kelapa di Nongsa
  - [ ] 04 › 9) Panau: nama dari panau
  - [ ] 04 › 10) Batu Merah & Sei Tering: Melcem
  - [ ] 04 › 11) Pulau Bulang Lintang (hinterland): pusat Temenggung
  - [ ] 04 › 12) Sembulang (Rempang): ringkas dan hati-hati
  - [ ] 04 › Toponim lama yang sering disebut "kampung tua" tapi tidak ada di daftar 37
- [ ] 04 › 4. Status legalitas: ringkasan netral & bertanggal
- [ ] 04 › 5. Arsip, foto lama, dan narasumber untuk diajak kolaborasi
- [ ] 04 › 6. Panduan etika penyajian
- [ ] 04 › 7. Seed data JSON
- [ ] 04 › Caveats

## 05-panduan-gaya.md

- [ ] 05 › Batam City Hall: Panduan Gaya & Design Tokens "Peta Laut"
- [ ] 05 › TL;DR
- [ ] 05 › Ringkasan arah visual
- [ ] 05 › 1. Referensi peta laut & peta lama
  - [ ] 05 › Sumber utama dan status lisensi
  - [ ] 05 › Elemen yang bisa dipinjam (dan cara menerjemahkannya)
- [ ] 05 › 2. Estetika Melayu & Kepri tanpa kitsch
  - [ ] 05 › Motif
  - [ ] 05 › Huruf Jawi Riau-Lingga
  - [ ] 05 › Perahu & arsitektur
- [ ] 05 › 3. Tipografi
  - [ ] 05 › Pasangan yang direkomendasikan
  - [ ] 05 › Matriks pemeriksaan
  - [ ] 05 › Catatan MapLibre (penting untuk Claude Code)
  - [ ] 05 › Skala tipografi
- [ ] 05 › 4. Warna
  - [ ] 05 › Tinta Riso sebagai jangkar
  - [ ] 05 › Palet UI, mode siang
  - [ ] 05 › Palet UI, mode "chart malam"
  - [ ] 05 › Layer peta
- [ ] 05 › 5. Tekstur & efek cetak
- [ ] 05 › 6. Gaya ilustrasi & ikon
  - [ ] 05 › Aturan garis [A]
  - [ ] 05 › Cara menggambar
  - [ ] 05 › Ilustrator yang bisa diajak bicara
- [ ] 05 › 7. Referensi website premium & pola yang ditiru
  - [ ] 05 › Pola konkret untuk komponen [A]
- [ ] 05 › 8. Logo & wordmark "Batam City Hall"
- [ ] 05 › 9. Nada tulisan (microcopy)
  - [ ] 05 › Prinsip [A]
  - [ ] 05 › Contoh pola
  - [ ] 05 › Daftar hindari
- [ ] 05 › Moodboard (link referensi, dikelompokkan)
- [ ] 05 › Design tokens
  - [ ] 05 › CSS custom properties
  - [ ] 05 › Versi JSON
- [ ] 05 › Boleh & Jangan
  - [ ] 05 › Desain
  - [ ] 05 › Tulisan
- [ ] 05 › Caveats: terverifikasi vs asumsi

## 06-direktori-taksonomi.md

- [ ] 06 › Batam City Hall: Rancangan Direktori & Seed Data
- [ ] 06 › TL;DR
- [ ] 06 › Key Findings
- [ ] 06 › Tabel Taksonomi Lengkap
- [ ] 06 › Detail per Kelompok Kategori
  - [ ] 06 › 1. Belanja
  - [ ] 06 › 2. Ruang Publik, Wisata, Pantai
  - [ ] 06 › 3. Ibadah dan Pemakaman
  - [ ] 06 › 4. Transportasi
  - [ ] 06 › 5. Kesehatan
  - [ ] 06 › 6. Pendidikan
  - [ ] 06 › 7. Pemerintahan dan Layanan Publik
  - [ ] 06 › 8. Akomodasi
  - [ ] 06 › 9. Olahraga
  - [ ] 06 › 10. Jasa dan Servis
  - [ ] 06 › 11. Khas Batam
- [ ] 06 › Rekomendasi Cara Pengisian
- [ ] 06 › Skema Database Terpadu
- [ ] 06 › Contoh Query Overpass API
- [ ] 06 › Caveats
- [ ] 06 › Seed Data (JSON)
- [ ] 06 › Daftar Tempat yang Koordinatnya Belum Pasti

## 07-direktori-layanan-publik.md

- [ ] 07 › Seed Data Tambahan "Batam City Hall": Layanan Publik, Kesehatan, Ibadah, Olahraga, Transportasi & Ruang Publik
- [ ] 07 › TL;DR
- [ ] 07 › Ringkasan Singkat
- [ ] 07 › 1. Pemerintahan & Layanan Publik
  - [ ] 07 › 1a. 12 Kantor Kecamatan
  - [ ] 07 › 1b. 64 Kelurahan (daftar resmi Kemendagri)
  - [ ] 07 › 1c. Kantor Layanan Publik Utama
  - [ ] 07 › 1d. Polsek (di bawah Polresta Barelang)
  - [ ] 07 › 1e. Pemadam Kebakaran
- [ ] 07 › 2. Perpustakaan
- [ ] 07 › 3. Kesehatan
  - [ ] 07 › 3a. 21 Puskesmas
  - [ ] 07 › 3b. 21 Rumah Sakit (kode Kemenkes, via S29)
- [ ] 07 › 4. Ibadah & Pemakaman
- [ ] 07 › 5. Olahraga
- [ ] 07 › 6. Jasa & Servis
- [ ] 07 › 7. Transportasi
- [ ] 07 › 8. Ruang Publik
- [ ] 07 › Rekomendasi untuk Claude Code
- [ ] 07 › Data JSON
- [ ] 07 › Daftar Tempat yang Koordinatnya Belum Pasti (untuk diisi user)

## 08-ppat-notaris-hukum.md

- [ ] 08 › Direktori Profesi & Jasa Administrasi Kota Batam: Seed Data PPAT, Notaris, Lahan, Bantuan Hukum, dan Jasa Dokumen
- [ ] 08 › TL;DR
- [ ] 08 › Ringkasan praktis: urusan tanah/rumah di Batam, ke mana untuk apa?
- [ ] 08 › Key Findings
- [ ] 08 › Details per kategori
  - [ ] 08 › A. Pertanahan, lahan, dan perizinan (simpul resmi)
  - [ ] 08 › B. PPAT dan Notaris (sampel, semua perlu cek ulang)
  - [ ] 08 › C. Bantuan hukum dan profesi hukum
  - [ ] 08 › D. Jasa dokumen, pajak, penilai, dan usaha
- [ ] 08 › Skema data per kategori (usulan)
- [ ] 08 › Recommendations
- [ ] 08 › Caveats
- [ ] 08 › Data JSON (seed)
- [ ] 08 › Daftar entri yang koordinatnya belum pasti (semua perlu diisi user)

## 09-direktori-celah.md

- [ ] 09 › Seed Data Tambahan Batam City Hall: Layanan Publik, Kesehatan, Ibadah, dan Transportasi (Riset Celah, November 2026)
- [ ] 09 › TL;DR
- [ ] 09 › Ringkasan singkat
- [ ] 09 › Key Findings dan Tabel per Kategori
  - [ ] 09 › A. Layanan Publik dan Pemerintahan
  - [ ] 09 › B. Kesehatan Pelengkap
  - [ ] 09 › C. Ibadah dan Makam
  - [ ] 09 › D. Transportasi
  - [ ] 09 › E. Nomor Darurat dan Pengaduan (non-lokasi, tanpa titik peta)
- [ ] 09 › Data JSON
- [ ] 09 › Caveats
- [ ] 09 › Daftar Entri dengan Koordinat Belum Pasti (per kategori)

## 10-trans-batam.md

- [ ] 10 › Peta Bus Trans Batam: Riset Data dan Desain untuk Batam City Hall (per 4 November 2026)
- [ ] 10 › TL;DR
- [ ] 10 › Ringkasan singkat
- [ ] 10 › Key Findings
- [ ] 10 › Tabel koridor (status per November 2026)
- [ ] 10 › Tabel halte per koridor (berurutan)
  - [ ] 10 › K1 Sekupang → Batam Centre (sumber: Kepri Post Mei/Juli 2025; 31 dari 56 halte)
  - [ ] 10 › K2 Batam Centre → Tanjung Uncang (sumber: Kepri Post Juli 2025; daftar ada gap; total 78)
  - [ ] 10 › K3 Sekupang → Jodoh (sumber: Warta Jaya Vision, Desember 2025; total 65)
  - [ ] 10 › K4 Sagulung → Sekupang (sumber: Kepri Post Februari 2026; daftar ringkas, total 69)
  - [ ] 10 › K5 Jodoh ↔ Batam Centre (sumber: Kepri Post Agustus 2025/2026 + Moovit)
  - [ ] 10 › K6 Tanjung Piayu → Batam Centre (sumber: InspirasiToday Mei 2026; 27 nama)
  - [ ] 10 › K7 Nongsa → Bandara Hang Nadim → Batam Centre (sumber: InspirasiToday Mei 2026 + berita Juli 2026)
  - [ ] 10 › K8 Punggur → Jodoh (sumber: Kepri Post Maret–April 2026; daftar sangat ringkas, total 78)
  - [ ] 10 › K9 Punggur → Nongsa (sumber: 1news.id Oktober 2025, Kepri Post Maret 2026; total 54)
  - [ ] 10 › Halte transit/persinggungan utama
- [ ] 10 › Data geometri rute
- [ ] 10 › Contoh query Overpass (Kota Batam)
- [ ] 10 › Info praktis untuk warga
- [ ] 10 › Konektivitas: titik penting dan halte terdekat
- [ ] 10 › Referensi desain peta transit
- [ ] 10 › Struktur data yang disarankan untuk Claude Code
- [ ] 10 › Rekomendasi
- [ ] 10 › Caveats
- [ ] 10 › Daftar halte yang koordinatnya belum pasti (isi sendiri)

## 11-geoportal.md

- [ ] 11 › Batam City Hall: Audit Data Geoportal HANG JEBAT, BP Batam, dan Ina-Geoportal (BIG)
- [ ] 11 › TL;DR
- [ ] 11 › Key Findings
- [ ] 11 › Details
  - [ ] 11 › 1. HANG JEBAT Geoportal (Disperkimtan Kota Batam)
  - [ ] 11 › 2. Geoportal BP Batam ("Satu Peta Batam")
  - [ ] 11 › 3. Ina-Geoportal (BIG): `tanahair.indonesia.go.id`
  - [ ] 11 › 4. Sumber alternatif resmi dan pembanding
  - [ ] 11 › 5. Halte dan rute Trans Batam: titik paling kosong
  - [ ] 11 › 6. Lisensi dan kompatibilitas dengan OSM (ODbL)
- [ ] 11 › Daftar Endpoint Teknis
- [ ] 11 › Recommendations: langkah pengambilan data (berurutan)
- [ ] 11 › Caveats

## 12-ruang-publik-olahraga-jasa.md

- [ ] 12 › Seed Data Direktori Batam City Hall: Ruang Publik, Wisata, Olahraga, Belanja, dan Jasa (riset per 4 November 2026)
- [ ] 12 › TL;DR
- [ ] 12 › Key Findings
- [ ] 12 › Details
  - [ ] 12 › A. Ruang publik dan wisata
  - [ ] 12 › B. Olahraga
  - [ ] 12 › C. Belanja kebutuhan sehari-hari
  - [ ] 12 › D. Jasa dan servis yang terdaftar publik
  - [ ] 12 › E. Tag OpenStreetMap dan sumber data terbaik per kategori
- [ ] 12 › Recommendations
- [ ] 12 › Caveats
- [ ] 12 › Data JSON
- [ ] 12 › Daftar Entri yang Koordinatnya Belum Pasti

## 13-budaya-kalender-kamus.md

- [ ] 13 › Loket Cerita & Budaya Batam: Kalender Acara, Budaya Melayu, Kamus Mini, Komunitas & Fakta Infografis (riset per November 2026)
- [ ] 13 › TL;DR
- [ ] 13 › 1. Kalender Acara Tahunan Batam (fokus 2024–2026)
  - [ ] 13 › Januari
  - [ ] 13 › Februari
  - [ ] 13 › Maret
  - [ ] 13 › April–Mei
  - [ ] 13 › Juni–Juli
  - [ ] 13 › Agustus
  - [ ] 13 › September
  - [ ] 13 › Oktober
  - [ ] 13 › November
  - [ ] 13 › Desember
- [ ] 13 › 2. Budaya Melayu Kepri untuk Warga Batam
- [ ] 13 › 3. Kamus Mini Batam (65 entri)
- [ ] 13 › 4. Komunitas Kreatif & Budaya Calon Kolaborator
- [ ] 13 › 5. Fakta & Angka untuk Infografis
  - [ ] 13 › Sejarah pembangunan (timeline)
  - [ ] 13 › Penduduk & agama
  - [ ] 13 › Wisatawan mancanegara
  - [ ] 13 › Geografi
- [ ] 13 › Caveats
- [ ] 13 › Blok Data JSON
  - [ ] 13 › acara.json
  - [ ] 13 › kamus.json

## 14-feri-pompong.md

- [ ] 14 › Data Loket Langit & Laut + Loket Jalan-jalan: Feri, RoRo, dan Pompong dari Batam (data per 4 November 2026)
- [ ] 14 › TL;DR
- [ ] 14 › Key Findings
- [ ] 14 › Details
  - [ ] 14 › 1. Feri internasional Batam–Singapura
    - [ ] 14 › Tabel operator dan rute
    - [ ] 14 › Tabel jadwal (tanggal data ditulis per baris; jadwal bisa berubah tanpa pemberitahuan)
  - [ ] 14 › 2. Feri internasional Batam–Malaysia
  - [ ] 14 › 3. Feri dan kapal domestik dari Batam
  - [ ] 14 › 4. Pompong dan pancung ke pulau hinterland
  - [ ] 14 › 5. Info praktis menyeberang
  - [ ] 14 › 6. Data geometri rute untuk peta
- [ ] 14 › Recommendations
- [ ] 14 › Caveats
- [ ] 14 › Blok data JSON
  - [ ] 14 › (a) Terminal dan pelantar
  - [ ] 14 › (b) Rute
  - [ ] 14 › (c) Contoh jadwal
- [ ] 14 › Daftar terminal dan pelantar yang koordinatnya belum pasti (untuk diisi user)

## 15-sejarah-arsip.md

- [ ] 15 › Sejarah Batam: Riset Garis Waktu, Asal Nama, Perubahan Kota, Arsip Foto, dan Data Infografis (untuk Batam City Hall)
- [ ] 15 › TL;DR
- [ ] 15 › Key Findings
- [ ] 15 › 1. Garis Waktu Sejarah Batam
- [ ] 15 › 2. Asal-Usul Nama "Batam" dan Nama Tempat
- [ ] 15 › 3. Perubahan Fisik Kota untuk Fitur "Batam Dulu vs Sekarang"
- [ ] 15 › 4. Sumber Arsip Foto dan Peta
- [ ] 15 › 5. Bacaan Lanjutan
- [ ] 15 › 6. Data untuk Infografis
  - [ ] 15 › Penduduk
  - [ ] 15 › Luas wilayah, lahan, dan investasi
  - [ ] 15 › Wisatawan mancanegara (BPS Kota Batam)
- [ ] 15 › Caveats
- [ ] 15 › Blok Data JSON

## 16-tokoh-nama-jalan.md

- [ ] 16 › Siapa di Balik Nama Jalan: Tokoh-Tokoh yang Namanya Dipakai di Kota Batam
- [ ] 16 › TL;DR
- [ ] 16 › Ringkasan singkat
- [ ] 16 › Tabel inventaris
- [ ] 16 › Profil tokoh (format kartu)
  - [ ] 16 › (a) Tokoh Melayu Riau-Lingga, Johor, Malaka, dan Riau daratan
  - [ ] 16 › (b) Tokoh hikayat/legenda
  - [ ] 16 › (c) Pahlawan nasional dan tokoh nasional (ringkas)
  - [ ] 16 › (d) Tokoh pembangunan Batam
  - [ ] 16 › (e) Tokoh lokal/adat
- [ ] 16 › Hubungan antartokoh
- [ ] 16 › Penamaan resmi (konteks singkat)
- [ ] 16 › Bacaan lanjutan
- [ ] 16 › Caveats
- [ ] 16 › Blok data JSON

## File data (setiap file wajib dipakai atau dijelaskan)

- [ ] `data/akomodasi/hotel.csv`
- [ ] `data/budaya/acara.json`
- [ ] `data/budaya/budaya_melayu.md`
- [ ] `data/budaya/fakta_infografis.json`
- [ ] `data/budaya/kamus.json`
- [ ] `data/budaya/komunitas.json`
- [ ] `data/budaya/tradisi_melayu.json`
- [ ] `data/darurat/nomor_darurat.json`
- [ ] `data/darurat/nomor_darurat_09.json`
- [ ] `data/design/boleh_jangan.md`
- [ ] `data/design/design_tokens.css`
- [ ] `data/design/design_tokens.json`
- [ ] `data/design/layer_peta_warna.json`
- [ ] `data/design/microcopy.json`
- [ ] `data/design/moodboard.md`
- [ ] `data/design/palet_ui.json`
- [ ] `data/design/tinta_riso.json`
- [ ] `data/design/tipografi_skala.json`
- [ ] `data/feri/info_praktis.md`
- [ ] `data/feri/jadwal.json`
- [ ] `data/feri/rute.json`
- [ ] `data/feri/terminal.json`
- [ ] `data/kampung_tua/kampung_tua.json`
- [ ] `data/kampung_tua/kronologi_legalitas.json`
- [ ] `data/kampung_tua/narasumber_arsip.md`
- [ ] `data/kampung_tua/panduan_etika.md`
- [ ] `data/kampung_tua/sumber_jumlah.json`
- [ ] `data/komunitas/sumber_rekomendasi_warga.json`
- [ ] `data/koordinat_perlu_diisi.csv`
- [ ] `data/koordinat_user.json`
- [ ] `data/mural/elemen_tabel_tanpa_seed.json`
- [ ] `data/mural/ikon_prioritas.json`
- [ ] `data/mural/landmarks.json`
- [ ] `data/mural/segmen.json`
- [ ] `data/mural/topik_sensitif.md`
- [ ] `data/osm/overpass/06-a_kesehatan.overpassql`
- [ ] `data/osm/overpass/06-b_belanja.overpassql`
- [ ] `data/osm/overpass/06-c_transportasi.overpassql`
- [ ] `data/osm/overpass/06-d_olahraga_ibadah_makam.overpassql`
- [ ] `data/osm/overpass/06-e_hitung_kelengkapan.overpassql`
- [ ] `data/osm/overpass/10-halte-bus.overpassql`
- [ ] `data/osm/overpass/10-jalan-utama-map-matching.overpassql`
- [ ] `data/osm/overpass/10-jejak-trans-batam.overpassql`
- [ ] `data/osm/overpass/10-relasi-rute-bus-ptv2.overpassql`
- [ ] `data/osm/overpass/14-jalur-feri.overpassql`
- [ ] `data/osm/overpass/14-terminal-dan-pelantar.overpassql`
- [ ] `data/panduan/09-nomor_darurat.json`
- [ ] `data/panduan/09-rute_pompong.json`
- [ ] `data/panduan/cara_verifikasi_profesi.md`
- [ ] `data/panduan/urusan_tanah.json`
- [ ] `data/panduan/urusan_tanah.md`
- [ ] `data/places.json`
- [ ] `data/places_id_index.json`
- [ ] `data/places_konflik.json`
- [ ] `data/places_stats.json`
- [ ] `data/referensi/direktori_hyperlocal.json`
- [ ] `data/referensi/perbandingan_library_mural.json`
- [ ] `data/referensi/temuan_kunci_mural.json`
- [ ] `data/referensi/website_inspirasi.json`
- [ ] `data/schema/tempat.sql`
- [ ] `data/sejarah/asal_usul_nama.md`
- [ ] `data/sejarah/bacaan_lanjutan.md`
- [ ] `data/sejarah/data_penduduk.json`
- [ ] `data/sejarah/data_wisman.json`
- [ ] `data/sejarah/garis_waktu.json`
- [ ] `data/sejarah/perubahan_fisik.json`
- [ ] `data/sejarah/sumber_arsip.json`
- [ ] `data/snippets/02-teknik-mural-peta/1-bash.txt`
- [ ] `data/snippets/02-teknik-mural-peta/2-ts.txt`
- [ ] `data/snippets/02-teknik-mural-peta/3-ts.txt`
- [ ] `data/snippets/02-teknik-mural-peta/4-ts.txt`
- [ ] `data/snippets/02-teknik-mural-peta/5-bash.txt`
- [ ] `data/snippets/02-teknik-mural-peta/6-struktur-folder.txt`
- [ ] `data/snippets/11-geoportal/1.txt`
- [ ] `data/snippets/11-geoportal/2.txt`
- [ ] `data/snippets/11-geoportal/3.txt`
- [ ] `data/snippets/11-geoportal/4.txt`
- [ ] `data/snippets/11-geoportal/5.txt`
- [ ] `data/statistik/angka_resmi.json`
- [ ] `data/sumber_data/endpoint.json`
- [ ] `data/sumber_data/geoportal.json`
- [ ] `data/taksonomi/12-sumber_dan_tag_osm.json`
- [ ] `data/taksonomi/skema_profesi.json`
- [ ] `data/taksonomi/taksonomi.json`
- [ ] `data/tokoh/penamaan.json`
- [ ] `data/tokoh/profil_tokoh.md`
- [ ] `data/tokoh/relasi.json`
- [ ] `data/tokoh/tokoh.json`
- [ ] `data/trans_batam/desain_peta.md`
- [ ] `data/trans_batam/halte.json`
- [ ] `data/trans_batam/halte_koordinat_perlu_diisi.csv`
- [ ] `data/trans_batam/info_praktis.json`
- [ ] `data/trans_batam/koridor.json`
- [ ] `data/wilayah/kelurahan.json`
- [ ] `data/places/*.json` (17 file per laporan; sumber `places.json`, dipakai lewat `places.json`)
- [ ] `data/raw/*.json` (blok JSON verbatim; cek tidak ada isi yang hilang dibanding file domain)
- [ ] `data/logs/*.md` (baca bagian "tidak bisa dipetakan" di setiap log dan tangani)
