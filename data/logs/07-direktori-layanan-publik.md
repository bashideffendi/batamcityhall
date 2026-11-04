# Log migrasi: 07-direktori-layanan-publik

- task_id: `wf-c0d3f7b7-b11a-5eb3-8473-ac2bed4b91cd`
- Judul: Seed Data Tambahan Batam City Hall: Layanan Publik, Kesehatan, Ibadah, Olahraga, Transportasi dan Ruang Publik
- Laporan `truncated: false`; 11 sumber di `sources` + 54 kode sumber S1–S54 di dalam teks.

## Ringkasan angka
- Blok ```json: **1** → `data/raw/07-direktori-layanan-publik__1.json` (127 objek, valid, tanpa perbaikan).
- Tempat (`data/places/07-direktori-layanan-publik.json`): **212**
  - 127 dari blok JSON, digabung dengan baris tabel 1a, 1c, 1d, 1e, 2, 3a, 3b, 4, 5, 7, 8 (satu entri per tempat; polsek dan pos damkar yang ada di tabel dan JSON hanya muncul sekali).
  - 21 dari baris tabel/prosa yang tidak punya versi JSON: Pojok Perpustakaan MPP, Pura Satya Dharma, Pura Sekupang, DPRD Kota Batam, RS Awal Bros Batu Aji, 11 venue padel (10 dari baris "Padel lain di AYO" + Rally Padel dari prosa), Pulau Belakang Padang, Taman Dang Anom, Taman Kolam, Taman Mini, Taman Rusa.
  - 64 kantor kelurahan dari tabel 1b, sesuai instruksi laporan ("buat 64 entri `kantor_kelurahan` … alamat null, lat/lng null, perlu_diisi_user, sumber_url S1"). Nama dibentuk "Kantor Kelurahan <nama>", id `kel-<slug>`.
  - Kategori: pemerintahan 84 (termasuk 64 kelurahan), kesehatan 43, keamanan_darurat 24, olahraga 17, transportasi 10, layanan_publik 8, pemakaman 7, ruang_publik 5, pertanahan_hukum 4, perpustakaan 4, ibadah 4, landmark 1, wisata 1.
  - status_koordinat: terverifikasi 5 (Batam Centre, Harbour Bay, Telaga Punggur, Hang Nadim, Jembatan Barelang 1), perlu_cek_ulang 5, perlu_diisi_user 202.
  - status_data: perlu_cek_ulang 25, null 187.

## File yang dibuat
- `research/07-direktori-layanan-publik.md`: salinan verbatim + `## Daftar sumber` (11 item `sources`).
- `data/raw/07-direktori-layanan-publik__1.json`: blok JSON verbatim.
- `data/places/07-direktori-layanan-publik.json`: 212 tempat.
- `data/wilayah/kelurahan.json`: 12 kecamatan + kode Kemendagri + 64 kelurahan, format `[{"kecamatan","kode","kelurahan":[...]}]`, urutan dan ejaan sama dengan tabel 1b.
- `data/darurat/nomor_darurat.json`: 112, 113; call center Damkar BP Batam 0811-6060-113, PLN 123, MPP (0778) 468278, Air Batam Hilir (0778) 5700 000 (dari laporan 06, ditandai); 10 unit damkar dan 14 unit polisi (Polresta + 13 polsek), masing-masing satu entri dengan `tempat_id`; kutipan armada damkar BP Batam; peringatan situs damkarbatam.com palsu.
- Tambahan ke `data/statistik/angka_resmi.json` (file domain laporan 06), ditandai `sumber_riset: 07-…`: armada damkar BP Batam, usulan TPU baru 2023 (6 lokasi, 148 ha) dan 2025 (5 lokasi, ~122,31 ha), jumlah lapangan padel (3 per Des 2025, ≥15 venue di AYO Nov 2026).

## Keputusan normalisasi
- **Kategori diganti** (asli di `atribut.kategori_asli`): `keamanan` (bukan enum) → `keamanan_darurat` (24); PN, PA, Kejari, BPN → `pertanahan_hukum` (4); Jembatan Barelang 1 `ruang_publik` → `landmark` (1).
- **Kontak** dipecah dari string JSON: email → `kontak.email`, "WA …" → `kontak.whatsapp`, "CC 123" → `atribut.call_center`, sisanya → `kontak.telepon`. WA PA Batam (0812-6658-8031) dari tabel 1c.
- **jam_layanan non-jam dipindah ke atribut**: "Reservasi via HGAT BP Batam"/"Booking via AYO" → `atribut.booking`; daftar layanan Gerai Disdukcapil → `atribut.layanan` (versi tabel yang lebih lengkap di `atribut.layanan_tabel`). "IGD 24 jam" tetap di `jam_layanan` + `atribut.igd_24jam: true`.
- **Dari tabel ke atribut**: tipe RS (verbatim, mis. "A (beberapa sumber menyebut B)"), rawat inap puskesmas (`rawat_inap` true/false/null + `rawat_inap_label` verbatim), pengelola damkar (Pemko/BP Batam), pengelola dan biaya gali tutup TPU, kapasitas stadion, cabang olahraga GOR, harga dan jumlah lapangan padel, plus code Tamora, tarif/waktu tempuh/pengelola pompong, tanggal MPP, alamat lama PLN Tiban dan Dispusip.
- **sumber_url**: URL JSON + semua kode S dari kolom sumber tabel, diselesaikan ke URL lewat daftar "Daftar Sumber (kode)".
- **Alamat**: placeholder "perlu cek" → `null` (teks asli di `catatan`), kecuali Polsek Sagulung yang memakai alamat tabel "Jl. R. Suprapto (perlu cek)" karena lebih lengkap dari JSON.
- **status_data `perlu_cek_ulang`** hanya untuk entri yang ditandai laporan: 10 kantor camat ber-alamat 2009 (S3), DPMPTSP, PLN Nagoya, BPJS Kesehatan (blog 2018), Polsek Sagulung/Belakang Padang/KKP, Puskesmas Tanjung Buntung dan Lubuk Baja, RS Awal Bros (konflik tipe), Stadion TAJ (konflik kapasitas), TPU Kavling Bagan, dan entri tambahan yang "belum terverifikasi" (Pura Satya Dharma, Pura Sekupang, DPRD, RS Awal Bros Batu Aji).
- **Kecamatan ragu → null + catatan**: Polsek KKP (tabel "Batu Ampar/Batam Kota"), TPU Kavling Bagan, Pura Satya Dharma, venue padel AYO, 4 taman, RS Awal Bros Batu Aji (nama menyiratkan Batu Aji tetapi tidak disebut). Jembatan Barelang 1 tetap Bulang (JSON) dengan catatan tabel "Galang/Bulang (perbatasan)". Puskesmas Sei Panas tetap Bengkong (per Komdat), dicatat.
- **Kelurahan** tidak perlu diturunkan dari alamat (0 entri); semua nilai kelurahan JSON lolos cek terhadap daftar resmi.
- **catatan_koordinat**: sumber koordinat per entri (Wikidata, Waze, TripAdvisor, batamgems), peringatan koordinat BP Batam yang salah untuk Nongsapura/Telaga Punggur, titik kasar ShipNext Waterfront City (sengaja tidak dimasukkan), dan rentang perkiraan pelantar pancung Sekupang (tidak dimasukkan ke lat/lng).

## Masalah dan konflik yang perlu diketahui
- **Konflik koordinat Telaga Punggur dengan laporan 06** (06: BP Batam 1.1175, 104.1683; 07: Wikidata 1.035230, 104.133397 terverifikasi, BP Batam "jelas salah"). Wajib dicek sebelum dirender.
- Harbour Bay: laporan ini memakai Mapcarta N703813600 sebagai pembanding, sedangkan laporan 06 menyebut node itu `place=locality`, bukan gedung terminal.
- Konflik dalam laporan: tanggal operasional MPP (7 Desember 2017 vs 27 November 2017), kapasitas Stadion TAJ (10.000 vs 2.800), tipe RS Awal Bros (A vs B), alamat Puskesmas Lubuk Baja (Jl. Duyung vs Baloi Centre). Semua dicatat di `catatan`.
- Status koordinat Perpustakaan Keliling di tabel "null (bergerak)"; di places tetap `perlu_diisi_user` (aturan spesifikasi), dengan catatan bahwa tidak perlu titik.
- Data polsek dari kompilasi 2020; tidak ditandai perlu cek kecuali yang alamatnya "perlu cek".

## Tidak dipetakan ke places (tetap ada di `research/07-direktori-layanan-publik.md`)
- Baris kolektif tanpa tempat spesifik: "Kantor Pos Batam (utama & cabang)", "KUA per kecamatan (12)", "Terminal bus antarkota", "Padel lain di AYO" sebagai baris (sudah dipecah per venue), "pantai dan RTH lainnya", klinik 24 jam/lab/apotek 24 jam, gereja per denominasi, klenteng, TMP, SPBU, dan seluruh kategori jasa (laporan menyatakan belum ada data).
- Usulan lokasi TPU baru (Sei Temiang 55 ha, Tiban Lama 20 ha, Tanjungpiayu 23 ha, Tembesi 10 ha, Sambau 33 ha, Sekanak 7 ha) tidak dijadikan tempat karena laporan melarang menampilkannya sebagai TPU beroperasi; angkanya ada di `angka_resmi.json`.
- Rekomendasi untuk Claude Code (jangan render entri ber-koordinat null di peta, badge "lokasi belum diisi", prioritas isi manual) dan saran sumber komunitas untuk Tukang Langganan berupa prosa.
