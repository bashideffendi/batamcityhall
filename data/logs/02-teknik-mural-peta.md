# Log migrasi: 02-teknik-mural-peta

- task_id: `wf-63281ef7-42be-5d9b-91ac-0775ff777914`
- Judul laporan: Batam City Hall: Riset Teknik Mural Interaktif dan Peta Artsy
- Laporan `truncated: false` (utuh).

## File yang dibuat
| File | Isi |
|---|---|
| `research/02-teknik-mural-peta.md` | Salinan verbatim + `## Daftar sumber` (45 sumber) |
| `data/raw/02-teknik-mural-peta__1.json` | Blok JSON contoh hotspot/anotasi mural (`kampung-tua-tanjung-riau`) |
| `data/places/02-teknik-mural-peta.json` | 1 tempat |
| `data/snippets/02-teknik-mural-peta/1-bash.txt` | Membuat tile: `vips dzsave` (DZI, layout google, ZIP) + `gdal2tiles.py` |
| `data/snippets/02-teknik-mural-peta/2-ts.txt` | Georeferensi TPS dengan `@allmaps/transform` (tipe GCP, transformForward/Backward) |
| `data/snippets/02-teknik-mural-peta/3-ts.txt` | Posisi kapal feri dari jadwal (fraksi waktu di polyline piksel) |
| `data/snippets/02-teknik-mural-peta/4-ts.txt` | Deteksi `prefers-reduced-motion` |
| `data/snippets/02-teknik-mural-peta/5-bash.txt` | Pipeline kontur kedalaman GEBCO: gdalwarp → gdal_contour → ogr2ogr → tippecanoe |
| `data/snippets/02-teknik-mural-peta/6-struktur-folder.txt` | Struktur folder proyek Next.js (app/components/lib/data/scripts) |
| `data/referensi/perbandingan_library_mural.json` | Tabel "2. Perbandingan library gambar raksasa": 5 library × 8 kriteria, plus paragraf "Rekomendasi" verbatim (diminta pemanggil) |
| `data/referensi/temuan_kunci_mural.json` | Tabel Key Findings: 9 temuan + status (tambahan sesuai aturan tabel di spesifikasi) |

## Ringkasan angka
- Blok kode di laporan: 7 (bash, ts, ts, ts, json, bash, tanpa-bahasa).
- Blok JSON: **1**. Valid tanpa perbaikan. String berisi karakter "…" sebagai placeholder dari laporan; itu tetap JSON valid.
- Snippet non-JSON: **6**. Nomor `k` dihitung hanya di antara blok non-JSON, sesuai urutan kemunculan.
- Tempat: **1** (`kampung-tua-tanjung-riau`).

## Masalah / perbaikan / keputusan
- Blok struktur folder tidak punya tag bahasa, jadi dinamai `6-struktur-folder.txt`.
- Isi snippet disalin verbatim dari md (diekstrak dengan script, bukan diketik ulang). Snippet ini potongan ilustrasi, bukan kode siap jalan:
  - `2-ts.txt`: `import` muncul setelah deklarasi `type`, dan `gcps` tidak didefinisikan.
  - `3-ts.txt`: memakai helper yang tidak didefinisikan (`nowInZone`, `clamp`, `pointAlongPolyline`, `depart`, `duration`, `routePx`). Contoh jadwal di komentarnya berbentuk object literal JS, bukan JSON valid.
  - `5-bash.txt`: nama file input (`gebco.tif`, `water_polygons_batam.shp`) adalah placeholder.
- Perintah yang hanya ditulis sebagai inline code (bukan blok berpagar) tidak dijadikan snippet dan tetap ada di md, misalnya `pmtiles extract ... --bbox=103.6,0.6,104.3,1.35 --maxzoom=15`, `rclone copy ...`/`rclone copyto ...`, dan `ogr2ogr -simplify 0.0005`.
- Koordinat Kampung Tua Tanjung Riau (`lat 1.16`, `lng 103.95`) disalin persis dari contoh skema hotspot (urutan `[lng, lat]`). Karena itu nilai contoh, bukan koordinat survei, `status_koordinat` diisi `perlu_cek_ulang`. Bentuk poligon mural, segmen, dan quest disimpan di `atribut.contoh_hotspot_mural`.
- Tabel library: nama library diambil dari teks tebal di header; header aslinya disimpan di `header_asli` dan versi baris-per-kriteria di `baris_asli`. Laporan sendiri menandai beberapa nilai sebagai "asumsi", dan sumber angka ukuran bundle campuran (lihat Caveats di md).
- Tanggal di laporan (mis. "Leaflet 2.0 beta dirilis 2 Nov 2026") disalin apa adanya tanpa diverifikasi.

## Hal yang tidak bisa dipetakan ke places
- **Disebut hanya sebagai kandidat GCP/segmen/quest tanpa data**: ujung jembatan Barelang ("6 jembatan", segmen "Barelang 1–6"), pelabuhan feri Harbour Bay, Sekupang, Batam Centre, dan Nongsa Pura, Nagoya ("kucing oren di ruko Nagoya", segmen Harbour Bay–Nagoya), Mukakuning, Batu Aji, Nongsa, Rempang/Galang, serta "8 kampung tua". Jembatan Barelang dan terminal feri sudah punya entri berdata di `data/places/01-inspirasi-konsep.json`.
- **Mural Tokyo Skytree (teamLab)**: lokasi fisik, tetapi referensi inspirasi di luar negeri, jadi tidak dimasukkan ke places. Faktanya (40 m × 3 m, monitor 10 vs 13) ada di md dan di `temuan_kunci_mural.json`.
- **Koordinat/parameter teknis tanpa nama tempat**: `[104.0305, 1.1450]` (contoh input TPS), "lat 1,1 lng 104,0" (suncalc), bbox `103.6,0.6,104.3,1.35` (pmtiles extract), bbox `103.5 0.5 104.5 1.5` (gdalwarp), dan label graticule "1°08′N, 104°00′E".
- **Konten non-tabel** (warna peta chart `#F3EBDD`/`#DCE6E4`/`#0E1A24`, harga Cloudflare R2, anggaran performa HP, teknik overlay hujan/ombak/siang-malam, aksesibilitas, opsi produksi ilustrasi dan perkiraan biaya, fase MVP 0–5+, prompt pembuka Claude Code) hanya ada di md. Tidak ada mapping domain yang diminta dan bentuknya bukan tabel.

## Catatan koordinator
Entri tempat "Kampung Tua Tanjung Riau" dihapus dari data/places/02-teknik-mural-peta.json karena koordinatnya berasal dari contoh format JSON di laporan, bukan data. Data kampung tua resmi ada di laporan 04.
