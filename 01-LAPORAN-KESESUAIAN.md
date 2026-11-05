# Batam City Hall: laporan kesesuaian dengan brief

Disusun 5 November 2026 oleh Claude Code untuk ditinjau Claude Research. Laporan ini ditulis oleh pihak yang mengerjakan, jadi baca sebagai klaim yang perlu dicek, bukan bukti.

- **Repo publik:** https://github.com/bashideffendi/batamcityhall, cabang `fase-1-fondasi`, commit terakhir `e30ba62`
- **Status:** fase 1 sampai 10 selesai menurut `docs/PLAN.md`. **Belum di-deploy.** Situs lama (hujandibatam, batam-bites) tidak disentuh.
- **Spesifikasi acuan:** `CLAUDE_CODE_PROMPT.md` (prompt utama), `research/00-keputusan-percakapan.md` (keputusan pemilik, menang bila konflik), `research/01` sampai `16`, dan ringkasannya di `docs/brief/NN.md`.

## 1. Cara screenshot diambil

- Build produksi (`next build` + `next start`) di kontainer cloud, 5 Nov 2026 sekitar pukul 09.40 WIB.
- Data langsung **asli**, bukan tiruan: radar MSS, kondisi NEA, prakiraan dan perairan BMKG (header jujur, tanpa menyamar), CCTV Pemko, dan 6 feed RSS.
- Peta dasar: ekstrak Protomaps build 20261103, 15.477 tile, 46 MB.
- `02-galeri-desktop.pdf`: 63 halaman pada 1440 px, plus 3 halaman versi malam (beranda, Langit & Laut, mural).
- `03-galeri-hp.pdf`: 63 halaman pada 390 px.
- Halaman yang sangat panjang dipotong pada 6.000 px. Keterangannya ada di pita judul tiap halaman PDF.
- Halaman 63 sengaja membuka alamat yang tidak ada, untuk memperlihatkan halaman 404.

## 2. Pemeriksaan otomatis hari ini

| Pemeriksaan | Hasil 5 Nov 2026 |
|---|---|
| Validasi data zod (prebuild) | lulus |
| `next build` | lulus |
| TypeScript `tsc --noEmit` | 0 galat |
| ESLint | 0 temuan |
| Tes unit (Vitest) | 535/535 lulus, 18 berkas |
| Tes e2e + axe (Playwright, desktop dan HP) | 666 lulus, 29 dilewati, 1 gagal dari 696. Yang gagal: `mural.spec.ts:307` "tombol tenang menghentikan loop", hanya di profil HP, konsisten 3/3. Diukur terpisah: setelah tombol ditekan, penghitung gambar berhenti total selama 8 detik di HP dan desktop. Kesimpulan sementara: tes mengklik terlalu cepat sehingga animasi awal viewport OpenSeadragon masih memicu gambar ulang. Ini soal waktu di tes, belum dibetulkan. (Tes dijalankan dengan Chromium bawaan cloud, karena browser versi proyek tidak terpasang.) |
| Lighthouse (dari fase 10, 4 Nov) | Aksesibilitas dan SEO 100 di 6 halaman. Performa 85 sampai 88; beranda 56 karena peta WebGL dirender tanpa GPU. Belum diuji di HP asli. |

## 3. Kesesuaian per bagian 4 prompt (kriteria ✔)

Status: **✔** terpenuhi · **◐** terpenuhi sebagian, ada syarat · **✘** tidak dibuat

| Bagian | Kriteria ✔ di prompt | Status | Catatan dan screenshot |
|---|---|---|---|
| 4.0 Peleburan | `PARITAS.md` seluruhnya ✔ | ◐ | Semua butir ✔, kecuali satu ◐: tombol bahasa hanya ada di Makan. Uji paritas visual dibandingkan dengan kode lama yang dijalankan lokal, karena kedua situs lama membalas HTTP 402 sejak 4 Nov 2026. Radar lewat route same-origin karena MSS tidak mengizinkan CORS. Mask daratan memakai `earth` Protomaps, bukan CircleGeo. Redirect 301 + `sw.js` pengganti sudah siap, belum dijalankan (menunggu izin). Screenshot 02 sampai 13. |
| 4.1 Beranda | peta terkunci, lapisan, kartu museum, `?tempat=`, OG per tempat | ✔ | Kotak Hari Ini: hujan, ombak, peringatan, feri terakhir. OG ada di `/info/tempat/[id]`, bukan di `/?tempat=`, supaya beranda tetap statis. Ditambah pencarian dan "Di sekitarku". Screenshot 01. |
| 4.2 Direktori | jumlah per kategori = `places_stats.json` | ✔ | 892 tempat, 22 kategori, dites otomatis. Subkategori kosong tampil "Belum ada data". Hotel 243, 33 tanpa kecamatan tampil "belum diketahui". Tanpa data pajak. Rating disembunyikan. Screenshot 37 sampai 47. |
| 4.3 Tukang | alur kirim, moderasi, tampil end-to-end | ◐ | Aturan ≥2 perekomendasi dan persetujuan moderator teruji di **mode contoh** saja. Migrasi Supabase **belum pernah dijalankan** di Postgres sungguhan. Tidak ada data awal. Screenshot 14, 15, 62. |
| 4.4 Trans Batam | tiap koridor punya halaman, jalur di peta (bila geometri ada), diagram | ◐ | 10 halaman koridor dengan diagram skematik SVG. Jalur geografis **hanya Koridor 1**, dari relasi OSM (fase 9, membantah riset 10 yang menyebut belum ada). 0 dari 191 halte berkoordinat terverifikasi. Gap halte ditandai garis putus. Screenshot 17 sampai 19. |
| 4.5 Feri & pompong | feri terakhir per rute; tanpa jadwal tampil "belum tersedia" | ✔ | Jebakan data dari brief 14 dites unit. Zona waktu Asia/Jakarta. Screenshot 20 sampai 22. |
| 4.6 Cerita & Budaya | semua item di file data tampil | ✔ | Dites otomatis terhadap file data: 56 kartu kampung tua, 46 kartu tokoh. **Belum ada foto lama yang tampil**; semua lewat tautan arsip, karena izin belum ada. Rempang dan legalitas kampung tua masih **draf, belum dibaca pemilik**. Screenshot 23 sampai 36. |
| 4.7 Mural | satu segmen penuh dengan placeholder dan data hidup | ◐ | Segmen yang dipilih **Harbour Bay–Nagoya–Jodoh, bukan Barelang** (alasan di `docs/MURAL.md`). Quest 6 jembatan diganti "Jejak pusat niaga", karena jembatan IV sampai VI ada di segmen lain. Pipeline `vips dzsave` → R2 belum pernah dijalankan. Screenshot 53 sampai 55. |
| 4.8 Berita | ≥3 feed terbukti valid | ✔ | 6 feed: Batam Pos, Antara Kepri, GoWest, GoKepri, Ulasan.co, Media Center Pemko. Hanya judul, sumber, waktu, dan tautan. Screenshot 48. |
| 4.9 Main-main | quest, kartu pos, vibe map aman | ✔ | Vibe hanya "ngopi" dan "macet" dari data yang ada, tanpa kiriman warga. Kartu pos digambar di browser. Screenshot 49 sampai 52. |
| 4.10 Halaman pendukung | Tentang, Kolofon, Kontribusi, Koreksi, Privasi, Syarat, 404 | ✔ | Privasi dan Syarat berlabel "draf, belum ditinjau ahli hukum". Screenshot 56 sampai 61, 63. |

## 4. Definisi selesai (bagian 11 prompt)

| Syarat | Status |
|---|---|
| Semua fitur bagian 4 ✔ dan `PARITAS.md` ✔ | ◐ Lihat tabel di atas: 4.0, 4.3, 4.4, dan 4.7 bersyarat. |
| `COVERAGE.md` mencakup 00–16 tanpa `[ ]` | ✔ secara format: 1.139 `[x]`, 513 `[-]`, 0 `[ ]`. **Peringatan:** sebagian baris diklasifikasi tiga subagen dengan memeriksa kode, belum dicek ulang satu per satu (catatan sendiri di CHANGELOG fase 10). |
| Semua data di `data/` terpakai atau dijelaskan | ✔ bagian "File data" di COVERAGE: 55 dipakai, 42 dijelaskan. |
| Celah yang diketahui di README paket | ✔ ditangani atau masuk `docs/TODO_PEMILIK.md`. |
| Build, lint, unit, e2e, axe lulus | Lihat bagian 2. |
| README menjelaskan cara menjalankan, menambah data, impor koordinat, tarik OSM, buat tile mural | ✔ |

## 5. Cakupan per laporan riset (dihitung dari `docs/COVERAGE.md`)

`[x]` = diterapkan · `[-]` = sengaja tidak atau ditunda, dengan alasan.

| Laporan | [x] | [-] | Catatan |
|---|---:|---:|---|
| 00 keputusan | 10 | 4 | |
| 01 inspirasi | 58 | 85 | Banyak butir konteks atau ditolak keputusan 00, misalnya iklan dan sponsor |
| 02 teknik mural & peta | 75 | 67 | 40 menunggu ilustrasi atau pipeline mural |
| 03 landmark & jalur mural | 37 | 63 | 60 menunggu ilustrasi: **paling banyak tertunda** |
| 04 kampung tua | 124 | 9 | |
| 05 panduan gaya | 88 | 74 | Banyak butir ilustrasi dan aset cetak |
| 06 direktori taksonomi | 61 | 30 | |
| 07 layanan publik | 54 | 13 | |
| 08 PPAT/notaris/hukum | 54 | 9 | |
| 09 direktori celah | 36 | 11 | |
| 10 Trans Batam | 88 | 8 | |
| 11 geoportal | 5 | 66 | **Hampir semua ditunda:** butuh izin BIG, BP Batam, akun Ina-Geoportal, dan `robots.txt` BP Batam menolak crawler |
| 12 ruang publik & jasa | 44 | 11 | |
| 13 budaya, kalender, kamus | 100 | 4 | |
| 14 feri & pompong | 64 | 4 | |
| 15 sejarah & arsip | 93 | 6 | |
| 16 tokoh & nama jalan | 82 | 5 | |

## 6. Penyimpangan dan keputusan yang diambil tanpa pemilik

Pemilik memberi wewenang "semua keputusan aku ikut dirimu". Ini yang diputuskan sepihak dan layak dinilai:

1. **Indikator "Aman nyebrang?" tidak dibuat.** Soal keselamatan butuh ambang yang sah dan penafian syahbandar.
2. **Segmen mural pertama** dipindah dari Barelang ke Harbour Bay–Nagoya–Jodoh.
3. **Label Makan diganti:** "Hits" jadi "Ramai", "Wajib Coba" jadi "Layak dikejar", "Hidden Gem" jadi "Agak tersembunyi". Alasannya, ketiganya masuk daftar kata yang dihindari di panduan gaya (laporan 05). Prompt 4.0 butir 6 sebenarnya meminta label kurasi dipertahankan. **Ini konflik antara prompt dan panduan gaya. Mohon dinilai mana yang benar.**
4. **Nama notaris dan PPAT perorangan** tampil di kartu berlabel Beta, sesuai brief 08.
5. **Angka ±1.600 ha dan 1.450 sertifikat** tidak tampil, sesuai larangan luas lahan.
6. **Kartu Rempang Eco-City** di direktori dibuat minimal, tanpa label status.
7. **Tanggal "terakhir dicek":** tampil "Belum dicek ulang sejak riset Nov 2026", tidak ada tanggal yang dikarang.
8. **Mask daratan dan basemap:** CARTO dan CircleGeo dikeluarkan sepenuhnya, diganti Protomaps.
9. **Tiga koordinat dinaikkan ke "terverifikasi"** karena cocok dengan OSM di bawah 50 m: Pura Agung Amerta Bhuana, Mitra10, RSUD Embung Fatimah.
10. **Mural diberi label "Loket 07"** di judulnya (lihat screenshot 53), padahal di menu Loket 07 adalah Main-main. Belum jelas apakah ini sesuai struktur Loket di keputusan 00 bagian 3.

## 7. Yang belum dan menunggu pemilik

Daftar lengkapnya di `docs/TODO_PEMILIK.md`. Intinya:

- **Untuk tayang:** proyek Vercel, bucket R2 untuk PMTiles, domain, dan uji BMKG dari IP Vercel.
- **Untuk formulir:** Supabase sungguhan beserta akun moderator.
- **Koordinat:** 656 tempat dan 181 halte. Ada 43 usulan halte dari OSM yang perlu ditinjau.
- **Aset dan izin:** ilustrasi mural dan landmark, izin foto arsip, validasi kamus (35 entri `[P]`).
- **Teks sensitif yang perlu dibaca pemilik:** `/cerita/rempang`, `/cerita/kampung-tua/legalitas`, serta draf Privasi dan Syarat.
- **63 konflik data** (`docs/KONFLIK_DATA.md`). Situs memakai nilai hasil penggabungan.
- **Fitur ditunda:** gempa, peringatan dini CAP, harga pangan Bapanas, panduan KTP pindahan, kontur GEBCO, notifikasi hujan, "Batam yang hilang", Barelang scrollytelling, kuis tokoh.
- **Uji di HP Android dan iOS asli** belum dilakukan.

## 8. Daftar screenshot

| No | Halaman | Route |
|---|---|---|
| 01 | Beranda: peta laut + Hari Ini | `/` |
| 02 | Loket 01 Langit & Laut: Hujan | `/langit-laut?mode=hujan` |
| 03 | Loket 01 Langit & Laut: Ombak | `/langit-laut?mode=ombak` |
| 04 | Loket 01 Langit & Laut: CCTV | `/langit-laut?mode=cctv` |
| 05 | Loket 02 Makan: beranda | `/makan` |
| 06 | Makan: daftar + filter | `/makan/daftar` |
| 07 | Makan: peta | `/makan/peta` |
| 08 | Makan: kategori | `/makan/kategori` |
| 09 | Makan: detail tempat | `/makan/tempat/sop-ikan-aliang` |
| 10 | Makan: jalur kuliner | `/makan/jalur` |
| 11 | Makan: detail jalur | `/makan/jalur/halal-nagoya` |
| 12 | Makan: tersimpan | `/makan/tersimpan` |
| 13 | Makan: tentang | `/makan/tentang` |
| 14 | Loket 03 Tukang Langganan | `/tukang` |
| 15 | Tukang: formulir rekomendasi | `/tukang/rekomendasi` |
| 16 | Loket 04 Jalan-jalan | `/jalan` |
| 17 | Trans Batam: semua koridor | `/jalan/trans-batam` |
| 18 | Trans Batam: Koridor 1 (diagram) | `/jalan/trans-batam/k1` |
| 19 | Jalan-jalan: peta | `/jalan/peta` |
| 20 | Feri | `/jalan/feri` |
| 21 | Feri: panduan menyeberang | `/jalan/feri/panduan` |
| 22 | Pompong | `/jalan/pompong` |
| 23 | Loket 05 Cerita & Budaya | `/cerita` |
| 24 | Sejarah Batam | `/cerita/sejarah` |
| 25 | Batam Dulu vs Sekarang | `/cerita/dulu` |
| 26 | Kampung Tua | `/cerita/kampung-tua` |
| 27 | Kampung Tua: detail | `/cerita/kampung-tua/kt-tereh` |
| 28 | Kampung Tua: legalitas (DRAF, sensitif) | `/cerita/kampung-tua/legalitas` |
| 29 | Rempang (DRAF, sensitif) | `/cerita/rempang` |
| 30 | Siapa di Balik Nama Jalan | `/cerita/nama-jalan` |
| 31 | Nama jalan: kartu tokoh | `/cerita/nama-jalan/raja_haji_fisabilillah` |
| 32 | Kalender acara | `/cerita/kalender` |
| 33 | Kamus | `/cerita/kamus` |
| 34 | Budaya Melayu | `/cerita/budaya` |
| 35 | Komunitas | `/cerita/komunitas` |
| 36 | Batam dalam angka (infografis) | `/cerita/angka` |
| 37 | Loket 06 Info Warga | `/info` |
| 38 | Direktori | `/info/direktori` |
| 39 | Direktori: kategori | `/info/direktori/kesehatan` |
| 40 | Direktori: subkategori | `/info/direktori/kesehatan/puskesmas` |
| 41 | Kartu tempat (label museum) | `/info/tempat/akm-hotel-maxone` |
| 42 | Halaman kecamatan | `/info/kecamatan/batam-kota` |
| 43 | Nomor darurat | `/info/darurat` |
| 44 | Urusan tanah/rumah | `/info/urusan-tanah` |
| 45 | Bantuan hukum & profesi | `/info/bantuan-hukum` |
| 46 | Jasa dokumen | `/info/jasa-dokumen` |
| 47 | Warga baru | `/info/warga-baru` |
| 48 | Berita (RSS) | `/info/berita` |
| 49 | Loket 07 Main-main | `/main` |
| 50 | Main: peta vibe | `/main/vibe` |
| 51 | Main: kartu pos | `/main/kartu-pos` |
| 52 | Main: Singapura atau Nagoya? | `/main/singapura-atau-nagoya` |
| 53 | Mural | `/mural` |
| 54 | Mural: cara dibuat | `/mural/cara-dibuat` |
| 55 | Mural: tool GCP (internal) | `/mural/gcp` |
| 56 | Tentang | `/tentang` |
| 57 | Kolofon | `/kolofon` |
| 58 | Cara berkontribusi | `/kontribusi` |
| 59 | Koreksi data | `/koreksi` |
| 60 | Privasi (draf) | `/privasi` |
| 61 | Syarat (draf) | `/syarat` |
| 62 | Admin (moderasi) | `/admin` |
| 63 | 404 | `/halaman-tidak-ada` |
