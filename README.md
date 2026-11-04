# Batam City Hall

Balai warga, bukan balai kota. Website kota indie dan non-komersial untuk Batam: peta laut, hujan, feri, direktori, cerita. Tanpa iklan, tanpa listing berbayar.

Proyek independen warga Batam, bukan situs resmi Pemerintah Kota Batam atau BP Batam. Untuk layanan resmi: batam.go.id.

**Status:** fase 2: Langit & Laut dan Makan sudah jalan, tetapi belum di-deploy. Lihat `docs/LANJUTKAN.md`.

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

Bagian penarikan OSM dan pembuatan tile mural ditulis saat fase terkait selesai. Rincian isi data: `docs/PAKET_HANDOFF.md`.
