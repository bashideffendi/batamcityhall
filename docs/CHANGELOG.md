# CHANGELOG

## 2026-11-05 · Penerapan pedoman editorial

Mengikuti urutan bagian 8 `docs/PEDOMAN.md`.

- **Bahasa:** naskah semua loket mengikuti bagian 3. `scripts/cek-bahasa.mjs` jalan di `prebuild`.
- **Disembunyikan (bagian 6):** Batam Dulu, Warga Baru, Mural, Vibe, Quest, dan formulir foto lama keluar dari menu, beranda, dan sitemap.
- **Tampilan:** huruf Newsreader, Plus Jakarta Sans, dan IBM Plex Mono; token warna Riso; kepala, kaki halaman, dan menu ponsel baru. Tekstur kertas, ornamen peta laut, dan pucuk rebung dibuang.
- **Loket 01** pindah ke `/cuaca`, `/cuaca/hujan`, `/cuaca/gelombang`, `/cuaca/cctv`, `/cuaca/peringatan`, dan `/cuaca/gempa`. Alamat lama dialihkan 308 dengan parameter `view` dan `cam`.
- **Beranda:** Hari Ini dengan judul kalimat data, Peta Hari Ini dengan arsiran hujan langsung, Peta Tempat dengan panel Tempat, indeks loket, cerita pilihan, dan berita tiga kolom.
- **Peta kerja:** penanda gaya A di beranda, kategori, kartu tempat, Makan, Kampung Tua, dan Transportasi (`features/peta/LapisanTempat.tsx`, `gambar-penanda.ts`).
- **Halaman lain:** pembuka loket dengan daftar bernomor, direktori berikon, kategori dengan peta menempel, baris tempat, detail tempat dua kolom, tabel Feri Terakhir.
- **Teknis:** cache memori route realtime (`lib/cache-respons.ts`), ikon situs warna baru, CSS tak terpakai dibuang.
- **Bug:** `/makan/peta` bisa digulir ke ruang kosong sepanjang ribuan piksel; tautan kamera di kartu tempat salah alamat; balapan tema di `followSystemTheme`.
- **Koreksi pemilik:** istilah "loket" keluar dari teks yang tampil, nomor besar pembuka dihapus, penanda berisi isi bagian, judul beranda menjadi "Jelajahi Batam". `cek-bahasa` menjaganya lewat aturan `istilah-loket`.
- **Pratinjau:** tayang di https://batam.masbash.id. Sumber MSS, NEA, dan BMKG menjawab dari server Railway.

## 2026-11-05 · Gempa dan peringatan dini cuaca BMKG

- `/api/gempa`: gabungan autogempa, gempaterkini, dan gempadirasakan. Ditahan 60 detik per instance, jadi paling sering 3 permintaan per menit per instance, jauh di bawah batas BMKG 60 per menit per IP.
- `/api/peringatan-cuaca`: RSS nowcast sebagai daftar, XML CAP sebagai isi, hanya Kep. Riau. RSS ditarik paling sering sekali per menit, tiap XML cukup sekali. `?poligon=1` menyertakan poligon untuk peta.
- Header jujur (`BMKG_HEADERS`) lolos ke semua sumber ini dari PC pemilik, 5 Nov 2026. Belum diuji dari IP server.
- `/cuaca/peringatan`, `/cuaca/gempa`: halaman baru, teks BMKG disalin apa adanya, atribusi tampil, gagal ditulis gagal.
- Kotak Hari Ini: baris Cuaca hanya bila peringatan mengenai Batam atau datanya gagal, baris Gempa hanya bila relevan (ambang di `DATA_DECISIONS.md`). Baris lama "Peringatan" jadi "Peringatan laut".
- Radar: label peringatan di panel mengikuti wilayah yang dipilih, poligon BMKG di peta, bagian Detail, kredit sumber.
- Kecamatan Batam ditentukan dari teks BMKG atau titik label di dalam poligon. Diuji ke dua peringatan asli, 5 Nov 2026: Batu Aji dan Sagulung untuk yang satu, tidak ada untuk yang lain, cocok dengan teksnya.
- Belum terlihat di data asli, jadi belum teruji dengan data sungguhan: pesan CAP `Update` dan `Cancel`, dan kalimat `Potensi` yang benar-benar menyebut tsunami.
- Cek di PC ini: build, tsc, lint lulus; unit 608/608; e2e suite penuh 700 lulus, 29 dilewati, 1 gagal (`situs.spec.ts:113`). Setelah perbaikan terakhir, `langit-laut`, `situs`, `direktori`, `berita`, `jalan`, dan `mural` diulang: 403 lulus, 1 dilewati.
- `situs.spec.ts:113` gagal bukan karena perubahan ini: diulang 16 kali, gagal 16 di commit sebelumnya dan 14 sesudahnya. Penyebabnya di `LANJUTKAN.md`.

## 2026-11-05 · Pratinjau Railway dan paket review

- `railway.json`, `.node-version` (22), `scripts/siapkan-peta.mjs`, `deploy/peta-dasar.json`: build di Railway mengunduh `batam.pmtiles` dari cabang `aset-peta` dengan cek ukuran dan sha256. Vercel di-pause, jadi pratinjau pindah ke Railway. Diuji di sesi cloud: unduh dari cabang, build, `PORT` dihormati. Belum dicoba di Railway sungguhan.
- `SITE_PRATINJAU=1`: `robots.txt` menolak semua dan halaman ber-`noindex`. Tanpa variabel ini tidak ada yang berubah.
- Cabang `paket-review`: laporan kesesuaian dengan brief, galeri screenshot desktop dan HP dari build produksi dengan data langsung, untuk audit Claude Research.
- Cek di sesi cloud: build, tsc, lint lulus; unit 535/535; e2e 666 lulus, 29 dilewati, 1 gagal (`mural.spec.ts:307` di profil HP). Pengukuran terpisah menunjukkan loop mural benar berhenti saat tombol tenang ditekan; kemungkinan tesnya mengklik saat animasi awal viewport masih berjalan. Tes belum dibetulkan.

## 2026-11-05 · Fase 10: audit

- `COVERAGE.md` tanpa `[ ]`: tiap baris sudah `[x]` atau `[-]` dengan alasan. 99 butir berstatus ditunda dengan syaratnya. Baris sisa diklasifikasi tiga agen dengan memeriksa kode, belum dicek ulang satu per satu oleh pemimpin.
- Jelajah build produksi: 2.607 alamat, 0 tautan internal rusak, tidak ada catatan penyusun yang lolos kecuali satu tanda ⚠️ di jam layanan, sudah dibetulkan.
- Lighthouse (preset HP, renderer perangkat lunak): aksesibilitas dan SEO 100 di 6 halaman yang diuji. Performa 85 sampai 88, beranda 56 karena peta WebGL tanpa GPU. Belum diuji di HP asli.
- Baru dari temuan audit: pencarian tempat dan "Di sekitarku" di peta beranda, daftar OSM berlabel di subkategori kosong, catatan publik untuk alamat usang (`CATATAN_KURASI`), satu baris penjelas di menu HP, atribusi BIG.
- Label Makan "Hits", "Wajib Coba", "Hidden Gem" diganti karena masuk daftar hindari.
- `docs/TODO_PEMILIK.md`, `docs/KONFLIK_DATA.md`.

## 2026-11-05 · Fase 9: Main-main, redirect, OSM

- `/main`, `/main/kartu-pos` (gambar di browser, tanpa server), `/main/vibe` (hanya ngopi dan macet), `/main/singapura-atau-nagoya` (kurs diisi pengguna).
- `deploy/situs-lama/`: redirect 301, `sw.js` pengganti, halaman pindah favorit. **Disiapkan, belum dijalankan.** Peta path di `lib/redirect-lama.ts`.
- Overpass dijalankan 4 Nov 2026 UTC (`data/osm/2026-11-04`): 775 tempat ibadah, 301 sekolah, 165 halte bus. Satu query (jalan utama) gagal 502 dan tidak diulang. **Temuan yang membantah riset:** OSM sudah punya relasi Koridor 1 dan 113 halte bertanda Trans Batam. Jadi garis K1 dan halte OSM kini tampil di `/jalan/peta` sebagai lapisan terpisah berlabel.
- Tiga koordinat naik ke terverifikasi karena cocok OSM di bawah 50 m: Pura Agung Amerta Bhuana, Mitra10, RSUD Embung Fatimah. TMP dan paroki tetap perkiraan sesuai brief 09.

## 2026-11-05 · Fase 8: Mural

- `/mural` dengan OpenSeadragon, satu segmen placeholder berlabel (Harbour Bay–Nagoya–Jodoh), strip 8 perhentian, hotspot dengan alternatif daftar, quest "Jejak pusat niaga", overlay siang/senja/malam, hujan per kecamatan, kapal feri berlabel "posisi perkiraan, bukan AIS". Tool GCP di `/mural/gcp`. Pipeline di `docs/MURAL.md`, belum pernah dijalankan dengan ilustrasi asli.

## 2026-11-05 · Fase 7: Berita

- `/info/berita`, `/api/berita`, widget beranda. 6 feed valid: Batam Pos, Antara Kepri, GoWest, GoKepri, Ulasan.co, Media Center Pemko Batam. Hanya judul, sumber, waktu, tautan. Yang menolak dicatat di `docs/SUMBER_BERITA.md`, tidak diakali.

## 2026-11-05 · Fase 6: Tukang Langganan

- `/tukang`, `/tukang/rekomendasi`, `/koreksi`, `/admin`, `/admin/cek-ulang`, `/admin/koordinat`, migrasi `supabase/`. Aturan 2 rekomendasi dan persetujuan moderator diuji. **Hanya mode contoh dan mode mati yang teruji di browser. Supabase belum pernah dijalankan sungguhan.**

## 2026-11-05 · Fase 5: Cerita & Budaya

- `/cerita`, `/cerita/sejarah`, `/cerita/dulu`, `/cerita/kampung-tua` (56 kartu), `/cerita/rempang` (draf), `/cerita/nama-jalan` (46 kartu), `/cerita/kalender`, `/cerita/kamus`, `/cerita/budaya`, `/cerita/komunitas`, `/cerita/angka`. Tes menghitung semua item terhadap file data. Belum ada foto lama yang tampil, semua lewat tautan arsip.

## 2026-11-05 · Fase 4: Jalan-jalan

- `/jalan`, `/jalan/trans-batam` dan 10 halaman koridor dengan diagram skematik dan strip map, `/jalan/peta`, `/jalan/feri`, panduan menyeberang, `/jalan/pompong`. Widget feri terakhir di Hari Ini dan detail Makan, dengan semua jebakan data di brief 14 diuji unit.

## 2026-11-05 · Fase 3: Info Warga, direktori, dan pin di peta

Sisa fase 3 dicatat di `PLAN.md`. Riset Overpass, harga pangan, dan formulir koreksi belum dikerjakan.

- **Direktori** `/info/direktori`: 892 tempat, 22 kategori, jumlahnya dites terhadap `places_stats.json`. Pencarian MiniSearch dan filter kategori, subkategori, kecamatan, kelurahan, status data, status lokasi, dan buka sekarang, tersimpan di URL. Subkategori yang diminta warga tetapi belum ada datanya tampil "Belum ada data".
- **Kartu tempat** `/info/tempat/[id]` dengan gambar OG per tempat. Atribut memakai daftar putih, jadi rating, luas lahan, dan id internal tidak tampil. Catatan kerja penyusun disaring. Kampung tua dan Rempang Eco-City hanya kartu minimal.
- **Halaman:** `/info`, `/info/kecamatan/[slug]`, `/info/darurat` (alias `/darurat`), `/info/urusan-tanah`, `/info/bantuan-hukum`, `/info/jasa-dokumen`, `/info/warga-baru` (kerangka), serta draf `/kontribusi`, `/koreksi`, `/privasi`, `/syarat`.
- **Peta beranda:** pin berklaster dengan legenda (default hujan + landmark), pin penuh = terverifikasi, pin kosong = perkiraan, satu titik satu pin, kartu museum, tautan `/?tempat=<id>`, lapisan radar MSS terbaru. Tema berganti tanpa menghilangkan lapisan.
- **Widget silang:** "Lagi hujan di {kecamatan}" di kartu tempat dan detail Makan, "Buat berteduh" di detail hujan Langit & Laut, kamera terdekat di kartu tempat. Feri terakhir menunggu fase 4.
- **Koordinat Makan:** `data/koordinat_user.json` kini juga menimpa koordinat `/makan`.
- **Data:** `angka_resmi.json` ditambah angka notaris, PPAT, dan OBH dari brief 08.
- Tes baru: `tests/unit/direktori.test.ts`, `tests/e2e/direktori.spec.ts`.

## 2026-11-05 · Fase 2: peleburan hujandibatam dan batam-bites

Kriteria PLAN belum penuh: satu butir paritas ◐ (tombol bahasa situs) dan pengalihan situs lama memang menunggu fase 9.

- **Langit & Laut** di `/cuaca`: `RadarMap`, `KecamatanLayer`, `CctvLayer`, `OfsField`, `LandMask`, `MapController` pindah dari Leaflet ke MapLibre. Baru: `PetaLangit`, `PetaMarker`, `RadarLayer`, `lib/peta-lapisan.ts`. Angka zoom dikurangi 1 karena tile 512 px.
- **Header BMKG jujur:** `BMKG_HEADERS`, tanpa menyamar sebagai Chrome dan tanpa Referer. Diuji dari PC pemilik dan browser; belum dari IP Vercel.
- **Radar lewat `/api/radar-citra/[ts]`** karena MSS tidak mengizinkan CORS. Citra 404 tetap 404.
- **Mask daratan** memakai `earth` peta dasar sendiri, bukan CircleGeo. CARTO dan CircleGeo keluar sepenuhnya.
- **Peta dasar bertingkat:** fokus z15, Kepri z12, Luas z10. 15.477 tile, 46 MB.
- **CSS Langit & Laut** dipetakan ke token situs dan dibatasi `.app-root`. Tombol tema pindah ke strip navigasi.
- **Makan** di `/makan`, 9 route: port penuh ke MapLibre, ikon garis, label museum. Kuliner masuk `places.json`: 775 → 892 tempat. Rating tidak tampil, 117 pin tampil sebagai perkiraan area.
- **Beranda:** kotak Hari Ini (hujan, ombak, peringatan). Feri terakhir menyusul fase 4.
- **Situs:** manifest, `sw.js`, ikon PWA, `error.tsx`, `global-error.tsx`, robots, sitemap.
- Tes baru: `tests/unit/langit-laut.test.ts`, `tests/unit/makan.test.ts`, `tests/e2e/langit-laut.spec.ts`, `tests/e2e/makan.spec.ts`. Tes e2e meniru sumber data agar tidak membebani MSS dan BMKG.
- Temuan: kedua situs lama membalas HTTP 402 sejak setidaknya 4 Nov 2026. `warnings.json` BMKG tidak memuat `Kep. Riau`, jadi status peringatan "Belum Tersedia".

## 2026-11-04 · Fase 1 selesai menurut kriteria PLAN (build lulus, peta tampil di dua tema)

- Lingkungan: Node.js 26.13 LTS, Git 2.56, Python 3.13 dipasang lewat winget di PC pemilik. Repo di `Desktop\batam-city-hall`, cabang `fase-1-fondasi`.
- `features/peta/`: `PetaLaut` (MapLibre + protokol pmtiles, terkunci di bbox, gestur kooperatif), `style.ts` (siang/malam, hanya warna token), `graticule.ts` + `TepiChart` (graticule 1′/5′, strip koordinat, garis 1°N), `skala.ts` + `OrnamenChart` (kartusis, mawar angin, skala batang km dan mil laut), `ItikBerbaris`.
- Singapura-Johor dan Bintan tampil sebagai siluet: selubung warna darat di atas jalan, di bawah air (`LUAR_FOKUS`).
- Halaman: `/` (peta + daftar loket), `/tentang`, `/kolofon`, 404. Beranda hanya menautkan loket di `LOKET_DIBUKA`, yang saat ini kosong.
- Aset: `scripts/build-aset.mjs` membuat `public/tex/grain-256*.webp` (prosedural, 14,9 KB) dan `app/apple-icon.png`. `app/icon.svg` digambar di grid 16 px supaya terbaca; `public/logo/monogram.svg` versi vektor. `components/site/Emblem.tsx`.
- Tes: Vitest (`tests/unit`) dan Playwright + axe (`tests/e2e`, profil desktop dan HP).
- Perbaikan yang baru ketahuan setelah dijalankan: worker MapLibre 6 tidak ketemu setelah dibundel (`setWorkerUrl`), wadah peta bertinggi 0 karena CSS MapLibre, tautan loket pertama terpotong (`safe center`), prefetch ke route yang belum ada, tanda siap yang menunggu `idle` sehingga ornamen tertahan saat peta digeser, offset waterlining terbalik, warna flavor Protomaps yang lolos dari token, ikon sprite yang tidak ada.
- `scripts/extract-basemap.mjs` terbukti jalan dan menerima argumen keluaran. Tema membaca dari `<html>` lewat `useSyncExternalStore`.
- Sementara: `features/makan` dan `features/langit-laut/components` dikeluarkan dari tsconfig dan ESLint sampai di-port di fase 2.
- Route BMKG (`/api/ofs-frame`, `/api/perairan`) hanya dikompilasi, tidak pernah dijalankan.

## 2026-11-04 · Persiapan dan awal fase 1 (belum selesai, belum pernah di-build)

- Paket handoff dipasang sebagai repo. README paket dipindah ke `docs/PAKET_HANDOFF.md`.
- Riset 01–16 dibaca lima subagen; hasilnya `docs/brief/` dan `docs/coverage-parts/`, dirakit menjadi `docs/COVERAGE.md`.
- `docs/PLAN.md`, `docs/PARITAS.md`, `docs/DATA_DECISIONS.md` ditulis.
- Kode lama disalin dan import-nya ditulis ulang, belum di-port:
  - hujandibatam `45281a64de5fe068de9d95b9bbc73ba4eb5af4db` → `features/langit-laut/`, `app/api/`, `data/wilayah/kecamatan-kepri.geojson`, `scripts/build-kecamatan.mjs`, `scripts/cctv-audit.sh`
  - batam-bites `85905410a7a1f1e42e0b43f19e72b144cf384249` → `features/makan/`, `data/makan/`
- Konfigurasi Next.js 16, TypeScript, ESLint, Prettier, Tailwind 4.
- Layout, strip navigasi, menu HP, footer wajib, tema siang/malam, tombol Gerak.
- Validasi data zod: lulus untuk 21 berkas dan 775 tempat.
- Glyph peta dibangun ke `public/glyphs/`.
- `features/peta/style.ts` dan `scripts/extract-basemap.mjs` ditulis, belum diuji.
