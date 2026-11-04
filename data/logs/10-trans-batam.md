# Log migrasi: 10-trans-batam

- task_id: `wf-36063ca2-a5e1-819c-a7c8-6e6e789889d3`
- Judul: Peta Bus Trans Batam: Riset Data dan Desain untuk Batam City Hall (November 2026)
- Laporan `truncated: false`; 60 sumber.

## Ringkasan angka
- Blok ```json: **1** → `data/raw/10-trans-batam__1.json` (valid, tanpa perbaikan).
- Blok kode non-JSON: 4 query Overpass.
- Tempat (`data/places/10-trans-batam.json`): **4** (hanya hub/simpul transfer yang laporan sebut hub: Transferpoint Batam Center, Transferpoint Sekupang, Transferpoint Terminal Jodoh, Transferpoint Punggur). Kategori `transportasi`, subkategori `halte_transfer_bus`. Halte biasa tidak dimasukkan ke places.
- Halte (`data/trans_batam/halte.json`): **191** entri (19 dari seed JSON + 170 dibuat dari daftar berurutan dan tabel), 175 `kelompok`, 13 pola urutan.
- Koridor (`data/trans_batam/koridor.json`): **10** (K1–K9 aktif, K10 rencana).

## File yang dibuat
- `research/10-trans-batam.md`: salinan verbatim + `## Daftar sumber` (60 item).
- `data/raw/10-trans-batam__1.json`: seed JSON (meta, koridor, halte, urutan_ringkas).
- `data/places/10-trans-batam.json`: 4 hub.
- `data/trans_batam/koridor.json`: field seed JSON verbatim + `dari_tabel` (semua kolom Tabel koridor) + `warna_palet` (tabel palet) + `tambahan_bus_2026` (Key Finding 3) + `catatan_laporan` (kalimat verbatim per koridor). `meta` memuat catatan antarsumber, 6 Key Findings verbatim (soal armada, dll.), dan palet lengkap.
- `data/trans_batam/halte.json`: `halte` (semua halte), `pola` (13 daftar urutan per koridor per arah, termasuk penanda gap "…"), `halte_transit` (tabel halte transit verbatim), `urutan_ringkas_seed` (verbatim).
- `data/trans_batam/info_praktis.json`: tarif, pembayaran, transit, fasilitas, aksesibilitas, kontak, aplikasi, rencana, konektivitas (20 baris tabel + `halte_id`). Tiap bagian menyimpan `teks_laporan` verbatim.
- `data/trans_batam/desain_peta.md`: salinan verbatim bagian "Referensi desain peta transit" (termasuk palet) dan "Struktur data yang disarankan untuk Claude Code" (termasuk seed JSON).
- `data/osm/overpass/10-halte-bus.overpassql`, `10-relasi-rute-bus-ptv2.overpassql`, `10-jejak-trans-batam.overpassql`, `10-jalan-utama-map-matching.overpassql`: 4 query verbatim.

## Keputusan pemetaan
- **Id halte**: mengikuti id di `urutan_ringkas` seed. Sisi A dan B dipisah (mis. `kawasaki-a`, `kawasaki-b`, dan `kawasaki` tanpa sufiks dari daftar Kepri Post K5), kecuali halte seed yang sudah digabung laporan sendiri ("UIB (A/B)", "Kepri Mall (A/B)", "Politeknik (A/B)", "Hidayatullah (A/B)", "Panbil Mukakuning / Kawasan Industri Panbil", "Mega Mall"/"Mega Mall Batam Center", "Transferpoint/Transfer Point Batam Center", "Terminal Jodoh" → `tp-jodoh`).
- **`kelompok`**: id grup turunan nama (sufiks A/B dibuang) untuk `stop_groups`. Override eksplisit hanya untuk pasangan yang laporan sebut sendiri: "Bengkong Garama / Garama 2", "Monte Siena (A/2)", "Rafflesia"→raflesia (ejaan), "Bank Riau Kepri"/"Bank Riau A/B", "Basecamp"/"Base Camp B" (tabel transit: Basecamp K2/K4). "Masjid Agung" (Batam Centre, K2/K6) dan "Masjid Agung Sultan Riayat Syah" (K4) **dibiarkan terpisah**.
- **`urutan_pola`**: posisi di daftar yang dipublikasikan, hanya menghitung nama yang tercantum. Setelah gap "…", angka ini BUKAN nomor urut asli dari 54–78 halte. Pola K1/K6/K7/K9 dicek dan cocok persis dengan `urutan_ringkas` seed.
- **Kecamatan halte**: hanya dari seed JSON dan kolom "Kecamatan (perkiraan)" tabel K1 dan K6. Halte lain `null` (laporan hanya memberi rentang kecamatan per koridor; rentang itu ada di `pola[].catatan`). Tidak ada konflik seed vs tabel.
- **Koordinat**: hanya 10 halte seed yang punya angka, semuanya titik landmark → `perlu_cek_ulang`. Yang lain `null` → `perlu_diisi_user`. Tidak ada koordinat terverifikasi.
- **`koridor_tambahan_tabel_transit`**: K8 untuk Top 100 Jodoh dan DC Mall SW, serta K2 untuk Fanindo dan Basecamp. Koridor ini hanya disebut di tabel "Halte transit/persinggungan utama", tidak ada di daftar berurutan.
- Halte tambahan di luar daftar berurutan: `rsbp` (K4 versi 2022, perlu_cek_ulang, tanpa koordinat) dan `masjid-raya-a` (hanya di tabel konektivitas, koridor tidak dirinci).
- `sumber_url` per pola dipasangkan ke URL di daftar sumber berdasarkan judul/slug URL yang cocok dengan nama sumber di judul subbagian (mis. "Kepri Post Juli 2025" → URL pikiran-rakyat ...juli-2025). K1_balik tidak diberi URL.
- `sumber_url` seed (string) diubah jadi array di halte.json dan places. Markup `**` dibuang dari sel tabel.
- `tambahan_bus_2026`: label sumber "Jodoh–BC / Piayu–BC / Nongsa–BC" dipetakan ke K5/K6/K7, sejalan dengan kutipan Kadishub "memperkuat koridor 5, 6, dan 7".

## Masalah / konflik yang perlu diketahui
- Jumlah halte konflik: K5 (41 vs 65) dan K6 (41 vs 58). Jumlah bus K8 juga konflik (3 vs 8).
- Transferpoint Punggur: koordinat Wikidata vs BP Batam berbeda ±9 km.
- Koordinat `tp-batam-center` adalah titik terminal feri, bukan halte (halte ±240 m). `tp-jodoh` tidak punya koordinat; landmark Jodoh Square II hanya disimpan di `catatan_koordinat`.
- Halte Bandara Hang Nadim: posisi urutan perlu_cek_ulang. Di tabel konektivitas statusnya "terverifikasi (lokasi deskriptif, koordinat belum)", sedangkan koordinat seed = titik referensi bandara (perlu_cek_ulang).
- Harbourbay hanya ada di daftar Moovit K5 (kemungkinan usang).
- Jumlah armada simpang siur (65 / ±20 / 52 BTS). Laporan menyarankan tidak menampilkan armada total. Teks ada di `koridor.json` meta.
- Metode bayar e-money Mandiri/TapCash/Flazz berstatus `perlu_cek_ulang`. Kontak call center berasal dari 2022 (perlu_cek_ulang).

## Tidak bisa dipetakan ke JSON (hanya ada di research/10-trans-batam.md)
- Catatan pengganti area Overpass (`area["name"="Batam"]...` atau bbox `(0.95,103.85,1.22,104.20)`) adalah prosa di luar blok kode, jadi tidak dimasukkan ke file .overpassql.
- Bagian "Data geometri rute" (status OSM/Moovit/GTFS dan langkah menyusun GeoJSON), "Rekomendasi", "Caveats", dan "Daftar halte yang koordinatnya belum pasti". Nama-nama di daftar terakhir sudah tercakup di halte.json, tetapi keterangan "plus ±N halte yang belum tercantum" tidak bisa dijadikan entri.
- Waktu jeda Jumat Moovit (K1 10.55→13.20, K3 11.10→13.15) tersimpan sebagai teks di `koridor.json` `catatan_laporan` (K1, K3), bukan sebagai field terstruktur.
