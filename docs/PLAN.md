# PLAN

Disusun 4 November 2026. Status terkini ada di `docs/LANJUTKAN.md`. Spesifikasi lengkap: `CLAUDE_CODE_PROMPT.md`, keputusan pemilik: `research/00-keputusan-percakapan.md` (menang bila konflik). Ringkasan tiap laporan: `docs/brief/NN.md`.

## Urutan fase

Mengikuti bagian 9 prompt, tanpa perubahan urutan.

| Fase | Isi | Selesai bila |
|---|---|---|
| 1 | Fondasi: token, font, layout, footer, validasi data, peta dasar siang/malam, Tentang/Kolofon | build lulus, peta tampil di dua tema |
| 2 | Peleburan hujandibatam → Langit & Laut, batam-bites → Makan, kuliner masuk `places.json`, kotak Hari Ini | `docs/PARITAS.md` semua ✔, uji visual radar & ombak lulus |
| 3 | Direktori, pencarian, kartu museum, filter, OG image, darurat, urusan tanah, bantuan hukum, widget silang | jumlah per kategori cocok dengan `places_stats.json` |
| 4 | Trans Batam (diagram + hub di peta), feri & pompong, widget feri terakhir | tiap koridor punya halaman dan diagram |
| 5 | Sejarah, Kampung Tua, nama jalan, kalender, kamus, budaya, infografis, Batam Dulu | semua item di file data tampil |
| 6 | Tukang Langganan: Supabase, formulir, moderasi, consent, aturan 2 rekomendasi | alur kirim → moderasi → tampil jalan dengan data fiktif berlabel |
| 7 | Berita RSS, `docs/SUMBER_BERITA.md` | minimal 3 feed terbukti valid |
| 8 | Mural: mesin OpenSeadragon, tool GCP, satu segmen placeholder, overlay hidup | satu segmen penuh, sisanya "segera" |
| 9 | Main-main, penyempurnaan, peta redirect + `sw.js` pengganti | redirect siap, eksekusi menunggu izin |
| 10 | Audit: COVERAGE tanpa `[ ]`, Lighthouse/axe, uji HP, daftar TODO pemilik | definisi selesai bagian 11 prompt |

## Keputusan teknis

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 dipetakan ke token `data/design/design_tokens.css`, MapLibre + PMTiles + `@protomaps/basemaps`, OpenSeadragon + `@allmaps/transform` + `suncalc`, zod, MiniSearch, Supabase. Region Vercel `sin1`.

**Struktur:** kode lama dipindah ke `features/langit-laut/` dan `features/makan/`. API route tetap di path lama (`/api/frames`, dst.). Peta bersama di `features/peta/`. Komponen situs di `components/site/`. Data dibaca dari `data/` dan divalidasi saat prebuild oleh `scripts/validate-data.ts`.

**Tema:** `data-theme="day|night"` di `<html>`. Pilihan tersimpan (`bch-theme`) menang. Tanpa pilihan, `/langit-laut` ikut jam WIB (paritas hujandibatam), halaman lain ikut `prefers-color-scheme` (prompt 4.1). Kode lama memakai `light|dark` secara internal: petakan saat menyentuh DOM, dan ganti selektor `[data-theme="light|dark"]` di `langit-laut.css`.

**Glyph peta:** `scripts/build-glyphs.mjs` merender PBF dari Source Serif 4 dan Plus Jakarta Sans dengan tiny-sdf di Chromium. Tanpa dependensi native. Sudah dibangun ke `public/glyphs/` (1,3 MB, ikut repo) dan terbukti tampil di MapLibre.

**Peta dasar:** `scripts/extract-basemap.mjs` membuat `public/tiles/batam.pmtiles` memakai library npm `pmtiles`, tiga wilayah bertingkat: fokus `103.55,0.45,104.75,1.5` z15, Kepri z12, Luas z10 (tampilan Natuna dan sekeliling radar). Dipilih karena unduhan `pmtiles.exe` ditolak izin auto mode. 15.477 tile, 46 MB, kurang dari setengah jam (build 2 Nov 2026). Di-gitignore, jadi **deploy butuh R2** dan `NEXT_PUBLIC_PMTILES_URL` (butir 5). Wilayah di luar itu kosong kalau di-zoom lebih dalam dari z10.

**Worker MapLibre:** MapLibre 6 mencari worker di sebelah modulnya, dan setelah dibundel berkas itu tidak ada. `PetaLaut` memakai `setWorkerUrl(new URL(..., import.meta.url))` supaya Turbopack menyalinnya sebagai aset. Terbukti di dev dan build produksi.

**Urutan lapisan:** jalan dan bangunan, selubung `LUAR_FOKUS`, air, waterlining, jembatan, graticule, label. Protomaps menggabungkan jalan satu tile menjadi satu fitur di zoom rendah, jadi ekspresi `within` tidak bisa memisahkan Batam dari Bintan. Efeknya: jalan yang melintasi air tanpa tag jembatan tertutup air. Cek saat uji paritas fase 2.

**Radar:** PNG MSS lewat `/api/radar-citra/[ts]`, cache panjang karena per timestamp tidak berubah. Ini menambah pemakaian function dan bandwidth Vercel dibanding situs lama yang memuat langsung dari browser. Perhatikan setelah deploy, apalagi situs lama sedang kena 402.

**Zoom:** angka zoom MapLibre = Leaflet situs lama dikurangi 1.

**Lapisan radar di MapLibre:** WebGL butuh izin CORS, Leaflet tidak. Semua rencana di tabel ini sudah diterapkan di fase 2.

| Sumber | `Access-Control-Allow-Origin` (dites 4 Nov 2026) | Rencana |
|---|---|---|
| Radar MSS | hanya `https://www.weather.gov.sg` | route same-origin untuk PNG radar, cache panjang (asalnya `max-age=2592000`), lalu `image` source dengan `RADAR_BOUNDS` |
| Tile OFS BMKG | diizinkan: `fetch` mode cors dari `http://localhost:3000` berhasil, `image/png` | `raster` source langsung di MapLibre, dimuat dari browser pengguna seperti situs lama |
| CircleGeo | `*` | tidak dipakai: mask memakai `earth` peta dasar sendiri, CircleGeo terlalu kasar di MapLibre |
| CCTV Pemko | `*` | tetap hls.js |
| Protomaps build | tidak ada | jangan dipakai langsung dari browser; lewat hasil ekstrak |

Kalau uji visual gagal, catat di sini dan jangan lanjut sebelum diputuskan (prompt 4.0 butir 4).

**Jalur Trans Batam geografis:** ditunda. 0 dari 191 halte berkoordinat terverifikasi. Fase 4 memprioritaskan diagram skematik SVG, peta hanya menampilkan hub bergaya "perkiraan" (brief 10).

## Keadaan akhir fase 10

Semua fase sudah dikerjakan. Kriteria yang **tidak** terpenuhi penuh:

- Fase 6: alur kirim, moderasi, tampil terbukti di mode contoh, belum di Supabase sungguhan.
- Fase 8: satu segmen dengan placeholder, pipeline ilustrasi asli belum pernah dijalankan.
- Fase 9: redirect siap, eksekusi menunggu izin.
- Fase 10: uji HP asli belum.
- Jalur Trans Batam: hanya Koridor 1, dari OSM. Koridor lain menunggu OSM atau survei halte.

Butir yang ditunda ada di `COVERAGE.md` dengan syaratnya (cari `[-] ditunda`). Yang perlu pemilik lakukan: `TODO_PEMILIK.md`.

Catatan teknis yang masih berlaku: peta dan radar lewat function Vercel menambah bandwidth; widget hujan dan feri di detail Makan selalu berbahasa Indonesia; gambar OG ada di `/info/tempat/[id]`, bukan di `/?tempat=`, supaya beranda tetap statis.

## Pertanyaan untuk pemilik proyek

### Perlu dijawab sebelum fase terkait

1. **Header ke BMKG: terjawab, identitas jujur sudah terpasang** (`BMKG_HEADERS`, tanpa Referer). Dasarnya, uji 4 Nov 2026 dari PC pemilik:
   - `maritim.bmkg.go.id/apidoc` menyebut `marine2026-data/` API publik: tanpa autentikasi, CORS diizinkan. `api21/modelrun` tidak tercantum di sana.
   - Dengan User-Agent jujur tanpa Referer, `perairan/P.R.02.json`, `warning/warnings.json`, dan `api21/modelrun` semuanya 200, JSON, `Access-Control-Allow-Origin: *`. Dari browser juga lolos, termasuk tile OFS.
   - Belum terbukti dari IP Vercel. Komentar di `ofs-frame` mencatat BMKG suka memblokir permintaan server. Kalau itu terjadi, urutannya: ambil langsung dari browser (CORS terbuka), baru bahas lagi dengan pemilik. Pemilik pernah bilang boleh ikut cara hujandibatam bila jalur jujur gagal, tetapi cara itu tidak bisa diuji dari Claude Code.
   - `warnings.json` tidak memuat semua provinsi: 25 dari 38 tidak ada pada 4 Nov 2026, termasuk `Kep. Riau`, dan kunci `Indonesia` hanya berisi samudra. Jadi kunci yang hilang bukan berarti aman, dan status tetap "Belum Tersedia". Belum diketahui apakah kunci itu muncul saat ada peringatan. Layak ditanyakan ke BMKG atau dipantau.
2. **Situs lama.** Kapan boleh redirect, dan izin sebelum mengubah repo, deploy, atau DNS situs lama. Fase 9. Sejak setidaknya 4 Nov 2026 keduanya membalas HTTP 402; pemilik perlu mengecek akun Vercel.
3. **Rating Google di data makan** boleh tampil? Default: tidak. Fase 2.
4. **Proyek Supabase dan Vercel**, atau izin membuatnya. Fase 6 dan deploy.
5. **Bucket aset** (Cloudflare R2 atau lain) untuk PMTiles dan tile mural. Sebelum deploy.
6. **Domain** yang dipakai.
7. **URL donasi** (Saweria/Trakteer), bila sudah ada.

### Boleh menyusul

8. Koordinat di `data/koordinat_perlu_diisi.csv` dan `data/trans_batam/halte_koordinat_perlu_diisi.csv`. Situs tetap jalan tanpa ini. Urutan isi usulan: camat, puskesmas, RS, polsek, pelantar pompong; pelabuhan dan MPP bisa didahulukan karena jadi hub.
9. Ilustrasi mural dan landmark, siapa ilustratornya, honor. Segmen pertama: Barelang 1–6 atau Harbour Bay–Nagoya? AI boleh untuk isian latar?
10. Tanggal "terakhir dicek" untuk entri awal. Sementara tampil "Belum dicek ulang sejak riset Nov 2026", kecuali kuliner yang punya `last_verified`. Tidak ada tanggal yang dikarang.
11. Nama notaris/PPAT perorangan boleh tampil, atau hanya "kantor" sampai pemiliknya konfirmasi? Sementara tampil dalam kartu Beta, sesuai brief 08.
12. Angka "±1.600 ha" dan "1.450 sertifikat" boleh tampil di garis waktu sebagai kutipan beratribusi? Default: tidak, sesuai larangan luas lahan.
13. Kartu Rempang: siapa yang menyetujui teksnya? Sementara Rempang Eco-City hanya kartu minimal tanpa label status.
14. Boleh menjalankan Overpass publik dan mengumumkan hitung kelengkapan di halaman data?
15. Email izin ke BIG, PPID BP Batam, Disperkimtan: pemilik yang kirim. Akun Ina-Geoportal untuk BATNAS/RBI hanya bisa didaftarkan pemilik. Tarikan dari server BP Batam yang `robots.txt`-nya menolak crawler: default tidak.
16. Survei lapangan halte Trans Batam, konfirmasi UPT Trans Batam/Dishub, dan sumbangan hasil ke OSM.
17. Laporan tarif pompong dari warga boleh disimpan? Nomor kontak tekong: default tidak tampil.
18. Validator kamus `[P]` (Disbud/LAM Kepri), penutur Jawi untuk aksen nama Loket (tanpa penutur, aksen dilewati), lampiran SK 105/2004 & 89/2006, izin kutipan tutur lewat LAM/RKWB.
19. Lisensi foto arsip (Humas BP Batam, Museum Raja Ali Haji, dll.), izin gambar NLB 1846 dan Leiden 1847.
20. Merch, seed awal Tukang Langganan (siapa mengisi), harga pangan Bapanas masuk lingkup?, izin foto "Tukang Legendaris".
21. Koordinat wordmark (`1°08′U 104°03′T` belum dicek) dan pemakaian "EST. 2026". Sampai dijawab, baris itu tidak ditampilkan.
22. SPKLU: daftar 26 unit dari PLN Mobile manual, atau 14 titik + tautan aplikasi?
23. Destinasi komersial berbayar (Ocarina, Viovio, Kepri Coral) tetap tampil sebagai informasi netral?
24. Entri tokoh tambahan agar diagram relasi lengkap (Daeng Celak, Raja Jaafar, dst.), lokasi jalan yang "perlu dicek", dan alasan nama RSUD Embung Fatimah.

Sumber tiap butir: bagian 10 prompt dan bagian "Pertanyaan pemilik" di `docs/brief/NN.md`.
