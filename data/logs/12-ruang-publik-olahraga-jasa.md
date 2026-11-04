# Log migrasi: 12-ruang-publik-olahraga-jasa

- task_id: `wf-094bf2b5-cfa2-84c6-ab02-091743d5de69`
- Judul: Seed Data Direktori Batam City Hall: Ruang Publik, Wisata, Olahraga, Belanja, dan Jasa (November 2026)
- Laporan `truncated: false`. 90 sumber.

## File yang dibuat

| File | Isi |
|---|---|
| `research/12-ruang-publik-olahraga-jasa.md` | Salinan verbatim + `## Daftar sumber` (90 item) |
| `data/raw/12-ruang-publik-olahraga-jasa__1.json` | Blok JSON tunggal laporan, verbatim (array 82 objek) |
| `data/places/12-ruang-publik-olahraga-jasa.json` | 82 tempat yang dinormalisasi |
| `data/taksonomi/12-sumber_dan_tag_osm.json` | Tabel E (27 baris): kategori, tag OSM, sumber data terbaik |
| `data/komunitas/sumber_rekomendasi_warga.json` | Sumber komunitas untuk Tukang Langganan (kosong untuk tukang; hanya BASCOM sebagai komunitas lain yang terverifikasi) |

## Angka

- Blok ```json: **1**. Valid, tidak perlu perbaikan.
- Tempat: **82** (rp 17, or 27, bl 20, js 18). Semua tempat ada di JSON dan tabel A–D, jadi tiap tempat ditulis satu kali (versi JSON dilengkapi data tabel).
  - kategori: ruang_publik 5, wisata 9, landmark 2, budaya 1, olahraga 27, belanja 20, jasa 18
  - status_koordinat: perlu_cek_ulang 10, perlu_diisi_user 72, terverifikasi 0
  - status_data: perlu_cek_ulang 15, rencana 2 (S Padel Club, Pasar Induk Jodoh), usang 1 (Celebrity Fitness), sumber_tunggal 1 (Pasar Pagi Jodoh), null 63
- Tabel lain yang dikonversi: tabel E saja → taksonomi. Tabel A–D sudah punya versi JSON.

## Normalisasi dan perbaikan

1. **Kategori**: `ruang_publik_wisata` tidak ada di enum. Dipecah jadi ruang_publik (Dataran Engku Putri, Taman Dang Anom, Dataran Engku Hamidah, Taman Rusa, Taman Kolam), wisata (Ocarina, 6 pantai, Pulau Putri, Kepri Coral), landmark (Bukit Clara, Jembatan Barelang), dan budaya (Museum Raja Ali Haji). Kategori asli disimpan di `atribut.kategori_asli`.
2. **status_koordinat dipaksa `perlu_diisi_user`** karena lat/lng null, padahal JSON menulis `perlu_cek_ulang`: or-021 Celebrity Fitness, js-006 PT Alfa Gemilang, js-017 SiCepat. Label aslinya ternyata soal status data, jadi dipindah ke `status_data` (usang / perlu_cek_ulang).
3. **Kecamatan di-null-kan karena laporan ragu** (keraguannya ditulis di `catatan`): or-004 Primecourt ("Batu Ampar (perlu dicek)"), or-010 Batu Aji Padel Arena ("Sagulung (versi AYO)"; nama dan alamatnya mengarah ke Batu Aji), or-023 The Master Gym ("Batu Ampar (perlu dicek)"), bl-009 Toko Buku Gloria ("Batam Kota (perlu dicek)"). Yang sudah null di JSON tetap null: or-005, or-012 (Saraga: Kabil/Nongsa vs kawasan Sei Beduk), or-016 (Sei Ladi), or-019 (Sei Temiang), or-025, bl-004, bl-013.
4. **Jembatan Barelang**: kecamatan dibiarkan `Sagulung` sesuai JSON. Tabel menulis "Sagulung (ujung awal) – Galang", dan ini dicatat di `catatan`.
5. **`catatan_koordinat`**: `atribut.catatan_koordinat` dipindah ke field top-level dan dilengkapi kolom status koordinat di tabel (Apple Maps/Grab, Wikimapia, idalamat, Wikipedia/DBpedia) serta caveat Plus Code ("akurasi ±10 m kalau kodenya benar").
6. **Kontak**: string kontak dipetakan ke `kontak.telepon`. `whatsapp`, `email`, dan `website` tidak diisi karena laporan tidak menyebutnya sebagai kontak; URL resmi tetap ada di `sumber_url`. IG @new.ocarina dipindah ke `atribut.media_sosial`, dan X @BASCOMofficial (akun komunitas, bukan usaha) ke `atribut.komunitas`. Nomor Samsung SC Batam adalah call center Samsung, ditandai di `catatan`. Nomor money changer Mega Mall berasal dari pihak ketiga (Wise), juga ditandai di `catatan`. Nomor HP Ocarina tidak dimasukkan, sesuai caveat laporan.
7. **jam_layanan di-null-kan** kalau isinya bukan jam (dipindah ke `catatan`): bl-008 Gramedia GBM (typo "09:00 - 10:00"), bl-020 Pasar Induk Jodoh (belum beroperasi), js-013 Kantor Pos Batam (tidak konsisten). Jam dari tabel ditambahkan untuk rp-010 (media 07.00–19.00), bl-007 (sumber lain 10.00–22.00), js-010 (dua versi jam Xiaomi), dan or-004 ("tiap hari"). Jam museum dari sumber lain ada di `atribut.jam_sumber_lain`.
8. **atribut** dilengkapi dari tabel dan prosa: harga dan rincian harga, fasilitas, aktivitas, desainer golf, jumlah hole/par, `catatan_harga` AYO (harga dinamis), status kepemilikan pasar, kios/lapak, `kode_cabang`/`kode_gerai`, data Jembatan Barelang (panjang, tahun dibangun), detail wahana Ocarina dan waktu terbaik berkunjung, dan `jalur_lari_populer: true` (Dataran Engku Putri, Taman Rusa, Ocarina; dari prosa Batamnews). `atribut.status` dan `atribut.catatan` dari JSON dipindah ke `status_data` dan `catatan`. Status pembangunan Pasar Induk Jodoh disimpan di `atribut.status_pembangunan`.
9. **Nama**: alias dipisah ke `nama_alternatif`, dan nama asli JSON disimpan di `atribut.nama_asli_laporan` untuk rp-001 (Alun-alun Batam), rp-006 (Monumen/Bukit Welcome to Batam), rp-009 (Jembatan Tengku Fisabilillah, Jembatan 1), bl-011 (Pasar Tanjungpiayu), dan js-001 (PT Lima Triniti Valasindo). Alias tanpa ganti nama: Museum Raja Ali Haji, Ocarina, Stadion Temenggung Abdul Jamal, Lotte Mart Wholesale, Pasar Hangtuah. Nama lain disalin persis dari JSON.
10. **Alamat**: versi tabel dipakai kalau lebih lengkap dari JSON (rp-002, rp-004, rp-006, rp-010, rp-013, or-002, or-013, or-024, or-027, bl-005).
11. **sumber_url** dilengkapi dengan URL yang dikutip tabel dan URL di daftar sumber yang slug-nya jelas menyebut tempat itu. Contohnya kumparan/Pikiran Rakyat untuk Ocarina, Pantainesia untuk Tanjung Pinggir, idalamat untuk Mitra10/Samsung, kompas.id untuk Pasar Induk Jodoh, Traveloka untuk Pasar Pagi Jodoh (tabel: "Traveloka (via riset subagen)"), dan Batamnews jogging untuk 3 jalur lari.
12. **tag_osm** diisi per tempat berdasarkan tabel E (satu tag utama; untuk service center dan ekspedisi ditambah `brand=` dari nama).
13. **subkategori** dinormalisasi ke snake_case (`alun-alun` → `alun_alun`). Untuk Bukit Clara dan Jembatan Barelang diganti jadi `landmark_viewpoint`.

## Hal yang perlu diketahui / tidak dipetakan

- **Depo Bangunan** (baris di tabel C, tidak ada di JSON) **tidak dimasukkan** ke places. Laporan menulis "Cabang Batam tidak ditemukan. Jangan dimasukkan sebelum dicek."
- **Grand Lucky (bl-004)** tetap dimasukkan karena ada di JSON, tetapi alamat, kecamatan, dan sumbernya kosong (`status_data: perlu_cek_ulang`). Pertimbangkan menyembunyikannya di UI.
- **Pasar Induk Jodoh (bl-020)** berstatus `rencana`. Laporan meminta agar pasar ini tidak ditampilkan sebagai pasar yang beroperasi.
- Tempat yang hanya disebut di prosa dan tidak dijadikan entri (tidak ada data riset): MTC Nongsa (jalur lari populer), Pasar Jodoh dan Pasar Seiharapan (daftar 6 pasar Pemko 2018), serta Pasar Belakangpadang (kemungkinan sama dengan bl-015; dicatat di `catatan` bl-015). Gap riset yang disebut laporan: Taman Mini, Taman Tunas Hijau, Waduk Duriangkang, Pantai Melayu, kolam renang Sukajadi, dealer/bengkel, laundry, percetakan, salon/barbershop, spa, toko kain/bayi/optik, dan yoga/pilates. Mall dan masjid yang hanya dipakai sebagai patokan alamat juga tidak dijadikan entri.
- Statistik yang tidak masuk file domain (tidak ada mapping) dan tetap ada di `.md`: 41 pasar di Batam (36 swasta, 5 pemerintah; JIM UPB 2018), Pemko punya 6 pasar rakyat (Batam Pos 12/2/2018), dan Kepri punya 115 kantor pusat KUPVA BB + 60 layanan remitansi (BI Kepri, 9/11/2023).
- Rujukan tanpa URL di laporan: gokepri.com (Pasar Induk Jodoh), Tribun Batam 3/12/2023 (Ocarina), BatamNow 20/8/2026, Batam Pos 12/2/2018, Batamclick 9/11/2023, dan mediacenter KSP 17 Maret 2026.
- 14 URL di JSON tidak ada di daftar sumber laporan, tetapi tetap disalin ke `sumber_url`: goersapp blog Ocarina, batamnews berita-112710, id.trip.com (Dang Anom, Bukit Clara), Wikipedia/DBpedia Barelang, ayo.co/v/play-padel, batam-golf.com/batam-golf-paradise, batam.co.id/usaha/supermarket, researchgate 367132501, kepri.antaranews 254178, kemitraan.posindonesia, kantorpos.posindonesia, dan PDF SiCepat tokopedia.
- 1 sumber di daftar sumber tidak terpakai di tempat mana pun: gogolf.co.id (booking golf Batam, umum).
- Komunitas Tukang Langganan: laporan **tidak** mencantumkan grup FB/IG warga yang terverifikasi. File komunitas berisi daftar kosong, BASCOM (skateboard, tidak relevan untuk tukang), dan rekomendasi laporan: tukang diisi user, situs hanya menampilkan service center resmi (js-008 s.d. js-011).
- Rekomendasi laporan untuk UI (tetap ada di `.md`): sembunyikan entri `perlu_diisi_user` dari peta; cocokkan 10 koordinat `perlu_cek_ulang` dengan OSM dan naikkan status jika selisihnya < ±50 m; tampilkan "Harga per [tanggal sumber], cek di lokasi" di kartu museum dan pantai; cek ulang money changer ke daftar KUPVA BB BI tiap 6 bulan.
