# Log migrasi: 06-direktori-taksonomi

- task_id: `wf-9a2e3cf8-570e-5b8e-88b0-42be19b6a4c9`
- Judul: Batam City Hall: Rancangan Direktori dan Seed Data
- Laporan `truncated: false`; 33 sumber.

## Ringkasan angka
- Blok ```json: **1** → `data/raw/06-direktori-taksonomi__1.json` (73 objek, valid, tanpa perbaikan).
- Blok kode non-JSON: 1 SQL + 5 query Overpass.
- Tempat (`data/places/06-direktori-taksonomi.json`): **75** = 73 dari seed JSON + 2 dari prosa (Pasar Induk Jodoh, Waterfront City/Marina Teluk Senimba).
  - Kategori: kesehatan 15, belanja 12, pendidikan 12, ibadah 10, transportasi 8, pemerintahan 8, ruang_publik 4, layanan_publik 3, akomodasi 3.
  - status_koordinat: terverifikasi 3 (Hang Nadim, Masjid Agung, Mega Mall), perlu_cek_ulang 8, perlu_diisi_user 64.
  - status_data: perlu_cek_ulang 21, rencana 1, null 53.

## File yang dibuat
- `research/06-direktori-taksonomi.md`: salinan verbatim + `## Daftar sumber` (33 item).
- `data/raw/06-direktori-taksonomi__1.json`: seed JSON verbatim.
- `data/places/06-direktori-taksonomi.json`: 75 tempat.
- `data/taksonomi/taksonomi.json`: `taksonomi` (59 baris tabel, kolom kategori/subkategori/tag_osm/sumber_utama/cara_isi + `cara_isi_kode`), `rekomendasi_cara_pengisian` (9 baris), `legenda_cara_isi`, `kolom_atribut_per_kelompok` (daftar kolom `atribut` dari bagian "Detail per Kelompok Kategori").
- `data/schema/tempat.sql`: blok SQL verbatim (tabel `tempat`, `dokter`, `praktik`, `rekomendasi_warga`).
- `data/osm/overpass/06-a_kesehatan.overpassql`, `06-b_belanja.overpassql`, `06-c_transportasi.overpassql`, `06-d_olahraga_ibadah_makam.overpassql`, `06-e_hitung_kelengkapan.overpassql`: 5 query verbatim.
- `data/statistik/angka_resmi.json`: 42 indikator (37 dari laporan ini, 5 dari laporan 07, ditandai `sumber_riset`). Isinya: wilayah, sekolah per jenjang, negeri/SPMB, faskes semester 1 2024, rumah ibadah (Kemenag, BPS 2022, Satu Data 2023, FKUB 2019), hotel (4 versi angka + rujukan primer), Trans Batam (koridor, bus, tarif, halte per koridor, halte baru), feri, SPAM/air bersih, geoportal, Pasar Induk Jodoh, referensi relasi OSM dan ambang kelengkapan OSM.

## Keputusan normalisasi
- **Kategori diganti** (kategori asli disimpan di `atribut.kategori_asli`): 3 kantor Air Batam Hilir `pemerintahan` → `layanan_publik` (operatornya perusahaan, konsisten dengan PLN/BPJS di laporan 07).
- **Nama**: "(NPSN …)" dipindah dari `nama` ke `atribut.npsn` untuk 6 sekolah. Alias dari kurung/prosa ke `nama_alternatif`: Raja Hamidah, Masjid Tanjak, BCS Mall, "Imigrasi Kelas I Khusus TPI Batam", "Kanim Batam".
- **Alamat placeholder** ("Perlu cek", "Perlu cek di PDDikti") → `alamat: null`, teks aslinya ke `catatan`.
- **Kelurahan**: seed tidak punya kolom kelurahan. Untuk 30 entri, kelurahan diisi hanya kalau satu segmen alamat (dipisah koma) sama persis dengan nama kelurahan resmi di kecamatan yang sama (daftar di `data/wilayah/kelurahan.json`). Contoh "Jl. Duyung, Tanjung Uma" → Tanjung Uma. Tidak ada tebakan lain.
- **Data prosa dipindah ke entri**: jam layanan Imigrasi, Samsat, Disdukcapil, ABH KPP Pusat; WA Imigrasi; telepon Bea Cukai; `wilayah_kerja` KPP Utara/Selatan; ULP Harbourbay, M-Paspor, Paspor Simpatik; Samsat Corner (BCS Mall, Kepri Mall); bintang Hotel Maxone (3) dan Ibis Styles (4) dari SISPEK; call center ABH (0778) 5700 000 di `atribut.call_center` (bukan nomor kantor); `atribut.tujuan: ["Singapura"]` untuk 5 pelabuhan yang laporan sebut + Waterfront City.
- **status_data `perlu_cek_ulang`** dipakai hanya kalau laporan menandai data entri itu (alamat/kecamatan "perlu cek", konflik tipe RS Awal Bros) atau sumbernya disebut menua (6 entri FKUB data 2019). `rencana` untuk Pasar Induk Jodoh.
- **catatan_koordinat** diisi dari bagian "Daftar Tempat yang Koordinatnya Belum Pasti" dan Caveats, termasuk kandidat estimasi untuk Pelabuhan Batam Centre, Kantor Wali Kota, dan Dataran Engku Putri. Kandidat itu **tidak** dimasukkan ke `lat/lng`.
- **sumber_url** selalu array. 7 entri tanpa URL → `[]`: 5 dari seed (Grand Batam Mall, Pantai Nongsa, Polibatam, Unrika, UPB; `null` di seed) dan 2 entri prosa. Tambahan URL dari daftar sumber hanya untuk topik yang jelas sama: batamnews → Masjid Sultan Mahmud Riayat Syah; samsatbatamcentre.net dan kumparan Samsat → Samsat Batam Centre.
- **tag_osm** diambil dari tabel taksonomi per subkategori; politeknik → `amenity=college`, universitas → `amenity=university`.
- **taksonomi.json**: nilai sel tabel sama persis; hanya backtick dan `**` markdown yang dibuang.
- **angka_resmi.json**: `sumber_url_terkait` dicocokkan dari daftar sumber per topik, karena laporan tidak menautkan URL ke tiap angka. URL faskes menunjuk dataset Satu Data berjudul "tenaga kesehatan", jadi perlu dicocokkan ulang.

## Masalah dan konflik yang perlu diketahui
- **Konflik koordinat lintas laporan (penting)**: Telaga Punggur. Laporan ini memakai 1.1175, 104.1683 (BP Batam) dan menyebut Wikidata 1.03523, 104.13340 "kemungkinan salah". Laporan 07 justru menyatakan Wikidata terverifikasi dan BP Batam jelas salah. Ditulis di `catatan` kedua file places.
- Lintas laporan lain (dicatat di `catatan` dengan awalan `[Lintas laporan]`): koordinat Harbour Bay, Nongsapura, Batam Centre, Sekupang, Dataran Engku Putri (kandidat 06 ±1.128, 104.054 vs batamgems 1.106639, 104.052681, selisih ~2,4 km); alamat RSUD Embung Fatimah (Jl. Letjen R. Suprapto vs Jl. Pertiwi No. 27); alamat Disdukcapil (06 "perlu cek" vs 07 Jl. Ir. Sutami, Sekupang); RS BP Batam; Masjid Jabal Arafah; Gold Coast.
- `pdk-uniba` di seed memakai URL halaman Wikipedia daftar rumah sakit sebagai sumber. Dibiarkan apa adanya, dicatat di `catatan`.
- Seed memakai kategori `pemerintahan` untuk ABH, sedangkan laporan 07 memakai `layanan_publik` untuk PLN/BPJS; sudah diselaraskan untuk ABH.
- Jumlah RS: Key Findings menyebut 3 RS pemerintah + 18 swasta = 21; laporan 07 juga 21, tetapi menyebut kemungkinan RS ke-22 (Awal Bros Batu Aji).

## Tidak dipetakan ke file domain/places (tetap ada di `research/06-direktori-taksonomi.md`)
- Teks cadangan area Overpass (`area["boundary"="administrative"]["admin_level"="5"]["name"="Kota Batam"]->.batam;`) adalah kode inline, bukan blok query. Teksnya disalin ke `catatan` indikator `relasi_kota_batam` di `angka_resmi.json`.
- Pedoman kurasi per kelompok (mis. SISPEK harus difilter karena memuat diskotik dan salon; kos ditampilkan per kelurahan demi privasi; jangan simpan jadwal feri statis; dokter sebagai entitas terpisah) berupa prosa, tidak dikonversi.
- Kategori yang laporan sebut "belum diriset" (PLN, BPJS, kantor pos, Polresta, Damkar, pura, TPU, lapangan olahraga, jasa) sengaja tidak punya seed di laporan ini.
- Pasar Induk Jodoh dan Waterfront City dimasukkan sebagai tempat walau hanya ada di prosa; tidak ada entri lain yang dibuat dari prosa.
