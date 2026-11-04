# Batam City Hall

Balai warga, bukan balai kota. Website kota indie dan non-komersial untuk Batam: peta laut, hujan, feri, direktori, cerita. Tanpa iklan, tanpa listing berbayar.

Proyek independen warga Batam, bukan situs resmi Pemerintah Kota Batam atau BP Batam. Untuk layanan resmi: batam.go.id.

**Status:** fase 10 selesai di komputer pengembang, semua loket jalan, belum di-deploy. Yang perlu pemilik lakukan: `docs/TODO_PEMILIK.md`.

## Menyiapkan

Butuh Node.js 22 atau lebih baru, dan Python 3 untuk `tools/`.

```bash
git init -b main
npm install
npx playwright install chromium
cp .env.example .env.local
npm run validate:data
node scripts/extract-basemap.mjs
```

## Data

| Tugas | Perintah |
|---|---|
| Validasi semua data | `npm run validate:data` |
| Gabung ulang `data/places/*.json` | `python tools/merge_places.py` |
| Impor koordinat tempat | `python tools/import_koordinat.py data/koordinat_perlu_diisi.csv` |
| Impor koordinat halte | `python tools/import_koordinat.py data/trans_batam/halte_koordinat_perlu_diisi.csv` |
| Bangun ulang glyph peta | `node scripts/build-glyphs.mjs` |
| Menambah tempat | Tambah berkas di `data/places/`, jalankan penggabungan, lalu validasi. Duplikat didaftarkan di `tools/merge_aliases.json`, bukan dihapus |
| Menarik OSM | `node scripts/tarik-overpass.mjs [awalan query]`: hasil bertanggal di `data/osm/`, identitas jujur, jeda 30 detik antar query |
| Membuat lapisan OSM | `node scripts/buat-lapisan-osm.mjs data/osm/<tanggal>`: jalur Koridor 1, feri, halte, daftar subkategori, usulan koordinat halte |
| Cek koordinat terhadap OSM | `node scripts/cek-koordinat-osm.mjs data/osm/<tanggal>`: hanya laporan, data kurasi tidak berubah |
| Laporan konflik data | `node scripts/tulis-konflik.mjs` menulis `docs/KONFLIK_DATA.md` |
| Mengisi koordinat dengan klik peta | `/admin/koordinat`: unduh CSV, lalu impor seperti di atas |
| Membuat tile mural | `node scripts/buat-mural-placeholder.mjs` untuk placeholder; ilustrasi asli lewat `vips dzsave` ke R2, rincian di `docs/MURAL.md` |

## Menjalankan dan menguji

| Tugas | Perintah |
|---|---|
| Server pengembangan | `npm run dev` |
| Build produksi | `npm run build` |
| Tes unit | `npm test` |
| Tes e2e + aksesibilitas (sesudah build) | `npm run test:e2e` |
| Bangun ulang grain dan ikon | `node scripts/build-aset.mjs` |
| Konversi data Makan ke skema tempat | `node scripts/konversi-makan.mjs`, lalu `python tools/merge_places.py` |
| Ekstrak peta dasar (kurang dari 30 menit) | `node scripts/extract-basemap.mjs [YYYYMMDD] [maxzoom] [keluaran]` |

Tes e2e juga bisa diarahkan ke server yang sudah jalan: `E2E_URL=http://localhost:3000 npx playwright test`. Tes Tukang Langganan punya dua mode, lihat bagian atas `tests/e2e/tukang.spec.ts`.

## Formulir dan admin

Tanpa Supabase, formulir jujur menyatakan belum menerima kiriman. `NEXT_PUBLIC_MODE_CONTOH=1` memakai data fiktif berlabel di memori server, untuk dev dan e2e saja. Skema ada di `supabase/migrations/`.

## Dokumen

`docs/TODO_PEMILIK.md`, `docs/LANJUTKAN.md`, `docs/PLAN.md`, `docs/COVERAGE.md`, `docs/PARITAS.md`, `docs/DATA_DECISIONS.md`, `docs/KONFLIK_DATA.md`, `docs/CHANGELOG.md`, `docs/MURAL.md`, `docs/SUMBER_BERITA.md`, `deploy/situs-lama/README.md`. Isi paket data: `docs/PAKET_HANDOFF.md`.
