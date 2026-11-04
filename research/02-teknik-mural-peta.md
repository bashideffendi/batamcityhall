# Batam City Hall: Riset Teknik Mural Interaktif dan Peta Artsy
> task_id: wf-63281ef7-42be-5d9b-91ac-0775ff777914

# Batam City Hall: Riset Teknik Mural Interaktif & Peta Artsy (bahan prompt Claude Code)

Intinya: bangun **Mode Peta dulu** (MapLibre + PMTiles + style nautical chart + kontur GEBCO + sketsa landmark sebagai ikon/SVG), lalu bikin **Mode Mural per segmen** pakai **OpenSeadragon + tile DZI dari `vips dzsave`** dan overlay hidup di **satu canvas/WebGL terpisah**. Data lat/lng dipetakan ke piksel mural lewat **thin plate spline (TPS) dari titik kontrol**. Cara ini paling realistis buat dev solo, dan ini juga cara yang dipakai proyek sejenis yang paling terdokumentasi (Isometric NYC).

## TL;DR

- **Stack mural yang terbukti jalan:** gambar raksasa → `vips dzsave` → tile DZI → OpenSeadragon. Isometric NYC (Andy Coenen) memakai persis pola ini, di-host di Cloudflare. Leaflet `CRS.Simple` dan MapLibre raster juga bisa, tapi OpenSeadragon paling ringan dan paling pas buat "gambar seni yang di-zoom".
- **Georeferensi:** jangan pakai affine untuk ilustrasi oblique/panorama yang dibengkokkan. Pakai TPS (`@allmaps/transform`) dengan ±30–80 titik kontrol per segmen, simpan hasilnya di JSON, dan pakai dua arah (lat/lng → piksel untuk data hidup, piksel → lat/lng untuk "buka di Mode Peta").
- **Produksi ilustrasi:** hibrida. Ilustrator lokal menggambar landmark + "kunci gaya" (palet risograph, ketebalan garis). Mural penuh dibangun segmen demi segmen (mulai Barelang atau Nagoya–Harbour Bay), boleh dibantu AI untuk isian latar asal dijelaskan terbuka. Pengalaman Isometric NYC menunjukkan AI per tile murah untuk tahap generate, tapi QA dan perbaikan manual (terutama air dan pohon, yang di Batam ada di mana-mana) makan sebagian besar waktu.

## Key Findings

| Temuan | Status |
|---|---|
| Isometric NYC: tile 512×512 hasil model Qwen/Image-Edit yang di-fine-tune (~40 pasangan contoh, ~4 jam, ~$12), dari render Google Maps 3D Tiles, ditampilkan pakai OpenSeadragon | **Terverifikasi** (tulisan pembuatnya) |
| Isometric NYC disajikan sebagai tile DZI lewat Cloudflare | **Terverifikasi sekunder** (ringkasan diskusi HN) |
| Mural Skytree (teamLab): mural digital panjang 40 m, tinggi 3 m, digambar tangan dengan bantuan digital, ada monitor tertanam yang menampilkan animasi | **Terverifikasi** (teamLab + liputan) |
| Mural Jakarta (jakarta.oyenza.com): stack, format tile, dan cara produksi ilustrasinya | **Belum terverifikasi.** Situsnya tidak bisa diambil dan repo publiknya tidak ketemu. Pembuat yang sama (Luca Cada Lora / Oyenza) punya repo `isometric-jakarta`, game city builder fork IsoCity (MIT), tapi itu proyek lain |
| `vips dzsave` mendukung layout `dz`, `zoomify`, `google`, `iiif`, `iiif3`, output ZIP, dan melewati tile kosong (`skip_blanks`) | **Terverifikasi** (dok libvips) |
| PMTiles bisa menyimpan raster PNG/JPEG/WebP, tapi tooling untuk gambar non-geografis masih kurang (maintainer menyarankan tool berbasis Pillow) | **Terverifikasi** (issue GitHub PMTiles) |
| Cloudflare R2: menurut halaman harga resmi Cloudflare (developers.cloudflare.com/workers/platform/pricing/), free tier "10 GB-month / month", Class A "1 million requests / month", Class B "10 million requests / month", dan "There are no charges for egress bandwidth." | **Terverifikasi** (dok resmi Cloudflare) |
| Ukuran bundle (min+gzip): OpenSeadragon 6.1.1 ±88 kB; Leaflet 1.9.x ±40 kB (beranda resmi leafletjs.com: "Weighing just about 40 KB of JS"; Leaflet 2.0 beta dirilis 2 Nov 2026 dengan "Tree-shakable ES modules", 25,6 kB untuk peta + tile layer); PixiJS v8.22 ±258 kB (bisa di-tree-shake); MapLibre tanpa angka resmi (satu README pihak ketiga menyebut "379 kB gzipped", tapi itu termasuk font vektor) | **Campuran**, lihat tabel Q2 |
| Kantor Hak Cipta AS (Jan 2025): output murni AI dari prompt tidak bisa dilindungi hak cipta; seleksi, susunan, dan modifikasi oleh manusia bisa dilindungi | **Terverifikasi** (copyright.gov) |

---

## 1. Bagaimana proyek sejenis dibuat

### Isometric NYC: contoh terbaik yang terdokumentasi
Sumber utama: https://cannoneyed.com/projects/isometric-nyc (situs: https://isometric.nyc, diskusi: https://news.ycombinator.com/item?id=46721802)

Alur yang ditulis pembuatnya, Andy Coenen:
1. **Render dasar.** Awalnya pakai data CityGML untuk render "whitebox" isometrik (kamera orthographic) di atas citra satelit. Hasilnya terlalu sering memicu halusinasi model. Ia lalu pindah ke **Google Maps 3D Tiles API** yang dirender di browser dengan kamera orthographic, karena geometri dan teksturnya presisi.
2. **Model gaya.** Nano Banana Pro bagus tapi tidak konsisten ("at best 50/50"), lambat, dan mahal untuk perkiraan 40 ribu tile. Solusinya: fine-tune **Qwen/Image-Edit** di oxen.ai pakai ~40 pasangan input/output, selesai ~4 jam dengan biaya ~$12.
3. **Infill tanpa sambungan.** Dataset dibuat dengan sebagian target di-mask, jadi tile baru digenerate dengan konteks tetangganya. Skemanya "kuadran" 512×512, dan satu panggilan model menghasilkan gambar 2×2 kuadran. Metadata disimpan di **SQLite**, lalu ada web app untuk memilih kuadran mana yang mau digenerate.
4. **Scaling.** Inference pindah ke GPU H100 sewaan (Lambda): "For less than $3 an hour and more than 200 generations/hour".
5. **Masalah.** Air dan pohon gagal terus. QA otomatis tidak bisa diandalkan karena model tidak bisa "melihat" sambungan. Akhirnya ada banyak perbaikan manual, termasuk ekspor ke Affinity.
6. **Viewer.** Pakai **OpenSeadragon**, tapi ia menulis bahwa masalah zoom, ruang koordinat, caching, dan performa "seems like a very pathological challenge for today's generation of coding agents".

**Pelajaran untuk Batam:** Batam itu kota kepulauan, banyak laut, mangrove, dan hutan. Itu persis area yang paling bermasalah untuk AI per tile. Jadi kalau pakai AI, laut sebaiknya **bukan digenerate**, melainkan dirender prosedural (shader ombak) di atas mask air. Ini malah cocok dengan fitur "ombak sesuai tinggi gelombang".

Katalog proyek serupa: Isometric Map Finder (https://10015.io/tools/isometric-map-finder) mengumpulkan peta isometrik kota (tiny.london, Istanbul, dll.) dan menulis bahwa sebagian besar mengikuti metode Isometric NYC. Ini agregator, jadi detail tiap proyek perlu dicek sendiri.

### Mural Tokyo Skytree (teamLab): inspirasi Mural Jakarta
Sumber: https://www.teamlab.art/e/tokyoskytree/ dan https://www.vice.com/en/article/teamlabs-40-meter-digital-mural-captures-even-the-strangest-details-of-tokyo/
- Mural fisik di Tokyo Skytree, panjang ±40 m dan tinggi 3 m. Monitor tertanam di dinding menampilkan animasi (perahu, mobil, awan, orang). Jumlah monitornya beda antar sumber: teamLab menyebut 10, VICE menyebut 13.
- teamLab: "completely hand-drawn with the support of digital technology", memakai teknik Ukiyo-e dan cetak Edo. Ruangnya disebut "ultra subjective space": **tanpa titik hilang**, kedalaman dibangun dari tumpukan figur, mirip layar lipat Edo.
- **Implikasi desain:** gaya "panorama tanpa perspektif tunggal" ini cocok untuk jalur cerita Batam (utara → selatan lewat Barelang). Kita tidak terikat proyeksi isometrik yang ketat, tapi konsekuensinya georeferensi wajib pakai TPS (lihat Q3).

### Mural Jakarta (jakarta.oyenza.com)
- **Belum terverifikasi:** library viewer, format tile, cara produksi ilustrasi, dan cara penyimpanan game "Cari! 1/8". Situsnya tidak bisa diambil oleh alat riset dan repo publiknya tidak ditemukan.
- **Yang terverifikasi:** pembuat dari brand yang sama (Oyenza, GitHub `lucacadalora`) punya repo https://github.com/lucacadalora/isometric-jakarta, yaitu game city builder isometrik pixel yang merupakan fork **IsoCity (MIT)** dan jalan di game.oyenza.com. README-nya: "The engine, simulation and most of the art come from IsoCity". Ini **bukan** mural, tapi menunjukkan pembuatnya memang bekerja dengan aset isometrik pixel.
- **Cara cek sendiri (5 menit):** buka situsnya, DevTools → Network. Kalau ada request `*.dzi` atau `_files/{level}/{x}_{y}.jpg`, itu DZI/OpenSeadragon. Kalau ada `/{z}/{x}/{y}.png` dengan `leaflet.js`, itu Leaflet. Cari juga file JSON hotspot.
- **Peluang untuk "lebih bagus":** Mural Jakarta (dari deskripsimu) statis. Pembeda Batam City Hall ada di **data hidup** (hujan, ombak, feri, jam), **kartu museum yang informatif**, dan **gaya risograph yang terkendali**, bukan di kepadatan detail ala Where's Waldo.

---

## 2. Perbandingan library gambar raksasa

| Kriteria | **OpenSeadragon** | **Leaflet + CRS.Simple** | **MapLibre GL (raster, piksel → "lat/lng palsu")** | **deck.gl (OrthographicView + TileLayer)** | **PixiJS v8 + pixi-viewport** |
|---|---|---|---|---|---|
| Ukuran (min+gzip) | ±88 kB (v6.1.1, laporan size-check CI di fork) | ±40 kB (1.9.x; beranda leafletjs.com: "Weighing just about 40 KB of JS"); 2.0 beta (rilis 2 Nov 2026) 25,6 kB untuk peta + tile layer | tanpa angka resmi; satu README pihak ketiga: "379 kB gzipped" termasuk font (cek Bundlephobia, v6.2.0) | besar (asumsi: ratusan kB) | 258 kB penuh (Bundlephobia), bisa di-tree-shake |
| Format tile bawaan | DZI, IIIF, Zoomify, gambar biasa | XYZ `{z}/{x}/{y}`; DZI/Zoomify lewat plugin | XYZ, PMTiles (via `pmtiles` protocol) | custom loader | tidak ada, harus bikin sendiri |
| Rendering | Canvas 2D (opsional WebGL drawer di versi baru, asumsi) | DOM `<img>` per tile | WebGL | WebGL | WebGL |
| Overlay interaktif | `addOverlay` (elemen DOM), plugin SVG overlay, Annotorious | Marker/Polygon/SVG bawaan, sangat mudah | Layer GeoJSON + `queryRenderedFeatures`; terasa alami karena satu engine dengan Mode Peta | Picking bawaan | Event per sprite; animasi paling bebas |
| Animasi partikel/efek | Pakai canvas terpisah di atasnya | Canvas terpisah | Custom layer WebGL | Custom layer | **Terbaik** (filter, shader, blend mode) |
| HP Android menengah | Bagus; dirancang untuk gigapixel | Bagus, tapi DOM berat kalau marker ribuan | Bagus; satu konteks WebGL dipakai bersama | OK, tapi bundle berat | Bagus kalau culling tile benar; perlu kerja manual |
| Next.js | Client-only (`dynamic(() => import(...), { ssr:false })`) | Client-only; ada react-leaflet | Client-only; ada react-map-gl/maplibre | Bagus (React-first) | Client-only; ada @pixi/react |
| Cocok untuk | **Mural seni deep-zoom** | Peta "game", prototipe cepat | Kalau mau **satu engine** untuk Peta + Mural | Data-viz berat | Mural yang sangat "game-like" |

**Rekomendasi:** OpenSeadragon untuk mural, dengan **satu `<canvas>` overlay** (Canvas2D atau PixiJS minimal) yang disinkronkan ke viewport OSD untuk efek hidup. Alternatif yang patut dipertimbangkan serius: **MapLibre untuk keduanya**. Mural diperlakukan sebagai raster di koordinat palsu, misalnya piksel dipetakan ke derajat kecil dekat 0,0. Untungnya, kode layer, popup, dan URL state bisa dipakai bareng dengan Mode Peta. Ruginya, ada distorsi Mercator kalau area palsunya jauh dari ekuator, jadi taruh di sekitar lat 0. Ini **asumsi teknis** dan perlu prototipe.

Leaflet `CRS.Simple`: dok resminya https://leafletjs.com/examples/crs-simple/crs-simple.html. Plugin `leaflet-rastercoords` (https://github.com/commenthol/leaflet-rastercoords) membantu konversi piksel ↔ latlng. Satu hal yang sering bikin bingung: satuan `CRS.Simple` itu arbitrer, bukan 1 piksel gambar (lihat https://github.com/Leaflet/Leaflet/discussions/9579).

### Membuat tile
```bash
# DZI (OpenSeadragon), WebP kualitas 82, tile 512
vips dzsave batam_mural_seg01.tif public/tiles/seg01 \
  --tile-size 512 --overlap 1 --suffix .webp[Q=82]
# hasil: seg01.dzi + seg01_files/{level}/{col}_{row}.webp

# Layout Google/XYZ (Leaflet/MapLibre), lewati tile kosong
vips dzsave seg01.tif out_xyz --layout google --suffix .webp[Q=82] --background 244,239,228

# Satu ZIP (praktis untuk upload)
vips dzsave seg01.tif seg01.zip

# Alternatif GDAL (non-geografis)
gdal2tiles.py --xyz -p raster -z 0-6 -w none seg01.png tiles/
```
Dok: https://libvips.org/API/current/Making-image-pyramids.html. Di layout Google, `skip_blanks` default 5, jadi tile polos tidak ditulis. Ini menghemat file untuk area laut atau kertas kosong.

**PMTiles raster** bisa dipakai supaya satu file berisi semua tile (bagus untuk R2, tanpa ribuan objek). Konversinya: ambil folder XYZ → MBTiles (misalnya lewat `mb-util`) → `pmtiles convert`. Untuk gambar non-geografis tooling-nya belum mulus. Maintainer Protomaps menyarankan tool berbasis Pillow, bukan Rasterio (https://github.com/protomaps/PMTiles/issues/338). OpenSeadragon tidak membaca PMTiles secara bawaan, jadi butuh custom `tileSource` yang membaca range request. Ini **asumsi**: bisa dibuat, tapi belum ada library siap pakai yang terverifikasi.

### Hosting
- **Cloudflare R2:** menurut halaman harga resmi Cloudflare (https://developers.cloudflare.com/workers/platform/pricing/), Standard "$0.015 / GB-month", Class A "$4.50 / million requests", Class B "$0.36 / million requests", free tier 10 GB-bulan + 1 juta op A + 10 juta op B per bulan, dan "There are no charges for egress bandwidth." Satu mural 6 segmen × ±100 MB tile WebP masih di bawah 10 GB. Pasang domain kustom + cache CDN supaya pembacaan berulang tidak dihitung sebagai Class B.
- **Vercel:** taruh app Next.js di sini, **jangan** puluhan ribu tile di `public/`, karena akan memperberat deploy dan memakan kuota bandwidth Vercel (asumsi berdasarkan model harga Vercel; cek paket kamu).
- **Upload:** `rclone copy public/tiles r2:batam-mural/tiles --transfers 32`. Untuk PMTiles: `rclone copyto file.pmtiles r2:bucket/file.pmtiles`. Aktifkan CORS di bucket.

---

## 3. Georeferensi ilustrasi non-ortografis

**Masalahnya:** di mural panorama, skala dan arah berubah di sepanjang jalur. Barelang mungkin "diregangkan" supaya 6 jembatannya terbaca, sementara Mukakuning dipadatkan. Transformasi affine (6 parameter, garis lurus tetap lurus) cuma akurat untuk ilustrasi isometrik murni dari satu render orthographic.

**Pilihan:**
1. **Affine / polinomial orde 1:** cukup untuk segmen yang digambar di atas render isometrik ketat. Minimal 3 titik kontrol (GCP).
2. **Thin Plate Spline (TPS):** "karet" yang lewat tepat di semua GCP dan halus di antaranya. **Paling cocok** untuk panorama yang dibengkokkan. `@allmaps/transform` (https://allmaps.org/docs/packages/transform/) adalah port JS dari `gdaltransform`, mendukung polinomial dan TPS, maju dan mundur. Alternatif ringan: ThinPlateSplineJS (https://github.com/tilemapjp/ThinPlateSplineJS), MIT, dengan serialisasi hasil solve.
3. **Triangulasi piecewise-affine (Delaunay dari GCP):** affine per segitiga, dengan `d3-delaunay`. Cepat dan bisa diprediksi, tapi muncul "patahan" di tepi segitiga. Bagus kalau GCP rapat di sepanjang jalan.
4. **Parameter jalur (khusus feri dan jalan):** jangan transformasi titik per titik. Gambar ulang jalur feri sebagai **polyline di ruang piksel mural**, lalu posisikan kapal berdasarkan **fraksi waktu perjalanan** (0..1) di polyline itu. Hasilnya selalu berada di "laut" yang benar.

**Alur kerja konkret:**
```ts
// data/mural/seg01.gcps.json  ← dibuat sekali lewat tool klik
type GCP = { resource: [number, number]; geo: [number, number]; label?: string };

import { GcpTransformer } from '@allmaps/transform';
const t = new GcpTransformer(gcps, 'thinPlateSpline');
const px = t.transformBackward([104.0305, 1.1450]); // lng,lat → piksel mural
const geo = t.transformForward([12345, 6789]);      // piksel → lng,lat
```
- **Bikin tool GCP sendiri** (micro-tool, persis gaya Isometric NYC): layar kiri MapLibre, layar kanan OpenSeadragon, klik pasangan titik, simpan ke JSON. Pilih titik yang jelas: ujung jembatan Barelang, pelabuhan feri (Harbour Bay, Sekupang, Batam Centre, Nongsa Pura), simpang besar, masjid/landmark.
- Taruh **30–80 GCP per segmen**, rapat di area yang dibengkokkan. Validasi dengan "leave-one-out": hapus satu GCP, ukur error-nya dalam piksel. Targetnya di bawah 40 px pada zoom penuh (asumsi target UX).
- **Poligon hujan:** ambil sel grid/poligon hujan dari hujandibatam dalam lat/lng, **densify** tepinya (sisipkan titik tiap ±200 m), lalu transformasi tiap titik ke piksel. Tanpa densify, tepi lurus tidak ikut melengkung bersama TPS.
- Hitung sekali di build/server (Route Handler Next.js dengan cache), kirim ke klien dalam koordinat piksel.

---

## 4. Overlay hidup

**Arsitektur render:** OpenSeadragon (tile) → **satu `<canvas>` overlay** ukuran viewport. Di setiap event `animation`/`update-viewport` dari OSD, ambil transformasi `viewer.viewport.imageToViewerElementCoordinates()` lalu gambar ulang. Satu loop `requestAnimationFrame`, satu canvas, semua efek di sana. Jangan bikin canvas per efek.

### Hujan yang dibatasi poligon
- **Canvas2D (cukup untuk MVP):** `ctx.save(); ctx.beginPath(); /* path poligon hujan dalam koordinat layar */; ctx.clip();` lalu gambar garis-garis hujan pendek (bukan sprite), `ctx.restore()`. Jumlah partikel diskalakan ke luas poligon di layar dan intensitas mm/jam, dengan **batas keras ±600 partikel di HP** (asumsi anggaran).
- **WebGL/PixiJS:** pakai poligon sebagai **mask** (`sprite.mask = graphics`) atau stencil. Partikel lewat `ParticleContainer`. Gaya riso: hujan berupa garis 1 px warna tinta biru riso, `globalCompositeOperation = 'multiply'` supaya terlihat seperti tinta tercetak.
- **Kabut hujan:** isi poligon dengan tekstur halftone/grain semi-transparan. Murah dan sangat "riso".

### Ombak dengan intensitas variabel
- Masker air (PNG 1-bit per segmen, dibuat dari layer air ilustrator atau dari OSM water polygon lewat TPS) menentukan di mana ombak boleh muncul.
- Efek murah: beberapa layer garis ombak bergaya chart (ikon "~" kecil, atau pola garis sejajar pantai) yang digeser pakai sin(t) dengan **amplitudo dan kecepatan = f(tinggi gelombang)** dari data ombak hujandibatam. Contoh: Hs < 0,5 m tenang (gerak 1 px, lambat); > 1,5 m ada busa putih.
- Versi WebGL: fragment shader dengan noise + displacement ringan di area mask. Batasi resolusi render ke 0,5× DPR di HP.

### Kapal feri sesuai jadwal
```ts
// data/ferry/routes.json: polyline piksel per rute + durasi
// data/ferry/schedule.json: { route: 'batamcentre-harbourfront', depart: '08:00', durationMin: 60 }
const now = nowInZone('Asia/Jakarta'); // Batam = WIB, UTC+7
const f = clamp((now - depart) / duration, 0, 1);
const [x, y, angle] = pointAlongPolyline(routePx, f); // turf.along versi piksel
```
- Ini **posisi perkiraan dari jadwal**, bukan AIS realtime. Wajib diberi label jujur di kartu: "posisi perkiraan berdasar jadwal".
- Jadwal disimpan di Google Sheets → di-cache via Route Handler (`revalidate: 3600`).

### Siang–senja–malam
- Hitung fase dari **posisi matahari** (library `suncalc`, lat 1,1 lng 104,0), bukan jam tetap. Di Batam, matahari terbit dan terbenam sekitar pukul 06–07 dan 18–19 WIB sepanjang tahun (asumsi umum untuk dekat ekuator; hitung dengan suncalc).
- **Teknik yang direkomendasikan, dari murah ke mahal:**
  1. **CSS overlay di atas viewer:** `mix-blend-mode: multiply` dengan gradien (senja oranye-merah muda, malam biru tua 60%). Paling murah dan langsung jalan.
  2. **Layer malam terpisah:** ilustrator membuat **layer "lampu"** (jendela ruko, lampu jalan, lampu jembatan Barelang) sebagai **tile terpisah** (PNG transparan → DZI kedua) yang di-fade in dengan `opacity` dan blend `screen`/`lighter`. OSD mendukung banyak `TiledImage` sekaligus (`viewer.addTiledImage`). Hasil "ruko menyala" seperti ini **jauh lebih bagus** daripada filter warna.
  3. **LUT warna di WebGL:** tekstur LUT 3D per fase. Paling fleksibel, tapi mewajibkan semua tile dirender lewat WebGL. Simpan untuk nanti.
- Gaya riso kebetulan cocok: palet terbatas = mudah di-remap. Malam = tinta biru gelap + kuning fluoro untuk lampu.

### prefers-reduced-motion & anggaran performa
```ts
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// reduce → hujan jadi arsiran statis, ombak berhenti, kapal "melompat" tiap 1 menit, tanpa transisi zoom animasi
```
- Sediakan juga tombol "Gerak: hidup / tenang" di UI, jangan cuma mengandalkan setting OS.
- **Anggaran untuk HP Android menengah** (asumsi kerja, ukur dengan Chrome DevTools remote + Performance panel):
  - Target 30 fps untuk efek; turunkan ke 15–20 fps saat idle.
  - Overlay canvas dirender di DPR maksimal 1,5.
  - Hentikan loop saat tab tersembunyi (`document.visibilityState`) dan saat viewer tidak terlihat (IntersectionObserver).
  - Tile WebP 512 px, Q 75–82. Muatan awal di bawah 1,5 MB.
  - JS mode Mural dimuat lazy (dynamic import) hanya saat tab Mural dibuka.

---

## 5. Hotspot & permainan mencari

### Penyimpanan anotasi
Pakai format **W3C Web Annotation** supaya kompatibel dengan Annotorious (https://github.com/annotorious/annotorious-v2-openseadragon, BSD-3). Atau pakai JSON sederhana milik sendiri:
```json
{
  "id": "kampung-tua-tanjung-riau",
  "segment": "seg02",
  "shape": { "type": "polygon", "points": [[1203,880],[1260,872],[1271,930],[1210,941]] },
  "geo": [103.95, 1.16],
  "kind": ["kampung-tua"],
  "title": { "id": "Kampung Tua Tanjung Riau", "en": "Tanjung Riau Old Village" },
  "museumLabel": { "year": "…", "material": "…", "body": "…" },
  "quests": ["temukan-8-kampung-tua"],
  "source": "Wajib diisi: sumber data/narasumber"
}
```
- Data tempat (makan, Tukang Langganan) tetap di Supabase/Sheets dengan lat/lng. Posisi pikselnya **dihitung** lewat TPS, bukan diketik manual. Hanya landmark yang **digambar** di mural yang butuh poligon manual.
- Annotorious dipakai sebagai **editor internal** untuk menggambar poligon. Di produksi, render hotspot sendiri supaya ringan.

### Area klik presisi
- Hit-test poligon di ruang gambar: konversi titik tap ke koordinat gambar (`viewer.viewport.viewerElementToImageCoordinates`), lalu point-in-polygon. Tambah toleransi minimal 44×44 CSS px di layar (pedoman target sentuh) dengan memperbesar area hit saat zoom-out.
- Prioritaskan poligon terkecil kalau tumpang tindih.

### Aksesibilitas
- Di samping canvas, render **daftar hotspot sebagai `<button>` di DOM** (bisa visually-hidden, atau tampil sebagai panel "Daftar tempat di bagian ini"). Tab → fokus → Enter membuka kartu, lalu viewer `panTo` ke hotspot tersebut.
- Kartu museum dibuat sebagai `<dialog>` dengan `aria-labelledby`, fokus terkunci di dalamnya, dan Esc untuk menutup.
- Navigasi keyboard viewer: OSD punya keyboard bawaan (+/− dan panah), dengan catatan perilakunya perlu dicek di versi yang dipakai.
- Strip navigasi bawah = `<nav>` berisi daftar perhentian (Sekupang … Galang) sebagai tombol biasa.
- Game: umumkan progres lewat `aria-live="polite"` ("Kampung tua ditemukan: 3 dari 8"). Sediakan **mode petunjuk** (hint area berdenyut) supaya tetap bisa dimainkan oleh pengguna pembaca layar.

### Link per titik yang bisa dibagikan
- Rute: `/mural/[segment]?spot=kampung-tua-tanjung-riau` atau `/mural#seg02/zoom=3/x=0.42/y=0.37`. Sinkronkan state ke URL dengan `history.replaceState` (debounce).
- Buat **OG image per spot** dengan `next/og` (crop ilustrasi + judul serif) supaya preview di WhatsApp cantik. Ini penting karena warga Batam berbagi lewat WA.

### Hidden-object game
- Logika sederhana: `quests.json` → daftar id target. Simpan progres di `localStorage` dan tampilkan badge "Cari! 3/8" seperti Mural Jakarta, tapi tiap temuan **membuka kartu edukasi** (sejarah kampung tua, tahun jembatan), jadi bukan cuma centang.
- Ide quest khas Batam: 6 jembatan Barelang, 8 kampung tua, pelabuhan feri, "temukan kucing oren di ruko Nagoya" (easter egg lucu yang tidak norak).

---

## 6. Alur produksi ilustrasi untuk dev solo

### Opsi A: Ilustrator lokal (direkomendasikan untuk landmark + kunci gaya)
- **Kelebihan:** gaya konsisten, cerita lokal kuat, tidak ada debat etika, bisa dipromosikan ("digambar oleh @ilustrator Batam"). Juga lebih kuat secara hak cipta, karena karya manusia jelas terlindungi.
- **Kontrak:** lisensi eksklusif penggunaan web + merchandise, file berlapis (garis, warna, lampu malam, mask air terpisah), kanvas per segmen dengan **overlap 10%** di tepi supaya bisa disambung.
- **Perkiraan biaya dan waktu (ASUMSI, belum disurvei; harga ilustrator sangat bervariasi):** landmark sketsa garis satuan Rp150–500 rb per item; satu segmen mural panorama padat Rp3–15 jt dan 2–6 minggu. Mintalah 2–3 penawaran.

### Opsi B: AI per tile dari render peta (gaya Isometric NYC)
- **Pipeline:** render OSM/Protomaps dengan style polos (atau render 3D bangunan OSM) → model image-edit yang di-fine-tune dengan ±40 pasangan contoh **yang digambar ilustratormu** → infill per kuadran → QA manual.
- **Biaya generate murah** (Coenen: fine-tune ~$12, inference <$3/jam di H100), **tapi waktu QA yang mahal**. Coenen bilang ia menghabiskan "way more than I'd planned". Batam punya banyak laut dan hijau, persis titik lemahnya.
- **Data:** OSM untuk Batam relatif jarang di level detail bangunan dibanding NYC (asumsi). Hasil AI akan lebih "mengarang". Google 3D Tiles punya syarat lisensi sendiri yang harus dibaca sebelum dipakai sebagai input.

### Opsi C: Hibrida (rekomendasi)
1. Ilustrator membuat **style sheet**: palet 4–5 tinta riso (misalnya Fluorescent Pink, Blue, Yellow, Teal, Black di atas kertas krem), ketebalan garis, cara menggambar pohon, air, atap ruko, dan 20–40 landmark.
2. Kamu menyusun **komposisi panorama** (blocking) dari render peta + sketsa.
3. Isian latar (deret ruko generik, pepohonan, perumahan) boleh dibantu AI **dengan landmark ilustrator sebagai referensi**, lalu ilustrator melakukan pass akhir (redraw/cleanup).
4. **Konsistensi gaya:** posterize ke palet tetap di akhir pipeline (misalnya `vips` atau script Python: kuantisasi ke 5 warna + grain + misregistration 1–2 px per kanal). Ini "menyatukan" sumber yang berbeda-beda, dan tekstur riso sangat memaafkan.
5. **Keterbukaan:** halaman "Cara mural ini dibuat" yang menyebut bagian mana yang digambar tangan dan mana yang dibantu AI. Kantor Hak Cipta AS menyatakan "purely AI-generated material" dari prompt tidak bisa dilindungi hak cipta, sementara seleksi, susunan, dan modifikasi manusia bisa (https://www.copyright.gov/newsnet/2025/1060.html). Hukum Indonesia belum saya riset (**belum terverifikasi**); konsultasikan kalau mau komersial.

### Pendekatan hibrida paling murah: peta chart + sketsa landmark
Mode Peta dengan 20–40 sketsa landmark (SVG garis halus) sebagai `symbol` layer di MapLibre sudah memberi 70% "rasa artsy" dengan 10% biaya mural. Sketsa yang sama nanti dipakai ulang di mural.

---

## 7. Styling MapLibre bergaya nautical chart

### Contoh style yang ada
- **Mapbox GL Vintage style** (https://github.com/mapbox/mapbox-gl-vintage-style) dan remix-nya (https://www.github.com/jonahadkins/mapbox-gl-vintage-style-remix): pola SVG sebagai tekstur latar. Formatnya style spec v8, jadi bisa diadaptasi ke MapLibre (ganti source).
- **Pencil style untuk MapLibre** (https://googlemapsmania.blogspot.com/2025/11/a-pencil-style-for-maplibre.html): dari Positron OpenFreeMap, diedit di **Maputnik**, pakai sprite pola `pencil-wave` (air) dan `pencil-hatch` (bangunan) via `fill-pattern`.
- **Vintage dengan tekstur kertas** (https://www.viking2917.com/historical-maps-with-maplibre-and-open-historical-maps/): sprite berisi tekstur kertas + gradien laut.
- **Teknik kartografi** (QGIS, tapi konsepnya bisa ditiru): https://andywoodruff.com/posts/2024/qgis-hand-drawn-maps/

### Resep "Chart Batam"
- **Basis:** `@protomaps/basemaps` (layers dihasilkan dari kode) + `pmtiles` protocol. Ekstrak area Batam: `pmtiles extract https://build.protomaps.com/YYYYMMDD.pmtiles batam.pmtiles --bbox=103.6,0.6,104.3,1.35 --maxzoom=15` (pola perintah dari diskusi HN Protomaps; ganti tanggal build yang berlaku).
- **Darat:** `background`/`fill` warna kertas `#F3EBDD`; laut `#DCE6E4` (siang) atau `#0E1A24` (chart malam).
- **Tekstur kertas:** dua opsi.
  1. `fill-pattern` dengan pola grain 256 px yang seamless di sprite.
  2. Lebih murah dan lebih bagus: **overlay CSS** `<div>` di atas canvas peta dengan `background-image: url(paper.webp)` + `mix-blend-mode: multiply` + `pointer-events:none`. Teksturnya tidak ikut ter-zoom, seperti kertas sungguhan.
- **Arsiran pantai** (ciri chart lama): beberapa `line` layer dari garis pantai dengan `line-offset` bertingkat (−2, −5, −9 px) dan opacity menurun.
- **Label:** serif kapital kecil. MapLibre butuh font **glyph PBF**: generate dari TTF (misalnya Cormorant SC, EB Garamond SC, Libre Caslon) pakai `font-maker`/`build_pbf_glyphs`, lalu host sendiri. Pakai `text-transform: uppercase`, `text-letter-spacing: 0.15`, `text-font: ["Cormorant SC Regular"]`. Untuk laut, pakai italic + `symbol-placement: line` mengikuti kontur.
- **Garis koordinat di tepi (graticule):** generate GeoJSON garis tiap 1′ atau 5′ (turf atau script sendiri) sebagai `line` layer tipis, plus komponen React di tepi viewport yang membaca `map.getBounds()` untuk menampilkan label derajat-menit (1°08′N, 104°00′E).
- **Landmark sketsa:** SVG garis → raster di sprite (atau `map.addImage` dengan SDF untuk recolor siang/malam).
- **Chart malam:** dua style JSON, atau `setPaintProperty` untuk swap warna. Lampu pelabuhan dan mercusuar bisa diberi `circle-blur` berwarna kuning.

### Kontur kedalaman dari GEBCO
Menurut GEBCO, "The GEBCO_2025 Grid is a global continuous terrain model for ocean and land with a spatial resolution of 15 arc seconds" (±450 m, berbasis SRTM15+ v2.7), dan situs gebco.net kini juga mencantumkan GEBCO_2026 Grid, jadi pakai rilis terbaru dan sebutkan versinya. **Cukup untuk selat dan kontur dalam, kasar untuk perairan dangkal antar pulau** di Barelang, karena GEBCO sendiri mengingatkan bahwa "the resolution of The GEBCO Grid may be significantly different to that of the resolution of the underlying measured data". Beri label "kedalaman indikatif, bukan untuk navigasi".
```bash
# 1. Unduh subset GEBCO (GeoTIFF) untuk bbox Batam dari situs GEBCO (download app)
# 2. Potong & haluskan sedikit
gdalwarp -te 103.5 0.5 104.5 1.5 -r cubic -tr 0.001 0.001 gebco.tif batam_bathy.tif
# 3. Kontur di kedalaman tertentu (nilai negatif = laut)
gdal_contour -a depth -fl -2 -5 -10 -20 -30 -50 -100 batam_bathy.tif contours.geojson
#    atau poligon pita kedalaman (untuk isi warna gradasi):
gdal_contour -p -amin dmin -amax dmax -fl -200 -100 -50 -30 -20 -10 -5 -2 0 batam_bathy.tif depth_areas.geojson
# 4. Potong ke laut (buang yang di darat) dengan polygon air OSM
ogr2ogr -clipsrc water_polygons_batam.shp contours_sea.geojson contours.geojson
# 5. Sederhanakan & tile
tippecanoe -o bathy.pmtiles -Z6 -z14 -l contours --simplification=4 contours_sea.geojson
#    (gabung banyak layer: tippecanoe -o bathy.pmtiles -L contours:contours_sea.geojson -L depth:depth_areas.geojson)
```
- Referensi pipeline serupa: opendem.info memakai `gdal_translate -ot Int16` → `gdal_contour` → `ogr2ogr -clipdst` ke poligon laut (https://opendem.info/download_bathymetry.html). Proyek openwaters juga menulis kontur sebagai GeoJSON → tippecanoe → PMTiles (https://github.com/openwatersio/crowd-depth/pull/150).
- **Smoothing:** NOAA NCEI menghaluskan GEBCO dulu (konvolusi 3×3), lalu menyederhanakan garis dengan toleransi 0,005° (https://www.arcgis.com/home/item.html?id=5f98dbc4708e4a7e99c0a7fe043d70a1). Tirulah dengan `gdalwarp -r cubic` + `ogr2ogr -simplify 0.0005`.
- Kalau data kecil (beberapa MB), langsung `GeoJSON` source di MapLibre tanpa PMTiles juga oke.

---

## 8. Rekomendasi akhir: arsitektur & MVP bertahap

### Stack
- **Next.js (App Router) di Vercel:** halaman, OG image, Route Handler untuk proxy dan cache data (Sheets, Supabase, endpoint hujandibatam).
- **Mode Peta:** `maplibre-gl` + `pmtiles` + `@protomaps/basemaps`, dengan style JSON sendiri di repo.
- **Mode Mural:** `openseadragon` + overlay `<canvas>` (Canvas2D dulu; PixiJS hanya kalau efek butuh shader), `@allmaps/transform` untuk TPS, `suncalc`.
- **Aset besar:** Cloudflare R2 (tile DZI, PMTiles basemap Batam, bathy.pmtiles, font glyph) di belakang domain kustom `tiles.batamcityhall.id` (contoh).
- **Data:** Google Sheets untuk konten yang diedit non-dev (jadwal feri, kartu museum), Supabase untuk data warga (Tukang Langganan, rekomendasi makan, moderasi).

### Struktur folder
```
/app
  /(site)/page.tsx
  /peta/page.tsx                 ← client component MapView (dynamic, ssr:false)
  /mural/[segment]/page.tsx      ← MuralViewer + generateMetadata per spot
  /api/rain/route.ts             ← proxy hujandibatam → poligon (lat/lng) + cache 5 mnt
  /api/ferry/route.ts            ← Sheets → JSON, revalidate 3600
  /api/og/[spot]/route.tsx
/components
  /map/MapView.tsx  /map/layers/*.ts  /map/Graticule.tsx
  /mural/MuralViewer.tsx  /mural/OverlayCanvas.ts  /mural/effects/{rain,waves,ferry,daylight}.ts
  /mural/HotspotLayer.tsx  /mural/MuseumCard.tsx  /mural/QuestBadge.tsx  /mural/StopStrip.tsx
/lib
  geo/tps.ts  geo/densify.ts  time/batam.ts (Asia/Jakarta + suncalc)  data/sheets.ts  data/supabase.ts
/data
  mural/segments.json            ← id, nama perhentian, url .dzi, ukuran px, urutan strip
  mural/seg01.gcps.json  mural/seg01.hotspots.json  mural/seg01.water-mask.png
  quests.json  ferry/routes.px.json
  map/style.day.json  map/style.night.json
/scripts
  tile-segment.sh (vips dzsave → rclone ke R2)
  bathy.sh (gdal → tippecanoe → pmtiles)
  gcp-tool/ (micro-app Vite: MapLibre + OSD berdampingan)
```

### Jalur MVP bertahap (dev solo, perkiraan kasar, ASUMSI)
1. **Fase 0 (1 minggu): fondasi.** Next.js + MapLibre + PMTiles Batam di R2. Style chart siang/malam, font serif glyph, graticule.
2. **Fase 1 (2–3 minggu): Mode Peta berguna.** Layer toggle: hujan, ombak, CCTV (tinggal tarik dari hujandibatam), makan, Tukang Langganan, Kampung Tua, feri. Kontur GEBCO. Kartu museum (komponen yang sama nanti dipakai di mural). URL per tempat + OG image. **Rilis ke publik di sini.**
3. **Fase 2 (paralel, 3–6 minggu): sketsa landmark.** Pesan 20–40 sketsa ke ilustrator lokal → ikon di Mode Peta. Sekalian kunci palet riso.
4. **Fase 3 (3–4 minggu): mural segmen pertama.** Pilih **Barelang 1–6** (ikonik, game "Temukan 6 jembatan" jelas, banyak air jadi efek ombak paling terasa) **atau** Harbour Bay–Nagoya (padat, banyak hotspot). OSD + tile R2 + tool GCP + TPS + hotspot + quest + strip navigasi berisi satu segmen aktif dan sisanya "segera".
5. **Fase 4: mural hidup.** Overlay canvas: siang/senja/malam dulu (paling murah, efeknya besar), lalu layer lampu malam, hujan berbasis poligon, ombak, feri dari jadwal. Tambah reduced-motion dan uji di HP Android menengah sungguhan (misalnya seri Redmi/Samsung A).
6. **Fase 5+: segmen berikutnya** satu per satu (Sekupang → Batam Centre → Nongsa → Mukakuning/Batu Aji → Rempang/Galang). Tiap segmen jadi momen rilis dan konten media sosial.

**Prompt pembuka untuk Claude Code (saran):** "Buat proyek Next.js App Router dengan struktur folder di atas. Fase 0: MapView client-only memakai maplibre-gl + pmtiles protocol, sumber `https://tiles.example/batam.pmtiles`, style chart siang/malam sesuai spesifikasi (warna, font glyph self-hosted, graticule 5′). Jangan sentuh fitur cuaca; data hujan, ombak, dan CCTV diambil dari endpoint hujandibatam yang sudah ada."

## Caveats
- **Mural Jakarta belum diverifikasi teknisnya.** Semua perbandingan dengannya berdasar deskripsimu, bukan inspeksi kode.
- Angka ukuran bundle campuran: PixiJS dari Bundlephobia; OpenSeadragon dari laporan size-check CI sebuah fork; Leaflet dari beranda resmi leafletjs.com ("Weighing just about 40 KB of JS") dan catatan rilis 2.0 beta (2 Nov 2026); MapLibre **tidak terkonfirmasi** (Bundlephobia gagal dimuat; satu README pihak ketiga menyebut "379 kB gzipped" termasuk font, dan issue resmi #7255 menyebut ukurannya "steadily growing larger and larger with every release").
- Jumlah monitor mural Skytree beda antar sumber (10 menurut teamLab, 13 menurut VICE).
- Biaya ilustrator, durasi fase, anggaran partikel, dan target error GCP adalah **asumsi kerja**, bukan data survei.
- Grid GEBCO 15 arc-second (GEBCO_2025/2026) terlalu kasar untuk perairan dangkal antar pulau; GEBCO sendiri menyebut resolusi grid-nya "may be significantly different to that of the resolution of the underlying measured data". Jangan sampai terkesan sebagai peta navigasi.
- Posisi feri dari jadwal adalah simulasi; tandai dengan jelas di UI.
- Aspek hukum AI di Indonesia dan lisensi Google 3D Tiles sebagai input AI belum diriset.

## Daftar sumber
- cannoneyed — https://cannoneyed.com/projects/isometric-nyc
- ceshine — https://hnreader.ceshine.net/best/2026-01/1769264942
- teamlab — https://www.teamlab.art/e/tokyoskytree/
- VICE — https://www.vice.com/en/article/teamlabs-40-meter-digital-mural-captures-even-the-strangest-details-of-tokyo/
- github — https://github.com/lucacadalora/isometric-jakarta
- libvips — https://libvips.org/API/current/Making-image-pyramids.html
- libvips — https://www.libvips.org/API/current/method.Image.dzsave.html
- github — https://github.com/protomaps/PMTiles/issues/338?timeline_page=1
- osm2cdr — https://osm2cdr.com/en/blog/format-pmtiles-deep-dive/
- sidley — https://www.sidley.com/en/insights/newsupdates/2025/02/us-copyright-office-issues-report-on-artificial-intelligence-and-copyrightability
- rothjackson — https://www.rothjackson.com/blog/2025/02/copyright-office-publishes-part-2-of-its-artificial-intelligence-and-copyright-report/
- 10015 — https://10015.io/tools/isometric-map-finder
- gessato — https://www.gessato.com/tokyo-skytree-mural-by-teamlab/
- github — https://github.com/lucacadalora
- github — https://github.com/lukew-cogapp/openseadragon/pull/1
- bundlephobia — https://bundlephobia.com/package/pixi.js
- github — https://github.com/alfarisi/leaflet-deepzoom
- github — https://github.com/cmulders/Leaflet.Zoomify
- iceencounter — https://iceencounter.com/resources/mapping-tools/libraries/
- github — https://github.com/cuulee/annotorious-openseadragon
- github — https://github.com/emigre/openseadragon-annotations
- pub — https://pub.dev/documentation/flutter_map_rastercoords
- github — https://github.com/commenthol/leaflet-rastercoords
- github — https://github.com/Leaflet/Leaflet/discussions/9579
- libvips — https://www.libvips.org/API/8.17/making-image-pyramids.html
- leanopstech — https://leanopstech.com/blog/cloudflare-r2-pricing-2026/
- github — https://github.com/sachaw/PMTiles
- github — https://github.com/templeblock/ThinPlateSplineJS
- allmaps — https://allmaps.org/docs/packages/transform/
- github — https://github.com/tilemapjp/ThinPlateSplineJS
- github — https://github.com/annotorious/annotorious-v2-openseadragon
- npmjs — https://npmjs.com/package/@recogito/annotorious-openseadragon
- github — https://github.com/annotorious/annotorious-v2-openseadragon/blob/main/README.md
- mintz — https://www.mintz.com/insights-center/viewpoints/54731/2025-02-07-us-copyright-office-publishes-second-part-report-ai
- copyright — https://www.copyright.gov/newsnet/2025/1060.html
- authorsguild — https://authorsguild.org/news/us-copyright-office-ai-report-part-2-what-authors-should-know/
- github — https://www.github.com/jonahadkins/mapbox-gl-vintage-style-remix
- github — https://github.com/mapbox/mapbox-gl-vintage-style
- blogspot — https://googlemapsmania.blogspot.com/2025/11/a-pencil-style-for-maplibre.html
- viking2917 — https://www.viking2917.com/historical-maps-with-maplibre-and-open-historical-maps/
- andywoodruff — https://andywoodruff.com/posts/2024/qgis-hand-drawn-maps/
- ycombinator — https://news.ycombinator.com/item?id=37982621
- github — https://github.com/openwatersio/crowd-depth/pull/150
- opendem — https://opendem.info/download_bathymetry.html
- arcgis — https://www.arcgis.com/home/item.html?id=5f98dbc4708e4a7e99c0a7fe043d70a1
