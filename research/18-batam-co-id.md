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

## Tidak disarankan

- Promosi properti, sponsor, dan TaPitch: situs kita non-komersial.
- Jadwal bioskop dan loker yang ditarik dari situs lain: risiko syarat pakai sumbernya. Info Loker kita diisi lewat dashboard.

## Yang kita punya dan mereka tidak

Radar hujan, tinggi gelombang dan peringatan dini, gempa, peta CCTV, peta jaringan Trans Batam per koridor, pompong, sejarah dan kampung tua, kamus, nama jalan, 938 dataset, infografik, Standar Redaksi dan Log Koreksi, tanpa iklan.

## Mirip dengan yang sedang kita bangun

Beranda mereka memuat keberangkatan feri berikutnya dan "Kata Anak Batam". Modul beranda kita (Feri ke Singapura, Kata Hari Ini) dibangun dari data sendiri dan hanya memakai jadwal yang tidak diragukan.
