# Log migrasi: 11-geoportal

- task_id: `wf-38dc66ef-7548-840c-a519-a759202f4d2b`
- Judul laporan: Batam City Hall: Audit Data Geoportal HANG JEBAT, BP Batam, dan Ina-Geoportal BIG
- Laporan `truncated: false` (utuh).

## File yang dibuat
| File | Isi |
|---|---|
| `research/11-geoportal.md` | Salinan verbatim + `## Daftar sumber` (64 sumber) |
| `data/raw/11-geoportal__*.json` | Tidak ada; laporan tidak punya blok ```json |
| `data/places/11-geoportal.json` | 6 tempat |
| `data/sumber_data/geoportal.json` | 44 entri dataset/layer |
| `data/sumber_data/endpoint.json` | 98 entri endpoint |
| `data/snippets/11-geoportal/1.txt` | Blok kode daftar endpoint BP Batam (verbatim) |
| `data/snippets/11-geoportal/2.txt` | Blok kode daftar endpoint BIG (verbatim) |
| `data/snippets/11-geoportal/3.txt` | Blok kode daftar endpoint BPS (verbatim) |
| `data/snippets/11-geoportal/4.txt` | Blok ```bash 4 contoh query curl GeoJSON (verbatim) |
| `data/snippets/11-geoportal/5.txt` | Tambahan: perintah inline dari teks (esridump/esri2geojson, ogr2ogr, mapshaper, gdal_contour, tippecanoe, pola `?f=pjson`/`/query?...&f=geojson`), satu per baris, dengan 1 baris komentar asal-usul |

## Ringkasan angka
- Blok JSON: **0**. Blok kode lain: 4 (3 tanpa bahasa + 1 bash), semua disimpan ke snippets.
- Tempat: **6**: 5 halte Trans Batam yang lajur khususnya dicat (Politeknik Negeri Batam, Kantor Jasa Raharja Batam Center, Simpang Kara, Perumahan Plamo, Bank Sumut Batam Center) dan `disperkimtan-kota-batam` (kontak dari footer HANG JEBAT). Semua koordinat `null` → `perlu_diisi_user`, semua kecamatan `null` (laporan tidak menyebut).

## Struktur file domain
- `geoportal.json`: field wajib `portal, nama_dataset, produsen, tahun, format, akses, relevansi, lisensi, status_verifikasi`, ditambah `endpoint` (array URL), `catatan`, `sumber_riset`. Satu entri per baris tabel. Sub-layer yang dibundel dalam satu sel (mis. "/9, /16, /3", empat layer Fasilitas) tetap satu entri, supaya nilai sel lain tetap persis. Di luar tabel juga masuk dataset dari prosa: basis data id=23/id=31, data.bpbatam.go.id, folder Perencanaan/Pertanahan, CKAN "Kelurahan", Wikipedia Trans Batam, data halte resmi (tidak ditemukan), InaRISK, dan OSM.
- `endpoint.json`: field `portal, url, jenis, catatan, sumber_riset`. Memuat semua URL di teks, URL teknis dari daftar sumber, URL `/query` dari contoh curl, serta path relatif/nama folder yang disebut tanpa URL lengkap. Path relatif ditandai `jenis: *_nama` atau dijelaskan di catatan. Satu entri `url: null` untuk endpoint XHR HANG JEBAT yang belum diketahui.

## Keputusan / masalah
- Escape JSON dari tool didekode ke karakter aslinya.
- Format markdown (`**tebal**`, backtick) dibuang dari nilai di JSON. Teksnya tidak diubah.
- "sda" di tabel BP Batam dan BIG diuraikan menjadi `sda = <nilai baris pertama>` supaya bisa dibaca mandiri.
- `status_verifikasi` diambil dari penanda laporan: Key Findings, header "Daftar Endpoint Teknis" (✅ terverifikasi ada), atau kolom Akses (ditulis "✅ (dari kolom Akses)"). Layer HANG JEBAT selain Perumahan Sekota Batam diberi `null`, karena laporan tidak memberi status per layer.
- Dua URL Satu Data Batam (Kampung Tua) disimpan dalam satu entri, karena laporan tidak menyebut URL mana yang berisi angka 37 dan mana yang 24. **Konflik 37 vs 24 kampung tua** dicatat dan tidak diselesaikan.
- URL Fasilitas PEMANFAATAN/MENARATELEPON/KELOLALIMBAH dan beberapa URL `/layers`, `portals/info`, `DATACAKRA` diambil dari daftar sumber laporan. Tidak ada URL karangan.
- Endpoint InaRISK ditulis tanpa skema (`inarisk1.bnpb.go.id:6443/arcgis/rest/services`), disalin apa adanya.
- Halte: sumber faktanya Batam Pos 8/10/2026, tapi URL artikelnya tidak ada di daftar sumber, jadi `sumber_url: []`. Nama dinormalisasi dengan awalan "Halte ". `tag_osm: highway=bus_stop` mengikuti rekomendasi laporan. Kemungkinan duplikat lintas laporan dengan `data/trans_batam/halte.json` (10-trans-batam), jadi perlu dedup.
- Disperkimtan: laporan hanya menyebut singkatan "Disperkimtan", sehingga nama panjang dinas tidak ditulis. Alamat tidak ada.
- Semua contoh query **belum dieksekusi** (kata laporan). BP Batam menolak crawler (robots.txt).

## Hal yang tidak dipetakan
- **Daftar koridor Trans Batam K1–K9 dengan jumlah halte** (bagian 5): bentuknya daftar, bukan tabel, dan tidak ada mapping domain. Disimpan ringkas di `catatan` entri Wikipedia di `geoportal.json` dan utuh di md. Kemungkinan sudah tercakup di `data/trans_batam/koridor.json` dari laporan 10.
- **Info Trans Batam lain** (27 titik prioritas halte, 10 halte baru + 4 CSR pada 2025, target K10 Tembesi–Barelang dan K11 Nongsa–Jodoh, lajur 28 km): hanya di md, dan sebagian di `atribut` halte.
- **Tempat yang cuma disebut sebagai nama** dan tidak dijadikan entri: Bandara Hang Nadim (ujung koridor), Politeknik Negeri Batam sebagai institusi (pengembang HANG JEBAT), kantor BP Batam/PPID, BIG (`info@big.go.id`), serta pulau Belakang Padang, Bulang, Galang (disebut dalam konteks QA batas).
- **Kebijakan/regulasi** (Keppres 28/2023, Peraturan BIG No. 3/2024, Keppres 20/2018, KSP 151 peta tematik, ODbL Produced Work, teks atribusi yang disarankan) dan **langkah rekomendasi 1–9**: prosa. Hanya di md, sebagian dikutip di `catatan` geoportal.json.
