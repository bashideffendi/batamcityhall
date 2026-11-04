# Log pemindahan: 03-landmark-jalur-mural

- task_id: `wf-ada70080-d7d1-5178-b7e5-4385207430a2`
- Judul: Batam City Hall Mural Story Route North to South: Seed Data and Illustrator Brief
- Laporan `truncated: false`; 82 sumber.

## Ringkasan angka
- Blok ```json: **1** (`data/raw/03-landmark-jalur-mural__1.json`, 44 objek seed). Valid apa adanya, tanpa perbaikan.
- Tempat di `data/places/03-landmark-jalur-mural.json`: **46** (44 dari seed JSON, ditambah 2 baris tabel yang tidak punya versi JSON).
  - kategori: landmark 12, transportasi 9, lainnya 6, kampung_tua 5, belanja 4, ibadah 4, khas_batam 3, wisata 2, ruang_publik 1
  - status_koordinat: perlu_cek_ulang 39, terverifikasi 5, perlu_diisi_user 2
  - status_data: terverifikasi 13, perlu_cek_ulang 12, usang 2, rencana 1, null 18

## File yang dibuat
- `research/03-landmark-jalur-mural.md`: salinan verbatim beserta `## Daftar sumber` (82 item)
- `data/raw/03-landmark-jalur-mural__1.json`
- `data/places/03-landmark-jalur-mural.json`
- `data/mural/segmen.json`: 8 segmen (urutan, id, label, batas, kecamatan_utama, alasan) ditambah `landmark_ids` turunan dari field `segmen` di seed
- `data/mural/landmarks.json`: 44 baris seed verbatim (format angka seperti `0.98200` tetap dipertahankan) ditambah `deskripsi_visual` dan `ide_hotspot` dari tabel per segmen. Ke-44 entri punya pasangan di tabel, dan semua `segmen` di seed cocok dengan bagian tabelnya.
- `data/mural/ikon_prioritas.json`: 30 ikon (urutan, nama, status emoji persis), ditambah `status_arti` (dari legenda laporan) dan `id_landmark` (pemetaan ke id seed; no. 27 dan 28 adalah ikon generik dengan 2 id)
- `data/mural/topik_sensitif.md`: salinan verbatim bagian "## Catatan Topik Sensitif" sampai "Prinsip umum"
- `data/mural/elemen_tabel_tanpa_seed.json` (**tambahan**, mengikuti aturan "tabel tanpa versi JSON"): 3 baris tabel per segmen yang tidak ada di seed JSON, dengan nilai sel verbatim. Isinya Selat Singapura (elemen laut), Kampung Tua Batu Aji & Mukakuning (rujukan), dan Kawasan Rempang Eco-City.

## Keputusan normalisasi (perlu diketahui)
- **Selat Singapura tidak dimasukkan ke places**, karena laporan menyebutnya "Elemen dekoratif, bukan landmark". Datanya disimpan di `elemen_tabel_tanpa_seed.json`.
- Id baru (tidak ada di laporan) untuk 2 tempat dari tabel: `kawasan-rempang-eco-city` dan `kampung-tua-batu-aji-mukakuning`. Keduanya tanpa koordinat (`perlu_diisi_user`).
- Koordinat di places disalin persis sebagai literal angka dari seed (mis. `0.98200`, `104.05340`).
- `status_koordinat = terverifikasi` hanya untuk 5 titik yang akurasinya "tinggi" dan berlabel ✅: jembatan-barelang-1, masjid-agung-raja-hamidah, masjid-piramida-hilang, pelabuhan-batam-centre, dan pelabuhan-nongsapura. Titik ✅ yang akurasinya disebut "sedang"/"sedang-tinggi" (pulau-belakang-padang, bandara-hang-nadim, trans-batam-koridor-7, kamp-pengungsi-galang) diberi `perlu_cek_ulang` sesuai aturan spesifikasi.
- Aturan `status_data`:
  - "Batam yang hilang" → `usang`
  - Rempang Eco-City → `rencana`
  - ada ⚠️ di kolom fakta tabel atau di Key Findings → `perlu_cek_ulang`
  - entri berlabel ✅, atau dinyatakan "terkonfirmasi lintas sumber" di TL;DR/Key Findings (6 jembatan, Masjid SMRS, WTB, kamp Galang) → `terverifikasi`
  - selain itu `null`

  ⚠️ yang hanya ada di kolom lat/lng hanya memengaruhi `status_koordinat`. Akibatnya jembatan-barelang-5 dan bandara-hang-nadim berstatus `perlu_cek_ulang` walaupun fakta intinya ✅. Alasannya ditulis di `catatan`.
- Kecamatan `null` (alasan di `catatan`): jembatan-barelang-1–4 (PERLU-CEK Bulang/Galang), seafood-bawah-jembatan-1, pasar-jodoh (Batu Ampar/Lubuk Baja), dan kampung-tua-batu-aji-mukakuning (Batu Aji/Sei Beduk).
- Kelurahan diisi hanya kalau laporan menyebutnya di kolom kecamatan: Batu Besar, Sambau, Tanjung Uncang, Sijantung (kamp dan Pantai Melur), Teluk Tering (WTB), dan Sungai Panas (vihara; tabel menulis "Sei Panas", fakta menulis "Sungai Panas").
- Pemetaan kategori yang perlu dicek:
  - kuliner/kedai kopi → `khas_batam`
  - pulau (Belakang Padang, Rempang), kawasan industri, galangan, hunian relokasi, dan kawasan PSN → `lainnya`
  - "Batam yang hilang" (pelantar Sungai Jodoh, masjid piramida) → `landmark` dengan subkategori `batam_yang_hilang`
  - Makam Nghia Trang → `landmark` (sesuai instruksi memorial → wisata/landmark), bukan `pemakaman`
  - Museum → `wisata`
  - Kamp Galang dan monumen perahu → `landmark`
- `sumber_url` di places = URL seed ditambah URL dari daftar sumber yang jelas dirujuk baris tabel (mis. Mongabay untuk Jembatan IV, Okezone/Trip.com untuk vihara). Kampung Tua Batu Aji & Mukakuning dirujuk ke "Kepri Post" tanpa URL, jadi `sumber_url: []`.
- `tag_osm` hanya diisi `bridge=yes` untuk 6 jembatan, karena laporan memberi saran Overpass `bridge=yes` + `name~"..."`. Tempat lain `null`.
- Instagram Kopi Ameng (@kopiameng_batam) disimpan di `atribut.instagram`, bukan di `kontak`.
- Nilai `deskripsi_visual`/`ide_hotspot` dan label segmen diambil verbatim, termasuk markdown bold `**...**` di dalam teks (mis. ide hotspot Jembatan 1 dan koridor 7). Tanda bold yang membungkus seluruh label strip di `segmen.json` dibuang, sedangkan bold di dalam `alasan` segmen 7 dipertahankan.

## Masalah dan hal yang tidak bisa dipetakan
- Tidak ada blok JSON yang rusak.
- Beberapa tempat memakai koordinat yang identik:
  - 5 entri kompleks kamp Galang (0.7694, 104.1913)
  - Pasar Jodoh = pelantar Sungai Jodoh
  - Bandara = Halte Koridor 7
  - Masjid Agung = masjid piramida

  Semuanya dicatat di `catatan_koordinat`.
- Konflik data dari laporan dicatat di `catatan` dan tidak diselesaikan: tinggi pilon (118 m vs 199 m), landasan Hang Nadim (4.025 m vs 4.028 m) dan riwayat tanggalnya, jumlah pengungsi Galang dan tanggal penutupan kamp, jumlah penduduk Rempang, serta luas lahan Eco-City (7.572 ha vs 17.000 ha).
- Bagian naratif berikut tidak punya padanan terstruktur. Isinya tetap ada di `research/03-landmark-jalur-mural.md`:
  - TL;DR, Legenda status, dan Key Findings
  - paragraf "Kenapa 8, bukan 6?"
  - "Saran gaya" siluet jembatan (di bawah daftar ikon)
  - Caveats

  "Catatan warga" Sekupang, catatan koordinat vihara, dan peringatan koordinat Pantai Melur sudah dimasukkan ke `catatan`/`catatan_koordinat` entri terkait.
- Data cepat basi yang perlu diberi tanggal di UI: status feri internasional Sekupang (2026), jam vihara (data 2018), Koridor 7 Trans Batam (mulai 2 Juli 2026), dan angka relokasi Tanjung Banon (Juli/September 2025).
