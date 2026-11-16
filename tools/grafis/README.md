# Skrip Grafis Riso

Skrip ini membuat grafis bergaya cetak Riso untuk Batam City Hall (pedoman 4.7 dan 5.1). Hasilnya sudah ada di folder `grafis/`. Skrip hanya perlu dijalankan bila ingin membuat atau mengubah grafis.

## Kebutuhan

- Python 3.10 atau lebih baru dengan `numpy`, `Pillow` (dukungan WebP), dan `shapely`.
- `rsvg-convert` (paket `librsvg2-bin`).
- Batas kecamatan: `data/wilayah/kecamatan-kepri.geojson` dari repo.

## Menjalankan

```bash
# peta hari ini (dengan dan tanpa arsiran hujan), ilustrasi loket, ilustrasi cerita
python3 tools/grafis/riso.py public/grafis data/wilayah/kecamatan-kepri.geojson all

# hanya peta dasar tanpa arsiran hujan (dipakai di produksi)
python3 tools/grafis/riso.py public/grafis data/wilayah/kecamatan-kepri.geojson dasar

# ilustrasi submenu cuaca, ilustrasi kepiting, contoh peta radar, peta detail
python3 tools/grafis/riso2.py public/grafis data/wilayah/kecamatan-kepri.geojson
```

`markers.py` hanya dipakai untuk contoh tampilan (posisi penanda dan klaster). Di situs, penanda dibuat MapLibre.

## Ilustrasi Makan

`hidangan.mjs` membuat 17 ilustrasi hidangan (`public/grafis/hidangan/`) dan 6 ilustrasi panduan (`public/grafis/panduan/`). Algoritmanya sama dengan `riso.py`, tetapi hanya perlu Node dan `sharp` dari `node_modules`, tanpa Python dan `rsvg-convert`. Hasilnya sama tiap dijalankan. Batas ukuran 200 KB per gambar.

```bash
# semua gambar
node tools/grafis/hidangan.mjs

# sebagian gambar, menurut id
node tools/grafis/hidangan.mjs bakso cafe

# lembar kontak dan versi 72 px per gambar
node tools/grafis/hidangan.mjs --kontak <folder>
```

## Cara Kerja

1. Setiap tinta digambar sebagai lapisan SVG hitam di atas transparan.
2. Lapisan dirender menjadi topeng alfa dengan `rsvg-convert` pada dua kali ukuran.
3. Setiap topeng digeser 1—1,5 px (salah register), diberi butiran halus dan ketidakrataan tinta.
4. Lapisan ditimpakan dengan *multiply* di atas kertas putih, lalu disimpan sebagai WebP.

## Aturan

- Tinta: biru `#0078BF`, merah `#F15060`, kuning `#FFB511`, hitam `#222226`. Paling banyak tiga tinta warna per gambar.
- Bentuk sederhana. Tidak menggambar orang, logo, lambang, atau bangunan yang dikenali sebagai lambang resmi.
- Grafis baru ditunjukkan ke pemilik sebelum dipakai.
- Ukuran berkas paling besar 450 KB.

## Ikon

`ikon.json` memuat glyph ikon garis (24 × 24), kelompok dan warna penanda peta, emoji untuk gaya B, dan kategori direktori. Ubah menjadi komponen di `components/map/icons.tsx`.

## Gambar Kartu dan Ikon Buatan Codex (16 Nov 2026)

Pemilik meminta gambar kartu dan ikon dirancang ulang dengan Codex, bergaya sketsa tinta dengan cat air, dan padu bila dilihat bersamaan (PEDOMAN blok "Peta cuaca, menu ponsel, dan gambar kartu, 16 Nov 2026" butir 8).

- `codex/manifes.json`: 61 gambar (nama, rasio, isi gambar). Nama berawalan folder tujuannya: `loket-*`, `sub-*`, `bagian-*`, `hidangan-*`, `panduan-*`, `cerita-nongsa`.
- `codex/gaya-sketsa.txt`: satu uraian gaya untuk semua gambar, supaya hasilnya satu keluarga.
- `codex/gambar-codex.mjs`: menjalankan Codex CLI per gambar. Gambar yang sudah ada dilewati, jadi aman diulang.

```bash
GAYA_FILE=tools/grafis/codex/gaya-sketsa.txt node tools/grafis/codex/gambar-codex.mjs tools/grafis/codex/manifes.json tools/grafis/codex/hasil 4
```

Hasil mentah (PNG, ±2,5 MB per gambar) ada di `codex/hasil/` dan tidak ikut repo. Status 16 November 2026: 2 dari 61 selesai (`loket-cuaca`, `sub-gelombang`); sisanya berhenti karena kuota Codex akun pemilik habis. Sesudah lengkap: periksa semua gambar berdampingan, buat ulang yang tidak selaras, ubah ke WebP berukuran sama dengan berkas lama di `public/grafis/`, ganti seluruhnya sekaligus (jangan dicampur dengan grafis Riso), lalu sebut gambar buatan AI di Kolofon.
