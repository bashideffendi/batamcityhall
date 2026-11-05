# Prompt untuk Claude Code: bangun "Batam City Hall"

Kamu akan membangun **Batam City Hall**, website kota indie dan non-komersial buatan warga Batam. Semua bahan sudah disiapkan di paket ini: 16 laporan riset, keputusan pemilik proyek, dan dataset yang sudah dirapikan. Tugasmu membangunnya **lengkap dan teliti**. Tidak boleh ada hasil riset yang terlewat tanpa alasan tertulis.

Bahasa antarmuka: **Bahasa Indonesia** sebagai utama, Inggris sebagai pilihan untuk teks yang sudah punya versi Inggris di data (microcopy, kamus). Tulis kode, nama file, dan komentar dalam bahasa Inggris atau Indonesia secara konsisten. Komunikasi dengan pemilik proyek dalam Bahasa Indonesia.

---

## 0. Cara kerja yang wajib

1. **Baca semuanya dulu, jangan langsung coding.** Baca `README.md`, lalu `research/00-keputusan-percakapan.md` (keputusan ini menang jika ada konflik), lalu SEMUA file `research/01…16-*.md` sampai habis, lalu lihat isi folder `data/`. Laporan panjang; baca per bagian, jangan dilewati.
2. **Buat `docs/COVERAGE.md` sebelum coding**, mulai dari salinan `docs/COVERAGE_TEMPLATE.md` (sudah berisi semua judul bagian dari 17 file riset dan semua file data). Pecah setiap bagian menjadi sub-butir per temuan/rekomendasi/tabel, lalu tandai: `[ ] belum`, `[x] diterapkan di <file/route>`, atau `[-] ditunda: <alasan>`. Perbarui terus selama bekerja. Di akhir, tidak boleh ada `[ ]` yang tersisa. Ini cara pemilik proyek memastikan tidak ada riset yang terlewat.
3. **Buat `docs/PLAN.md`**: urutan fase (lihat bagian 9), keputusan teknis, dan daftar pertanyaan untuk pemilik proyek.
4. **Jangan mengarang data.** Pakai hanya data di paket ini, data yang ditarik dari sumber resmi/terbuka yang disebut riset, atau masukan pemilik proyek. **Jangan pernah menebak koordinat.** Entri tanpa koordinat tidak dirender di peta.
5. **Kerjakan bertahap dan bisa dijalankan setiap saat.** Setiap fase berakhir dengan build lulus, tes lulus, dan catatan di `docs/CHANGELOG.md`.
6. **Bertanya hanya untuk hal yang memang harus dari pemilik proyek** (bagian 10). Sambil menunggu, buat adaptor/mock dengan antarmuka yang jelas supaya pekerjaan lain tetap jalan.

---

## 1. Peta isi paket

```
CLAUDE_CODE_PROMPT.md        ← file ini
README.md                    ← indeks paket + statistik data + celah yang diketahui
docs/COVERAGE_TEMPLATE.md    ← checklist semua bagian riset & file data (salin jadi docs/COVERAGE.md)
research/
  00-keputusan-percakapan.md ← keputusan pemilik proyek (prioritas tertinggi)
  01-inspirasi-konsep.md     ← konsep awal, contoh situs, fitur, roadmap
  02-teknik-mural-peta.md    ← OpenSeadragon, tile, TPS georeferensi, overlay hidup, hotspot, GEBCO, arsitektur
  03-landmark-jalur-mural.md ← 8 segmen mural, landmark, ikon prioritas, topik sensitif
  04-kampung-tua.md          ← daftar kampung tua, profil, legalitas netral, etika
  05-panduan-gaya.md         ← style guide, design tokens, font, warna, microcopy, logo
  06-direktori-taksonomi.md  ← taksonomi, tag OSM, skema SQL, query Overpass, angka resmi
  07-direktori-layanan-publik.md ← kecamatan/kelurahan, puskesmas, RS, kantor, polsek, damkar
  08-ppat-notaris-hukum.md   ← urusan tanah ke mana, PPAT/notaris, bantuan hukum, KJPP
  09-direktori-celah.md      ← KUA, pos, dinas, klinik/lab/apotek, gereja/klenteng, terminal, SPBU, pompong
  10-trans-batam.md          ← koridor, halte, info praktis, desain peta transit
  11-geoportal.md            ← Hang Jebat, Geoportal BP Batam, Ina-Geoportal: apa yang bisa diambil
  12-ruang-publik-olahraga-jasa.md ← taman, pantai, wisata, olahraga, belanja, jasa
  13-budaya-kalender-kamus.md← kalender acara, budaya Melayu, kamus, komunitas, fakta infografis
  14-feri-pompong.md         ← terminal, rute, jadwal feri & pompong, info menyeberang
  15-sejarah-arsip.md        ← garis waktu, asal nama, perubahan fisik, arsip foto, bacaan
  16-tokoh-nama-jalan.md     ← tokoh, penamaan tempat, relasi antartokoh
data/
  places.json                ← SEMUA tempat, skema seragam, sudah digabung & dedup (sumber utama direktori)
  places_stats.json          ← statistik & masalah validasi
  places_konflik.json        ← konflik antarsumber (koordinat/alamat/kecamatan beda) untuk ditinjau
  places_id_index.json       ← id apa pun (id asli laporan/file domain, mis. "btc") → id kanonik di places.json
  koordinat_perlu_diisi.csv  ← tempat tanpa koordinat pasti, urut prioritas + tautan Google Maps, diisi pemilik proyek
  koordinat_user.json        ← koordinat yang sudah diisi pemilik proyek (dipakai ulang otomatis saat merge)
  places/*.json              ← tempat per laporan (sebelum digabung)
  raw/*.json                 ← setiap blok JSON di laporan, verbatim
  logs/*.md                  ← catatan pemindahan per laporan
  akomodasi/hotel.csv        ← daftar hotel dari pemilik proyek (tanpa data pajak)
  trans_batam/halte_koordinat_perlu_diisi.csv ← 191 halte Trans Batam untuk diisi koordinatnya
  design/ mural/ kampung_tua/ trans_batam/ feri/ sejarah/ tokoh/ budaya/ panduan/
  taksonomi/ schema/ osm/overpass/ wilayah/ darurat/ statistik/ sumber_data/ referensi/ snippets/ komunitas/
tools/
  merge_places.py            ← menggabungkan data/places/*.json → data/places.json (+ konflik, statistik, indeks id, CSV)
  merge_aliases.json         ← grup duplikat yang digabung manual (tambah di sini kalau menemukan duplikat lain)
  import_koordinat.py        ← memasukkan koordinat yang diisi pemilik proyek (CSV tempat atau CSV halte)
  _agent_spec.md             ← skema tempat & aturan normalisasi
```

**Skema tempat** (`data/places.json`): `id, nama, nama_alternatif[], kategori, subkategori, kecamatan, kelurahan, alamat, lat, lng, status_koordinat (terverifikasi|perlu_cek_ulang|perlu_diisi_user), catatan_koordinat, jam_layanan, kontak{}, atribut{}, status_data, catatan, tag_osm, sumber_url[], sumber_riset[], id_alias[]`. Penjelasan lengkap di `tools/_agent_spec.md`.

**Referensi id antarfile.** File domain (mis. `data/feri/terminal.json` memakai `btc`, `hb`; `data/mural/landmarks.json`; `data/kampung_tua/kampung_tua.json`) menyimpan id asli dari laporannya. Selalu resolusikan lewat `data/places_id_index.json` ke id kanonik `places.json`; `id_alias[]` di setiap tempat berisi id-id lama itu. **Pengecualian:** id halte di `data/trans_batam/halte.json` adalah namespace sendiri (halte `bandara-hang-nadim` atau `polsek-nongsa` adalah HALTE, bukan bandara/polsek di `places.json`); jangan diresolusikan lewat indeks tempat.

**Status koordinat di UI.** `terverifikasi` → pin biasa. `perlu_cek_ulang` → pin bergaya "perkiraan" (garis putus/berongga) + badge dan catatan_koordinat, tidak boleh tampil seolah pasti. `perlu_diisi_user` (lat/lng null) → hanya di daftar, badge "lokasi belum diisi". Entri `atribut.lokasi_luar_batam = true` (terminal Singapura/Johor, Penyengat) hanya untuk konteks rute/cerita, bukan pin direktori Batam.

---

## 2. Identitas, nada, dan batasan (dari keputusan pemilik proyek)

- Nama: **Batam City Hall**. Tagline penegas bahwa ini bukan situs resmi, misalnya "Balai warga, bukan balai kota".
- Footer wajib di semua halaman: "Proyek independen warga Batam, bukan situs resmi Pemerintah Kota Batam atau BP Batam. Untuk layanan resmi: batam.go.id." Tambah atribusi data (gabungan di bagian 4.0 butir 10, plus sumber arsip) dan tautan kolofon.
- Non-komersial: **tanpa iklan, tanpa listing berbayar, tanpa sponsor di direktori.** Boleh tombol donasi (Saweria/Trakteer, URL dari pemilik proyek).
- Nada: premium, elegan, artsy, kalcer, indie. **Informasi dulu, lucu jadi bumbu.** Jenaka kalem dan kering. Hindari semua yang ada di daftar "jangan" pada `data/design/boleh_jangan.md` dan bagian nada di `research/05-panduan-gaya.md`. Tidak ada maskot kartun, tidak ada plesetan di setiap judul, tidak ada bahasa promosi wisata.
- Jangan mirip identitas resmi Pemko Batam (perisai, keris, siluet Barelang sebagai logo, kombinasi merah-kuning-hijau). Lihat bagian logo di laporan 05.

---

## 3. Stack & arsitektur

Ikuti rekomendasi laporan 02 dan 05 kecuali ada alasan kuat (tulis di `docs/PLAN.md`).

- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4**, sama dengan hujandibatam dan batam-bites, deploy ke **Vercel** (region `sin1`). Komponen peta/mural client-only (`dynamic(..., { ssr: false })`).
- **Peta:** `maplibre-gl` + `pmtiles` + `@protomaps/basemaps` (layer Leaflet dari kedua situs lama di-port ke sini, lihat 4.0). Ekstrak area Batam dari build harian Protomaps (lihat laporan 02/05 dan catatan di laporan 00 untuk bbox). Style JSON sendiri untuk **siang** dan **"chart malam"** sesuai `data/design/`. Glyph font self-hosted (PBF) dari font yang dipilih. Graticule + penanda 1°N.
- **Kontur kedalaman:** pipeline GEBCO → GDAL → GeoJSON/PMTiles (laporan 02), label "kedalaman indikatif, bukan untuk navigasi".
- **Mural:** `openseadragon` + tile DZI (`vips dzsave`) + satu canvas overlay, georeferensi **TPS** (`@allmaps/transform`), `suncalc` untuk siang/senja/malam (laporan 02). Fase awal: bangun mesin mural, tool GCP, dan satu segmen contoh memakai **gambar placeholder** yang jelas berlabel "ilustrasi sementara". Ilustrasi asli menyusul dari pemilik proyek/ilustrator.
- **Data:** fase awal = file JSON statis di repo (`data/`), divalidasi saat build dengan **zod**, dan di-generate menjadi modul bertipe. Fitur yang menerima kiriman warga (Tukang Langganan, koreksi data, foto lama) memakai **Supabase (Postgres + PostGIS)**. Pakai skema di `data/schema/tempat.sql` sebagai dasar, disesuaikan dengan skema `places.json`.
- **Aset besar** (PMTiles, tile mural, glyph): Cloudflare R2 atau sejenisnya, dengan fallback lokal untuk development.
- **Pencarian:** indeks klien ringan (misalnya MiniSearch/Fuse) atas nama, nama_alternatif, kelurahan, kecamatan, subkategori.
- **Gaya:** CSS custom properties dari `data/design/design_tokens.css`. Kalau memakai Tailwind, petakan ke token yang sama. Font sesuai laporan 05 (Source Serif 4, Plus Jakarta Sans, IBM Plex Mono; cek lisensi masing-masing dan catat di kolofon).
- **Kualitas:** ESLint, Prettier, tes unit (Vitest) untuk validasi data dan util geo, tes e2e (Playwright) untuk alur utama, dan pemeriksaan aksesibilitas (axe). Target performa HP Android kelas menengah sesuai laporan 02/05.

---

## 4. Halaman dan fitur yang wajib dibangun

Struktur menu "Loket" ada di `research/00-keputusan-percakapan.md` bagian 3. Untuk setiap fitur di bawah, kriteria selesai (✔) harus terpenuhi.

### 4.0 Peleburan hujandibatam & batam-bites (wajib, dikerjakan di fase 2)

Pemilik proyek sudah punya dua situs yang **dilebur** ke Batam City Hall: hujandibatam menjadi **Loket 01 · Langit & Laut**, batam-bites menjadi **Loket 02 · Makan**. Prinsipnya: **pindahkan dan adaptasi kode yang sudah jalan, jangan tulis ulang dari nol, dan jangan riset ulang datanya.** Kedua repo publik:

| Situs | Repo | Isi |
|---|---|---|
| hujandibatam.masbash.id | `https://github.com/bashideffendi/hujandibatam` | Next.js 16, React 19, Tailwind 4, Leaflet, hls.js, pngjs. Tiga mode: **Hujan** (radar 240 km Meteorological Service Singapore, 30 frame × 5 menit, deteksi echo ±20 km, hujan per kecamatan dari mask piksel, prakiraan BMKG kelurahan Teluk Tering, strip kondisi NEA: nowcast, PSI, UV, angin), **Ombak** (tile OFS/WAVEWATCH III BMKG 25 frame × 3 jam, mask daratan CircleGeo, prakiraan Perairan Kep. Batam P.R.02 + peringatan dini), **CCTV** (28 kamera Pemko menurut README; daftar pasti di `lib/cctv.ts`, satu stream on-demand, cek playlist dulu). API: `/api/frames`, `/api/conditions`, `/api/prakiraan`, `/api/ofs-frame`, `/api/perairan`. |
| batam-bites.vercel.app | `https://github.com/bashideffendi/batam-bites` | Next.js 16, React 19, Tailwind 4, Leaflet. 117 tempat makan, 17 kategori, 15 area, 5 jalur kuliner (`trails.json`), 4 terminal feri, filter halal/harga/area/terminal/label/buka sekarang, detail tempat (menu andalan, jam, harga IDR + kurs SGD/MYR/USD, pembayaran, tombol Navigasi Google Maps), favorit (localStorage), ID/EN (siap 中文), PWA. Sasaran: turis SG/MY. |

**Langkah wajib:**
1. **Clone dan baca kedua repo sampai habis** (README, `lib/`, `app/api/`, `hooks/`, `components/`, `data/`). batam-bites punya `AGENTS.md`: Next.js 16 berbeda dari yang kamu kenal, baca dokumentasi di `node_modules/next/dist/docs/` sebelum menulis kode. Pakai Next.js mayor yang sama (16) untuk Batam City Hall supaya porting mulus.
2. **Buat `docs/PARITAS.md`**: daftar SEMUA fitur, perilaku, dan aturan kejujuran kedua situs (mulai dari daftar di bawah, lengkapi dari kode). Setiap butir harus ✔ di Batam City Hall sebelum situs lama dialihkan. Masukkan juga ke `docs/COVERAGE.md`.
3. **Struktur:** pindahkan kode ke modul fitur (misalnya `features/langit-laut/` dan `features/makan/`), catat commit asal di `docs/CHANGELOG.md`. Route: `/langit-laut` (mode `?mode=hujan|ombak|cctv`, `?view=`, `?cam=` tetap didukung) dan `/makan` (daftar, peta, kategori, `/makan/tempat/[slug]`, `/makan/jalur/[slug]`, tersimpan, tentang). API route boleh tetap di path lama (`/api/frames`, dst.) supaya logika tidak berubah.
4. **Satu peta dasar bersama.** Kedua situs memakai Leaflet + CARTO; Batam City Hall memakai MapLibre + Protomaps (bagian 3). Port layer-nya ke MapLibre dengan perilaku sama: radar → `image` source memakai `RADAR_BOUNDS` dari `lib/radar.ts` (bounds hasil georeferensi, jangan diubah); tile OFS → `raster` source dengan `scheme: "tms"` (tile y-flip) dan URL dari `ofsTilePath`; mask daratan → `vector` source CircleGeo layer `indocg` di atas raster ombak; pin CCTV & makan → GeoJSON source dengan clustering. Preset tampilan (`VIEWS`: batam, regional, kepri, natuna, kamera) dipertahankan. **Uji paritas visual**: tangkapan layar overlay radar dan ombak pada waktu dan zoom yang sama di situs lama vs baru; garis pantai harus sejajar. Kalau port ke MapLibre gagal paritas, catat alasannya di `docs/PLAN.md` dan jangan lanjut sebelum diputuskan.
5. **Pertahankan aturan kejujuran hujandibatam** (prinsip "yakin aja"): data asal Singapura ditandai sebagai proksi; label Langsung/Tertunda/Terputus dari umur citra; frame 404 dilewati dan tidak pernah tampil sebagai "tidak hujan"; run OFS basi/kedaluwarsa ditandai; CCTV dicek playlist dulu (`#EXT-X-ENDLIST` = mati, `Last-Modified` tua = beku), tidak ada grid atau autoplay massal, stream berhenti saat tab disembunyikan, tampilkan perkiraan konsumsi data; hls.js build **penuh** (bukan `light`, ada kamera H.265); route realtime `force-dynamic` + `s-maxage` 30–60 detik, **tanpa ISR/prerender**; function region `sin1`; header keamanan dari `next.config.ts`; semua URL eksternal di satu file seperti `lib/sources.ts`; tanpa pelacak. Sumber data cuaca yang benar adalah yang dipakai repo ini (MSS, NEA, BMKG OFS/maritim/prakiraan, CircleGeo, CCTV Pemko); catatan BMKG di `research/00` bagian 9.4 hanya pelengkap.
6. **Data makan:** pindahkan `data/places.json` batam-bites ke `data/makan/` **dengan skema aslinya** (UI Makan memakai field kaya: halal, signature, labels, trails, trilingual). Tambahkan skrip konversi yang menghasilkan `data/places/17-batam-bites.json` dalam skema tempat (kategori baru **`kuliner`**: tambahkan ke enum di `tools/_agent_spec.md`, `tools/merge_places.py`, dan zod; subkategori = kategori batam-bites; field khusus ke `atribut`), lalu jalankan `merge_places.py` agar kuliner ikut pencarian, peta, dan widget silang. Sumber data tetap satu: file di `data/makan/`.
   - **Semua 117 koordinat batam-bites adalah titik tengah area + jitter (`coord_approx: true`)** → `status_koordinat: perlu_cek_ulang`, tampil sebagai "perkiraan area", masuk CSV koordinat untuk diisi pemilik proyek. Tombol Navigasi tetap memakai kueri Google Maps (`gmaps`).
   - `ferries.json` batam-bites diganti data feri Batam City Hall: petakan `batam-centre`, `harbour-bay`, `sekupang`, `nongsapura` ke id kanonik lewat `places_id_index.json` (tambahkan alias bila perlu).
   - Status halal tetap dengan penafian halaman About batam-bites ("kurasi best-effort, verifikasi langsung bila ragu").
   - `rating`/`reviews` (angka Google, 51 tempat) **tidak ditampilkan**, sejalan dengan prinsip tanpa rating bintang; data disimpan. Catat di `docs/DATA_DECISIONS.md` agar pemilik proyek bisa mengubahnya.
   - Label kurasi (Legendaris, Hits, Wajib Coba, Hidden Gem) dipertahankan, tampil bergaya label museum. Emoji kategori diganti ikon garis sesuai panduan gaya.
   - Bahasa: Makan tetap ID/EN (+ 中文 bila ada isinya) karena sasarannya turis; ikuti tombol bahasa situs. Konversi mata uang dipertahankan.
7. **Widget silang** (nilai utama peleburan, laporan 01 "Cara menggabungkan"):
   - Kartu tempat (direktori & makan): "Lagi hujan di kecamatan ini" dari hujan per kecamatan (`lib/kecamatan-mask.ts` + `lib/echo.ts`), berlabel "perkiraan radar MSS".
   - Peta hujan: "kopitiam/kafe terdekat buat berteduh" dari data makan.
   - Detail makan: terminal feri terdekat + **feri terakhir hari ini** dari `data/feri/`; halte Trans Batam terdekat bila koordinat halte sudah terverifikasi.
   - Kotak "Hari Ini" di beranda: hujan sekarang, ombak, peringatan, feri terakhir.
   - Mural: hujan per poligon kecamatan dan ombak dari data yang sama.
   - CCTV terdekat dari tempat di direktori (pelabuhan, simpang besar) bila kamera hidup.
8. **Batas kecamatan:** hujandibatam sudah memakai batas resmi BIG edisi Juni 2026 (`data/kecamatan-kepri.geojson`, `scripts/build-kecamatan.mjs`). Pakai ulang untuk layer batas tipis Batam City Hall (cek dan catat lisensi/atribusi), alih-alih mencari sumber baru.
9. **Pengalihan situs lama (hanya setelah paritas ✔ dan izin pemilik proyek):** kedua situs lama tetap hidup selama transisi. Siapkan peta redirect 301 per path (contoh: `hujandibatam.masbash.id/?mode=ombak&view=kepri` → `/langit-laut?mode=ombak&view=kepri`; `batam-bites.vercel.app/tempat/<slug>` → `/makan/tempat/<slug>`; `/jalur/<slug>`, `/peta`, `/daftar`, `/kategori`, `/saved`, `/about` dipetakan juga). Pengguna PWA lama: siapkan `sw.js` pengganti yang membersihkan cache dan mengarahkan ke situs baru. **Jangan push, deploy, atau mengubah DNS/Vercel situs lama tanpa persetujuan eksplisit.** Favorit batam-bites ada di localStorage domain lama dan tidak bisa pindah otomatis; sediakan tombol "ekspor/impor tersimpan" atau tautan berisi daftar slug.
10. **Atribusi** di footer/kolofon digabung: Citra radar © Meteorological Service Singapore · Kondisi cuaca © National Environment Agency (data.gov.sg) · Prakiraan gelombang & cuaca © BMKG · Daratan © OpenStreetMap contributors (via CircleGeo) · Peta dasar © OpenStreetMap contributors, Protomaps · CCTV © Pemerintah Kota Batam · Batimetri GEBCO.

**Daftar paritas awal** (lengkapi dari kode):
- Langit & Laut: 3 mode; animasi + penggeser waktu radar; jawaban echo ±20 km; hujan per kecamatan; prakiraan BMKG 3-jaman; strip kondisi; legenda hujan 3 tingkat (palet asli MSS); ombak 25 frame + legenda + prakiraan teks + peringatan dini; CCTV pin berkelompok, daftar/direktori kamera, jalan pintas kamera terakhir, status abu untuk kamera mati; preset cakupan; tema siang/malam otomatis jam WIB + toggle; panel bottom-sheet ringkas di HP, bagian Detail; deep link `?mode`/`?view`/`?cam`; tombol Bagikan (Web Share API, fallback salin); PWA + petunjuk pasang di iOS; preferensi tersimpan; halaman galat; sitemap/robots/manifest; kredit sumber.
- Makan: peta ⟷ daftar dengan filter tersinkron; pencarian; filter halal, 17 kategori, 15 area, harga, terminal feri, label, buka sekarang; shortcut "Dekat Terminal Ferry"; detail (menu andalan, jam + buka sekarang, harga IDR + kurs, pembayaran, mini-map, Navigasi); 5 jalur kuliner dengan peta jalur; favorit; ID/EN; About (prinsip tanpa listing berbayar, penafian halal); PWA.

### 4.1 Beranda: peta laut + "Hari Ini"
- Peta chart laut siang/malam (toggle + ikut `prefers-color-scheme`), siluet Singapura/Bintan pucat, graticule, skala batang, mawar angin minimal, atribusi.
- Kotak "Hari Ini": hujan sekarang, ombak, feri terakhir hari ini (dari `data/feri/`), dan peringatan cuaca aktif bila ada. Data hujan/ombak dari modul Langit & Laut hasil peleburan (bagian 4.0).
- ✔ Peta terkunci di area Batam, layer bisa dinyalakan/dimatikan, kartu museum terbuka saat pin diklik, URL bisa dibagikan per pin (`?tempat=<id>`), OG image per tempat untuk WhatsApp.

### 4.2 Direktori lengkap (Loket Info Warga) dari `data/places.json`
- Semua kategori di `data/taksonomi/` dan laporan 06/07/09/12 tampil, termasuk subkategori yang **dirinci** (dokter per spesialis, lapangan per jenis olahraga, sekolah per jenjang negeri/swasta, ibadah per agama, makam per agama, dll.). Kategori tanpa data tetap punya halaman berisi "Belum ada data. Kenal tempatnya? Kabari kami." dan tautan formulir.
- Kartu tempat bergaya label museum: nama, subkategori, kecamatan/kelurahan, alamat, jam, kontak kantor, atribut khusus (BPJS, rawat inap, tipe RS, NPSN, booking, harga, dll.), **status data**, **tanggal terakhir dicek**, sumber (tautan), dan badge ketidakpastian (`perlu_cek_ulang`, `sumber_tunggal`, `cerita_rakyat`, `usang`, `rencana`).
- Filter: kategori, subkategori, kecamatan, kelurahan, buka sekarang (jika jam tersedia), dan status data. Tampilan daftar dan peta.
- Entri `lat/lng = null` hanya muncul di daftar dengan badge "lokasi belum diisi".
- **Hotel:** kategori `akomodasi` di `places.json` (243 tempat: 242 hotel unik dari daftar pemilik proyek, `sumber_riset` `00-data-hotel-user`, + 1 dari laporan 06). Tampilkan nama, kelas bintang (`atribut.bintang`/`kelas_asli`), alamat, kecamatan. 33 hotel belum punya kecamatan: tampilkan "kecamatan belum diketahui", jangan ditebak. **Jangan pernah** menambah kolom pajak (NPWPD, NOP, nilai pajak); data itu sengaja tidak ada di paket.
- **Nomor darurat:** halaman ringkas dari `data/darurat/`.
- **Urusan tanah/rumah: ke mana untuk apa** dari `data/panduan/urusan_tanah.*` (laporan 08), dengan pin MPP sebagai hub.
- **Bantuan hukum & profesi:** Posbakum, LBH, organisasi advokat, PPAT/notaris (label "Beta – data komunitas, verifikasi sendiri"), KJPP, konsultan pajak, plus panduan verifikasi dari `data/panduan/cara_verifikasi_profesi.md`.
- **Layanan dari laporan 09** (KUA, kantor pos, dinas, klinik 24 jam, lab, apotek, PMI, gereja/klenteng, terminal, SPBU/SPKLU, pompong) masuk direktori.
- ✔ Semua entri `places.json` bisa ditemukan lewat pencarian dan filter, jumlah per kategori di UI cocok dengan `places_stats.json`.

### 4.3 Tukang Langganan (Loket 03)
Aturan lengkap di laporan 00 bagian 4. Wajib:
- Formulir rekomendasi (nama tukang, jasa, area/kecamatan, cara menghubungi, kapan dipakai, cerita singkat, tag, kontak perekomendasi yang **tidak pernah ditampilkan**, centang persetujuan).
- Entri tampil publik hanya setelah **≥2 rekomendasi dari perekomendasi berbeda** dan disetujui moderator. Tanpa rating bintang, tanpa listing berbayar.
- Kartu menampilkan jumlah rekomendasi, cerita, tag, area, **terakhir dicek**, tombol "Masih buka?/Sudah pindah", dan "Laporkan masalah" (menyembunyikan sementara).
- Kolom consent dan log persetujuan untuk tukang dan perekomendasi; fitur hapus/koreksi data atas permintaan.
- Halaman admin sederhana untuk moderasi (dilindungi auth Supabase).
- Sumber komunitas dari `data/komunitas/` hanya sebagai referensi pemilik proyek, bukan untuk di-scrape.
- ✔ Alur kirim → moderasi → tampil berjalan end-to-end dengan data contoh fiktif yang jelas ditandai, lalu dikosongkan sebelum rilis.

### 4.4 Trans Batam (Loket 04), permintaan khusus pemilik proyek
Dari `data/trans_batam/` dan laporan 10:
- **Layer rute di peta geografis**: garis per koridor (warna per koridor sesuai usulan palet laporan 10/05), halte, `line-offset` untuk rute yang berimpit. Halte tanpa koordinat tidak dirender di peta tetapi tetap ada di daftar halte koridor. **Koordinat halte di data seed adalah titik landmark (pelabuhan/mal/kampus), bukan posisi halte** (lihat `halte.json` → `meta.catatan_seed`); tampilkan sebagai "perkiraan" atau sembunyikan sampai pemilik proyek mengisi `data/trans_batam/halte_koordinat_perlu_diisi.csv`. Perhatikan `pola`, `halte_transit`, `urutan_pola`, dan gap ("…") di daftar halte: diagram harus menandai gap, bukan menyambung halte yang tidak berurutan.
- **Peta skematik/diagram** ala peta metro (sudut 45/90 derajat, simbol halte transit, legenda), dibuat sebagai SVG dari data urutan halte. Responsif di HP.
- Halaman per koridor: urutan halte, jam operasi, headway, tarif, cara bayar, titik transit, konektivitas (pelabuhan, bandara, RS, kampus, kawasan industri), kontak resmi, tanggal data.
- ✔ Setiap koridor di `koridor.json` punya halaman, jalur di peta (bila geometri tersedia atau bisa disusun dari OSM sesuai laporan 10), dan diagram.

### 4.5 Feri & pompong
Dari `data/feri/` dan laporan 14: terminal & pelantar di peta (koordinat ambil dari `places.json` lewat `places_id_index.json`; `feri/terminal.json` untuk metadata, rute_id, dan terminal luar Batam `sg-*`/`my-*`), rute feri internasional/domestik/pompong, jadwal dengan **tanggal data** dan peringatan "jadwal bisa berubah, cek operator", tautan jadwal resmi, info praktis menyeberang, widget "Feri terakhir hari ini" (zona waktu Asia/Jakarta).
- ✔ Widget menampilkan feri terakhir per rute dari data jadwal; rute tanpa jadwal tampil "jadwal belum tersedia".

### 4.6 Cerita & Budaya (Loket 05)
- **Sejarah Batam:** garis waktu interaktif + esai scrollytelling dari `data/sejarah/garis_waktu.json` (laporan 15), dengan label terverifikasi/beda versi/cerita rakyat, asal-usul nama, perubahan fisik kota, bacaan lanjutan, dan infografis penduduk (`data_penduduk.json`).
- **Batam Dulu vs Sekarang:** fitur foto lama di peta + slider tahun (laporan 01/15), memakai `sumber_arsip.json` dan `perubahan_fisik.json`. Hanya pakai gambar yang lisensinya jelas boleh dipakai ulang; sisanya tampil sebagai tautan ke arsip asli. Formulir kirim foto lama dari warga (dengan izin dan kredit).
- **Peta Kampung Tua:** dari `data/kampung_tua/` (laporan 04). Ikon gapura garis halus, kartu museum (lokasi, sejarah singkat dengan sumber, suku awal, yang bisa dilihat, etika berkunjung, cerita rakyat diberi ikon berbeda). **Jangan tampilkan batas, luas, atau status lahan.** Rempang ditulis netral, bertanggal, dengan atribusi para pihak (laporan 03/04). Ikuti `panduan_etika.md`.
- **Siapa di Balik Nama Jalan:** dari `data/tokoh/` (laporan 16). Kartu tokoh, tautan dari nama jalan/tempat di peta (cocokkan dengan nama jalan OSM bila memungkinkan), diagram relasi/silsilah sederhana, label sejarah vs hikayat.
- **Kalender acara** dari `data/budaya/acara.json`, **kamus Melayu Kepri & bahasa Batam** dari `kamus.json`, halaman budaya Melayu, daftar komunitas kreatif, dan infografis dari `fakta_infografis.json`.
- ✔ Semua item di file data tersebut tampil; topik sensitif mengikuti aturan bagian 6.

### 4.7 Mode Mural
Sesuai laporan 02 dan 03: OpenSeadragon, 8 segmen di `data/mural/segmen.json`, strip navigasi perhentian, hotspot ke kartu museum, quest edukatif (misalnya 6 jembatan Barelang), overlay hidup (siang/senja/malam dulu, lalu hujan per poligon, ombak, feri dari jadwal), reduced-motion, tool GCP internal, dan pipeline tile (`vips dzsave` → R2).
- ✔ Satu segmen berjalan penuh dengan placeholder dan data hidup; segmen lain tampil "segera" di strip.

### 4.8 Berita Batam (RSS), belum diriset, kerjakan sendiri
- Telusuri sendiri feed RSS/Atom resmi media lokal dan sumber resmi (misalnya Batam Pos, Tribun Batam, Batamnews, Antara Kepri, GoWest/GoKepri, BatamToday, Media Center Pemko Batam, BP Batam). Catat hasilnya di `docs/SUMBER_BERITA.md` (URL feed, terakhir dicek, catatan).
- Tampilkan hanya **judul, sumber, waktu, dan tautan** ke artikel asli. Jangan menyalin isi artikel. Cache di server (route handler, revalidate 15–30 menit), batasi jumlah, dan tangani feed yang mati.
- ✔ Halaman berita dan widget kecil di beranda berjalan dengan minimal 3 feed yang terbukti valid.

### 4.9 Loket Main-main (fase akhir)
Quest mural, generator kartu pos dari ilustrasi, dan "Batam Vibe Map" dengan kategori aman (cuaca, macet, ngopi), **tanpa** kategori etnis/kelas.

### 4.10 Halaman pendukung
Tentang (prinsip non-komersial, cara kerja data), Kolofon (font, lisensi data, atribusi arsip, keterbukaan soal AI bila dipakai), Cara Berkontribusi, Koreksi Data, Kebijakan Privasi & Syarat (draf konservatif, bagian 7), dan 404 bernada kalem.

---

## 5. Pipeline data

1. **Validasi saat build:** skema zod untuk `places.json` dan semua file domain. Build gagal jika data tidak valid.
2. **Penggabungan:** `tools/merge_places.py` sudah dijalankan (887 entri → 775 tempat, 0 masalah validasi). Jika menambah/mengubah `data/places/*.json`, jalankan ulang. Duplikat yang tidak tertangkap otomatis didaftarkan di `tools/merge_aliases.json` (sudah 30 grup: terminal feri, RS Elisabeth, Dataran Engku Putri, Masjid Agung Raja Hamidah, kantor pos, imigrasi, BPN, dll.). Kalau menemukan duplikat lain, tambahkan grup di sana, jangan menghapus entri sumber. Tinjau `data/places_konflik.json`, putuskan versi yang dipakai, catat keputusannya di `docs/DATA_DECISIONS.md`.
3. **Koordinat dari pemilik proyek:** pemilik proyek mengisi `data/koordinat_perlu_diisi.csv` (763 baris, urut prioritas 1–5, ada kolom tautan Google Maps) dan `data/trans_batam/halte_koordinat_perlu_diisi.csv` (191 halte). Jalankan `python3 tools/import_koordinat.py <csv>`. Koordinat tempat juga disimpan ke `data/koordinat_user.json` sehingga tidak hilang saat merge diulang. Sediakan juga halaman admin untuk mengisi koordinat dengan klik di peta (menulis ke format yang sama).
4. **OSM/Overpass:** pakai query di `data/osm/overpass/`. Simpan hasil tarikan di `data/osm/` dengan tanggal. Data OSM hanya untuk (a) mengecek koordinat dan (b) layer terpisah ber-atribusi ODbL; jangan dicampur diam-diam ke data kurasi. Jalankan query hitung kelengkapan (laporan 06) dan catat hasilnya.
5. **Geoportal:** ikuti rekomendasi laporan 11 (`data/sumber_data/`). Ambil hanya data yang lisensinya jelas; sisanya untuk referensi/cek manual.
6. **Batas wilayah:** sumber batas kecamatan/kelurahan sesuai rekomendasi laporan 11; tampilkan sebagai layer tipis, bukan klaim resmi.
7. **Kesegaran data:** setiap entri menampilkan tanggal terakhir dicek. Buat halaman admin "Data yang perlu dicek ulang" (status `perlu_cek_ulang`, `usang`, atau lebih dari 6 bulan sejak dicek).

---

## 6. Topik sensitif (wajib dipatuhi)
- **Rempang Eco-City, kampung tua, sengketa lahan:** fakta bertanggal, atribusi jelas (pemerintah/BP Batam, Ombudsman, warga/Walhi), tanpa humor, tanpa ilustrasi bangunan proyek, tanpa batas/luas lahan. Cantumkan "terakhir diperbarui".
- **Bekas kamp pengungsi Galang dan makam Nghia Trang:** nada memorial, tanpa quest/poin game.
- **Cerita rakyat** selalu diberi label. Istilah etnis lama yang berpotensi merendahkan diparafrasekan atau diberi konteks.
- **Agama & etnis:** bahasa netral dan setara; tidak ada kategori "vibe" berbasis kelompok.

## 7. Privasi & etika (default konservatif; riset hukum ditunda)
- Tidak menampilkan nomor HP pribadi. Kontak yang tampil hanya kontak kantor/usaha yang dipublikasikan resmi, atau kontak tukang yang sudah memberi izin.
- Data pribadi (nomor perekomendasi, email pengirim) tidak pernah dikirim ke klien; simpan seminimal mungkin dengan kolom consent dan timestamp.
- Analytics ramah privasi tanpa cookie pelacak.
- Gambar arsip hanya yang lisensinya jelas; selalu kredit sesuai `sumber_arsip.json`.
- CCTV: hanya tampilkan apa yang sudah ditampilkan hujandibatam, dengan sumber yang sama.
- Siapkan draf Kebijakan Privasi dan Syarat Penggunaan singkat, ditandai "draf, belum ditinjau ahli hukum".

## 8. Aksesibilitas & performa
- Kontras sesuai token (sudah dihitung lolos AA; verifikasi otomatis dengan axe). Status tidak hanya dibedakan warna.
- Semua hotspot/pin punya alternatif daftar yang bisa dinavigasi keyboard; dialog kartu memakai fokus yang benar.
- `prefers-reduced-motion` mematikan animasi; tombol "Gerak: hidup/tenang".
- JS peta/mural dimuat lazy; grain/tekstur sebagai tile kecil (bukan `feTurbulence` live); uji di profil CPU 4× lambat.

---

## 9. Urutan fase (boleh disesuaikan, catat di PLAN.md)
1. **Fondasi:** repo, token desain, font, layout, footer/atribusi, validasi data, peta dasar siang/malam, halaman Tentang/Kolofon.
2. **Peleburan (bagian 4.0):** port hujandibatam → Langit & Laut dan batam-bites → Makan di peta bersama, data kuliner masuk `places.json`, `docs/PARITAS.md` semua ✔, kotak "Hari Ini". Situs lama belum dialihkan.
3. **Direktori & pencarian:** semua kategori dari `places.json`, kartu museum, filter, daftar tanpa koordinat, OG image, nomor darurat, urusan tanah, bantuan hukum, widget silang hujan/makan/feri.
4. **Jalan-jalan:** Trans Batam (geografis + skematik), feri & pompong, widget feri terakhir.
5. **Cerita & Budaya:** sejarah, Kampung Tua, nama jalan, kalender, kamus, budaya, infografis, Batam Dulu.
6. **Tukang Langganan:** Supabase, formulir, moderasi, consent, aturan 2 rekomendasi.
7. **Berita RSS.**
8. **Mural:** mesin, GCP tool, satu segmen placeholder, overlay hidup (hujan per kecamatan, ombak, feri).
9. **Main-main**, penyempurnaan, lalu **pengalihan situs lama** (setelah izin pemilik proyek).
10. **Audit akhir:** `docs/COVERAGE.md` tanpa `[ ]`, Lighthouse/axe, uji HP, daftar TODO untuk pemilik proyek.

## 10. Yang harus diminta dari pemilik proyek (tanya sekali, di awal, dalam satu daftar)
1. **hujandibatam** dan **batam-bites**: repo sudah publik (bagian 4.0), jadi tidak perlu minta akses baca. Yang perlu ditanyakan: izin sebelum mengubah repo/deploy/DNS situs lama, kapan boleh redirect, dan apakah kunci CARTO masih perlu (tidak perlu bila basemap pindah ke Protomaps).
2. Apakah rating Google di data makan boleh ditampilkan (default: tidak).
3. Proyek **Supabase** (atau izin membuatnya) dan **Vercel**.
4. Bucket aset (Cloudflare R2 atau alternatif) untuk PMTiles dan tile mural.
5. Domain yang dipakai.
6. URL donasi (Saweria/Trakteer) bila sudah ada.
7. Koordinat yang sudah diisi di `data/koordinat_perlu_diisi.csv` dan `data/trans_batam/halte_koordinat_perlu_diisi.csv` (boleh menyusul).
8. Ilustrasi mural/landmark (boleh menyusul; pakai placeholder dulu).

## 11. Definisi selesai
- Semua fitur di bagian 4 memenuhi kriteria ✔, dan `docs/PARITAS.md` (hujandibatam + batam-bites) seluruhnya ✔.
- `docs/COVERAGE.md` mencakup setiap bagian dari 17 file riset (00–16) dan tidak menyisakan `[ ]`.
- Semua data di `data/` terpakai atau dijelaskan alasan tidak dipakai (bagian "File data" di COVERAGE).
- Setiap butir "celah yang diketahui" di `README.md` paket ditangani atau dicatat sebagai TODO pemilik proyek.
- Build, lint, tes unit, tes e2e, dan axe lulus.
- `README.md` repo menjelaskan cara menjalankan, menambah data, mengimpor koordinat, menarik OSM, dan membuat tile mural.
