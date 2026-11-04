# Log migrasi: 05-panduan-gaya

- task_id: `wf-758f4152-ff9a-54eb-9ec5-2bd1b4fe7099`
- Judul laporan: Batam City Hall: Panduan Gaya dan Design Tokens Peta Laut
- Laporan `truncated: false` (utuh).

## File yang dibuat
| File | Isi |
|---|---|
| `research/05-panduan-gaya.md` | Salinan verbatim + `## Daftar sumber` (59 sumber) |
| `data/raw/05-panduan-gaya__1.json` | Blok ```json "Versi JSON" design tokens, verbatim (valid tanpa perbaikan) |
| `data/places/05-panduan-gaya.json` | 3 tempat |
| `data/design/design_tokens.css` | Blok ```css "CSS custom properties", verbatim |
| `data/design/design_tokens.json` | Identik byte-per-byte dengan `data/raw/05-panduan-gaya__1.json` |
| `data/design/microcopy.json` | 8 baris tabel "Contoh pola" (`konteks`, `id`, `en`) |
| `data/design/boleh_jangan.md` | Verbatim bagian "Boleh & Jangan" + "9. Nada tulisan > Daftar hindari" (diberi 1 baris komentar HTML asal-usul di atas) |
| `data/design/moodboard.md` | Verbatim bagian "Moodboard (link referensi, dikelompokkan)", semua link (diberi 1 baris komentar HTML asal-usul) |
| `data/design/tipografi_skala.json` | 11 token tabel "Skala tipografi" |
| `data/design/layer_peta_warna.json` | 14 layer tabel "Layer peta" (siang/malam) |
| `data/design/tinta_riso.json` | 13 tinta tabel "Tinta Riso sebagai jangkar" + catatan perkiraan hex + aturan Mural |
| `data/design/palet_ui.json` | Tambahan sesuai aturan tabel di spesifikasi: tabel "Palet UI, mode siang" (12 token) dan "mode chart malam" (9 token), termasuk kolom "Pakai" dan kontras yang tidak ada di JSON tokens |

## Ringkasan angka
- Blok JSON: **1** (valid, tanpa perbaikan).
- Blok kode lain: 1 ```css (→ `design_tokens.css`), 1 blok tanpa bahasa (mockup ASCII "Kartu label museum").
- Tempat: **3**: `nagoya-citywalk` (belanja), `jembatan-barelang` (landmark), `pulau-penyengat` (budaya). Semua koordinat `null` → `perlu_diisi_user`, semua kecamatan `null` (laporan tidak menyebut).

## Keputusan / masalah
- Dua H1 di md: baris 1 dari `title` laporan, lalu H1 asli teks laporan (sesuai spesifikasi).
- Escape JSON dari tool (`&`, `<`, `\"`) didekode ke karakter aslinya.
- Di file JSON hasil konversi tabel, format markdown (`**tebal**`, backtick) dibuang dari nilai sel. Teksnya sendiri tidak diubah. Contoh: "`kicker` (Loket 01)" → `token: "kicker"`, `keterangan: "Loket 01"`; "**15,0 : 1** ✓ AAA" → "15,0 : 1 ✓ AAA". Semua nilai (px, em, hex, rasio) disimpan sebagai string persis seperti di tabel.
- `tinta_riso.json`: kolom "Hex (stencil.wiki)" disimpan sebagai `hex_stencil_wiki`, karena laporan menegaskan hex ini perkiraan.
- Places: laporan ini panduan gaya, bukan direktori. Entri dibuat hanya untuk tempat fisik yang diberi data/konteks: Nagoya Citywalk (lokasi festival Wave of Wall April 2026), Jembatan Barelang (elemen lambang resmi, jadi larangan logo), dan Pulau Penyengat (pusat budaya buku Melayu, EAP153). Kategori Nagoya Citywalk (`belanja`) dipilih agen karena laporan tidak menyebut jenis tempatnya. `status_data: terverifikasi` mengikuti label [V] laporan untuk fakta yang dicantumkan.
- Pulau Penyengat tidak ada di enum kecamatan Kota Batam. Ini dicatat di `catatan`, perlu diputuskan apakah ditampilkan di peta Batam.
- `sumber_url` untuk Pulau Penyengat memuat `https://eap.bl.uk/project/EAP153`. URL ini ada di bagian Moodboard laporan, tidak di daftar `sources`.
- Duplikat lintas laporan: `jembatan-barelang` juga ada di `data/places/01-inspirasi-konsep.json`. Perlu dedup saat digabung.

## Hal yang tidak dipetakan
- **Mockup ASCII "Kartu label museum"** (blok kode tanpa bahasa): tidak ada mapping domain. Tetap ada di md. Isinya fiktif menurut laporan ("Mi Lendir Pak Atan" bukan tempat nyata, jadi tidak masuk places).
- **Tabel kualitatif yang tidak dikonversi**: "Sumber utama dan status lisensi" (peta lama), "Motif", "Matriks pemeriksaan" font, dan "Referensi website premium". Tidak ada mapping domain yang diminta. Isinya penilaian/rekomendasi dengan label [V]/[A], bukan data tempat. Semua utuh di md.
- **Area/kawasan yang cuma disebut sebagai citra atau contoh microcopy**, tidak dijadikan entri: Tanjung Uma, Jodoh, Nagoya (atap ruko), Sekupang, Batam Centre, Belakangpadang, HarbourFront, garis 1°N.
- **Institusi/arsip di luar Batam** (NLB Singapura, KITLV/Leiden, David Rumsey, British Library, Kontinentalist, Cooper Hewitt, dll.) dan lembaga historis (Mathba'ah al-Riauwiyah, Rusydiah Klub) tidak dijadikan places. Konteksnya dimasukkan ke `atribut` Pulau Penyengat.
- **Pasangan font, aturan tekstur, aturan ilustrasi, komponen UI, arah logo**: prosa. Hanya ada di md.
