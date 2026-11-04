# Log migrasi: 14-feri-pompong

- task_id: `wf-45ea1918-1dd9-865f-844b-d2b422910e8a`
- Judul: Feri, RoRo, dan Pompong dari Batam: Jadwal, Tarif, dan Data Rute per November 2026
- Laporan `truncated: false`; 84 sumber.

## Ringkasan angka
- Blok ```json: **4**, semuanya valid tanpa perbaikan.
  - `data/raw/14-feri-pompong__1.json`: contoh GeoJSON FeatureCollection (bagian 6, geometri perkiraan btc-hfc)
  - `data/raw/14-feri-pompong__2.json`: blok (a) terminal dan pelantar (22)
  - `data/raw/14-feri-pompong__3.json`: blok (b) rute (23)
  - `data/raw/14-feri-pompong__4.json`: blok (c) contoh jadwal (16)
- Blok kode non-JSON: 2 query Overpass.
- Tempat (`data/places/14-feri-pompong.json`): **20** (kategori `transportasi`): 9 terminal/pelabuhan di Batam + 10 pelantar pompong dari blok (a) + 1 pelantar `pr-blp` yang dibuat saat migrasi. Tiga terminal tujuan di luar Batam (`sg-scc`, `sg-tmft`, `my-stl`) **tidak** dimasukkan ke places, tetapi tetap ada di `data/feri/terminal.json`.
- `data/feri/terminal.json`: 23 entri (22 JSON + `pr-blp`).
- `data/feri/rute.json`: 23 rute JSON + 10 `rute_tambahan` dari tabel.
- `data/feri/jadwal.json`: 47 entri (16 dari blok JSON (c) + 31 dari baris tabel jadwal).

## File yang dibuat
- `research/14-feri-pompong.md`: salinan verbatim + `## Daftar sumber` (84 item).
- `data/raw/14-feri-pompong__1..4.json`
- `data/places/14-feri-pompong.json`
- `data/feri/terminal.json`, `data/feri/rute.json`, `data/feri/jadwal.json`
- `data/feri/info_praktis.md`: salinan verbatim "### 5. Info praktis menyeberang" dan "### 6. Data geometri rute untuk peta" (termasuk query Overpass dan contoh GeoJSON). Ditambah dua kutipan verbatim pendukung yang diberi label: "Biaya tambahan" (bagian 1) dan "Tips keselamatan untuk panduan warga" (bagian 4).
- `data/osm/overpass/14-jalur-feri.overpassql`, `data/osm/overpass/14-terminal-dan-pelantar.overpassql`

## Keputusan pemetaan
- Di semua file domain, `sumber_url` diubah dari string menjadi array (null → `[]`). Nilai lain dari blok JSON disalin apa adanya.
- **rute.json**: setiap rute diberi `dari_tabel`, yaitu baris tabel yang cocok dengan kolom asli. Tabel yang dipakai: operator & rute Singapura, Malaysia, domestik, dan pompong. Tiap baris tabel dipakai tepat sekali. `status_data` diturunkan dari kolom "Status data"/"Tanggal data", dan label aslinya disimpan di `status_data_asli`. Pemetaan label: "lemah" → `perlu_cek_ulang`, "data lama" → `usang`, "perlu_diisi_user" → null.
- **rute_tambahan** (id dibuat saat migrasi, `id_dibuat_migrasi: true`): `hb-nirup`, `batam-pasirgudang` (asal `asal_ids` = hb/btc/nsp), `tpg-senayang`, `tpg-roro-mengkapan-kualatungkal`, `skp-kundur-penyalai`, `hb-domestik-tbk-moro`, `pr-blp-kasu-geranting`, `pr-tgr-riau`, `pr-jb1-wisata`, `pr-jb2-panjang`. Baris pompong tanpa tujuan (Pelantar Batu Ampar / Tanjung Sengkuang, Setokok) disimpan di `terminal.json` sebagai `dari_tabel_pompong`.
- **jadwal.json**: entri dari blok JSON (c) diberi `asal_blok_json: true`, `dari_tabel` (baris tabel yang cocok berdasarkan operator, arah, dan daftar jam), serta `operator` dan `zona_waktu` (diturunkan dari teks `arah`). Baris tabel lain jadi entri baru dengan `trips` (keterangan per jam dari tabel, mis. "Sindo", "Kam–Min", "Sab–Min") dan `jam_berangkat_teks` verbatim di `dari_tabel`. Zona waktu: SGT=Asia/Singapore, WIB=Asia/Jakarta, MYT=Asia/Kuala_Lumpur.
  - Baris BatamFast "HarbourFront ⇄ Gold Coast" dipecah jadi dua arah. Tabel tidak menulis zona waktu untuk baris ini, jadi `zona_waktu` = null dengan catatan.
  - `tanggal_data` untuk baris tabel: BatamFast `2026-11-01`, Majestic `2026-05`, Sindo/Horizon `2026-11` ("diakses November 2026"). Untuk Sindo/Horizon, blok JSON sendiri memakai `2026-11-04`.
  - Jadwal RoRo per kapal (Trisakti Adinda / Tanjung Burang) disimpan di `per_kapal`.
  - Jadwal domestik tanpa daftar jam (speedboat Tanjung Uban "07:00–18:00, tiap ±30 menit", RoRo Mengkapan, Harbour Bay domestik, Pasir Gudang) dicatat dengan `jam_berangkat: []` plus teks/catatan.
  - Jam pompong Kasu "±11:00 / balik ±07:00" ditulis "11:00"/"07:00" dengan catatan tanda ±.
- **terminal.json**: ditambah `rute_id`, `catatan_daftar_koordinat` (baris verbatim dari daftar koordinat belum pasti), dan `catatan` (kalimat laporan: pindahnya HarbourFront, Gold Coast suspended, Pelni pindah ke Bintang 99, koordinat BatamPort salah ketik, nama Berjaya Waterfront).
- **places**: `subkategori` diambil dari `jenis` (mis. `terminal_feri_internasional`, `pelantar_pompong`), dan `jenis` asli disimpan di `atribut.jenis_asli`. `jam_layanan` hanya diisi untuk `pr-skp` (dari tabel pompong). `status_data` pelantar diambil dari kolom Status data tabel pompong.

## Masalah / konflik yang perlu diketahui
- `blp-kasu` (JSON): asal_id `pr-skp` (Sekupang), tetapi harga "Kasu carter Rp150.000-200.000" dan durasi 45 menit sama dengan baris tabel pelantar Belakang Padang. Baris tabel Sekupang menyebut Kasu ±30 mnt dan ±Rp180.000 PP. Dicatat di `rute.json` `catatan`.
- `pr-jb1`: kecamatan di JSON "Bulang", di tabel pompong "Bulang/Galang". Places memakai `Bulang`.
- `wfc` (Waterfront City): kecamatan di JSON "Sekupang", tetapi alamatnya "Jl. KH Ahmad Dahlan, Tanjung Uncang". Kecamatan perlu dicek.
- Sindo: jadwal Batam Centre → HarbourFront tampil dalam dua versi di dua halaman Sindo, dan Sekupang 20:30 perlu dicek ulang. Majestic: tanda trip khusus akhir pekan tidak terbaca dari PDF (perlu_cek_ulang).
- Tanggal mulai fuel surcharge: 12 Maret 2026 (Sindo/Mothership) vs 14 Maret 2026 (judul berita BatamFast).
- Durasi Harbour Bay–Puteri Harbour tidak konsisten (±1,5–3 jam).
- Data pompong mayoritas dari 2014–2022, jadi tarif kemungkinan sudah naik.
- **Lintas-laporan**: `tpg` (Telaga Punggur, 1.0352/104.1334, "terverifikasi") sama dengan titik Wikidata yang dipakai `tp-punggur` di 10-trans-batam (di sana `perlu_cek_ulang` karena konflik ±9 km dengan BP Batam). Laporan ini juga menyebut koordinat BatamPort untuk Batam Centre, Nongsapura, dan Telaga Punggur salah ketik. `btc` (1.1309/104.0552) praktis sama dengan titik terminal feri pada `tp-batam-center` di 10-trans-batam, dan `hb` sama dengan `harbourbay`. Kalau places digabung, entri bus (transferpoint) dan terminal feri adalah entitas berbeda, tetapi koordinatnya bersumber sama.

## Tidak bisa dipetakan ke JSON (hanya ada di research/14-feri-pompong.md)
- Prosa TL;DR, Key Findings, Recommendations, dan Caveats disalin sebagai string ke `rute.json` `meta`. Key Finding 6 (BMKG/angin utara) hanya ada di research md dan di info_praktis.md (bagian musim angin).
- Kolom "Link jadwal resmi" di tabel operator berisi domain tanpa skema (mis. "batamfast.com · majesticfastferry.com.sg ...") dan disimpan apa adanya di `dari_tabel`.
- Status Natuna ("tidak punya rute reguler yang terverifikasi ... perlu_diisi_user") tidak punya entri rute; hanya tercatat di research md (`rute.json` meta `catatan_domestik` tidak memuatnya).
- Plus Code Sembulang (R7W6+43C) tidak dikonversi ke lat/lng (tidak boleh menebak).
