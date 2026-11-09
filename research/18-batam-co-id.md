# batam.co.id: perbandingan fitur

Ditelusuri 9 November 2026 atas permintaan pemilik ("coba selami semua fiturnya, ada ngga yg bisa kita tiru yg kita gapunya"). Yang dibaca: beranda, Terdekat, Kualitas Udara, Kurs, Jadwal Sholat, Bioskop, Trip Batam, Hari Besar, Tentang, Aplikasi, Expats, PLN Batam, Cuaca, Pelabuhan, Event, Loker.

## Gambaran

Portal informasi komersial (sponsor, promosi properti, layanan talenta TaPitch). Isinya artikel panduan bertanda tangan "Redaksi", alat interaktif, dan data harian yang diperbarui otomatis. Direktori usaha sekitar 6.300 entri (2.505 bertitik di halaman Terdekat), jam buka dan telepon dari Google Maps. Ada aplikasi Android (APK dan Google Play), notifikasi lewat Telegram ("Kabari"), versi bahasa Inggris untuk pengunjung dari Singapura, dan mesin pencari sendiri.

## Fitur yang belum kita punya

| Fitur | Sumber data mereka | Catatan untuk kita |
|---|---|---|
| Kualitas udara (AQI sekarang, perkiraan 24 jam, saran aktivitas) | Open-Meteo, model Copernicus CAMS, tiap 3 jam | Sumber terbuka tanpa kunci, bukan pemerintah. Cocok di Cuaca dan kotak Hari Ini. |
| Kurs SGD, USD, MYR dengan kalkulator dan riwayat 30 hari | Kurs tengah Bank Indonesia | Pemilik meminta pemerintah tidak disebut; alternatif kurs acuan ECB (mencakup IDR). Perlu keputusan pemilik. |
| Jadwal salat dengan hitung mundur, jadwal Jumat | Kemenag (Bimas Islam) | Bisa dihitung sendiri dengan kriteria yang dipakai di Indonesia, atau memakai sumber Kemenag bila pemilik setuju. |
| Libur nasional dan cuti bersama | SKB 3 Menteri | Data tahunan, sekali susun. |
| Terdekat dari lokasi (jarak garis lurus, perkiraan menit motor, buka sekarang) | Direktori sendiri, dihitung di HP | Kita punya tombol "Di sekitar saya" di peta; bisa jadi halaman sendiri dari data tempat kita. |
| Prakiraan per jam 24 jam dan 7 hari (suhu, peluang hujan, UV) | Open-Meteo | Kita punya prakiraan BMKG 3-jaman 3 hari dan radar. |
| Layanan sehari-hari: listrik, air, kode pos, UMK, harga BBM, SKCK, sekolah negeri, kantor lurah | Situs resmi, dicek bertanggal | Sebagian ada di Layanan Warga. Perlu data terverifikasi; aturan PEDOMAN 2.9 (tanpa tautan pemerintah) tetap berlaku. |
| Trip Batam: itinerary per hari dari asal, minat, tanggal; tiga kelas biaya | Direktori sendiri, OpenStreetMap, jadwal feri | Fitur besar. Perlu keputusan pemilik. |
| Panduan bahasa Inggris untuk pengunjung dan ekspatriat | Tulisan sendiri | Pemilik memutuskan hanya Bahasa Indonesia yang tampil (koreksi rombak menu butir 3). |
| Notifikasi Telegram dan aplikasi Android | — | Kita sudah PWA (`app/manifest.ts`). |
| Tombol "Apakah halaman ini membantu?" | — | Butuh basis data (Supabase belum tersambung). |

## Sumber data tempat (dicek 9 November 2026)

Pemilik meminta direktori selengkap batam.co.id (hotel, makanan, sekolah, dan lainnya). Pilihan sumbernya:

| Sumber | Isi untuk Batam | Boleh dipakai? | Catatan |
|---|---|---|---|
| Overture Maps Places, rilis 2026-10-21.0 | 20.654 tempat; 7.297 berkeyakinan 0,7 ke atas (1.564 di atas 0,9); 72% bertelepon, 30% bersitus web. Keyakinan 0,7 ke atas: restoran 691, hotel 349, sekolah dan tempat belajar sekitar 240, rumah sakit 100, kafe 142, bank 153, tempat ibadah 587 | Ya. CDLA-Permissive-2.0 (sebagian Apache-2.0 dan CC0), boleh di peta kita, kredit di Kolofon | Hampir semuanya dari halaman bisnis Facebook (Meta): ada yang sudah tutup, ganda, atau titiknya kasar; status buka hampir selalu kosong; tanpa jam buka dan rating. Perlu saringan dan label lokasi belum dicek. Diambil gratis tanpa kunci dari penyimpanan terbuka Overture. |
| OpenStreetMap | Sekitar 2.000 titik usaha dan fasilitas (hitungan awal; server Overpass penuh saat dicek) | Ya, ODbL, sudah dipakai untuk peta | Lebih sedikit, mutu dijaga relawan. |
| Foursquare Open Source Places | Belum dihitung | Ya, Apache-2.0 | Sekarang hanya di Hugging Face dan butuh akun gratis yang menyetujui syaratnya: tindakan pemilik. |
| Google Places API (resmi) | Paling lengkap: jam buka, rating, telepon | Bersyarat. Pasal 14 Service Specific Terms: boleh tanpa peta Google, tetapi dilarang dipakai bersama peta non-Google (peta kita OSM), koordinat hanya boleh disimpan 30 hari | Butuh akun Google Cloud dan kartu pemilik; berbayar di atas kuota gratis; wajib atribusi Google. |
| Menarik langsung dari Google Maps (scrape) | Sama lengkapnya | Melanggar syarat Google (larangan menyalin dan mengekspor konten) | Risiko diblokir atau ditegur, data tidak boleh diterbitkan ulang. Tidak disarankan; bila tetap dipilih, itu keputusan pemilik. |

## Tidak disarankan

- Promosi properti, sponsor, dan TaPitch: situs kita non-komersial.
- Jadwal bioskop dan loker yang ditarik dari situs lain: risiko syarat pakai sumbernya. Info Loker kita diisi lewat dashboard.

## Yang kita punya dan mereka tidak

Radar hujan, tinggi gelombang dan peringatan dini, gempa, peta CCTV, peta jaringan Trans Batam per koridor, pompong, sejarah dan kampung tua, kamus, nama jalan, 938 dataset, infografik, Standar Redaksi dan Log Koreksi, tanpa iklan.

## Mirip dengan yang sedang kita bangun

Beranda mereka memuat keberangkatan feri berikutnya dan "Kata Anak Batam". Modul beranda kita (Feri ke Singapura, Kata Hari Ini) dibangun dari data sendiri dan hanya memakai jadwal yang tidak diragukan.
