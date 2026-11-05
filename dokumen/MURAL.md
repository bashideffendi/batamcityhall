# Mode Mural

Catatan teknis fase 8. Halaman: `/mural`, `/mural/cara-dibuat`, `/mural/gcp` (internal, `noindex`). Kode: `features/mural/`.

## Keadaan

Satu segmen jalan penuh dengan ilustrasi **placeholder** yang digambar skrip. Tujuh segmen lain tampil "segera" di strip. Semua yang bergantung pada ilustrasi asli menunggu pemilik: file berlapis (garis, warna, lampu malam, masker air), 30 sampai 80 GCP per segmen, dan bucket R2.

## Segmen pertama: Harbour Bay, Nagoya, Jodoh

Laporan 02 merekomendasikan Barelang 1-6 atau Harbour Bay-Nagoya, dan membawa pilihannya ke pemilik. Yang dipilih Harbour Bay-Nagoya:

1. **Hanya di sini feri punya jadwal sungguhan.** Rute `hb-hfc` (Horizon) punya jam dan durasi di `data/feri/`. Barelang tidak punya rute terjadwal, jadi lapisan feri akan kosong dan kriteria "data hidup" tidak terpenuhi.
2. **Quest 6 jembatan tidak bisa tuntas di satu segmen tanpa melanggar aturan.** Jembatan IV adalah lokasi bentrok 7 September 2023, Jembatan V berada di segmen Rempang, Jembatan VI di segmen Galang. Aturan: tidak ada quest atau poin di titik konflik dan memorial, tidak ada elemen game di Rempang.
3. **Titiknya padat.** Sembilan kartu, sebagian besar soal kuliner dan keseharian, tempat humor kering masih boleh.
4. **Hujan per kecamatan paling berarti di sini.** Lubuk Baja, Batu Ampar, Bengkong, dan Sekupang ada dalam satu bingkai.

### Kalau segmen Barelang nanti digambar

Usulan aman untuk quest jembatan, perlu keputusan pemilik: Jembatan I, II, III, dan VI boleh jadi target. Jembatan IV dan V tetap punya kartu biasa bertanggal, tanpa poin. Namanya jangan lagi "6 jembatan" kalau hanya empat yang dihitung. Enam siluet tetap digambar berbeda karena itu inti edukasinya.

## Placeholder

```
node scripts/buat-mural-placeholder.mjs
```

Skrip reprodusibel, tanpa dependensi native: gambar dan potongan tile dibuat Chromium milik Playwright.

- Garis pantai dan poligon kecamatan: `data/wilayah/kecamatan-kepri.geojson` (BIG). Tepi dirapatkan tiap 200 m, ditransformasi dengan TPS, lalu disederhanakan.
- Tinta: Federal Blue, Copper, Charcoal, dibaca dari `data/design/design_tokens.css`.
- Ruko dan sketsa hanya pengisi. Beberapa pin digeser supaya tidak bertumpuk (`GESER` di skrip), dengan garis penunjuk ke koordinat data. Karena itu label wajib: "ilustrasi placeholder, bukan posisi tepat".
- Koordinat dari `places.json` lewat `places_id_index.json`, bukan seed `landmarks.json`, karena yang pertama sudah digabung dengan laporan lain.
- Garis feri berhenti di tepi mural: HarbourFront belum punya koordinat terverifikasi di `data/feri/terminal.json`.

Keluaran:

| Berkas | Isi |
|---|---|
| `public/mural/<segmen>/segmen.dzi` | deskriptor Deep Zoom |
| `public/mural/<segmen>/segmen_files/<level>/<kol>_<baris>.webp` | tile 512 px, overlap 1, WebP |
| `public/mural/<segmen>/meta.json` | poligon kecamatan, rute, titik, lampu dalam piksel |
| `data/mural/<segmen>.gcps.json` | GCP placeholder, kisi 3x3 dari proyeksi linear |

Total 66 tile, 0,68 MB. Tes unit menjaga batas 5 MB.

## Pipeline asli (belum dijalankan, menunggu ilustrasi dan bucket)

Perintah dari research/02. Belum ada `vips` dan belum ada R2 yang diuji di proyek ini.

```bash
# 1. Potong ilustrasi jadi DZI. Nama keluaran harus segmen.dzi + segmen_files, atau sesuaikan Penampil.tsx.
mkdir -p tiles/<segmen>
vips dzsave <segmen>.tif tiles/<segmen>/segmen --tile-size 512 --overlap 1 --suffix ".webp[Q=82]"

# 2. Unggah ke R2. Tile jangan ditaruh di public/ untuk produksi.
rclone copy tiles r2:batam-mural/mural --transfers 32
```

3. Aktifkan CORS bucket dan pasang domain kustom dengan cache CDN.
4. Isi `NEXT_PUBLIC_MURAL_TILE_URL` dengan alamat folder segmen, misalnya `https://tiles.contoh.id/mural/<segmen>`. `meta.json` tetap dari `public/`.
5. Buat 30 sampai 80 GCP di `/mural/gcp`, simpan ke `data/mural/<segmen>.gcps.json`. Rapat di area bengkok. Target galat di bawah 40 px pada zoom penuh adalah asumsi.
6. Hitung ulang `meta.json` dari GCP baru, dan poligon air dari layer masker ilustrator.
7. Isi kartu di `features/mural/data.ts`, dan tandai segmen aktif.

Alternatif yang tidak dipakai: `--layout google --background 244,239,228` (XYZ), keluaran ZIP (`vips dzsave seg.tif seg.zip`), `gdal2tiles.py --xyz -p raster -z 0-6 -w none`, dan PMTiles raster. OpenSeadragon butuh tileSource khusus untuk PMTiles, dan itu belum terverifikasi.

Tarif R2 menurut laporan: $0,015/GB-bulan, Class A $4,50/juta, Class B $0,36/juta, gratis 10 GB + 1 juta A + 10 juta B per bulan, egress gratis. Enam segmen sekitar 100 MB tetap di bawah 10 GB.

Produksi menurut laporan (asumsi, biaya belum ditawar): lisensi eksklusif web dan merch, file berlapis, kanvas per segmen overlap 10%, 2-3 penawaran. Landmark Rp150-500 ribu per item, segmen Rp3-15 juta, 2-6 minggu.

## Overlay hidup

Satu kanvas, satu loop rAF (`features/mural/lib/overlay.ts`, `Penampil.tsx`). Loop berhenti saat tab tersembunyi, penampil di luar layar, atau gerak tenang. 30 fps kalau ada yang bergerak, 15 fps kalau tidak. DPR kanvas maksimal 1,5.

| Lapisan | Sumber | Saat data tidak ada |
|---|---|---|
| Siang, senja, malam | `suncalc` di 1,1 / 104,0. Senja: matahari antara +6 dan -6 derajat | selalu ada |
| Hujan per poligon | `/api/frames`, `echo.kec` per kecamatan, batas 600 garis di HP | tidak digambar, tertulis "bukan berarti cerah" |
| Ombak | `/api/perairan`, gelombang jam ini | tidak digerakkan, tertulis "bukan berarti laut tenang" |
| Feri | `data/feri/jadwal.json` + `rute.json`, zona per baris | rute tanpa durasi tidak digambar, disebut alasannya |
| Lampu | titik acak berbenih di `meta.json`, bukan posisi bangunan | selalu ada saat senja dan malam |

`suncalc` 2 mengembalikan ketinggian dalam **derajat**, bukan radian seperti versi lama.

**Gerak tenang dan reduced motion:** tidak ada loop. Yang bergerak mati. Yang tersisa satu gambar diam: pin, arsiran di kecamatan yang hujan, dan kapal yang melompat tiap menit. Ombak tidak digambar. Semua keadaan tetap tertulis di panel teks.

## Topik sensitif

`bolehJadiQuest` di `lib/quest.ts` menutup segmen Rempang dan Galang serta kategori kampung tua, memorial, dan Batam yang hilang. Tes unit memeriksa semua target. Kampung Tua Tanjung Uma hanya penanda yang merujuk ke `/cerita/kampung-tua`, tanpa klaim batas atau status lahan. Strip untuk Rempang dan Galang hanya menulis batas segmen dan tautan direktori.

## Yang belum terverifikasi (dari laporan)

- Teknis Mural Jakarta belum terverifikasi. Hanya repo `lucacadalora/isometric-jakarta` (fork IsoCity MIT, bukan mural) yang terkonfirmasi.
- Angka ukuran bundle di laporan campuran, terutama MapLibre (README pihak ketiga 379 kB gzip termasuk font).
- Jumlah monitor Skytree berbeda antarsumber (10 menurut teamLab, 13 menurut VICE).
- Biaya ilustrator, durasi fase, anggaran partikel, dan target galat GCP adalah asumsi kerja.
- Hukum AI Indonesia dan lisensi Google 3D Tiles belum diriset.
- Pembanding library dan temuan kunci: `data/referensi/perbandingan_library_mural.json`, `data/referensi/temuan_kunci_mural.json`.
